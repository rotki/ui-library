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
}

const {
  chipAttrs,
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
    <RuiChip
      v-if="chips"
      :key="getTextToken(getIdentifier(item))"
      tabindex="-1"
      :size="dense ? 'sm' : 'md'"
      closeable
      :class="{ 'leading-3': dense }"
      clickable
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
        {{ getText(item) }}
      </slot>
    </div>
  </template>
</template>
