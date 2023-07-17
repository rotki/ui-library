<script setup lang="ts">
const radioGroupName = ref('');

export interface Props {
  modelValue?: string;
  inline?: boolean;
  hint?: string;
  errorMessages?: string[];
  hideDetails?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  inline: false,
  hint: '',
  errorMessages: () => [],
  hideDetails: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

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
      <component
        :is="child"
        v-for="(child, i) in children"
        :key="i"
        :model-value="modelValue"
        hide-details
        :name="radioGroupName"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <div v-if="!hideDetails" class="details">
      <div v-if="errorMessages.length > 0" class="text-rui-error text-caption">
        {{ errorMessages[0] }}
      </div>
      <div
        v-else-if="hint"
        class="text-black/[0.6] dark:text-white text-caption"
      >
        {{ hint }}
      </div>
      <div v-else class="h-5" />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  &__inline {
    @apply flex space-x-6;
  }
}
</style>
