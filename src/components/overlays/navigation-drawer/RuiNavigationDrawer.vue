<script setup lang='ts'>
import type { MaybeElement } from '@vueuse/core';
import { type Ref, ref } from 'vue';
import { getRootAttrs } from '@/utils/helpers';

export interface NavigationDrawerProps {
  modelValue?: boolean;
  temporary?: boolean;
  stateless?: boolean;
  width?: string | number;
  miniVariant?: boolean;
  overlay?: boolean;
  position?: 'left' | 'right';
  contentClass?: string | object | string[];
}

defineOptions({
  name: 'RuiNavigationDrawer',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<NavigationDrawerProps>(), {
  modelValue: false,
  temporary: false,
  stateless: false,
  width: 360,
  miniVariant: false,
  overlay: false,
  position: 'left',
  contentClass: '',
});

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
  (e: 'closed'): void;
}>();

const {
  modelValue,
  position,
  miniVariant,
  width,
} = toRefs(props);

function onUpdateModelValue(value: boolean) {
  emit('update:model-value', value);

  if (!value)
    emit('closed');
}

const internalValue: Ref<boolean> = ref(false);

watchImmediate(modelValue, (value) => {
  set(internalValue, value);
});

watch(internalValue, (value) => {
  onUpdateModelValue(value);
});

function close() {
  set(internalValue, false);
}

const style = computed(() => ({
  width: transformPropsUnit(get(width)),
}));

const content: Ref<MaybeElement | null> = ref(null);

onClickOutside(content, () => {
  if (get(internalValue) && props.temporary && !props.stateless) {
    setTimeout(() => {
      close();
    }, 50);
  }
});

const activatorAttrs = computed(() => ({
  onClick: () => {
    const newValue = !get(internalValue);
    set(internalValue, newValue);
    onUpdateModelValue(newValue);
  },
}));
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
        leave-active-class="ease-in duration-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="internalValue"
          :class="$style.overlay"
          @click.stop="close()"
        />
      </Transition>
      <aside
        ref="content"
        :style="style"
        :class="[
          $style.content,
          contentClass,
          {
            [$style.visible]: internalValue,
            [$style[position]]: position,
            [$style.mini]: miniVariant,
            [$style.temporary]: temporary,
            [$style['with-overlay']]: overlay,
          },
        ]"
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
  @apply transition-all top-0 h-full fixed text-rui-text bg-white z-[7];

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
