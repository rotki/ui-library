<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { getNonRootAttrs, getRootAttrs, transformPropsUnit } from '@/utils/helpers';
import { cn, tv } from '@/utils/tv';

export interface RuiDialogClassNames {
  root?: VueClassValue;
  content?: VueClassValue;
}

export interface DialogProps {
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  bottomSheet?: boolean;
  classNames?: RuiDialogClassNames;
  /** @deprecated Use `classNames.content` instead */
  contentClass?: string | string[] | Record<string, boolean>;
  zIndex?: string | number;
  ariaLabel?: string;
}

defineOptions({
  name: 'RuiDialog',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const {
  persistent = false,
  width = '98%',
  maxWidth,
  bottomSheet = false,
  classNames,
  contentClass = '',
  zIndex = 9999,
  ariaLabel,
} = defineProps<DialogProps>();

const emit = defineEmits<{
  'closed': [];
  'click:outside': [];
  'click:esc': [];
}>();

defineSlots<{
  activator?: (props: { attrs: { onClick: () => void }; isOpen: boolean }) => any;
  default?: (props: { isOpen: boolean; close: () => void }) => any;
}>();

const transitioning = ref<boolean>(false);
const contentRef = useTemplateRef<HTMLDivElement>('contentRef');

const leaveTimeout = useTimeoutManager();

const alive = computed<boolean>(() => get(modelValue) || get(transitioning));

const style = computed<{ width: string | undefined; maxWidth: string | undefined }>(() => ({
  width: transformPropsUnit(width),
  maxWidth: transformPropsUnit(maxWidth),
}));

const dialog = tv({
  slots: {
    root: 'fixed inset-0',
    overlay: 'absolute inset-0 backdrop-blur bg-rui-grey-500/50 dark:bg-black/50',
    content: 'absolute left-1/2 bottom-0 -translate-x-1/2 outline-none overflow-y-auto max-h-[90vh]',
  },
  variants: {
    bottomSheet: {
      true: { content: '' },
      false: { content: 'top-1/2 -translate-y-1/2 bottom-auto' },
    },
  },
  defaultVariants: { bottomSheet: false },
});

const ui = computed<ReturnType<typeof dialog>>(() => dialog({ bottomSheet }));

const dialogAttrs: { onClick: () => void } = {
  onClick: toggle,
};

const contentTransition = computed<Record<string, string>>(() => {
  if (!bottomSheet) {
    return {
      enterFromClass: 'opacity-0 scale-95',
      enterActiveClass: 'transition-all ease-out duration-200',
      enterToClass: 'opacity-100 scale-100',
      leaveFromClass: 'opacity-100 scale-100',
      leaveActiveClass: 'transition-all ease-in duration-150',
      leaveToClass: 'opacity-0 scale-95',
    };
  }

  return {
    enterFromClass: 'translate-y-full',
    enterActiveClass: 'transition-transform ease-out duration-300',
    enterToClass: 'translate-y-0',
    leaveFromClass: 'translate-y-0',
    leaveActiveClass: 'transition-transform ease-in duration-200',
    leaveToClass: 'translate-y-full',
  };
});

function toggle(): void {
  set(modelValue, !get(modelValue));
}

function close(): void {
  set(modelValue, false);
}

function onEscClick(): void {
  if (!persistent) {
    close();
  }
  emit('click:esc');
}

function onClickOutside(): void {
  if (!persistent) {
    close();
  }
  emit('click:outside');
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
    // Safety fallback if transitionend is not detected
    leaveTimeout.create(onLeaveComplete, 400);
  }
});

watch(contentRef, (ref) => {
  if (ref) {
    nextTick(() => ref.focus());
  }
  else {
    onLeaveComplete();
  }
});
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <slot
      name="activator"
      v-bind="{ attrs: dialogAttrs, isOpen: modelValue }"
    />
    <Teleport to="body">
      <div
        v-if="alive"
        :class="ui.root({ class: cn(classNames?.root) })"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        tabindex="0"
        v-bind="getNonRootAttrs($attrs)"
        @keydown.esc.stop="onEscClick()"
      >
        <Transition
          enter-from-class="opacity-0"
          enter-active-class="transition-opacity ease-out duration-200"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-active-class="transition-opacity ease-in duration-150"
          leave-to-class="opacity-0"
        >
          <div
            v-if="modelValue"
            data-id="overlay"
            :class="ui.overlay()"
            @click.stop="onClickOutside()"
          />
        </Transition>
        <Transition
          v-bind="contentTransition"
          @after-leave="onLeaveComplete()"
        >
          <div
            v-if="modelValue"
            ref="contentRef"
            data-id="content"
            :style="style"
            tabindex="0"
            :data-bottom-sheet="bottomSheet || undefined"
            :class="ui.content({ class: cn(classNames?.content) ?? cn(contentClass) })"
          >
            <slot v-bind="{ isOpen: modelValue, close }" />
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>
