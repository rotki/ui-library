<script lang="ts" setup generic="TValue, TItem">
import type { VueClassValue } from '@/types/class-value';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiChip from '@/components/chips/RuiChip.vue';
import { autoCompleteStyles, type AutoCompleteVariant } from '@/components/forms/auto-complete/auto-complete-styles';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import {
  type KeyOfType,
  useDropdownMenu,
  useDropdownOptionProperty,
} from '@/composables/dropdown-menu';
import {
  useAutoCompleteFocus,
  useAutoCompleteKeyboardNavigation,
  useAutoCompleteSearch,
  useAutoCompleteValue,
} from '@/composables/forms/auto-complete';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs, getTextToken } from '@/utils/helpers';
import { isEqual } from '@/utils/is-equal';
import { cn } from '@/utils/tv';

export type AutoCompleteModelValue<TValue> =
  TValue extends Array<infer U> ? U[] : TValue | undefined;

export interface RuiAutoCompleteClassNames {
  root?: VueClassValue;
  label?: VueClassValue;
  menu?: VueClassValue;
}

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
  classNames?: RuiAutoCompleteClassNames;
  /** @deprecated Use `classNames.label` instead */
  labelClass?: string;
  /** @deprecated Use `classNames.menu` instead */
  menuClass?: string;
  prependWidth?: number;
  appendWidth?: number;
  itemHeight?: number;
  variant?: AutoCompleteVariant;
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
  required?: boolean;
  hideSearchInput?: boolean;
  hideSelectionWrapper?: boolean;
}

defineOptions({
  name: 'RuiAutoComplete',
  inheritAttrs: false,
});

const modelValue = defineModel<AutoCompleteModelValue<TValue>>({ required: true });

const searchInputModel = defineModel<string>('searchInput', { default: '' });

const {
  options = [],
  disabled = false,
  loading = false,
  readOnly = false,
  dense = false,
  clearable = false,
  hideDetails = false,
  chips = false,
  label = 'Select',
  menuOptions,
  classNames,
  labelClass,
  menuClass,
  variant = 'default',
  hint,
  keyAttr,
  textAttr,
  itemHeight,
  errorMessages = [],
  successMessages = [],
  autoSelectFirst = false,
  noFilter = false,
  hideNoData = false,
  noDataText = 'No data available',
  filter,
  hideSelected = false,
  placeholder = '',
  returnObject = false,
  customValue = false,
  hideCustomValue = false,
  required = false,
  hideSearchInput = false,
  hideSelectionWrapper = false,
} = defineProps<AutoCompleteProps<TValue, TItem>>();

const slots = defineSlots<{
  'activator'?: (props: {
    disabled: boolean;
    value: TItem[];
    variant: string;
    readOnly: boolean;
    attrs: Record<string, unknown>;
    open: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
  'activator.label'?: (props: { value: TItem[] }) => any;
  'selection.prepend'?: (props: { index: number; item: TItem }) => any;
  'selection'?: (props: { index: number; item: TItem; chipAttrs: Record<string, unknown> }) => any;
  'item.prepend'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item.append'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'no-data'?: () => any;
}>();

const { getText, getIdentifier } = useDropdownOptionProperty<TValue, TItem>({
  keyAttr,
  textAttr,
});

const textInput = useTemplateRef<HTMLInputElement>('textInput');
const activator = useTemplateRef<HTMLDivElement>('activator');
const menuRef = useTemplateRef<HTMLDivElement>('menuRef');
const menuWrapperRef = useTemplateRef<HTMLDivElement>('menuWrapperRef');

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: menuWrapperFocusedWithin } = useFocusWithin(menuWrapperRef);
const { focused: searchInputFocused } = useFocus(textInput);
const { focused: activatorFocused } = useFocus(activator);

const {
  internalSearch,
  filteredOptions,
  justOpened,
  updateInternalSearch,
  textValueToProperValue,
} = useAutoCompleteSearch<TItem>(
  () => options,
  searchInputModel,
  {
    keyAttr: () => keyAttr,
    textAttr: () => textAttr,
    noFilter: () => noFilter,
    filter: () => filter,
    customValue: () => customValue,
    hideCustomValue: () => hideCustomValue,
    returnObject: () => returnObject,
  },
);

const isOpen = ref<boolean>(false);
const isHovered = ref<boolean>(false);

// Calculate multiple from modelValue directly to avoid circular dependency
const multiple = computed<boolean>(() => Array.isArray(get(modelValue)));

const shouldApplyValueAsSearch = computed<boolean>(
  () => !(slots.selection || get(multiple) || chips),
);

const { value, setSelected } = useAutoCompleteValue<AutoCompleteModelValue<TValue>, TItem>(
  modelValue,
  () => options,
  {
    keyAttr: () => keyAttr,
    returnObject: () => returnObject,
    customValue: () => customValue,
  },
  {
    getIdentifier,
    getText,
    textValueToProperValue,
    shouldApplyValueAsSearch,
    isOpen,
    multiple,
    updateInternalSearch,
  },
);

const resolvedItemHeight = itemHeight ?? (dense ? 30 : 48);

const {
  containerProps,
  wrapperProps,
  renderedData,
  menuWidth,
  isActiveItem,
  itemIndexInValue,
  highlightedIndex,
  moveHighlight,
  applyHighlighted,
  optionsWithSelectedHidden,
  userNavigated,
} = useDropdownMenu<TValue, TItem>({
  itemHeight: resolvedItemHeight,
  keyAttr,
  textAttr,
  options: filteredOptions,
  dense: () => dense,
  value,
  menuRef,
  setValue,
  autoSelectFirst,
  hideSelected,
  isOpen,
  getText,
  getIdentifier,
});

const {
  focusedValueIndex,
  moveSelectedValueHighlight,
  onEnter,
  onInputDeletePressed,
  onTab,
  setValueFocus,
} = useAutoCompleteKeyboardNavigation<TItem>(
  {
    chips: () => chips,
    customValue: () => customValue,
    multiple,
  },
  {
    activator,
    applyHighlighted,
    clear,
    filteredOptions,
    getText,
    highlightedIndex,
    internalSearch,
    isOpen,
    removeValue: (item: TItem): void => { setValue(item); },
    searchInputFocused,
    setSearchAsValue,
    userNavigated,
    value,
  },
);

const {
  anyFocused: focusAnyFocused,
  inputClass: focusInputClass,
  onActivatorFocused: focusOnActivatorFocused,
  onInputFocused: focusOnInputFocused,
  setInputFocus: focusSetInputFocus,
} = useAutoCompleteFocus(
  {
    customValue: () => customValue,
    disabled: () => disabled,
    shouldApplyValueAsSearch,
  },
  {
    activatorFocused,
    activatorFocusedWithin,
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

const menuMinHeight = computed<number>(
  () => Math.min(5, get(optionsWithSelectedHidden).length) * resolvedItemHeight,
);

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const valueSet = computed<boolean>(() => get(value).length > 0);

const usedPlaceholder = computed<string>(() => {
  if (get(searchInputFocused))
    return placeholder;
  return '';
});

const outlined = computed<boolean>(() => variant === 'outlined');
const float = computed<boolean>(() => (get(isOpen) || get(valueSet) || get(searchInputFocused)) && get(outlined));

const legendText = computed<string>(() => {
  if (!get(float) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

const ui = computed<ReturnType<typeof autoCompleteStyles>>(() => autoCompleteStyles({
  filled: variant === 'filled',
  outlined: get(outlined),
  float: get(float),
  opened: get(isOpen),
  hovered: get(isHovered),
  dense,
  disabled,
  readonly: readOnly,
  hasError: get(hasError),
  hasSuccess: get(hasSuccess) && !get(hasError),
}));

const highlightedClass = autoCompleteStyles({}).highlighted();

function updateSearchInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement))
    return;

  const value = target.value;
  set(isOpen, true);
  updateInternalSearch(value);
  set(justOpened, false);
}

async function setValue(val: TItem, skipRefocused = false): Promise<void> {
  const isMultiple = get(multiple);

  if (isMultiple) {
    const newValue = [...get(value)];
    const indexInValue = itemIndexInValue(val);
    if (indexInValue === -1) {
      updateInternalSearch();
      newValue.push(val);
    }
    else {
      newValue.splice(indexInValue, 1);
    }
    set(value, newValue);
  }
  else {
    if (get(shouldApplyValueAsSearch))
      updateInternalSearch(getText(val));
    else updateInternalSearch();

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

function setSearchAsValue(): void {
  const searchToBeValue = get(internalSearch);
  if (!searchToBeValue)
    return;

  const newValue: TItem = textValueToProperValue(searchToBeValue);
  setValue(newValue, true);
}

function clear(): void {
  updateInternalSearch();
  set(modelValue, (Array.isArray(get(modelValue)) ? [] : undefined) as AutoCompleteModelValue<TValue>);
}

function chipAttrs(item: TItem, index: number): Record<string, unknown> {
  return {
    'data-index': index,
    'data-value': getIdentifier(item),
    'onKeydown': (event: KeyboardEvent): void => {
      const { key } = event;
      if (['Backspace', 'Delete'].includes(key)) {
        event.stopPropagation();
        event.preventDefault();
        setValue(item);
      }
    },
    'onClick': (e: MouseEvent): void => {
      e.stopPropagation();
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

function arrowClicked(event: MouseEvent): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

function openMenu(): void {
  set(isOpen, true);
}

function closeMenu(): void {
  set(isOpen, false);
}

// Optimize options watcher with shallow comparison first
watch(() => options, (curr, old) => {
  if (curr === old || customValue)
    return;

  // Only do deep comparison if reference changed
  if (isEqual(curr, old))
    return;

  setSelected(get(value));
});

defineExpose({
  closeMenu,
  focus: focusSetInputFocus,
  openMenu,
  setSelectionRange,
});
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    v-bind="{ ...getRootAttrs($attrs, []), ...menuOptions }"
    :class="ui.wrapper({ class: cn($attrs.class) })"
    placement="bottom-start"
    :close-on-content-click="false"
    :full-width="true"
    :persist-on-activator-click="true"
    :menu-class="[
      { hidden: optionsWithSelectedHidden.length === 0 && customValue && !slots['no-data'] },
      menuOptions?.menuClass,
    ]"
    :error-messages="errorMessages"
    :success-messages="successMessages"
    :hint="hint"
    :dense="dense"
    :show-details="!hideDetails"
    :disabled="disabled"
    disable-auto-focus
  >
    <template #activator="{ attrs, open, hasError: slotHasError, hasSuccess: slotHasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, variant, readOnly, attrs, open, hasError: slotHasError, hasSuccess: slotHasSuccess }"
      >
        <div
          ref="activator"
          :class="ui.activator({ class: cn(classNames?.label) ?? labelClass })"
          v-bind="{
            ...getNonRootAttrs($attrs, ['onClick', 'class']),
            ...(readOnly ? {} : attrs),
          }"
          role="combobox"
          :aria-expanded="open"
          :aria-disabled="disabled || undefined"
          :aria-readonly="readOnly || undefined"
          :aria-required="required || undefined"
          :aria-busy="loading || undefined"
          data-id="activator"
          :aria-invalid="hasError"
          :tabindex="disabled || readOnly ? -1 : 0"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          @click="focusSetInputFocus()"
          @focus="focusOnActivatorFocused()"
          @keydown.enter="onEnter($event)"
          @keydown.tab="onTab($event)"
          @keydown.left="moveSelectedValueHighlight($event, false)"
          @keydown.right="moveSelectedValueHighlight($event, true)"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
          @keydown.home.prevent="highlightedIndex = 0"
          @keydown.end.prevent="highlightedIndex = optionsWithSelectedHidden.length - 1"
        >
          <span
            v-if="outlined || (!valueSet && !searchInputFocused)"
            :class="[
              ui.label(),
              { 'pr-2': !valueSet && !open && outlined },
            ]"
          >
            <slot
              name="activator.label"
              v-bind="{ value }"
            >
              {{ label }}
            </slot>
            <span
              v-if="required"
              :class="ui.required()"
            >
              ﹡
            </span>
          </span>
          <div
            data-id="value"
            :class="ui.value()"
          >
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
                    v-bind="{ item, chipAttrs: chipAttrs(item, i) }"
                  >
                    {{ getText(item) }}
                  </slot>
                </div>
              </RuiChip>
              <div
                v-else-if="
                  multiple
                    || (!searchInputFocused && (slots['selection.prepend'] || slots.selection))
                "
                :class="hideSelectionWrapper ? 'contents' : 'flex'"
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
              :placeholder="usedPlaceholder"
              :class="[focusInputClass, { hidden: hideSearchInput }]"
              :aria-invalid="hasError"
              aria-autocomplete="list"
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
            data-id="clear"
            :class="[
              ui.clear(),
              focusAnyFocused && '!visible',
              { 'mr-2': !dense },
            ]"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              name="lu-x"
              size="18"
            />
          </RuiButton>

          <span
            :class="ui.iconWrapper()"
            @click="arrowClicked($event)"
          >
            <RuiIcon
              :class="ui.icon()"
              :size="dense ? 16 : 24"
              name="lu-chevron-down"
            />
          </span>

          <RuiProgress
            v-if="loading"
            :class="ui.progress()"
            color="primary"
            thickness="3"
            variant="indeterminate"
          />
        </div>
        <fieldset
          v-if="outlined"
          :class="ui.fieldset()"
        >
          <legend :class="ui.legend()">
            {{ legendText }}
          </legend>
        </fieldset>
      </slot>
    </template>
    <template #default="{ width }">
      <div ref="menuWrapperRef">
        <div
          v-if="optionsWithSelectedHidden.length > 0"
          :ref="containerProps.ref"
          :class="ui.menu({ class: cn(classNames?.menu) ?? menuClass })"
          :style="[containerProps.style, { width: `${width}px`, minWidth: menuWidth, minHeight: `${menuMinHeight}px` }]"
          @scroll="containerProps.onScroll"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
        >
          <div
            v-bind="wrapperProps"
            ref="menuRef"
          >
            <RuiButton
              v-for="{ item, _index } in renderedData"
              :key="getIdentifier(item)?.toString()"
              :active="isActiveItem(item)"
              :aria-selected="isActiveItem(item)"
              :size="dense ? 'sm' : undefined"
              tabindex="0"
              variant="list"
              :data-highlighted="highlightedIndex === _index"
              :class="{
                [highlightedClass]: !isActiveItem(item) && highlightedIndex === _index,
              }"
              @click="setValue(item)"
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
          :class="classNames?.menu ?? menuClass"
        >
          <slot name="no-data">
            <div
              v-if="!customValue"
              class="p-4"
              data-id="no-data"
            >
              {{ noDataText }}
            </div>
          </slot>
        </div>
      </div>
    </template>
  </RuiMenu>
</template>
