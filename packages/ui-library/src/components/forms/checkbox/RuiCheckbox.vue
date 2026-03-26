<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { objectPick } from '@vueuse/shared';
import { checkControlStyles, getCheckControlIconSize } from '@/components/forms/check-control-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface Props {
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
  disabled = false,
  color = undefined,
  size = undefined,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  required = false,
} = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();

const el = useTemplateRef<HTMLInputElement>('el');

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const ui = computed<ReturnType<typeof checkControlStyles>>(() => checkControlStyles({
  size,
  disabled,
  checked: get(modelValue) || get(indeterminate),
  validation: get(validation),
  color,
}));

const internalModelValue = computed<boolean>({
  get: () => get(modelValue),
  set: (checked: boolean) => {
    if (checked)
      set(indeterminate, false);
    set(modelValue, checked);
  },
});

const iconSize = computed<number>(() => getCheckControlIconSize(size));

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
      :data-checked="modelValue || indeterminate || undefined"
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
          v-else-if="modelValue"
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
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
