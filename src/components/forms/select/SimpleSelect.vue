<script lang="ts" setup>
import Icon from '@/components/icons/Icon.vue';

export interface Props {
  modelValue: string | number;
  options: string[] | number[];
  disabled?: boolean;
  name?: string;
  variant?: 'default' | 'outlined';
}

defineOptions({
  name: 'RuiSimpleSelect',
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

const css = useCssModule();

const value = computed({
  get: () => get(modelValue),
  set: (value) => emit('update:model-value', value),
});
</script>

<template>
  <div :class="css.wrapper">
    <select
      v-model="value"
      :class="[
        css.select,
        css[variant ?? 'default'],
        { [css.disabled]: disabled },
      ]"
      :name="name"
      :disabled="disabled"
    >
      <option v-for="(option, i) in options" :key="i" :value="option">
        {{ option }}
      </option>
    </select>
    <span :class="css.icon__wrapper">
      <Icon :class="css.icon" name="arrow-drop-down-fill" size="24" />
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
