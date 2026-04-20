<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { type FloatingOptions, useFloating } from '@/composables/floating';
import { type PopperOptions, toFloatingOptions } from '@/composables/popper';
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
  options?: FloatingOptions;
  /** @deprecated Use `options` instead */
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
  options,
  popper,
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
  popover: menu,
  open,
  visible,
  currentPlacement,
  leavePending,
  onLeavePending,
  onOpen,
  onClose,
  onLeaveComplete,
  updatePosition,
} = useFloating(
  () => popper ? toFloatingOptions(popper) : (options ?? {}),
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
    popover: 'w-max z-[9999]',
    content: 'rounded overflow-hidden shadow-8 bg-white dark:bg-[#2E2E2E] text-rui-text focus:outline-none py-2',
    details: 'pt-1',
  },
  variants: {
    fullWidth: {
      true: { wrapper: 'w-full' },
    },
    dense: {
      true: { details: 'px-2' },
      false: { details: 'px-4' },
    },
  },
  defaultVariants: { fullWidth: false, dense: false },
});

const ui = computed<ReturnType<typeof menuStyles>>(() => menuStyles({
  fullWidth,
  dense,
}));

// NOTE: both computed functions must return the *same* object shape from
// every branch — otherwise vue-tsc infers the slot's `attrs` type as a
// discriminated union where each key is either "all defined" or "all
// undefined", which breaks consumer code that types its own `attrs`
// handler with individually-optional keys.
const baseMenuAttrs = computed<BaseMenuAttrs>(() => {
  const clickVal = get(click);
  return {
    onMouseover: disabled
      ? undefined
      : () => {
          if (openOnHover)
            onOpen();
        },
    onMouseleave: disabled
      ? undefined
      : () => {
          if (openOnHover && !clickVal)
            onClose();
        },
  };
});

const menuAttrs = computed<MenuAttrs>(() => ({
  ...get(baseMenuAttrs),
  onClick: disabled ? undefined : checkClick,
}));

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
        v-if="visible"
        ref="menu"
        :class="ui.popover({ class: cn(classNames?.menu) ?? cn(menuClass as VueClassValue) })"
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
          @before-enter="updatePosition()"
          @after-leave="leavePending ? onLeaveComplete() : undefined"
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
