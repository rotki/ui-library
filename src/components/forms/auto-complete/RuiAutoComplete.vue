<script lang="ts" setup generic='TValue, TItem'>
import type { KeyOfType } from '@/composables/dropdown-menu';
import type { ComponentPublicInstance, ComputedRef } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiChip from '@/components/chips/RuiChip.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { getTextToken } from '@/utils/helpers';
import { isEqual } from '@/utils/is-equal';
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
}

defineOptions({
  name: 'RuiAutoComplete',
  inheritAttrs: false,
});

const modelValue = defineModel<AutoCompleteModelValue<TValue>>({ required: true });

const searchInputModel = defineModel<string>('searchInput');

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

const anyFocused = logicOr(activatorFocusedWithin, menuWrapperFocusedWithin);

const renderedOptions = ref<ComponentPublicInstance[]>([]);

const menuMinHeight = computed<number>(() => {
  const renderedOptionsData = get(renderedOptions).slice(0, Math.min(5, get(renderedData).length));
  return renderedOptionsData.reduce((currentValue, item) => currentValue + item.$el.offsetHeight, 0);
});

const multiple = computed(() => Array.isArray(get(modelValue)));

const shouldApplyValueAsSearch = computed(() => !(slots.selection || get(multiple) || props.chips));

const internalSearch = ref<string>('');
const debouncedInternalSearch = refDebounced(internalSearch, 100);

watch(searchInputModel, (search) => {
  set(internalSearch, search);
}, { immediate: true });

const justOpened = ref(false);

const filteredOptions = computed<TItem[]>(() => {
  const search = get(debouncedInternalSearch);
  const options = props.options;
  if (props.noFilter || !search || get(justOpened))
    return options;

  const keyAttr = props.keyAttr;
  const textAttr = props.textAttr;

  const usedFilter = props.filter || ((item, search) => {
    if (!item)
      return false;

    const keywords: string[] = [keyAttr ? getTextToken(item[keyAttr]) : item.toString()];

    if (textAttr && typeof item === 'object')
      keywords.push(getTextToken(item[textAttr]));

    return keywords.some(keyword => getTextToken(keyword).includes(getTextToken(search)));
  });

  return options.filter(item => usedFilter(item, search));
});

function onUpdateModelValue(value: AutoCompleteModelValue<TValue>) {
  set(modelValue, value);
}

function setSelected(selected: TItem[]): void {
  const keyAttr = props.keyAttr;
  const selection = keyAttr && !props.returnObject ? selected.map(item => item[keyAttr]) : selected;

  if (get(multiple))
    return onUpdateModelValue(selection as AutoCompleteModelValue<TValue>);

  if (selection.length === 0)
    return onUpdateModelValue(undefined as AutoCompleteModelValue<TValue>);

  return onUpdateModelValue(selection[0] as AutoCompleteModelValue<TValue>);
}

const value = computed<TItem[]>({
  get: () => {
    const value = get(modelValue);
    const keyAttr = props.keyAttr;
    const multiple = Array.isArray(value);

    const shouldUpdateInternalSearch = get(shouldApplyValueAsSearch) && !get(isOpen);

    if (keyAttr && props.returnObject) {
      const valueToArray = value ? (multiple ? value : [value]) : [];
      const filtered: TItem[] = [];
      valueToArray.forEach((val) => {
        const inOptions = props.options.find(item => getIdentifier(item) === getIdentifier(val));

        if (inOptions)
          return filtered.push(inOptions);
        if (props.customValue)
          return filtered.push(textValueToProperValue(val, props.returnObject));
      });

      if (multiple || filtered.length === 0) {
        if (shouldUpdateInternalSearch)
          updateInternalSearch();
        return filtered;
      }
      else {
        const val = filtered[0];
        if (shouldUpdateInternalSearch)
          updateInternalSearch(getText(val));

        return [val];
      }
    }
    else {
      const valueToArray = value ? (multiple ? value : [value]) : [];
      const filtered: TItem[] = [];
      valueToArray.forEach((val) => {
        const inOptions = props.options.find(item => getIdentifier(item) === val);

        if (inOptions)
          return filtered.push(inOptions);
        if (props.customValue)
          return filtered.push(textValueToProperValue(val, props.returnObject));
      });

      if (shouldUpdateInternalSearch) {
        if (filtered.length > 0)
          updateInternalSearch(getText(filtered[0]));
        else
          updateInternalSearch();
      }

      return filtered;
    }
  },
  set: (selected: TItem[]): void => {
    setSelected(selected);
  },
});

const valueSet = computed<boolean>(() => get(value).length > 0);

const labelWithQuote = computed<string>(() => {
  if (!props.label)
    return '"\\200B"';

  return `'  ${props.label}  '`;
});

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

function updateInternalSearch(value: string = '') {
  set(searchInputModel, value);
  set(internalSearch, value);
}

function updateSearchInput(event: any) {
  const value = event.target.value;
  set(isOpen, true);
  updateInternalSearch(value);
  set(justOpened, false);
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

async function setInputFocus(): Promise<void> {
  await nextTick(() => {
    set(searchInputFocused, true);
  });
}

async function onActivatorFocused() {
  await nextTick(() => {
    if (!get(activatorFocused)) {
      set(searchInputFocused, true);
    }
  });
}

const focusedValueIndex = ref<number>(-1);

function setValueFocus(index: number): void {
  set(focusedValueIndex, index);
}

watch(value, () => {
  setValueFocus(-1);
});

watch(focusedValueIndex, async (index) => {
  if (index === -1 || !get(multiple))
    return;

  await nextTick(() => {
    const activeChip = get(activator).querySelector(`[data-index="${index}"]`);
    activeChip?.focus();
  });
});

function moveSelectedValueHighlight(event: KeyboardEvent, next: boolean): void {
  if (!get(multiple) || get(internalSearch).length > 0)
    return;

  event.preventDefault();
  const total = get(value).length;

  let current = get(focusedValueIndex);

  if (current === -1) {
    set(focusedValueIndex, next ? 0 : total - 1);
    return;
  }

  const move = next ? 1 : -1;
  current += move;

  if (current < 0 || current >= total) {
    set(focusedValueIndex, -1);
    set(searchInputFocused, true);
  }
  else {
    set(focusedValueIndex, current);
  }
}

const inputClass = computed<string>(() => {
  if ((!get(anyFocused) || get(disabled)) && !get(shouldApplyValueAsSearch))
    return 'w-0 h-0';
  if (get(internalSearch))
    return 'flex-1 min-w-[4rem]';
  return 'flex-1 min-w-0';
});

function textValueToProperValue(val: any, returnObject: boolean = false): TItem {
  const keyAttr = props.keyAttr;
  const textAttr = props.textAttr;
  if (!keyAttr || returnObject)
    return val;

  return {
    [keyAttr]: val,
    ...(
      textAttr
        ? { [textAttr]: val }
        : {}
    ),
  } as TItem;
}

function setSearchAsValue() {
  const searchToBeValue = get(internalSearch);
  if (!searchToBeValue)
    return;

  const newValue: TItem = textValueToProperValue(searchToBeValue);
  setValue(newValue, undefined, true);
}

// Close menu if the activator is not focused anymore
// Using debounced to avoid the menu closing momentarily while focus switches.
watchDebounced(anyFocused, (focused) => {
  if (!focused) {
    set(isOpen, false);
    if (props.customValue && get(filteredOptions).length === 0 && get(internalSearch))
      setSearchAsValue();

    if (!get(shouldApplyValueAsSearch))
      updateInternalSearch();
  }
}, {
  debounce: 200,
  maxWait: 400,
});

function onInputFocused() {
  set(focusedValueIndex, -1);
  if (get(shouldApplyValueAsSearch))
    get(textInput)?.select();

  if (!get(isOpen))
    set(justOpened, true);
}

function clear(): void {
  updateInternalSearch();
  set(modelValue, (Array.isArray(get(modelValue)) ? [] : undefined) as AutoCompleteModelValue<TValue>);
}

function onInputDeletePressed(): void {
  const total = get(value).length;
  if (!get(internalSearch) && total > 0) {
    if (get(multiple))
      set(focusedValueIndex, total - 1);
    else
      clear();
  }
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

function onEnter(event: KeyboardEvent): void {
  if (get(filteredOptions).length > 0 && get(highlightedIndex) > -1 && get(isOpen)) {
    applyHighlighted();
    event.preventDefault();
  }
  else if (get(options).length > 0 && props.customValue) {
    setSearchAsValue();
    if (!get(multiple))
      set(isOpen, false);
    event.preventDefault();
  }
  else if (!get(isOpen) && get(value).length === 0) {
    set(isOpen, true);
    event.preventDefault();
  }
}

function onTab(event: KeyboardEvent): void {
  if (get(isOpen) && get(filteredOptions).length > 0 && get(highlightedIndex) > -1 && !get(multiple)) {
    applyHighlighted();
    event.preventDefault();
  }
}

function setSelectionRange(start: number, end: number): void {
  set(searchInputFocused, true);
  get(textInput)?.setSelectionRange?.(start, end);
}

watch(options, (curr, old) => {
  if (isEqual(curr, old) || props.customValue)
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
  focus: setInputFocus,
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
          @click="setInputFocus()"
          @focus="onActivatorFocused()"
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
              :class="inputClass"
              @keydown.delete="onInputDeletePressed()"
              @input="updateSearchInput($event)"
              @focus="onInputFocused()"
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
            :class="[$style.clear, anyFocused && '!visible', {
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

      &.opened,
      &:focus,
      &:focus-within {
        @apply border-rui-primary;

        ~ .fieldset {
          @apply border-rui-primary #{!important};
          @apply border-2 #{!important};
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
