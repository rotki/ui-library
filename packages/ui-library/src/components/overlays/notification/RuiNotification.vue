<script lang="ts" setup>
import { useTimeoutFn } from '@vueuse/core';
import { transformPropsUnit } from '@/utils/helpers';

export interface NotificationProps {
  timeout: number;
  width?: number | string;
  theme?: 'light' | 'dark';
}

defineOptions({
  name: 'RuiNotification',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ required: true });

const { timeout, width = 400, theme } = defineProps<NotificationProps>();

const style = computed<{ width: string | undefined }>(() => ({
  width: transformPropsUnit(width),
}));

const { start, stop } = useTimeoutFn(() => {
  set(modelValue, false);
}, timeout, { immediate: false });

function dismiss(): void {
  if (timeout < 0)
    return;

  set(modelValue, false);
}

watchImmediate(modelValue, (display) => {
  if (!display) {
    stop();
    return;
  }

  if (timeout > 0) {
    stop();
    start();
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
        role="alert"
        aria-live="polite"
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
