<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { tv } from '@/utils/tv';

export interface Props {
  options: string[] | number[];
  disabled?: boolean;
  label?: string;
  name?: string;
}

defineOptions({
  name: 'RuiSimpleSelect',
  inheritAttrs: false,
});

const modelValue = defineModel<string | number>({ required: true });

const { options, disabled = false, label, name = '' } = defineProps<Props>();

/** The native select dressed as the other fields: a 36px bordered box with their hover, focus and disabled looks. */
const selectClass = tv({
  base: [
    'appearance-none cursor-pointer m-0 w-full h-9 pl-3 pr-8 rounded-rui-control [font:inherit] text-sm text-rui-text',
    'border border-rui-outline bg-transparent transition-colors',
    'hover:border-rui-neutral-400 dark:hover:border-rui-neutral-500',
    'outline-hidden focus-visible:border-rui-primary focus-visible:ring-3 focus-visible:ring-rui-primary/20',
    'disabled:cursor-default disabled:border-rui-outline disabled:bg-rui-neutral-50 disabled:text-rui-text-disabled',
    'dark:disabled:bg-rui-neutral-900',
  ].join(' '),
});

const ui = computed<string>(() => selectClass());
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
      class="flex items-center justify-end absolute right-3 inset-y-0 pointer-events-none"
      aria-hidden="true"
    >
      <RuiIcon
        class="text-rui-text-secondary pointer-events-none"
        name="lu-chevron-down"
        size="16"
      />
    </span>
  </div>
</template>
