<script setup lang="ts">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTextField, { type TextFieldProps } from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props extends TextFieldProps {}

/**
 * What the field forwards to its RuiTextField through `$attrs`: the input's attributes and the text
 * field's events (`blur`, `clear`, `focus-input`, `remove`). The field sets `type` itself. A template
 * listener `@focus-input` is checked as `onFocusInput`, which Vue also matches at runtime.
 */
type TextFieldAttributes = Omit<InstanceType<typeof RuiTextField>['$props'], keyof Props | 'modelValue' | 'onUpdate:modelValue' | 'modelModifiers' | 'type'>
  & Partial<Record<'onFocusInput', (event: Event) => void>>;

defineOptions({
  name: 'RuiRevealableTextField',
  inheritAttrs: false,
});

// `v-model.trim` trims the update, which Vue applies to any model event
const modelValue = defineModel<string, 'trim'>({ required: true });

const {
  label = '',
  placeholder = '',
  disabled = false,
  labelPlacement = undefined,
  dense = false,
  hint = '',
  errorMessages = [],
  successMessages = [],
  details = undefined,
  hideDetails = false,
  readonly = false,
  clearable = false,
  required = false,
} = defineProps<Props & /* @vue-ignore */ TextFieldAttributes>();

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
    :details="hideDetails ? 'hidden' : details"
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
