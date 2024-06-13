<script lang='ts' setup>
export interface NotificationProps {
  modelValue: boolean;
  timeout: number;
  width?: number | string;
  theme?: 'light' | 'dark';
}

defineOptions({
  name: 'RuiNotification',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<NotificationProps>(),
  {
    width: 400,
    theme: undefined,
  },
);

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();

const { timeout, modelValue, width } = toRefs(props);

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
}));

function dismiss() {
  if (get(timeout) < 0)
    return;

  emit('update:model-value', false);
}

watchImmediate(modelValue, (display) => {
  if (!display)
    return;

  const duration = get(timeout);
  if (duration > 0) {
    setTimeout(() => {
      emit('update:model-value', false);
    }, duration);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="ease-out duration-150"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="ease-in duration-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="top-2 right-2 fixed drop-shadow-lg rounded-sm z-50"
        :class="{
          'bg-white dark:bg-[#363636]': !theme,
          'bg-white text-rui-light-text': theme === 'light',
          'bg-[#363636] text-rui-dark-text': theme === 'dark',
        }"
        :style="style"
        v-bind="$attrs"
        @click="dismiss()"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
