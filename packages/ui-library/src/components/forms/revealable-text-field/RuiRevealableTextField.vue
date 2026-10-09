<script setup lang="ts">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTextField, { type TextFieldProps } from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props extends TextFieldProps {}

defineOptions({
  name: 'RuiRevealableTextField',
  inheritAttrs: false,
});

const modelValue = defineModel<string>({ required: true });

const {
  label = '',
  placeholder = '',
  disabled = false,
  labelPlacement = undefined,
  dense = false,
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  readonly = false,
  clearable = false,
  required = false,
} = defineProps<Props>();

defineSlots<{
  prepend?: () => any;
  append?: () => any;
}>();

const hidden = ref<boolean>(true);
</script>

<template>
  <RuiTextField
    v-bind="$attrs"
    v-model="modelValue"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :label-placement="labelPlacement"
    :dense="dense"
    :hint="hint"
    :error-messages="errorMessages"
    :success-messages="successMessages"
    :hide-details="hideDetails"
    :readonly="readonly"
    :clearable="clearable"
    :required="required"
    :type="hidden ? 'password' : 'text'"
  >
    <template
      v-if="$slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>
    <template #append>
      <div class="flex items-center">
        <RuiButton
          :disabled="disabled"
          :aria-label="hidden ? 'Show password' : 'Hide password'"
          tabindex="-1"
          variant="text"
          type="button"
          icon
          data-id="toggle-visibility"
          class="-mr-1 p-1!"
          @click="hidden = !hidden"
        >
          <!--
            24px round the field's 16px glyph, so the focus ring and its offset stay inside even the 32px
            dense field; the muted tone of the other field icons
          -->
          <RuiIcon
            class="text-rui-neutral-500 dark:text-rui-neutral-400"
            size="16"
            :name="hidden ? 'lu-eye-off' : 'lu-eye'"
          />
        </RuiButton>

        <slot name="append" />
      </div>
    </template>
  </RuiTextField>
</template>
