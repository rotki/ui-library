<script setup lang="ts">
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { type PopperOptions, usePopper } from '@/composables/popper';
import { useFormTextDetail } from '@/utils/form-text-detail';

export interface MenuProps {
  openOnHover?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  popper?: PopperOptions;
  wrapperClass?: string | object | string[];
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

const props = withDefaults(defineProps<MenuProps>(), {
  openOnHover: false,
  disabled: false,
  fullWidth: false,
  openDelay: 0,
  closeDelay: 0,
  popper: () => ({}),
  wrapperClass: '',
  menuClass: '',
  closeOnContentClick: false,
  persistOnActivatorClick: false,
  hint: undefined,
  errorMessages: () => [],
  successMessages: () => [],
  persistent: false,
  disableAutoFocus: false,
});

const {
  closeDelay,
  openDelay,
  popper,
  disabled,
  persistOnActivatorClick,
  closeOnContentClick,
  openOnHover,
  errorMessages,
  successMessages,
  persistent,
  disableAutoFocus,
} = toRefs(props);

const {
  reference: activator,
  popper: menu,
  open,
  popperEnter,
  leavePending,
  onLeavePending,
  onOpen,
  onClose,
  onPopperLeave,
  updatePopper,
} = usePopper(popper, disabled, openDelay, closeDelay);

const { width } = useElementSize(activator);

const click = ref<boolean>(false);
const menuContent = ref<HTMLElement>();

const FOCUSABLE_ELEMENTS_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function focusMenu() {
  if (get(disableAutoFocus))
    return;

  nextTick(() => {
    const content = get(menuContent);
    if (!content)
      return;

    // Focus on the menu container itself
    content.focus();
  });
}

function onLeave(event?: KeyboardEvent) {
  if (!get(open))
    return;
  onClose();
  set(click, false);
  event?.stopPropagation();

  // Return focus to activator when menu closes
  if (!get(disableAutoFocus)) {
    nextTick(() => {
      const activatorEl = get(activator);
      if (activatorEl) {
        const focusableEl = activatorEl.querySelector<HTMLElement>(
          FOCUSABLE_ELEMENTS_SELECTOR,
        );
        if (focusableEl) {
          focusableEl.focus();
        }
      }
    });
  }
}

function checkClick() {
  if (get(open) && get(click)) {
    if (!get(persistOnActivatorClick))
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
  if (get(open) && !get(persistent))
    onLeave();
}, { ignore: [activator] });

const baseMenuAttrs = computed(() => {
  if (get(disabled))
    return {};

  const openOnHoverVal = get(openOnHover);
  const clickVal = get(click);
  return {
    onMouseover: () => {
      if (openOnHoverVal)
        onOpen();
    },
    onMouseleave: () => {
      if (openOnHoverVal && !clickVal)
        onClose();
    },
  };
});

const menuAttrs = computed(() => {
  if (get(disabled))
    return {};

  return { ...get(baseMenuAttrs), onClick: checkClick };
});

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);
</script>

<template>
  <div
    @keydown.esc.stop="onLeave()"
    @keydown.tab="!disableAutoFocus && open ? undefined : null"
  >
    <div
      ref="activator"
      :class="[$style.wrapper, wrapperClass, { 'w-full': fullWidth }]"
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
        :class="[
          $style.menu,
          menuClass,
          $style[`menu__${popper?.strategy ?? 'absolute'}`],
        ]"
        role="menu"
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
            role="menu-content"
            :class="$style.base"
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
      class="pt-1"
      :class="[dense ? 'px-2' : 'px-4']"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative inline-flex max-w-full;
}

.menu {
  @apply w-max transform transition-opacity delay-0 z-[9999];

  &__fixed {
    @apply fixed;
  }

  &__absolute {
    @apply absolute;
  }

  .base {
    @apply rounded overflow-hidden shadow-8;
    @apply bg-white text-rui-text;

    &:focus {
      @apply outline-none;
    }
  }
}

:global(.dark) {
  .menu {
    .base {
      @apply bg-[#2E2E2E];
    }
  }
}
</style>
