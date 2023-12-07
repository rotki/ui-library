<script setup lang="ts">
import { objectPick } from '@vueuse/shared';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import { type ContextColorsType } from '~/src';

export interface Props {
  modelValue?: string;
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
});

withDefaults(defineProps<Props>(), {
  modelValue: '',
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const radioGroupName = ref('');

onMounted(() => {
  set(radioGroupName, generateId('radio-group'));
});

const slots = useSlots();
const children = computed(() => slots.default?.()?.[0].children ?? []);

const css = useCssModule();
</script>

<template>
  <div>
    <div v-if="label" class="text-rui-text-secondary text-body-1">
      {{ label }}
    </div>
    <div :class="[css.wrapper, { [css.wrapper__inline]: inline }]">
      <Component
        :is="child"
        v-for="(child, i) in children"
        v-bind="objectPick($props, ['disabled', 'color', 'size'])"
        :key="i"
        :model-value="modelValue"
        hide-details
        :name="radioGroupName"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <FormTextDetail
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
