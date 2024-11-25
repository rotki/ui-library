<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props {
  modelValue: string | number;
  options: string[] | number[];
  disabled?: boolean;
  name?: string;
  variant?: 'default' | 'outlined';
}

defineOptions({
  name: 'RuiSimpleSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  name: '',
  variant: 'default',
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: string | number): void;
}>();

const { modelValue } = toRefs(props);

const value = computed({
  get: () => get(modelValue),
  set: value => emit('update:model-value', value),
});
</script>

<template>
  <div
    :class="$style.wrapper"
    v-bind="$attrs"
  >
    <select
      v-model="value"
      :class="[
        $style.select,
        $style[variant ?? 'default'],
        { [$style.disabled]: disabled },
      ]"
      :name="name"
      :disabled="disabled"
    >
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
    <span :class="$style.icon__wrapper">
      <RuiIcon
        :class="$style.icon"
        name="lu-chevron-down"
        size="16"
      />
    </span>
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative inline-flex;

  .select {
    @apply outline-none focus:outline-none appearance-none cursor-pointer pl-2 py-1 pr-8 rounded;
    @apply m-0 w-full bg-white hover:bg-gray-50 transition;
    @apply disabled:bg-black/[.12] disabled:text-rui-text-disabled disabled:active:text-rui-text-disabled disabled:cursor-default;

    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    &::-ms-expand {
      display: none;
    }

    &.outlined {
      @apply border border-rui-text-disabled disabled:border-transparent;
    }
  }

  .icon {
    @apply text-rui-text-disabled pointer-events-none;

    &__wrapper {
      @apply flex items-center justify-end;
      @apply absolute right-1 top-px bottom-0 pointer-events-none;
    }
  }
}

:global(.dark) {
  .wrapper {
    .select {
      @apply bg-transparent hover:bg-white/10 disabled:bg-white/10 text-rui-text-disabled;

      &.outlined {
        @apply border border-rui-text-disabled;
      }
    }

    .icon {
      @apply text-rui-text-disabled;
    }
  }
}
</style>
