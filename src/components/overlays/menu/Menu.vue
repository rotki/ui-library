<script setup lang="ts">
import { type PopperOptions, usePopper } from '@/composables/popper';

export interface Props {
  modelValue?: boolean;
  openOnHover?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  popper?: PopperOptions;
  menuClass?: string;
  closeOnContentClick?: boolean;
}

defineOptions({
  name: 'RuiMenu',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  openOnHover: false,
  disabled: false,
  openDelay: 0,
  closeDelay: 0,
  popper: () => ({}),
  menuClass: '',
  closeOnContentClick: false,
});

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();

const css = useCssModule();

const { modelValue, closeDelay, openDelay, popper, disabled, closeOnContentClick, openOnHover } = toRefs(props);

const {
  reference: activator,
  popper: menu,
  open,
  popperEnter,
  onOpen,
  onClose,
  onPopperLeave,
  updatePopper,
} = usePopper(popper, disabled, openDelay, closeDelay);

const click: Ref<boolean> = ref(false);

function onLeave() {
  onClose();
  set(click, false);
}

function checkClick() {
  if (get(open) && get(click)) {
    onLeave();
  }
  else {
    onOpen();
    set(click, true);
  }
}

watch(modelValue, (value) => {
  if (value) {
    onOpen();
    set(click, true);
  }
  else {
    onLeave();
  }
});

watch(open, (open) => {
  emit('update:model-value', open);
});

const onClickOutsideIgnored = computed(() => {
  if (!get(closeOnContentClick))
    return get(menu);

  return undefined;
});

onClickOutside(activator, () => {
  if (get(open))
    onLeave();
}, { ignore: [onClickOutsideIgnored] });

const on = computed(() => {
  const openOnHoverVal = get(openOnHover);
  const clickVal = get(click);
  return {
    mouseover: () => {
      if (openOnHoverVal)
        onOpen();
    },
    mouseleave: () => {
      if (openOnHoverVal && !clickVal)
        onClose();
    },
    click: checkClick,
  };
});
</script>

<template>
  <div>
    <div
      ref="activator"
      :class="css.wrapper"
      :data-menu-disabled="disabled"
    >
      <slot
        name="activator"
        :on="on"
        :open="open"
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
          css.menu,
          menuClass,
          css[`menu__${popper?.strategy ?? 'absolute'}`],
        ]"
        role="menu"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="updatePopper()"
          @after-leave="onPopperLeave()"
        >
          <div
            v-if="open"
            key="menu"
            :class="css.base"
            role="menu-content"
          >
            <slot />
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
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
