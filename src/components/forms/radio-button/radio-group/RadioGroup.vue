<script setup lang="ts">
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';

export interface Props {
  modelValue?: string;
  inline?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiRadioGroup',
});

withDefaults(defineProps<Props>(), {
  modelValue: '',
  inline: false,
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
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
    <div :class="[css.wrapper, { [css.wrapper__inline]: inline }]">
      <Component
        :is="child"
        v-for="(child, i) in children"
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
