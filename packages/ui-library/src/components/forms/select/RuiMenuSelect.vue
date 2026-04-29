<script lang="ts" setup generic="TValue, TItem">
import type { VueClassValue } from '@/types/class-value';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { menuSelectStyles, type MenuSelectVariant } from '@/components/forms/select/menu-select-styles';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { type KeyOfType, useDropdownMenu } from '@/composables/dropdown-menu';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { cn } from '@/utils/tv';

export interface RuiMenuSelectClassNames {
  root?: VueClassValue;
  label?: VueClassValue;
  menu?: VueClassValue;
  option?: VueClassValue;
}

export interface MenuSelectProps<TValue, TItem> {
  options: TItem[];
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  menuOptions?: MenuProps;
  classNames?: RuiMenuSelectClassNames;
  /** @deprecated Use `classNames.label` instead */
  labelClass?: string;
  /** @deprecated Use `classNames.menu` instead */
  menuClass?: string;
  /** @deprecated Use `classNames.option` instead */
  optionClass?: string;
  prependWidth?: number;
  appendWidth?: number;
  itemHeight?: number;
  variant?: MenuSelectVariant;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
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

const modelValue = defineModel<TValue | undefined>({ required: true });

const {
  options,
  disabled = false,
  loading = false,
  readOnly = false,
  dense = false,
  clearable = false,
  hideDetails = false,
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
  hideNoData = false,
  noDataText = 'No data available',
  required = false,
} = defineProps<MenuSelectProps<TValue, TItem>>();

defineSlots<{
  'activator'?: (props: {
    disabled: boolean;
    value: TItem | undefined;
    variant: string;
    readOnly: boolean;
    attrs: Record<string, unknown>;
    open: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
  'activator.label'?: (props: { value: TItem | undefined }) => any;
  'selection.prepend'?: (props: { item: TItem }) => any;
  'selection'?: (props: { item: TItem }) => any;
  'item.prepend'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'item.append'?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  'no-data'?: () => any;
}>();

const menuRef = useTemplateRef<HTMLDivElement>('menuRef');
const activator = useTemplateRef<HTMLDivElement>('activator');
const { focused } = useFocus(activator);
const isHovered = ref<boolean>(false);

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const value = computed<TItem | undefined>({
  get: () => {
    const value = get(modelValue);
    if (keyAttr)
      return options.find(option => option[keyAttr] === value);
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
  highlightedIndex,
  moveHighlight,
  applyHighlighted,
  valueKey,
} = useDropdownMenu<TValue, TItem>({
  itemHeight: itemHeight ?? (dense ? 30 : 48),
  keyAttr,
  textAttr,
  options: () => options,
  dense: () => dense,
  value,
  menuRef,
  disabled: () => disabled,
  autoSelectFirst,
  setValue,
});

const outlined = computed<boolean>(() => variant === 'outlined');
const float = computed<boolean>(() => (get(isOpen) || !!get(value)) && get(outlined));

const legendText = computed<string>(() => {
  if (!get(float) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

const ui = computed<ReturnType<typeof menuSelectStyles>>(() => menuSelectStyles({
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

const highlightedClass = menuSelectStyles({}).highlighted();

function clear(): void {
  set(modelValue, undefined);
}
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    v-bind="{ ...getRootAttrs($attrs, []), ...menuOptions }"
    :class="ui.wrapper({ class: cn($attrs.class) })"
    placement="bottom-start"
    :close-on-content-click="true"
    :full-width="true"
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
        <button
          ref="activator"
          :disabled="disabled"
          :aria-disabled="disabled"
          :aria-expanded="isOpen"
          :aria-readonly="readOnly || undefined"
          :aria-required="required || undefined"
          :aria-busy="loading || undefined"
          type="button"
          :tabindex="disabled || readOnly ? -1 : 0"
          :class="ui.activator({ class: cn(classNames?.label) ?? labelClass })"
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
          @keydown.home.prevent="highlightedIndex = 0"
          @keydown.end.prevent="highlightedIndex = options.length - 1"
        >
          <span
            v-if="outlined || !value"
            :class="[
              ui.label(),
              { 'pr-2': !value && !open && outlined },
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
            v-if="clearable && value && !disabled"
            data-id="clear"
            :class="[ui.clear(), focused && '!visible']"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              color="error"
              name="lu-x"
              size="18"
            />
          </span>

          <span :class="ui.iconWrapper()">
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
        </button>
        <fieldset
          v-if="outlined"
          :class="ui.fieldset()"
        >
          <legend :class="ui.legend()">
            {{ legendText }}
          </legend>
        </fieldset>
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
        :class="ui.menu({ class: cn(classNames?.menu) ?? menuClass })"
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
            :aria-selected="isActiveItem(item)"
            :size="dense ? 'sm' : undefined"
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
        data-id="no-data"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        :class="classNames?.menu ?? menuClass"
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
