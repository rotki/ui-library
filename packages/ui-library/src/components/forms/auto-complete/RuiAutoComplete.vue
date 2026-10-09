<script lang="ts" setup generic="TValue, TItem">
import type { AutoCompleteModelValue, AutoCompleteProps } from '@/components/forms/auto-complete/auto-complete-props';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { autoCompleteStyles } from '@/components/forms/auto-complete/auto-complete-styles';
import RuiAutoCompleteOptionList from '@/components/forms/auto-complete/RuiAutoCompleteOptionList.vue';
import RuiAutoCompleteSelection from '@/components/forms/auto-complete/RuiAutoCompleteSelection.vue';
import RuiFieldLabel from '@/components/forms/field-label/RuiFieldLabel.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { activatorHandlers } from '@/components/overlays/menu/activator-handlers';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { useLabelPlacement } from '@/composables/defaults/field';
import { getOptionHeight, useDropdownMenu, useDropdownOptionProperty } from '@/composables/dropdown-menu';
import { type FloatingOptions, Placement } from '@/composables/floating';
import {
  splitAriaAttrs,
  useAutoCompleteChips,
  useAutoCompleteCombobox,
  useAutoCompleteFocus,
  useAutoCompleteKeyboardNavigation,
  useAutoCompleteSearch,
  useAutoCompleteSelection,
  useAutoCompleteValue,
} from '@/composables/forms/auto-complete';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { cn } from '@/utils/tv';

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
  labelPlacement = undefined,
  menuOptions,
  classNames,
  prependIcon,
  hideArrow = false,
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
    readOnly: boolean;
    attrs: Record<string, unknown>;
    open: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
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

const { value } = useAutoCompleteValue<AutoCompleteModelValue<TValue>, TItem>(
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

const resolvedItemHeight = itemHeight ?? getOptionHeight(dense);

/* eslint-disable @typescript-eslint/no-use-before-define -- these call the selection composable below, which needs their helpers; the calls run after setup */
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
  setValue: (item: TItem): void => { setValue(item); },
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
  onInputKeydown,
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
    clear: (): void => clear(),
    filteredOptions,
    getText,
    highlightedIndex: modelHighlightedIndex,
    internalSearch,
    isOpen,
    removeValue: (item: TItem): void => { setValue(item); },
    searchInputFocused,
    setSearchAsValue: (): void => setSearchAsValue(),
    updateInternalSearch,
    userNavigated: modelUserNavigated,
    value,
  },
);

const { chipAttrs, selectChip } = useAutoCompleteChips<TItem>({
  focusInput: (): void => get(textInput)?.focus(),
  getIdentifier,
  setValue: (item: TItem): void => { setValue(item); },
  setValueFocus,
});

/** The selected chip's text, read out by the live region so the selection is heard, not only seen. */
const selectedChipAnnouncement = computed<string>(() => {
  const item = get(value)[get(focusedValueIndex)];
  return chips && item !== undefined ? `${getText(item) ?? ''}, press Backspace to remove` : '';
});

const {
  anyFocused: focusAnyFocused,
  editing,
  inputClass: focusInputClass,
  onInputFocused: focusOnInputFocused,
  onSettledKeydown,
  setInputFocus: focusSetInputFocus,
  settleOnInput,
  unsettle,
} = useAutoCompleteFocus(
  {
    customValue: () => customValue,
    disabled: () => disabled,
    shouldApplyValueAsSearch,
  },
  {
    activatorFocusedWithin,
    focusedValueIndex,
    internalSearch,
    isOpen,
    justOpened,
    menuWrapperFocusedWithin,
    searchInputFocused,
    setSearchAsValue: (): void => setSearchAsValue(),
    textInput,
    updateInternalSearch,
  },
);

/* eslint-enable @typescript-eslint/no-use-before-define -- the wiring above ends here */

const { clear, setSearchAsValue, setValue } = useAutoCompleteSelection<TItem>({
  getText,
  internalSearch,
  isOpen,
  itemIndexInValue,
  multiple,
  resetModel: (): void => set(modelValue, (Array.isArray(get(modelValue)) ? [] : undefined) as AutoCompleteModelValue<TValue>),
  searchInputFocused,
  settleOnInput,
  shouldApplyValueAsSearch,
  textValueToProperValue,
  updateInternalSearch,
  value,
});

const menuMinHeight = computed<number>(
  () => Math.min(5, get(optionsWithSelectedHidden).length) * resolvedItemHeight,
);

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const valueSet = computed<boolean>(() => get(value).length > 0);

const usedPlaceholder = computed<string>(() => {
  if (get(editing))
    return placeholder;
  return '';
});

const labelId = useId();
const placement = useLabelPlacement(() => labelPlacement);
const { activeDescendant, optionIdPrefix } = useAutoCompleteCombobox(isOpen, modelHighlightedIndex);

// An empty, unfocused field shows the placeholder where the collapsed search input sits
const restingPlaceholder = computed<boolean>(() =>
  !!placeholder && !get(valueSet) && !get(editing) && !slots.placeholder,
);

const ui = computed<ReturnType<typeof autoCompleteStyles>>(() => autoCompleteStyles({
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
  unsettle();
  set(isOpen, true);
  updateInternalSearch(value);
  set(justOpened, false);
}

/**
 * Moves the highlight through the options, which also leaves the picked-value display for a search.
 *
 * @param up - whether to move towards the first option
 */
function onArrow(up: boolean): void {
  unsettle();
  moveHighlight(up);
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
    :class-names="{
      ...menuOptions?.classNames,
      details: ['px-0', cn(menuOptions?.classNames?.details) ?? ''],
      menu: [
        { hidden: optionsWithSelectedHidden.length === 0 && customValue && !slots['no-data'] },
        cn(menuOptions?.classNames?.menu) ?? '',
      ],
    }"
    :options="menuFloatingOptions"
    :close-on-content-click="false"
    full-width
    persist-on-activator-click
    :error-messages="errorMessages"
    :success-messages="successMessages"
    :hint="hint"
    :dense="dense"
    :show-details="!hideDetails"
    :disabled="disabled"
    disable-auto-focus
    role="listbox"
  >
    <template
      v-if="label"
      #label
    >
      <RuiFieldLabel
        :id="labelId"
        :text="label"
        :hidden="placement === 'hidden'"
        :required="required"
        :disabled="disabled"
      />
    </template>
    <template #activator="{ attrs, open, hasError: slotHasError, hasSuccess: slotHasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, readOnly, attrs, open, hasError: slotHasError, hasSuccess: slotHasSuccess }"
      >
        <!--
          The visual box: it takes clicks and the keys that bubble from the input and the chips, but
          is no tab stop and carries no role. The input inside is the combobox (ARIA 1.2), so the
          chips sit beside it rather than nested in it.
        -->
        <div
          ref="activator"
          :class="ui.activator({ class: cn([hideArrow && 'pr-3', classNames?.label]) })"
          v-bind="{
            ...splitAriaAttrs(getNonRootAttrs($attrs, ['onClick', 'class']), false),
            ...(readOnly ? {} : activatorHandlers(attrs)),
          }"
          data-id="activator"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          @click="focusSetInputFocus()"
          @keydown.enter="onEnter($event)"
          @keydown.tab="onTab($event)"
          @keydown.left="moveSelectedValueHighlight($event, false)"
          @keydown.right="moveSelectedValueHighlight($event, true)"
          @keydown.up.prevent="onArrow(true)"
          @keydown.down.prevent="onArrow(false)"
          @keydown.home.prevent="modelHighlightedIndex = 0"
          @keydown.end.prevent="modelHighlightedIndex = optionsWithSelectedHidden.length - 1"
        >
          <span
            v-if="prependIcon"
            :class="ui.prepend()"
            data-id="prepend"
          >
            <RuiIcon
              :name="prependIcon"
              :size="dense ? 16 : 18"
            />
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
            <span
              v-if="restingPlaceholder"
              data-id="resting-placeholder"
              class="truncate text-rui-text-secondary pointer-events-none"
            >
              {{ placeholder }}
            </span>
            <div
              v-if="!valueSet && !editing && slots.placeholder"
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
              :search-input-focused="editing"
              :hide-selection-wrapper="hideSelectionWrapper"
              :get-identifier="getIdentifier"
              :get-text="getText"
              :chip-attrs="chipAttrs"
              :selected-index="focusedValueIndex"
              :select-chip="selectChip"
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
            <!-- with hideSearchInput the input stays as a collapsed, read-only combobox, so the field keeps a focus target -->
            <input
              ref="textInput"
              :disabled="disabled"
              :readonly="readOnly || hideSearchInput"
              :value="internalSearch"
              class="bg-transparent outline-hidden"
              type="text"
              :placeholder="usedPlaceholder"
              :class="hideSearchInput ? 'w-0 h-0 min-w-0 opacity-0' : focusInputClass"
              role="combobox"
              :tabindex="readOnly ? -1 : undefined"
              :aria-labelledby="label ? labelId : undefined"
              :aria-expanded="open"
              aria-haspopup="listbox"
              :aria-controls="attrs['aria-controls']"
              :aria-activedescendant="activeDescendant"
              :aria-readonly="readOnly || undefined"
              :aria-required="required || undefined"
              :aria-busy="loading || undefined"
              :aria-invalid="hasError"
              aria-autocomplete="list"
              data-id="search-input"
              v-bind="splitAriaAttrs(getNonRootAttrs($attrs, ['onClick', 'class']), true)"
              @keydown="onSettledKeydown($event); onInputKeydown($event)"
              @keydown.delete="onInputDeletePressed($event)"
              @input.stop="updateSearchInput($event)"
              @focus="focusOnInputFocused()"
            />
            <span
              class="sr-only"
              aria-live="polite"
            >
              {{ selectedChipAnnouncement }}
            </span>
          </div>

          <RuiButton
            v-if="clearable && valueSet && !disabled && !readOnly"
            variant="text"
            icon
            size="sm"
            tabindex="-1"
            data-id="clear"
            aria-label="Clear"
            :class="[
              ui.clear(),
              focusAnyFocused && 'visible!',
              { 'mr-2': !dense },
            ]"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              name="lu-x"
              size="16"
            />
          </RuiButton>

          <span
            v-if="!hideArrow"
            :class="ui.iconWrapper()"
            @click="arrowClicked($event)"
          >
            <RuiIcon
              :class="ui.icon()"
              :size="dense ? 16 : 20"
              name="lu-chevron-down"
            />
          </span>

          <RuiProgress
            v-if="loading"
            :class="ui.progress()"
            color="primary"
            thickness="2"
            variant="indeterminate"
          />
        </div>
        <fieldset :class="ui.fieldset()" />
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
          :menu-class="ui.menu({ class: cn(classNames?.menu) })"
          :menu-style="{ width: `${width}px`, minWidth: menuWidth, minHeight: `${menuMinHeight}px` }"
          :get-identifier="getIdentifier"
          :get-text="getText"
          :is-active-item="isActiveItem"
          :is-item-disabled="isItemDisabled"
          :option-id-prefix="optionIdPrefix"
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
          :class="classNames?.menu"
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
          the menu's outer edge. `pr-(--rui-scrollbar-gutter,15px)`
          lets consumers override if their theme reserves a different width.
        -->
        <div
          v-if="slots.footer"
          class="bg-rui-menu border-t border-rui-divider pr-(--rui-scrollbar-gutter,15px) -mb-2"
          data-id="footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </template>
  </RuiMenu>
</template>
