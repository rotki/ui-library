<script lang="ts" setup generic='TValue, TItem'>
import type { ComponentPublicInstance, ComputedRef } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiChip from '@/components/chips/RuiChip.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { type KeyOfType, useDropdownMenu, useDropdownOptionProperty } from '@/composables/dropdown-menu';
import { useAutoCompleteFocus, useAutoCompleteKeyboardNavigation, useAutoCompleteSearch, useAutoCompleteValue } from '@/composables/forms/auto-complete';
import { getTextToken } from '@/utils/helpers';
import { isEqual } from '@/utils/is-equal';
import { syncRef } from '@vueuse/core';
import { logicAnd, logicOr } from '@vueuse/math';

export type AutoCompleteModelValue<TValue> = TValue extends Array<infer U> ? U[] : TValue | undefined;

export interface AutoCompleteProps<TValue, TItem> {
  options?: TItem[];
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  menuOptions?: MenuProps;
  labelClass?: string;
  menuClass?: string;
  itemClass?: string;
  prependWidth?: number; // in rem
  appendWidth?: number; // in rem
  itemHeight?: number; // in px
  variant?: 'default' | 'filled' | 'outlined';
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  autoSelectFirst?: boolean;
  chips?: boolean;
  noFilter?: boolean;
  hideNoData?: boolean;
  noDataText?: string;
  filter?: (item: TItem, queryText: string) => boolean;
  hideSelected?: boolean;
  placeholder?: string;
  returnObject?: boolean;
  customValue?: boolean;
  hideCustomValue?: boolean;
}

defineOptions({
  name: 'RuiAutoComplete',
  inheritAttrs: false,
});

const modelValue = defineModel<AutoCompleteModelValue<TValue>>({ required: true });

const searchInputModel = defineModel<string>('searchInput', { default: '' });

const props = withDefaults(defineProps<AutoCompleteProps<TValue, TItem>>(), {
  options: () => [],
  disabled: false,
  loading: false,
  readOnly: false,
  dense: false,
  clearable: false,
  hideDetails: false,
  chips: false,
  label: 'Select',
  menuOptions: undefined,
  prependWidth: 0,
  appendWidth: 0,
  variant: 'default',
  hint: undefined,
  keyAttr: undefined,
  textAttr: undefined,
  itemHeight: undefined,
  errorMessages: () => [],
  successMessages: () => [],
  autoSelectFirst: false,
  noFilter: false,
  hideNoData: false,
  noDataText: 'No data available',
  hideSelected: false,
  placeholder: '',
  returnObject: false,
  customValue: false,
  hideCustomValue: false,
});

const slots = useSlots();

const { dense, disabled, options } = toRefs(props);

const { getText, getIdentifier } = useDropdownOptionProperty<TValue, TItem>({
  keyAttr: props.keyAttr,
  textAttr: props.textAttr,
});

const textInput = ref();
const activator = ref();
const menuRef = ref();
const menuWrapperRef = ref();

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: menuWrapperFocusedWithin } = useFocusWithin(menuWrapperRef);
const { focused: searchInputFocused } = useFocus(textInput);
const { focused: activatorFocused } = useFocus(activator);

const renderedOptions = ref<ComponentPublicInstance[]>([]);

const {
  internalSearch,
  filteredOptions,
  justOpened,
  updateInternalSearch,
  textValueToProperValue,
} = useAutoCompleteSearch<TItem>(
  options,
  searchInputModel,
  {
    keyAttr: toRef(props, 'keyAttr'),
    textAttr: toRef(props, 'textAttr'),
    noFilter: toRef(props, 'noFilter'),
    filter: toRef(props, 'filter'),
    customValue: toRef(props, 'customValue'),
    hideCustomValue: toRef(props, 'hideCustomValue'),
    returnObject: toRef(props, 'returnObject'),
  },
);

// Calculate multiple from modelValue directly to avoid circular dependency
const multiple = computed<boolean>(() => Array.isArray(get(modelValue)));

const shouldApplyValueAsSearch = computed<boolean>(() => !(slots.selection || get(multiple) || props.chips));

// Create a temporary isOpen ref that we'll sync with useDropdownMenu's isOpen
const tempIsOpen = ref<boolean>(false);

const {
  value,
  setSelected,
} = useAutoCompleteValue<AutoCompleteModelValue<TValue>, TItem>(
  modelValue,
  options,
  {
    keyAttr: toRef(props, 'keyAttr'),
    returnObject: toRef(props, 'returnObject'),
    customValue: toRef(props, 'customValue'),
  },
  {
    getIdentifier,
    getText,
    textValueToProperValue,
    shouldApplyValueAsSearch,
    isOpen: tempIsOpen,
    updateInternalSearch,
  },
);

const {
  containerProps,
  wrapperProps,
  renderedData,
  isOpen,
  menuWidth,
  isActiveItem,
  itemIndexInValue,
  highlightedIndex,
  moveHighlight,
  applyHighlighted,
  optionsWithSelectedHidden,
} = useDropdownMenu<TValue, TItem>({
  itemHeight: props.itemHeight ?? (props.dense ? 30 : 48),
  keyAttr: props.keyAttr,
  textAttr: props.textAttr,
  options: filteredOptions,
  dense,
  value,
  menuRef,
  setValue,
  autoSelectFirst: props.autoSelectFirst,
  hideSelected: props.hideSelected,
});

// Sync the isOpen states
syncRef(isOpen, tempIsOpen);

const {
  focusedValueIndex,
  moveSelectedValueHighlight,
  onEnter,
  onInputDeletePressed,
  onTab,
  setValueFocus,
} = useAutoCompleteKeyboardNavigation<TItem>(
  {
    customValue: toRef(props, 'customValue'),
    multiple,
  },
  {
    activator,
    applyHighlighted,
    clear,
    filteredOptions,
    highlightedIndex,
    internalSearch,
    isOpen,
    options,
    searchInputFocused,
    setSearchAsValue,
    value,
  },
);

const {
  anyFocused: focusAnyFocused,
  inputClass: focusInputClass,
  onActivatorFocused: focusOnActivatorFocused,
  onInputFocused: focusOnInputFocused,
  setInputFocus: focusSetInputFocus,
} = useAutoCompleteFocus<TItem>(
  {
    customValue: toRef(props, 'customValue'),
    disabled,
    shouldApplyValueAsSearch,
  },
  {
    activatorFocused,
    activatorFocusedWithin,
    filteredOptions,
    focusedValueIndex,
    internalSearch,
    isOpen,
    justOpened,
    menuWrapperFocusedWithin,
    searchInputFocused,
    setSearchAsValue,
    textInput,
    updateInternalSearch,
  },
);

const valueSet = computed<boolean>(() => get(value).length > 0);

const labelWithQuote = computed<string>(() => {
  if (!props.label)
    return '"\\200B"';

  return `'  ${props.label}  '`;
});

const menuMinHeight = ref<number>(0);

// Update menu min height only when rendered data changes
watch(renderedData, async () => {
  await nextTick();
  const renderedOptionsData = get(renderedOptions).slice(0, Math.min(5, get(renderedData).length));
  let height = 0;
  for (const item of renderedOptionsData) {
    if (item.$el) {
      height += item.$el.offsetHeight;
    }
  }
  set(menuMinHeight, height);
}, { immediate: true });

const outlined = computed<boolean>(() => props.variant === 'outlined');

const float: ComputedRef<boolean> = logicAnd(
  logicOr(
    isOpen,
    valueSet,
    searchInputFocused,
  ),
  outlined,
);

const virtualContainerProps = computed(() => ({
  style: containerProps.style as any,
  ref: containerProps.ref as any,
}));

const updateSearchInputDebounced = useDebounceFn((value: string) => {
  updateInternalSearch(value);
  set(justOpened, false);
}, 50);

function updateSearchInput(event: any) {
  const value = event.target.value;
  set(isOpen, true);
  updateSearchInputDebounced(value);
}

async function setValue(val: TItem, index?: number, skipRefocused = false): Promise<void> {
  if (isDefined(index))
    set(highlightedIndex, index);

  const isMultiple = get(multiple);

  if (isMultiple) {
    const newValue = [...get(value)];
    const indexInValue = itemIndexInValue(val);
    if (indexInValue === -1) {
      updateInternalSearch();
      newValue.push(val);
    }

    else { newValue.splice(indexInValue, 1); }
    set(value, newValue);
  }
  else {
    if (get(shouldApplyValueAsSearch))
      updateInternalSearch(getText(val));
    else
      updateInternalSearch();

    set(value, [val]);
  }

  if (!isMultiple) {
    if (!skipRefocused) {
      set(activatorFocused, true);
      get(activator)?.focus();
      await nextTick(() => {
        set(isOpen, false);
      });
    }
    else {
      set(isOpen, false);
    }
  }
  else if (!skipRefocused) {
    set(searchInputFocused, true);
  }
}

function setSearchAsValue() {
  const searchToBeValue = get(internalSearch);
  if (!searchToBeValue)
    return;

  const newValue: TItem = textValueToProperValue(searchToBeValue);
  setValue(newValue, undefined, true);
}

function clear(): void {
  updateInternalSearch();
  set(modelValue, (Array.isArray(get(modelValue)) ? [] : undefined) as AutoCompleteModelValue<TValue>);
}

function chipAttrs(item: TItem, index: number) {
  return {
    'data-index': index,
    'data-value': getIdentifier(item),
    'onKeydown': (event: KeyboardEvent): void => {
      const { key } = event;
      if (['Backspace', 'Delete'].includes(key))
        setValue(item);
    },
    'onClick.stop': (): void => {
      setValueFocus(index);
    },
    'onClick:close': (): void => {
      setValue(item);
    },
  };
}

function setSelectionRange(start: number, end: number): void {
  set(searchInputFocused, true);
  get(textInput)?.setSelectionRange?.(start, end);
}

// Optimize options watcher with shallow comparison first
watch(options, (curr, old) => {
  if (curr === old || props.customValue)
    return;

  // Only do deep comparison if reference changed
  if (isEqual(curr, old))
    return;

  setSelected(get(value));
});

function arrowClicked(event: any): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

defineExpose({
  focus: focusSetInputFocus,
  setSelectionRange,
});
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="$style.wrapper"
    v-bind="{
      ...getRootAttrs($attrs),
      placement: 'bottom-start',
      closeOnContentClick: false,
      fullWidth: true,
      persistOnActivatorClick: true,
      ...menuOptions,
      menuClass: [
        { hidden: (optionsWithSelectedHidden.length === 0 && customValue && !slots['no-data']) },
        menuOptions?.menuClass,
      ],
      errorMessages,
      successMessages,
      hint,
      dense,
      showDetails: !hideDetails,
      disabled,
    }"
  >
    <template #activator="{ attrs, open, hasError, hasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, variant, readOnly, attrs, open, hasError, hasSuccess }"
      >
        <div
          ref="activator"
          class="group"
          :class="[
            $style.activator,
            labelClass,
            {
              [$style.disabled]: disabled,
              [$style.readonly]: readOnly,
              [$style.outlined]: outlined,
              [$style.dense]: dense,
              [$style.float]: float,
              [$style.opened]: open,
              [$style['with-value']]: valueSet,
              [$style['with-error']]: hasError,
              [$style['with-success']]: hasSuccess && !hasError,
            },
          ]"
          v-bind="{
            ...getNonRootAttrs($attrs, ['onClick', 'class']),
            ...(readOnly ? {} : attrs) }
          "
          data-id="activator"
          :tabindex="disabled || readOnly ? -1 : 0"
          @click="focusSetInputFocus()"
          @focus="focusOnActivatorFocused()"
          @keydown.enter="onEnter($event)"
          @keydown.tab="onTab($event)"
          @keydown.left="moveSelectedValueHighlight($event, false)"
          @keydown.right="moveSelectedValueHighlight($event, true)"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
        >
          <span
            v-if="outlined || (!valueSet && !searchInputFocused)"
            :class="[
              $style.label,
              {
                'absolute': outlined,
                'pr-2': !valueSet && !open && outlined,
              },
            ]"
          >
            <slot
              name="activator.label"
              v-bind="{ value }"
            >
              {{ label }}
            </slot>
          </span>
          <div :class="$style.value">
            <template
              v-for="(item, i) in value"
              :key="getIdentifier(item)"
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
                    name="selection.prepend"
                    :index="i"
                    v-bind="{ item }"
                  />
                  <slot
                    :index="i"
                    name="selection"
                    v-bind="{ item }"
                  >
                    {{ getText(item) }}
                  </slot>
                </div>
              </RuiChip>
              <div
                v-else-if="multiple || ((!searchInputFocused) && (slots['selection.prepend'] || slots.selection))"
                class="flex"
              >
                <slot
                  name="selection.prepend"
                  :index="i"
                  v-bind="{ item }"
                />
                <slot
                  v-if="multiple || slots.selection"
                  :index="i"
                  name="selection"
                  v-bind="{ item, chipAttrs: chipAttrs(item, i) }"
                >
                  {{ getText(item) }}
                </slot>
              </div>
            </template>
            <input
              ref="textInput"
              :disabled="disabled"
              :value="internalSearch"
              class="bg-transparent outline-none"
              type="text"
              :placeholder="placeholder"
              :class="focusInputClass"
              @keydown.delete="onInputDeletePressed()"
              @input.stop="updateSearchInput($event)"
              @focus="focusOnInputFocused()"
            />
          </div>

          <RuiButton
            v-if="clearable && valueSet && !disabled"
            variant="text"
            icon
            size="sm"
            tabindex="-1"
            color="error"
            class="group-hover:!visible"
            :class="[$style.clear, focusAnyFocused && '!visible', {
              'mr-2': !dense,
            }]"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              name="lu-x"
              size="18"
            />
          </RuiButton>

          <span
            :class="$style.icon__wrapper"
            @click="arrowClicked($event)"
          >
            <RuiIcon
              :class="[$style.icon, { 'rotate-180': open }]"
              :size="dense ? 16 : 24"
              name="lu-chevron-down"
            />
          </span>

          <RuiProgress
            v-if="loading"
            class="absolute left-0 bottom-0 w-full"
            color="primary"
            thickness="3"
            variant="indeterminate"
          />
        </div>
        <fieldset
          v-if="outlined"
          :class="$style.fieldset"
        >
          <legend :class="{ 'px-2': float }" />
        </fieldset>
      </slot>
    </template>
    <template #default="{ width }">
      <div ref="menuWrapperRef">
        <div
          v-if="optionsWithSelectedHidden.length > 0"
          :class="[$style.menu, menuClass]"
          :style="{ width: `${width}px`, minWidth: menuWidth, minHeight: `${menuMinHeight}px` }"
          v-bind="virtualContainerProps"
          @scroll="containerProps.onScroll"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
        >
          <div
            v-bind="wrapperProps"
            ref="menuRef"
          >
            <RuiButton
              v-for="({ item, _index }) in renderedData"
              ref="renderedOptions"
              :key="getIdentifier(item)?.toString()"
              :active="isActiveItem(item)"
              :size="dense ? 'sm' : undefined"
              tabindex="0"
              variant="list"
              :class="{
                highlighted: highlightedIndex === _index,
                [$style.highlighted]: highlightedIndex === _index,
                [$style.active]: isActiveItem(item),
              }"
              @click="setValue(item, _index)"
              @mousedown="highlightedIndex = _index"
            >
              <template #prepend>
                <slot
                  name="item.prepend"
                  v-bind="{ disabled, item, active: isActiveItem(item) }"
                />
              </template>
              <slot
                name="item"
                v-bind="{ disabled, item, active: isActiveItem(item) }"
              >
                {{ getText(item) }}
              </slot>
              <template #append>
                <slot
                  name="item.append"
                  v-bind="{ disabled, item, active: isActiveItem(item) }"
                />
              </template>
            </RuiButton>
          </div>
        </div>

        <div
          v-else-if="!hideNoData"
          :style="{ width: `${width}px`, minWidth: menuWidth }"
          :class="menuClass"
        >
          <slot name="no-data">
            <div
              v-if="!customValue"
              class="p-4"
            >
              {{ noDataText }}
            </div>
          </slot>
        </div>
      </div>
    </template>
  </RuiMenu>
</template>

<style lang="scss" module>
.wrapper {
  @apply w-full inline-flex flex-col;

  .activator {
    @apply relative inline-flex items-center w-full;
    @apply outline-none focus-within:outline-none cursor-pointer min-h-14 pl-3 py-2 pr-8 rounded;
    @apply m-0 bg-white transition-all text-body-1 text-left hover:border-black;

    &:not(.outlined) {
      @apply hover:bg-gray-100 focus-within:bg-gray-100;
    }

    &.dense {
      @apply py-1.5 min-h-10;

      ~ .fieldset {
        @apply px-2;
      }
    }

    &.disabled {
      @apply opacity-65 text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none;
    }

    &.readonly {
      @apply opacity-80 pointer-events-none cursor-default bg-gray-50;
    }

    &.outlined {
      @apply border-none hover:border-none;

      &:not(.disabled) {
        &.opened,
        &:focus,
        &:focus-within {
          @apply border-rui-primary;

          ~ .fieldset {
            @apply border-rui-primary #{!important};
            @apply border-2 #{!important};
          }
        }
      }

      ~ .fieldset {
        @apply border border-black/[0.23];
      }

      &:hover {
        ~ .fieldset {
          @apply border-black;
        }
      }

      &.disabled {
        ~ .fieldset {
          @apply border-dotted;
          @apply border border-black/[0.23] #{!important};
        }
      }

      &.with-success {
        .label {
          @apply text-rui-success #{!important};
        }

        ~ .fieldset {
          @apply border-rui-success #{!important};
        }
      }

      &.with-error {
        .label {
          @apply text-rui-error #{!important};
        }

        ~ .fieldset {
          @apply border-rui-error #{!important};
        }
      }
    }

    .label {
      @apply text-rui-text-secondary;
      max-width: calc(100% - 2.5rem);
    }

    .label,
    .value {
      @apply block truncate transition-all duration-75;
    }

    .value {
      @apply flex gap-1 flex-wrap flex-1;
    }

    .clear {
      @apply ml-auto shrink-0 invisible;
    }

    .icon {
      @apply text-rui-text transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute right-3 top-px bottom-0;
      }
    }

    &.float {
      .label {
        @apply -translate-y-2 top-0 text-xs px-1;
      }

      ~ .fieldset {
        legend {
          &:after {
            content: v-bind(labelWithQuote);
          }
        }
      }

      &:not(.disabled) {
        &.opened,
        &.opened.with-value,
        &:focus,
        &:focus.with-value,
        &:focus-within,
        &:focus-within.with-value {
          .label {
            @apply text-rui-primary;
          }

          ~ .fieldset {
            @apply border-rui-primary;
            @apply border-2 #{!important};
          }
        }
      }
    }
  }

  .fieldset {
    @apply absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0 rounded pointer-events-none px-2 transition-all -mt-2;

    legend {
      @apply opacity-0 text-xs truncate;
      max-width: calc(100% - 1rem);

      &:before {
        content: ' ';
      }

      &:after {
        @apply truncate max-w-full leading-[0];
        content: '\200B';
      }
    }
  }
}

.menu {
  @apply overflow-y-auto max-h-60 min-w-[2.5rem];
}

.highlighted {
  @apply bg-rui-grey-200 #{!important};

  &.active {
    @apply bg-rui-grey-300 #{!important};
  }
}

:global(.dark) {
  .wrapper {
    .activator {
      @apply bg-transparent text-rui-text;

      &:not(.outlined) {
        @apply hover:bg-white/10 focus-within:bg-white/10;

        &.disabled {
          @apply bg-white/10;
        }
      }

      &.readonly {
        @apply bg-white/10;
      }

      &.outlined {
        ~ .fieldset {
          @apply border-white/[0.23];
        }

        &.disabled {
          ~ .fieldset {
            @apply border-white/[0.23] #{!important};
          }
        }

        &:hover {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }

  .highlighted {
    @apply bg-rui-grey-800 #{!important};

    &.active {
      @apply bg-rui-grey-700 #{!important};
    }
  }
}
</style>
