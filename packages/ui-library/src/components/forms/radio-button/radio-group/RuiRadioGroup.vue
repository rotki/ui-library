<script lang="ts" setup generic="TValue">
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode } from 'vue';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { assert } from '@/utils/assert';

export interface Props {
  inline?: boolean;
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  required?: boolean;
}

defineOptions({
  name: 'RuiRadioGroup',
  inheritAttrs: false,
});

const modelValue = defineModel<TValue>({ required: false });

const {
  inline = false,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  disabled = false,
  color,
  size,
  required = false,
} = defineProps<Props>();

const slots = defineSlots<{
  default?: () => any;
}>();

const radioGroupName = useId();

const children = computed<VNode[]>(() => {
  const slotContent = slots.default?.() ?? [];

  // When using dynamic content with v-for the slot content is a single fragment
  // containing the children components.
  if (slotContent.length === 1) {
    const firstChild = slotContent[0];
    assert(firstChild);
    if (firstChild.type === Fragment) {
      return Array.isArray(firstChild.children) ? firstChild.children.filter(isVNode) : [];
    }
  }
  return slotContent;
});
</script>

<template>
  <div
    role="radiogroup"
    v-bind="$attrs"
  >
    <div
      v-if="label"
      class="text-rui-text-secondary text-body-1"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-rui-error"
      >
        ﹡
      </span>
    </div>
    <div :class="[$style.wrapper, { [$style.wrapper__inline ?? '']: inline }]">
      <Component
        :is="child"
        v-for="(child, i) in children"
        :key="i"
        v-model="modelValue"
        :disabled="disabled"
        :color="color"
        :size="size"
        hide-details
        :name="radioGroupName"
      />
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  &__inline {
    @apply flex space-x-6;
  }
}
</style>
