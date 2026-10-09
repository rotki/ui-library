<script lang="ts" setup generic="TItem">
import RuiChip from '@/components/chips/RuiChip.vue';
import { getTextToken } from '@/utils/helpers';

export interface AutoCompleteSelectionProps<TItem> {
  items: TItem[];
  chips: boolean;
  dense: boolean;
  multiple: boolean;
  searchInputFocused: boolean;
  hideSelectionWrapper: boolean;
  getIdentifier: (item: TItem) => unknown;
  getText: (item: TItem) => string | undefined;
  chipAttrs: (item: TItem, index: number) => Record<string, unknown>;
  /** The chip Backspace and Delete act on, -1 for none, drawn with a ring though it never takes focus. */
  selectedIndex: number;
  /** Selects a clicked chip, with focus left in the input. */
  selectChip: (index: number) => void;
}

const {
  chipAttrs,
  selectChip,
  selectedIndex,
  chips,
  dense,
  getIdentifier,
  getText,
  hideSelectionWrapper,
  items,
  multiple,
  searchInputFocused,
} = defineProps<AutoCompleteSelectionProps<TItem>>();

const slots = defineSlots<{
  prepend?: (props: { index: number; item: TItem }) => any;
  default?: (props: { index: number; item: TItem; chipAttrs: Record<string, unknown> }) => any;
}>();

/**
 * Without a chip, a selected value is only drawn when it cannot be read off the
 * search input: while picking several values, or while the input is unfocused
 * and a slot renders the selection itself.
 */
const showPlainSelection = computed<boolean>(() =>
  multiple || (!searchInputFocused && (!!slots.prepend || !!slots.default)),
);
</script>

<template>
  <template
    v-for="(item, i) in items"
    :key="getIdentifier(item)?.toString()"
  >
    <!--
      Not a clickable chip: that would make it a button around its own close button. It never takes
      focus either, which stays in the input; the wrapper, which takes no box, selects it on a click.
    -->
    <span
      v-if="chips"
      class="contents"
      @click.stop="selectChip(i)"
    >
      <RuiChip
        :key="getTextToken(getIdentifier(item))"
        :size="dense ? 'sm' : 'md'"
        closeable
        close-unfocusable
        :class="{
          'leading-3': dense,
          // drawn inside the chip's edge: the field clips anything outside it
          'outline-2 outline-solid outline-rui-primary -outline-offset-2': i === selectedIndex,
        }"
        :data-selected="i === selectedIndex || undefined"
        v-bind="chipAttrs(item, i)"
      >
        <div class="flex">
          <slot
            name="prepend"
            :index="i"
            v-bind="{ item }"
          />
          <slot
            :index="i"
            v-bind="{ item, chipAttrs: chipAttrs(item, i) }"
          >
            {{ getText(item) }}
          </slot>
        </div>
      </RuiChip>
    </span>
    <div
      v-else-if="showPlainSelection"
      :class="hideSelectionWrapper ? 'contents' : 'flex'"
    >
      <slot
        name="prepend"
        :index="i"
        v-bind="{ item }"
      />
      <slot
        v-if="multiple || !!slots.default"
        :index="i"
        v-bind="{ item, chipAttrs: chipAttrs(item, i) }"
      >
        <!-- plain values are joined with a comma, the value row's gap standing in for the space -->
        {{ getText(item) }}{{ multiple && i < items.length - 1 ? ',' : '' }}
      </slot>
    </div>
  </template>
</template>
