<script setup lang="ts">
import { labelStyles } from './field-label-styles';

/**
 * The label a field shows above itself when its label placement is `top`, or
 * keeps for screen readers alone when it is `hidden`. A text input links it
 * through `for`; a select or picker, whose activator is not a labelable
 * element, points at its `id` with `aria-labelledby` instead.
 */
export interface FieldLabelProps {
  text: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  for?: string;
  id?: string;
}

defineOptions({
  name: 'RuiFieldLabel',
});

const {
  text,
  hidden = false,
  required = false,
  disabled = false,
  for: forId = undefined,
  id = undefined,
} = defineProps<FieldLabelProps>();

const ui = computed<ReturnType<typeof labelStyles>>(() => labelStyles({ hidden, disabled }));
</script>

<template>
  <label
    :id="id"
    :for="forId"
    :class="ui.root()"
    data-id="field-label"
  >
    {{ text }}
    <span
      v-if="required"
      :class="ui.required()"
      aria-hidden="true"
    >
      *
    </span>
  </label>
</template>
