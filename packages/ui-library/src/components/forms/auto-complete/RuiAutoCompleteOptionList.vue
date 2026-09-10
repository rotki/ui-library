<script lang="ts" setup generic="TItem">
import type { ComponentPublicInstance, Ref, StyleValue } from 'vue';
import type { DropdownOptionGroup } from '@/composables/dropdown-menu';
import type { VueClassValue } from '@/types/class-value';
import RuiAutoCompleteOption from '@/components/forms/auto-complete/RuiAutoCompleteOption.vue';

export interface AutoCompleteOptionListProps<TItem> {
  containerProps: {
    ref: Ref<HTMLElement | null>;
    onScroll: () => void;
    style: StyleValue;
  };
  wrapperProps: Record<string, unknown>;
  /** Hands the list element back to the parent, which the dropdown composable measures. */
  setMenuRef: (element: Element | ComponentPublicInstance | null) => void;
  isGrouped: boolean;
  groupedOptions: DropdownOptionGroup<TItem>[];
  renderedData: { _index: number; item: TItem }[];
  options: TItem[];
  highlightedIndex: number;
  highlightedClass: string;
  dense: boolean;
  menuClass: VueClassValue;
  menuStyle: StyleValue;
  getIdentifier: (item: TItem) => unknown;
  getText: (item: TItem) => string | undefined;
  isActiveItem: (item: TItem) => boolean;
  isItemDisabled: (item: TItem) => boolean;
}

const {
  containerProps,
  dense,
  getIdentifier,
  getText,
  groupedOptions,
  highlightedClass,
  highlightedIndex,
  isActiveItem,
  isGrouped,
  isItemDisabled,
  menuClass,
  menuStyle,
  options,
  renderedData,
  setMenuRef,
  wrapperProps,
} = defineProps<AutoCompleteOptionListProps<TItem>>();

const emit = defineEmits<{
  'select': [item: TItem];
  'move-highlight': [up: boolean];
}>();

defineSlots<{
  'group-header'?: (props: { group: string; items: TItem[] }) => any;
  'item.prepend'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item.append'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
}>();

/**
 * The highlight follows the option's place in the flat option list, which is
 * the order the keyboard walks, so a grouped option looks its index up there
 * rather than in the bucket it is drawn in.
 */
function isHighlighted(item: TItem): boolean {
  return options.indexOf(item) === highlightedIndex;
}
</script>

<template>
  <div
    :ref="containerProps.ref"
    :class="menuClass"
    :style="[containerProps.style, menuStyle]"
    @scroll="containerProps.onScroll()"
    @keydown.up.prevent="emit('move-highlight', true)"
    @keydown.down.prevent="emit('move-highlight', false)"
  >
    <div
      v-if="isGrouped"
      :ref="setMenuRef"
    >
      <template
        v-for="(bucket, bucketIndex) in groupedOptions"
        :key="bucket.group || `group-${bucketIndex}`"
      >
        <div
          class="sticky top-0 z-10 bg-white dark:bg-rui-grey-900"
          data-id="group-header"
        >
          <slot
            name="group-header"
            v-bind="{ group: bucket.group, items: bucket.items }"
          >
            <div class="px-3 py-1 text-xs uppercase tracking-wide text-rui-text-secondary">
              {{ bucket.group }}
            </div>
          </slot>
        </div>
        <RuiAutoCompleteOption
          v-for="item in bucket.items"
          :key="getIdentifier(item)?.toString()"
          :item="item"
          :text="getText(item)"
          :active="isActiveItem(item)"
          :disabled="isItemDisabled(item)"
          :dense="dense"
          :highlighted="isHighlighted(item)"
          :highlighted-class="highlightedClass"
          @select="emit('select', $event)"
        >
          <template
            v-if="$slots['item.prepend']"
            #prepend="slotProps"
          >
            <slot
              name="item.prepend"
              v-bind="slotProps"
            />
          </template>
          <template
            v-if="$slots.item"
            #default="slotProps"
          >
            <slot
              name="item"
              v-bind="slotProps"
            />
          </template>
          <template
            v-if="$slots['item.append']"
            #append="slotProps"
          >
            <slot
              name="item.append"
              v-bind="slotProps"
            />
          </template>
        </RuiAutoCompleteOption>
      </template>
    </div>
    <div
      v-else
      v-bind="wrapperProps"
      :ref="setMenuRef"
    >
      <RuiAutoCompleteOption
        v-for="{ item, _index } in renderedData"
        :key="getIdentifier(item)?.toString()"
        :item="item"
        :text="getText(item)"
        :active="isActiveItem(item)"
        :disabled="isItemDisabled(item)"
        :dense="dense"
        :highlighted="highlightedIndex === _index"
        :highlighted-class="highlightedClass"
        @select="emit('select', $event)"
      >
        <template
          v-if="$slots['item.prepend']"
          #prepend="slotProps"
        >
          <slot
            name="item.prepend"
            v-bind="slotProps"
          />
        </template>
        <template
          v-if="$slots.item"
          #default="slotProps"
        >
          <slot
            name="item"
            v-bind="slotProps"
          />
        </template>
        <template
          v-if="$slots['item.append']"
          #append="slotProps"
        >
          <slot
            name="item.append"
            v-bind="slotProps"
          />
        </template>
      </RuiAutoCompleteOption>
    </div>
  </div>
</template>
