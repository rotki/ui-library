<script setup lang="ts">
import type { MaybeElement } from '@vueuse/core';
import { getRootAttrs, transformPropsUnit } from '@/utils/helpers';

export interface NavigationDrawerProps {
  temporary?: boolean;
  stateless?: boolean;
  width?: string | number;
  miniVariant?: boolean;
  overlay?: boolean;
  position?: 'left' | 'right';
  contentClass?: string | object | string[];
  ariaLabel?: string;
}

defineOptions({
  name: 'RuiNavigationDrawer',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const {
  temporary = false,
  stateless = false,
  width = 360,
  miniVariant = false,
  overlay = false,
  position = 'left',
  contentClass = '',
  ariaLabel,
} = defineProps<NavigationDrawerProps>();

const emit = defineEmits<{
  closed: [];
}>();

const internalValue = ref<boolean>(false);
const isOpen = ref<boolean>(false);
const content = useTemplateRef<MaybeElement>('content');

const style = computed<{ width: string | undefined }>(() => ({
  width: transformPropsUnit(width),
}));

const activatorAttrs = computed<{ onClick: () => void }>(() => ({
  onClick: () => {
    const newValue = !get(internalValue);
    set(internalValue, newValue);
    onUpdateModelValue(newValue);
  },
}));

function onUpdateModelValue(value: boolean): void {
  set(modelValue, value);

  if (!value)
    emit('closed');
}

function close(): void {
  set(isOpen, false);
}

watch(
  modelValue,
  (value) => {
    nextTick(() => {
      set(internalValue, value);
    });
  },
  { immediate: true },
);

watch(internalValue, (value) => {
  if (value) {
    window.requestAnimationFrame(() => {
      set(isOpen, value);
    });
  }
  else {
    setTimeout(() => {
      set(isOpen, value);
    }, 150);
  }
});

watch(isOpen, (isOpen) => {
  if (isOpen) {
    onUpdateModelValue(isOpen);
    set(internalValue, isOpen);
  }
  else {
    setTimeout(() => {
      onUpdateModelValue(isOpen);
      set(internalValue, isOpen);
    }, 150);
  }
});

onClickOutside(content, () => {
  if (get(isOpen) && temporary && !stateless) {
    setTimeout(() => {
      close();
    }, 50);
  }
});
</script>

<template>
  <div>
    <slot
      name="activator"
      v-bind="{ open: internalValue, attrs: activatorAttrs }"
    />
    <Teleport to="body">
      <Transition
        v-if="overlay"
        enter-from-class="opacity-0"
        enter-active-class="ease-out duration-150"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="ease-in duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen && internalValue"
          data-id="overlay"
          :class="$style.overlay"
          @click.stop="close()"
        />
      </Transition>
      <aside
        v-if="isOpen || internalValue || miniVariant"
        ref="content"
        :style="style"
        :class="[
          $style.content,
          contentClass,
          {
            [$style.visible]: isOpen && internalValue,
            [$style[position]]: position,
            [$style.mini]: miniVariant,
            [$style.temporary]: temporary,
            [$style['with-overlay']]: overlay,
          },
        ]"
        :aria-label="ariaLabel"
        :aria-hidden="miniVariant && !(isOpen && internalValue) ? 'true' : undefined"
        v-bind="getRootAttrs($attrs)"
      >
        <slot v-bind="{ attrs: activatorAttrs, close }" />
      </aside>
    </Teleport>
  </div>
</template>

<style lang="scss" module>
.overlay {
  @apply absolute top-0 left-0 w-full h-full backdrop-blur bg-rui-grey-500/[0.5] z-[10000];
}

.content {
  @apply transition-all duration-150 ease-in-out top-0 h-full fixed text-rui-text bg-white z-[7];

  &.left {
    @apply -translate-x-full left-0;
  }

  &.right {
    @apply translate-x-full right-0;
  }

  &.with-overlay {
    @apply z-[10000];
  }

  &.visible {
    @apply translate-x-0;
  }

  &.temporary {
    &.visible {
      @apply shadow-5;
    }
  }

  &.mini {
    @apply translate-x-0;

    &:not(.visible) {
      @apply w-14 #{!important};
    }
  }
}

:global(.dark) {
  .overlay {
    @apply bg-black/[0.5];
  }

  .content {
    @apply bg-[#363636];
  }
}
</style>
