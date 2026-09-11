<script lang="ts" setup generic="TValue, TItem">
import type { VueClassValue } from '@/types/class-value';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { autoCompleteStyles, type AutoCompleteVariant } from '@/components/forms/auto-complete/auto-complete-styles';
import RuiAutoCompleteOptionList from '@/components/forms/auto-complete/RuiAutoCompleteOptionList.vue';
import RuiAutoCompleteSelection from '@/components/forms/auto-complete/RuiAutoCompleteSelection.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import {
  type GroupBy,
  type ItemDisabled,
  type KeyOfType,
  useDropdownMenu,
  useDropdownOptionProperty,
} from '@/composables/dropdown-menu';
import { type FloatingOptions, Placement } from '@/composables/floating';
import {
  useAutoCompleteFocus,
  useAutoCompleteKeyboardNavigation,
  useAutoCompleteSearch,
  useAutoCompleteValue,
} from '@/composables/forms/auto-complete';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
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
  /**
   * Custom search predicate. Receives the resolved group label as a third
   * argument when `groupBy` is set, so callers don't have to re-run the
   * `groupBy` resolver themselves.
   */
  filter?: (item: TItem, queryText: string, group?: string) => boolean;
  hideSelected?: boolean;
  placeholder?: string;
  returnObject?: boolean;
  customValue?: boolean;
  hideCustomValue?: boolean;
  required?: boolean;
  hideSearchInput?: boolean;
  hideSelectionWrapper?: boolean;
  groupBy?: GroupBy<TItem>;
  itemDisabled?: ItemDisabled<TItem>;
  /**
   * When true and `groupBy` is set, the default search predicate also matches
   * against the resolved group label. Items belonging to a group whose label
   * matches the query stay visible (group header included), even when the
   * items themselves don't match. No effect when a custom `filter` is supplied
   * or when `groupBy` is undefined.
   */
  searchIncludesGroupLabel?: boolean;
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
  prependWidth,
  appendWidth,
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
  groupBy,
  itemDisabled,
  searchIncludesGroupLabel = false,
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
  'group-header'?: (props: { group: string; items: TItem[] }) => any;
  'no-data'?: () => any;
  'placeholder'?: (props: { disabled: boolean; readOnly: boolean }) => any;
  'footer'?: () => any;
}>();

const { getText, getIdentifier } = useDropdownOptionProperty<TValue, TItem>({
  keyAttr,
  textAttr,
});

const textInput = useTemplateRef<HTMLInputElement>('textInput');
const activator = useTemplateRef<HTMLDivElement>('activator');
// Owned by the option list, so it arrives through a ref callback rather than this template
const menuRef = shallowRef<HTMLElement | null>(null);

function setMenuRef(element: Element | ComponentPublicInstance | null): void {
  set(menuRef, element instanceof HTMLElement ? element : null);
}
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
    groupBy: () => groupBy,
    searchIncludesGroupLabel: () => searchIncludesGroupLabel,
  },
);

const isOpen = ref<boolean>(false);
const isHovered = ref<boolean>(false);

// Calculate multiple from modelValue directly to avoid circular dependency
const multiple = computed<boolean>(() => Array.isArray(get(modelValue)));

const shouldApplyValueAsSearch = computed<boolean>(
  () => !(slots.selection || get(multiple) || chips),
);

const { resolveIn, value, setSelected } = useAutoCompleteValue<AutoCompleteModelValue<TValue>, TItem>(
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
  modelHighlightedIndex,
  moveHighlight,
  applyHighlighted,
  optionsWithSelectedHidden,
  modelUserNavigated,
  groupedOptions,
  isGrouped,
  isItemDisabled,
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
  groupBy: () => groupBy,
  itemDisabled: () => itemDisabled,
  prependWidth,
  appendWidth,
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
    highlightedIndex: modelHighlightedIndex,
    internalSearch,
    isOpen,
    removeValue: (item: TItem): void => { setValue(item); },
    searchInputFocused,
    setSearchAsValue,
    userNavigated: modelUserNavigated,
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

/**
 * True while the consumer's `#placeholder` slot holds the resting content
 * area, where the resting label would overlap it and so hides instead.
 */
const placeholderSlotActive = computed<boolean>(() => Boolean(slots.placeholder) && !get(valueSet) && !get(searchInputFocused));

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
        // Alt + delete restores the chip as search text, which only helps where custom values are accepted
        if (event.altKey && customValue) {
          const text = getText(item) ?? '';
          setValue(item);
          updateInternalSearch(text);
        }
        else {
          setValue(item);
        }
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

/**
 * Reconciles the selection against a new set of options, comparing by
 * reference before by value so an unchanged list costs nothing.
 *
 * Only a selection the previous options could resolve is reconciled: a value
 * that was already unresolvable is one the consumer set before its options
 * arrived, since an async list starts empty, and clearing it here would
 * discard a legitimate value.
 */
function onOptionsChanged(curr: TItem[], old: TItem[]): void {
  if (curr === old || customValue || isEqual(curr, old))
    return;

  if (!get(multiple) && resolveIn(old).length === 0)
    return;

  setSelected(get(value));
}

watch(() => options, onOptionsChanged);

const menuFloatingOptions = computed<FloatingOptions>(() => ({
  placement: Placement.bottomStart,
  ...menuOptions?.options,
}));

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
    :options="menuFloatingOptions"
    :close-on-content-click="false"
    full-width
    persist-on-activator-click
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
          @keydown.home.prevent="modelHighlightedIndex = 0"
          @keydown.end.prevent="modelHighlightedIndex = optionsWithSelectedHidden.length - 1"
        >
          <span
            v-if="(outlined || (!valueSet && !searchInputFocused)) && !placeholderSlotActive"
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
            <!--
              Placeholder slot occupies the same flex space the input takes
              when focused, so transitioning into the focused state doesn't
              shift the activator's content. pointer-events-none is required
              so clicks pass through to the activator (otherwise the slot
              swallows the first click and the menu needs two taps to open).
            -->
            <div
              v-if="!valueSet && !searchInputFocused && slots.placeholder"
              data-id="placeholder"
              class="flex-1 min-w-0 pointer-events-none"
            >
              <slot
                name="placeholder"
                v-bind="{ disabled, readOnly }"
              />
            </div>
            <RuiAutoCompleteSelection
              :items="value"
              :chips="chips"
              :dense="dense"
              :multiple="multiple"
              :search-input-focused="searchInputFocused"
              :hide-selection-wrapper="hideSelectionWrapper"
              :get-identifier="getIdentifier"
              :get-text="getText"
              :chip-attrs="chipAttrs"
            >
              <template
                v-if="slots['selection.prepend']"
                #prepend="slotProps"
              >
                <slot
                  name="selection.prepend"
                  v-bind="slotProps"
                />
              </template>
              <template
                v-if="slots.selection"
                #default="slotProps"
              >
                <slot
                  name="selection"
                  v-bind="slotProps"
                />
              </template>
            </RuiAutoCompleteSelection>
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
        <RuiAutoCompleteOptionList
          v-if="optionsWithSelectedHidden.length > 0"
          :container-props="containerProps"
          :wrapper-props="wrapperProps"
          :set-menu-ref="setMenuRef"
          :is-grouped="isGrouped"
          :grouped-options="groupedOptions"
          :rendered-data="renderedData"
          :options="optionsWithSelectedHidden"
          :highlighted-index="modelHighlightedIndex"
          :highlighted-class="highlightedClass"
          :dense="dense"
          :menu-class="ui.menu({ class: cn(classNames?.menu) ?? menuClass })"
          :menu-style="{ width: `${width}px`, minWidth: menuWidth, minHeight: `${menuMinHeight}px` }"
          :get-identifier="getIdentifier"
          :get-text="getText"
          :is-active-item="isActiveItem"
          :is-item-disabled="isItemDisabled"
          @select="setValue($event)"
          @move-highlight="moveHighlight($event)"
        >
          <template
            v-if="slots['group-header']"
            #group-header="slotProps"
          >
            <slot
              name="group-header"
              v-bind="slotProps"
            />
          </template>
          <template
            v-if="slots['item.prepend']"
            #item.prepend="slotProps"
          >
            <slot
              name="item.prepend"
              v-bind="slotProps"
            />
          </template>
          <template
            v-if="slots.item"
            #item="slotProps"
          >
            <slot
              name="item"
              v-bind="slotProps"
            />
          </template>
          <template
            v-if="slots['item.append']"
            #item.append="slotProps"
          >
            <slot
              name="item.append"
              v-bind="slotProps"
            />
          </template>
        </RuiAutoCompleteOptionList>

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
        <!--
          The scroll container above reserves ~15px on the right for the
          scrollbar gutter. We render an equivalent right-padding here so the
          footer's content aligns with the option rows' content rather than
          the menu's outer edge. `pr-[var(--rui-scrollbar-gutter,15px)]`
          lets consumers override if their theme reserves a different width.
        -->
        <div
          v-if="slots.footer"
          class="bg-white dark:bg-rui-grey-900 border-t border-black/[0.12] dark:border-white/[0.12] pr-[var(--rui-scrollbar-gutter,15px)] -mb-2"
          data-id="footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </template>
  </RuiMenu>
</template>
