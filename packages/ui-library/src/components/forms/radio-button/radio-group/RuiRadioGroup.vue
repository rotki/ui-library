<script lang="ts" setup generic='TValue'>
import type { ContextColorsType } from '@/consts/colors';
import { objectPick } from '@vueuse/shared';
import { Fragment, isVNode } from 'vue';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { assert } from '@/utils/assert';
import { generateId } from '@/utils/generate-id';

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

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  disabled: false,
  color: undefined,
  size: undefined,
  required: false,
});

const radioGroupName = ref('');

onMounted(() => {
  set(radioGroupName, generateId('radio-group'));
});

const slots = useSlots();
const children = computed(() => {
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
  <div v-bind="$attrs">
    <div
      v-if="props.label"
      class="text-rui-text-secondary text-body-1"
    >
      {{ props.label }}
      <span
        v-if="props.required"
        class="text-rui-error"
      >
        ﹡
      </span>
    </div>
    <div :class="[$style.wrapper, { [$style.wrapper__inline ?? '']: inline }]">
      <Component
        :is="child"
        v-for="(child, i) in children"
        v-bind="objectPick($props, ['disabled', 'color', 'size'])"
        :key="i"
        v-model="modelValue"
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
