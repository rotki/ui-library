<script setup lang="ts">
import type { ClassValue } from 'vue';
import type { VueClassValue } from '@/types/class-value';
import type { MaybeElement } from '@/types/dom';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { getRootAttrs, transformPropsUnit } from '@/utils/helpers';
import { cn } from '@/utils/tv';
import { navigationDrawerStyles } from './navigation-drawer-styles';

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
  ariaLabel?: string;
  /**
   * Starts the drawer, and its overlay, below the app bar (`--rui-app-bar-height`), so the app bar
   * stays uncovered and usable while the drawer is open. Without it the drawer runs the full height and
   * a modal one covers the app bar.
   */
  belowAppBar?: boolean;
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
  ariaLabel,
  belowAppBar = false,
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

/**
 * Where the drawer starts its slide in: it mounts open, so the closed position has to be put on it for
 * its first frame. Important, because the open position is already on the element.
 */
const enterFromClass = computed<string>(() => (position === 'left' ? '-translate-x-full!' : 'translate-x-full!'));

// the overlay dims what the drawer covers: the whole view, or only the part below the app bar
const overlayClass = computed<string>(() => cn([
  'fixed inset-x-0 bottom-0 backdrop-blur-sm bg-rui-neutral-950/40 dark:bg-black/60 z-rui-drawer',
  belowAppBar ? 'top-rui-app-bar' : 'top-0',
]) ?? '');

/**
 * Consumer classes go through `navigationDrawerStyles()` rather than alongside it, so
 * tailwind-variants' twMerge resolves conflicts in the consumer's favour.
 * Passed as an argument instead of read off `$attrs` here, so the template
 * keeps using `$attrs` directly.
 */
function rootClass(attrsClass: ClassValue): string {
  return navigationDrawerStyles({
    position,
    visible: modelValue.value,
    mini: miniVariant,
    withOverlay: overlay,
    temporary,
    belowAppBar,
    class: cn([
      temporary && modelValue.value && 'shadow-rui-drawer',
      classNames?.content,
      classNames?.root,
      attrsClass,
    ]),
  });
}

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

// Debounced, so the activator's own click, which bubbles to the body, does not close it again
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
          :class="overlayClass"
          @click.stop="close()"
        />
      </Transition>
      <!-- leaves with no transition: it has already slid out, and its own would hold the removal for a transitionend that never comes -->
      <Transition
        :enter-from-class="enterFromClass"
        leave-active-class="duration-0!"
      >
        <aside
          v-if="alive"
          ref="content"
          data-id="drawer-content"
          :style="style"
          :data-visible="modelValue || undefined"
          :data-position="position"
          :data-mini="miniVariant || undefined"
          :class="rootClass($attrs.class)"
          :aria-label="ariaLabel"
          v-bind="getRootAttrs($attrs, [])"
        >
          <slot v-bind="{ attrs: activatorAttrs, close }" />
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>
