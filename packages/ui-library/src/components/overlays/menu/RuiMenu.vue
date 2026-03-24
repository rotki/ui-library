<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { type PopperOptions, usePopper } from '@/composables/popper';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { cn, tv } from '@/utils/tv';

interface BaseMenuAttrs { onMouseover?: () => void; onMouseleave?: () => void }

interface MenuAttrs extends BaseMenuAttrs { onClick?: () => void }

export interface RuiMenuClassNames {
  root?: VueClassValue;
  wrapper?: VueClassValue;
  menu?: VueClassValue;
}

export interface MenuProps {
  openOnHover?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  popper?: PopperOptions;
  classNames?: RuiMenuClassNames;
  /** @deprecated Use `classNames.wrapper` instead */
  wrapperClass?: string | object | string[];
  /** @deprecated Use `classNames.menu` instead */
  menuClass?: string | object | string[];
  closeOnContentClick?: boolean;
  persistOnActivatorClick?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  showDetails?: boolean;
  dense?: boolean;
  persistent?: boolean;
  disableAutoFocus?: boolean;
}

defineOptions({
  name: 'RuiMenu',
});

const modelValue = defineModel<boolean>({ default: false });

const {
  openOnHover = false,
  disabled = false,
  fullWidth = false,
  openDelay = 0,
  closeDelay = 0,
  popper = {},
  classNames,
  wrapperClass = '',
  menuClass = '',
  closeOnContentClick = false,
  persistOnActivatorClick = false,
  hint,
  errorMessages = [],
  successMessages = [],
  showDetails = false,
  dense = false,
  persistent = false,
  disableAutoFocus = false,
} = defineProps<MenuProps>();

defineSlots<{
  activator?: (props: {
    attrs: { onMouseover?: () => void; onMouseleave?: () => void; onClick?: () => void };
    open: boolean;
    disabled: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
  default?: (props: { width: number }) => any;
}>();

const click = ref<boolean>(false);
const menuContent = useTemplateRef<HTMLElement>('menuContent');

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const {
  reference: activator,
  popper: menu,
  open,
  popperEnter,
  currentPlacement,
  leavePending,
  onLeavePending,
  onOpen,
  onClose,
  onPopperLeave,
  updatePopper,
} = usePopper(
  () => popper,
  () => disabled,
  () => openDelay,
  () => closeDelay,
);

const { width } = useElementSize(activator);

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const menuStyles = tv({
  slots: {
    wrapper: 'relative inline-flex max-w-full',
    popper: 'w-max z-[9999]',
    content: 'rounded overflow-hidden shadow-8 bg-white dark:bg-[#2E2E2E] text-rui-text focus:outline-none',
    details: 'pt-1',
  },
  variants: {
    fullWidth: {
      true: { wrapper: 'w-full' },
    },
    strategy: {
      fixed: { popper: 'fixed' },
      absolute: { popper: 'absolute' },
    },
    dense: {
      true: { details: 'px-2' },
      false: { details: 'px-4' },
    },
  },
  defaultVariants: { fullWidth: false, strategy: 'absolute', dense: false },
});

const ui = computed<ReturnType<typeof menuStyles>>(() => menuStyles({
  fullWidth,
  strategy: popper?.strategy === 'fixed' ? 'fixed' : 'absolute',
  dense,
}));

const baseMenuAttrs = computed<BaseMenuAttrs>(() => {
  if (disabled)
    return {};

  const clickVal = get(click);
  return {
    onMouseover: () => {
      if (openOnHover)
        onOpen();
    },
    onMouseleave: () => {
      if (openOnHover && !clickVal)
        onClose();
    },
  } satisfies BaseMenuAttrs;
});

const menuAttrs = computed<MenuAttrs>(() => {
  if (disabled)
    return {};

  return { ...get(baseMenuAttrs), onClick: checkClick };
});

function focusOnContent() {
  const content = get(menuContent);
  if (!content)
    return;

  // Focus on the menu container itself
  content.focus();
}

function focusMenu(): void {
  if (disableAutoFocus)
    return;

  nextTick(() => focusOnContent());
}

function focusOnActivator() {
  const activatorEl = get(activator);
  if (!activatorEl) {
    return;
  }
  const focusableEl = activatorEl.querySelector<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
  if (focusableEl) {
    focusableEl.focus();
  }
}

function onLeave(event?: KeyboardEvent): void {
  if (!get(open))
    return;
  onClose();
  set(click, false);
  event?.stopPropagation();

  // Return focus to activator when menu closes
  if (disableAutoFocus) {
    return;
  }

  nextTick(() => focusOnActivator());
}

function checkClick(): void {
  if (get(open) && get(click)) {
    if (!persistOnActivatorClick)
      onLeave();
  }
  else {
    onOpen();
    set(click, true);
  }
}

watch(modelValue, (value) => {
  if (get(open) === value)
    return;

  if (value) {
    onOpen();
    set(click, true);
  }
  else {
    onLeave();
  }
});

watch(open, (open) => {
  set(modelValue, open);
  if (open) {
    focusMenu();
  }
});

onClickOutside(menu, () => {
  if (get(open) && !persistent)
    onLeave();
}, { ignore: [activator] });
</script>

<template>
  <div
    :class="classNames?.root"
    @keydown.esc.stop="onLeave()"
  >
    <div
      ref="activator"
      :class="ui.wrapper({ class: cn(classNames?.wrapper) ?? cn(wrapperClass as VueClassValue) })"
      :data-menu-disabled="disabled"
      aria-haspopup="true"
      :aria-expanded="open"
    >
      <slot
        name="activator"
        v-bind="{ attrs: menuAttrs, open, disabled, hasError, hasSuccess }"
      />
    </div>
    <Teleport
      v-if="!disabled"
      to="body"
    >
      <div
        v-if="popperEnter"
        ref="menu"
        :class="ui.popper({ class: cn(classNames?.menu) ?? cn(menuClass as VueClassValue) })"
        role="menu"
        :data-placement="currentPlacement"
        @click="closeOnContentClick ? onLeave() : undefined"
        @keydown.esc.stop="onLeave()"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="updatePopper()"
          @after-leave="leavePending ? onPopperLeave() : undefined"
          @before-leave="onLeavePending()"
        >
          <div
            v-if="open"
            ref="menuContent"
            key="menu"
            data-id="content"
            :class="ui.content()"
            tabindex="-1"
            v-bind="baseMenuAttrs"
          >
            <slot v-bind="{ width }" />
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
    <RuiFormTextDetail
      v-if="showDetails"
      :class="ui.details()"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
