<script setup lang="ts">
export interface DialogProps {
  modelValue?: boolean;
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  bottomSheet?: boolean;
  contentClass?: any;
  zIndex?: string | number;
}

defineOptions({
  name: 'RuiDialog',
});

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  persistent: false,
  width: '98%',
  bottomSheet: false,
  contentClass: '',
  zIndex: 9999,
});

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
  (e: 'closed'): void;
}>();

const css = useCssModule();

const {
  modelValue,
  width,
  maxWidth,
  bottomSheet,
} = toRefs(props);

const internalValue: Ref<boolean> = ref(false);
const isOpen: Ref<boolean> = ref(false);

watchImmediate(modelValue, (value) => {
  nextTick(() => {
    set(internalValue, value);
  });
});

watch(internalValue, (value) => {
  if (value) {
    nextTick(() => {
      set(isOpen, value);
    });
  }
  else {
    setTimeout(() => {
      set(isOpen, value);
    }, 100);
  }
});

function onUpdateModelValue(value: boolean) {
  emit('update:model-value', value);

  if (!value)
    emit('closed');
}

watch(isOpen, (isOpen) => {
  if (isOpen) {
    onUpdateModelValue(isOpen);
    set(internalValue, isOpen);
  }
  else {
    setTimeout(() => {
      onUpdateModelValue(isOpen);
      set(internalValue, isOpen);
    }, 100);
  }
});

function close() {
  set(isOpen, false);
}

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
  maxWidth: transformPropsUnit(get(maxWidth)),
}));

const contentRef: Ref<HTMLDivElement | undefined> = ref(undefined);

watch(contentRef, (contentRef) => {
  if (contentRef) {
    nextTick(() => {
      contentRef.focus();
    });
  }
});

const dialogAttrs = computed(() => ({
  onClick: () => {
    const newValue = !get(internalValue);
    set(internalValue, newValue);
    onUpdateModelValue(newValue);
  },
}));

const contentTransition = computed(() => {
  if (!get(bottomSheet)) {
    return {
      enterFromClass: 'opacity-0 scale-75',
      enterActiveClass: 'ease-out duration-150',
      enterToClass: 'opacity-100 scale-100',
      leaveFromClass: 'opacity-100 scale-100',
      leaveActiveClass: 'ease-in duration-100',
      leaveToClass: 'opacity-0 scale-75',
    };
  }

  return {
    enterFromClass: 'translate-y-full',
    enterActiveClass: 'ease-out duration-150',
    enterToClass: 'translate-y-0',
    leaveFromClass: 'translate-y-0',
    leaveActiveClass: 'ease-in duration-100',
    leaveToClass: 'translate-y-full',
  };
});
</script>

<template>
  <div>
    <slot
      name="activator"
      v-bind="{ attrs: dialogAttrs, isOpen }"
    />
    <Teleport to="body">
      <div
        v-if="isOpen || internalValue"
        :class="css.wrapper"
        :style="{ zIndex }"
        role="dialog"
        tabindex="0"
        v-bind="$attrs"
        @keydown.esc.stop="!persistent && close()"
      >
        <Transition
          enter-from-class="opacity-0"
          enter-active-class="ease-out duration-150"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-active-class="ease-in duration-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isOpen && internalValue"
            :class="css.overlay"
            @click.stop="!persistent && close()"
          />
        </Transition>
        <Transition v-bind="contentTransition">
          <div
            v-if="isOpen && internalValue"
            ref="contentRef"
            :style="style"
            tabindex="0"
            :class="[css.content, contentClass, { [css.center]: !bottomSheet }]"
          >
            <slot v-bind="{ isOpen, close }" />
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply fixed w-full h-full top-0 left-0;
}

.overlay {
  @apply absolute top-0 left-0 w-full h-full bg-black/[0.5];
}

.content {
  @apply absolute left-1/2 bottom-0 transform -translate-x-1/2 outline-none overflow-y-auto max-h-[90vh];

  &.center {
    @apply top-1/2 -translate-y-1/2 bottom-auto;
  }
}
</style>
