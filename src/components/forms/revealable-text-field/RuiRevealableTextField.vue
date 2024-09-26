<script setup lang="ts">
import RuiTextField, { type TextFieldProps } from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

export interface Props extends TextFieldProps {}

defineOptions({
  name: 'RuiRevealableTextField',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
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
});

const hidden: Ref<boolean> = ref(true);

const slots = useSlots();
</script>

<template>
  <RuiTextField
    v-bind="{ ...props, ...$attrs }"
    :type="hidden ? 'password' : 'text'"
  >
    <template
      v-if="slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>
    <template #append>
      <div class="flex items-center">
        <RuiButton
          :disabled="disabled"
          tabindex="-1"
          variant="text"
          type="button"
          icon
          class="-mr-1 !p-2"
          @click="hidden = !hidden"
        >
          <RuiIcon
            class="text-black/[.54] dark:text-white/[.56]"
            size="20"
            :name="hidden ? 'eye-off-line' : 'eye-line'"
          />
        </RuiButton>

        <slot name="append" />
      </div>
    </template>
  </RuiTextField>
</template>
