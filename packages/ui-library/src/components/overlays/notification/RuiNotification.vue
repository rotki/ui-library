<script lang="ts" setup>
import { useTimeoutFn } from '@vueuse/core';
import { transformPropsUnit } from '@/utils/helpers';
import { cn, tv } from '@/utils/tv';

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

defineSlots<{
  default?: () => any;
}>();

const style = computed<{ width: string | undefined }>(() => ({
  width: transformPropsUnit(width),
}));

// a popup like a menu: panel corners, a hairline edge for dark backgrounds, and never wider than the screen
const rootStyle = tv({ base: 'top-4 right-4 fixed z-rui-toast max-w-[calc(100vw-2rem)] overflow-hidden rounded-rui-panel border shadow-rui-menu' });

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
        :class="rootStyle({ class: cn([$attrs.class, {
          'bg-rui-overlay border-rui-divider': !theme,
          'bg-rui-light-overlay text-rui-light-text border-rui-light-divider': theme === 'light',
          'bg-rui-dark-overlay text-rui-dark-text border-rui-dark-divider': theme === 'dark',
        }]) })"
        :style="style"
        v-bind="{ ...$attrs, class: undefined }"
        @click="dismiss()"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
