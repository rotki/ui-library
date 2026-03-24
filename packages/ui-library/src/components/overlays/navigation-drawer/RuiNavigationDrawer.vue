<script setup lang="ts">
import type { MaybeElement } from '@vueuse/core';
import type { VueClassValue } from '@/types/class-value';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { getRootAttrs, transformPropsUnit } from '@/utils/helpers';
import { tv } from '@/utils/tv';

export interface RuiNavigationDrawerClassNames {
  root?: VueClassValue;
  content?: VueClassValue;
}

export interface NavigationDrawerProps {
  temporary?: boolean;
  stateless?: boolean;
  width?: string | number;
  miniVariant?: boolean;
  overlay?: boolean;
  position?: 'left' | 'right';
  classNames?: RuiNavigationDrawerClassNames;
  /** @deprecated Use `classNames.content` instead */
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
  classNames,
  contentClass = '',
  ariaLabel,
} = defineProps<NavigationDrawerProps>();

const emit = defineEmits<{
  closed: [];
}>();

defineSlots<{
  activator?: (props: { open: boolean; attrs: { onClick: () => void } }) => any;
  default?: (props: { attrs: { onClick: () => void }; close: () => void }) => any;
}>();

const transitioning = ref<boolean>(false);
const content = useTemplateRef<MaybeElement>('content');
const leaveTimeout = useTimeoutManager();
const clickOutsideTimeout = useTimeoutManager();

const alive = computed<boolean>(() => get(modelValue) || get(transitioning) || miniVariant);

const style = computed<{ width: string | undefined }>(() => ({
  width: transformPropsUnit(width),
}));

const activatorAttrs: { onClick: () => void } = {
  onClick: toggle,
};

const drawer = tv({
  base: 'transition-[transform,width] duration-200 ease-in-out top-0 h-full fixed text-rui-text bg-white dark:bg-[#363636]',
  variants: {
    position: {
      left: 'left-0',
      right: 'right-0',
    },
    visible: {
      true: 'translate-x-0',
      false: '',
    },
    mini: {
      true: 'translate-x-0',
      false: '',
    },
    withOverlay: {
      true: 'z-[10000]',
      false: 'z-[7]',
    },
  },
  compoundVariants: [
    { position: 'left', visible: false, mini: false, class: '-translate-x-full' },
    { position: 'right', visible: false, mini: false, class: 'translate-x-full' },
    { mini: true, visible: false, class: '!w-14' },
  ],
  defaultVariants: { position: 'left', visible: false, mini: false, withOverlay: false },
});

const ui = computed<string>(() => drawer({ position, visible: modelValue.value, mini: miniVariant, withOverlay: overlay }));

function toggle(): void {
  set(modelValue, !get(modelValue));
}

function close(): void {
  set(modelValue, false);
}

function onLeaveComplete(): void {
  leaveTimeout.clear();
  if (get(transitioning)) {
    set(transitioning, false);
    emit('closed');
  }
}

watch(modelValue, (value) => {
  if (!value) {
    set(transitioning, true);
    // Match CSS transition duration (200ms) + buffer
    leaveTimeout.create(onLeaveComplete, 250);
  }
});

// Debounce prevents activator click from immediately triggering close
// (click bubbles to body → onClickOutside fires in the same tick)
onClickOutside(content, () => {
  if (get(modelValue) && temporary && !stateless) {
    clickOutsideTimeout.create(close, 50);
  }
});
</script>

<template>
  <div>
    <slot
      name="activator"
      v-bind="{ open: modelValue, attrs: activatorAttrs }"
    />
    <Teleport to="body">
      <Transition
        v-if="overlay"
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity ease-out duration-200"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          data-id="overlay"
          class="absolute inset-0 backdrop-blur bg-rui-grey-500/50 dark:bg-black/50 z-[10000]"
          @click.stop="close()"
        />
      </Transition>
      <aside
        v-if="alive"
        ref="content"
        data-id="drawer-content"
        :style="style"
        :data-visible="modelValue || undefined"
        :data-position="position"
        :data-mini="miniVariant || undefined"
        :class="[
          ui,
          temporary && modelValue && 'shadow-5',
          classNames?.content ?? contentClass,
          classNames?.root,
        ]"
        :aria-label="ariaLabel"
        :aria-hidden="miniVariant && !modelValue ? 'true' : undefined"
        v-bind="getRootAttrs($attrs)"
      >
        <slot v-bind="{ attrs: activatorAttrs, close }" />
      </aside>
    </Teleport>
  </div>
</template>
