<script lang="ts" setup generic="TValue">
import type { ContextColorsType } from '@/consts/colors';
import { objectPick } from '@vueuse/shared';
import { checkControlStyles, getCheckControlIconSize } from '@/components/forms/check-control-styles';
import { RuiCheckboxGroupContextKey } from '@/components/forms/checkbox/checkbox-group/context';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface Props<TValue> {
  value?: TValue;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiCheckbox',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const indeterminate = defineModel<boolean>('indeterminate', { default: false });

const {
  value = undefined,
  disabled: disabledProp = false,
  color: colorProp = undefined,
  size: sizeProp = undefined,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  required = false,
} = defineProps<Props<TValue>>();

defineSlots<{
  default?: () => any;
}>();

const el = useTemplateRef<HTMLInputElement>('el');

const group = inject(RuiCheckboxGroupContextKey, undefined);

const disabled = computed<boolean>(() => disabledProp || (group ? toValue(group.disabled) : false));
const color = computed<ContextColorsType | undefined>(() => colorProp ?? (group ? toValue(group.color) : undefined));
const size = computed<'sm' | 'lg' | undefined>(() => sizeProp ?? (group ? toValue(group.size) : undefined));
// Suppress per-child details inside a group so the group's own hint/error wins.
const effectiveHideDetails = computed<boolean>(() => hideDetails || (group !== undefined && value !== undefined));

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const internalModelValue = computed<boolean>({
  get: () => {
    if (group && value !== undefined)
      return group.isChecked(value);
    return get(modelValue);
  },
  set: (checked: boolean) => {
    if (checked)
      set(indeterminate, false);
    if (group && value !== undefined)
      group.toggle(value, checked);
    else
      set(modelValue, checked);
  },
});

const ui = computed<ReturnType<typeof checkControlStyles>>(() => checkControlStyles({
  size: get(size),
  disabled: get(disabled),
  checked: get(internalModelValue) || get(indeterminate),
  validation: get(validation),
  color: get(color),
}));

const iconSize = computed<number>(() => getCheckControlIconSize(get(size)));

watch(indeterminate, (val) => {
  const input = get(el);
  if (!input) {
    return;
  }
  input.checked = !val;
  input.value = val ? 'off' : 'on';
});

watch(internalModelValue, (val) => {
  const input = get(el);
  if (input && input.checked !== val)
    input.checked = val;
});
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      :class="ui.wrapper()"
      v-bind="objectPick($attrs, ['onClick'])"
      :data-disabled="disabled || undefined"
      :data-checked="internalModelValue || indeterminate || undefined"
      :data-error="hasError ? '' : undefined"
    >
      <input
        ref="el"
        v-model="internalModelValue"
        type="checkbox"
        :class="ui.input()"
        :disabled="disabled"
        :aria-invalid="hasError"
        v-bind="getNonRootAttrs($attrs, ['onInput', 'onClick'])"
      />
      <span :class="ui.control()">
        <RuiIcon
          v-if="indeterminate"
          name="lu-checkbox-indeterminate-fill"
          :size="iconSize"
        />
        <RuiIcon
          v-else-if="internalModelValue"
          name="lu-checkbox-fill"
          :size="iconSize"
        />
        <RuiIcon
          v-else
          name="lu-checkbox-blank"
          :size="iconSize"
        />
      </span>
      <span
        v-if="label || $slots.default"
        :class="ui.label()"
      >
        <slot>{{ label }}</slot>
        <span
          v-if="required"
          class="text-rui-error"
        >
          ﹡
        </span>
      </span>
    </label>
    <RuiFormTextDetail
      v-if="!effectiveHideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
