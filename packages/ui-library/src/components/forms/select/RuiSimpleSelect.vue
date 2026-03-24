<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { tv } from '@/utils/tv';

export interface Props {
  options: string[] | number[];
  disabled?: boolean;
  label?: string;
  name?: string;
  variant?: 'default' | 'outlined';
}

defineOptions({
  name: 'RuiSimpleSelect',
  inheritAttrs: false,
});

const modelValue = defineModel<string | number>({ required: true });

const { options, disabled = false, label, name = '', variant: selectVariant = 'default' } = defineProps<Props>();

const selectClass = tv({
  base: [
    'outline-none focus:outline-none appearance-none cursor-pointer pl-2 py-1 pr-8 rounded',
    'm-0 w-full transition [font:inherit]',
    'bg-white hover:bg-gray-50',
    'dark:bg-transparent dark:hover:bg-white/10 dark:text-rui-text-disabled',
    'disabled:bg-black/[.12] disabled:text-rui-text-disabled disabled:active:text-rui-text-disabled disabled:cursor-default',
    'dark:disabled:bg-white/10',
  ].join(' '),
  variants: {
    variant: {
      default: '',
      outlined: 'border border-rui-text-disabled disabled:border-transparent dark:border-rui-text-disabled',
    },
  },
  defaultVariants: { variant: 'default' },
});

const ui = computed<string>(() => selectClass({ variant: selectVariant }));
</script>

<template>
  <div
    class="relative inline-flex"
    v-bind="$attrs"
  >
    <select
      v-model="modelValue"
      :class="ui"
      :name="name"
      :disabled="disabled"
      :aria-label="label"
      data-id="select"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
    <span
      class="flex items-center justify-end absolute right-1 top-px bottom-0 pointer-events-none"
      aria-hidden="true"
    >
      <RuiIcon
        class="text-rui-text-disabled pointer-events-none"
        name="lu-chevron-down"
        size="16"
      />
    </span>
  </div>
</template>
