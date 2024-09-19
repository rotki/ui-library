<script lang="ts" setup generic='TValue'>
import { objectPick } from '@vueuse/shared';
import { Fragment, isVNode } from 'vue';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import type { ContextColorsType } from '@/consts/colors';

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
}

defineOptions({
  name: 'RuiRadioGroup',
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), {
  inline: false,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  disabled: false,
  color: undefined,
  size: undefined,
});

const modelValue = defineModel<TValue>({ required: false });

const radioGroupName = ref('');

onMounted(() => {
  set(radioGroupName, generateId('radio-group'));
});

const slots = useSlots();
const children = computed(() => {
  const slotContent = slots.default?.() ?? [];

  // When using dynamic content with v-for the slot content is a single fragment
  // containing the children components.
  return slotContent.length === 1 && slotContent[0].type === Fragment
    ? Array.isArray(slotContent[0].children) ? slotContent[0].children.filter(isVNode) : []
    : slotContent;
});

const css = useCssModule();
</script>

<template>
  <div v-bind="$attrs">
    <div
      v-if="label"
      class="text-rui-text-secondary text-body-1"
    >
      {{ label }}
    </div>
    <div :class="[css.wrapper, { [css.wrapper__inline]: inline }]">
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
