<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { simpleSelectStyles } from './simple-select-styles';

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

const ui = computed<string>(() => simpleSelectStyles());
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
