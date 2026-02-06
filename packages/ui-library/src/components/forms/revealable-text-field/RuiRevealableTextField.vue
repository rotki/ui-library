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

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  disabled: false,
  variant: 'default',
  color: undefined,
  textColor: undefined,
  dense: false,
  hint: '',
  as: undefined,
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  prependIcon: undefined,
  appendIcon: undefined,
  readonly: false,
  clearable: false,
  required: false,
});

const hidden = ref<boolean>(true);
</script>

<template>
  <RuiTextField
    v-bind="{ ...props, ...$attrs }"
    v-model="modelValue"
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
          class="-mr-1 !p-2"
          @click="hidden = !hidden"
        >
          <RuiIcon
            class="text-black/[.54] dark:text-white/[.56]"
            size="20"
            :name="hidden ? 'lu-eye-off' : 'lu-eye'"
          />
        </RuiButton>

        <slot name="append" />
      </div>
    </template>
  </RuiTextField>
</template>
