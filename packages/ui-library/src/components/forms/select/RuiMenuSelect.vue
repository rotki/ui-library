<script lang="ts" setup generic="TValue, TItem, TClear = undefined, TClearable extends boolean = false">
import type { ButtonHTMLAttributes, Ref } from 'vue';
import type { VueClassValue } from '@/types/class-value';
import type { ClearedValue } from '@/types/clear-value';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiFieldLabel from '@/components/forms/field-label/RuiFieldLabel.vue';
import { menuSelectStyles } from '@/components/forms/select/menu-select-styles';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { type LabelPlacement, useLabelPlacement } from '@/composables/defaults/field';
import { getOptionHeight, type KeyOfType, useDropdownMenu } from '@/composables/dropdown-menu';
import { type FloatingOptions, Placement } from '@/composables/floating';
import { type ModelValueEmits, usePropModel } from '@/composables/prop-model';
import { type FormDetails, useFormDetails, useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { cn } from '@/utils/tv';

export interface RuiMenuSelectClassNames {
  root?: VueClassValue;
  label?: VueClassValue;
  menu?: VueClassValue;
  option?: VueClassValue;
}

export interface MenuSelectProps<TValue, TItem, TClear = undefined, TClearable extends boolean = boolean> {
  options: TItem[];
  /**
   * What `clearable` writes in place of `undefined`: `value-on-clear=""` keeps a `Ref<string>` a
   * string. The update is typed with it once `clearable`, so `v-model` takes exactly what is sent.
   */
  valueOnClear?: TClear;
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  /** Shows a clear button. The `& boolean` gives the SFC compiler a `Boolean` prop to cast a bare attribute. */
  clearable?: TClearable & boolean;
  label?: string;
  /** Where the label shows; falls back to the nearest `RuiFieldDefaults`, then the app default, then `top`. */
  labelPlacement?: LabelPlacement;
  menuOptions?: MenuProps;
  classNames?: RuiMenuSelectClassNames;
  prependWidth?: number;
  appendWidth?: number;
  itemHeight?: number;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  /** The line under the field for its hint and messages: `reserve`, `auto` or `hidden`; falls back to the nearest `RuiFieldDefaults`, then the app default, then `reserve`. */
  details?: FormDetails;
  /** @deprecated Use `details="hidden"`. Removed in 4.0. */
  hideDetails?: boolean;
  autoSelectFirst?: boolean;
  hideNoData?: boolean;
  noDataText?: string;
  required?: boolean;
}

defineOptions({
  name: 'RuiMenuSelect',
  inheritAttrs: false,
});

const {
  modelValue: modelValueProp,
  valueOnClear,
  options,
  disabled = false,
  loading = false,
  readOnly = false,
  dense = false,
  clearable = false,
  details = undefined,
  hideDetails = false,
  label = 'Select',
  labelPlacement = undefined,
  menuOptions,
  classNames,
  hint,
  keyAttr,
  textAttr,
  itemHeight,
  prependWidth,
  appendWidth,
  errorMessages = [],
  successMessages = [],
  autoSelectFirst = false,
  hideNoData = false,
  noDataText = 'No data available',
  required = false,
} = defineProps<MenuSelectProps<TValue, TItem, TClear, TClearable> & {
  /**
   * The selected key, or the item itself without `keyAttr`. Its type is the bound value's, so a
   * `Ref<number>` takes the update as is.
   */
  modelValue: TValue;
} & /* @vue-ignore */ Omit<ButtonHTMLAttributes, keyof MenuSelectProps<TValue, TItem, TClear, TClearable> | 'modelValue'>>();

defineEmits<ModelValueEmits<TValue | ClearedValue<TValue, TClear, TClearable>>>();

defineSlots<{
  'activator'?: (props: {
    disabled: boolean;
    value: TItem | undefined;
    readOnly: boolean;
    attrs: Record<string, unknown>;
    open: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
  'selection.prepend'?: (props: { item: TItem }) => any;
  'selection'?: (props: { item: TItem }) => any;
  'item.prepend'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item.append'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'no-data'?: () => any;
}>();

// The component writes through this wider ref: `clearable` writes `valueOnClear`
const modelValue: Ref<TValue | TClear | undefined> = usePropModel('modelValue', () => modelValueProp);

const menuRef = useTemplateRef<HTMLDivElement>('menuRef');
const activator = useTemplateRef<HTMLDivElement>('activator');
const { focused } = useFocus(activator);
const isHovered = ref<boolean>(false);
const labelId = useId();

const placement = useLabelPlacement(() => labelPlacement);

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);
const detailsMode = useFormDetails(() => details, () => hideDetails);

const value = computed<TItem | undefined>({
  get: () => {
    const value = get(modelValue);
    if (keyAttr)
      return options.find(option => option[keyAttr] === value);
    // eslint-disable-next-line slop/no-chained-type-assertions -- without keyAttr the model holds the item itself, which the two generics cannot express
    return value as unknown as TItem;
  },
  set: (selected?: TItem) => {
    const selection = keyAttr && selected ? selected[keyAttr] : selected;
    set(modelValue, selection as TValue);
  },
});

function setValue(val: TItem): void {
  set(value, val);
  set(focused, true);
}

const {
  containerProps,
  wrapperProps,
  renderedData,
  isOpen,
  menuWidth,
  getText,
  getIdentifier,
  isActiveItem,
  modelHighlightedIndex,
  moveHighlight,
  applyHighlighted,
  valueKey,
} = useDropdownMenu<TValue, TItem>({
  itemHeight: itemHeight ?? getOptionHeight(dense),
  keyAttr,
  textAttr,
  options: () => options,
  dense: () => dense,
  value,
  menuRef,
  disabled: () => disabled,
  autoSelectFirst,
  setValue,
  prependWidth,
  appendWidth,
});

const ui = computed<ReturnType<typeof menuSelectStyles>>(() => menuSelectStyles({
  opened: get(isOpen),
  hovered: get(isHovered),
  dense,
  disabled,
  readonly: readOnly,
  hasError: get(hasError),
  hasSuccess: get(hasSuccess) && !get(hasError),
}));

const highlightedClass = menuSelectStyles({}).highlighted();

function clear(): void {
  set(modelValue, valueOnClear);
}

const menuFloatingOptions = computed<FloatingOptions>(() => ({
  placement: Placement.bottomStart,
  ...menuOptions?.options,
}));
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    v-bind="{ ...getRootAttrs($attrs, []), ...menuOptions }"
    :class="ui.wrapper({ class: cn($attrs.class) })"
    :class-names="{ ...menuOptions?.classNames, details: ['px-0', cn(menuOptions?.classNames?.details) ?? ''] }"
    :options="menuFloatingOptions"
    close-on-content-click
    full-width
    :error-messages="errorMessages"
    :success-messages="successMessages"
    :hint="hint"
    :dense="dense"
    :show-details="detailsMode !== 'hidden'"
    :details="detailsMode === 'auto' ? 'auto' : 'reserve'"
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
        <!-- a select-only combobox: the button opens a listbox of options, and carries the field's state -->
        <button
          ref="activator"
          role="combobox"
          :disabled="disabled"
          :aria-disabled="disabled"
          :aria-expanded="isOpen"
          :aria-readonly="readOnly || undefined"
          :aria-required="required || undefined"
          :aria-busy="loading || undefined"
          :aria-labelledby="label ? labelId : undefined"
          type="button"
          :tabindex="disabled || readOnly ? -1 : 0"
          :class="ui.activator({ class: cn(classNames?.label) })"
          v-bind="{
            ...getNonRootAttrs($attrs),
            ...(readOnly ? {} : attrs),
          }"
          data-id="activator"
          :aria-invalid="hasError"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
          @keydown.enter.prevent="applyHighlighted()"
          @keydown.space.prevent="applyHighlighted()"
          @keydown.home.prevent="modelHighlightedIndex = 0"
          @keydown.end.prevent="modelHighlightedIndex = options.length - 1"
        >
          <span
            v-if="value"
            :class="ui.value()"
          >
            <slot
              name="selection.prepend"
              v-bind="{ item: value }"
            />
            <slot
              name="selection"
              v-bind="{ item: value }"
            >
              {{ getText(value) }}
            </slot>
          </span>

          <span
            v-if="clearable && value && !disabled && !readOnly"
            data-id="clear"
            :class="[ui.clear(), focused && 'visible!', { 'mr-2': !dense }]"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              name="lu-x"
              size="16"
            />
          </span>

          <span :class="ui.iconWrapper()">
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
        </button>
        <fieldset :class="ui.fieldset()" />
      </slot>
      <input
        :value="valueKey"
        class="hidden"
        type="hidden"
      />
    </template>
    <template #default="{ width }">
      <div
        v-if="options.length > 0"
        :ref="containerProps.ref"
        :class="ui.menu({ class: cn(classNames?.menu) })"
        :style="[containerProps.style, { width: `${width}px`, minWidth: menuWidth }]"
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
            :key="getIdentifier(item)"
            :active="isActiveItem(item)"
            role="option"
            :aria-selected="isActiveItem(item)"
            :size="dense ? 'sm' : undefined"
            variant="list"
            :data-highlighted="modelHighlightedIndex === _index"
            :class="{
              [highlightedClass]: !isActiveItem(item) && modelHighlightedIndex === _index,
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
        data-id="no-data"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        :class="classNames?.menu"
      >
        <slot name="no-data">
          <div class="p-4">
            {{ noDataText }}
          </div>
        </slot>
      </div>
    </template>
  </RuiMenu>
</template>
