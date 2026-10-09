<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiFieldLabel from '@/components/forms/field-label/RuiFieldLabel.vue';
import { textFieldStyles } from '@/components/forms/text-field/text-field-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type LabelPlacement, useLabelPlacement } from '@/composables/defaults/field';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Where the label shows; falls back to the nearest `RuiFieldDefaults`, then the app default, then `top`. */
  labelPlacement?: LabelPlacement;
  color?: ContextColorsType;
  textColor?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiTextField',
  inheritAttrs: false,
});

const modelValue = defineModel<string>({ required: true });

const {
  label = '',
  placeholder = '',
  disabled = false,
  labelPlacement = undefined,
  color = undefined,
  textColor = undefined,
  dense = false,
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  prependIcon = undefined,
  appendIcon = undefined,
  readonly = false,
  clearable = false,
  required = false,
} = defineProps<TextFieldProps>();

const emit = defineEmits<{
  'focus-input': [event: Event];
  'blur': [event: Event];
  'remove': [value: unknown];
  'clear': [];
}>();

defineSlots<{
  prepend?: () => any;
  append?: () => any;
}>();

const isHovered = ref<boolean>(false);
const showClearButton = ref<boolean>(false);

const inputRef = useTemplateRef<HTMLInputElement>('inputRef');

const generatedId = useId();
const attrs = useAttrs();

const { focused } = useFocus(inputRef);
const placement = useLabelPlacement(() => labelPlacement);
const { clear: cancelClearHide, create: delayClearHide } = useTimeoutManager();
const { hasError, hasSuccess, hasMessages, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const inputId = computed<string>(() => {
  const id = attrs.id;
  return typeof id === 'string' && id ? id : generatedId;
});

const showClearIcon = computed<boolean>(() => clearable && !!get(modelValue) && !disabled && !readonly);

const effectiveTextColor = computed<ContextColorsType | undefined>(() => {
  if (get(hasError))
    return 'error';
  if (get(hasSuccess))
    return 'success';
  if (textColor && !get(hasMessages))
    return textColor;
  return undefined;
});

const effectiveColor = computed<ContextColorsType | undefined>(() => get(validation) ?? color);

const ui = computed<ReturnType<typeof textFieldStyles>>(() => textFieldStyles({
  dense,
  disabled,
  readonly,
  hovered: get(isHovered),
  focused: get(focused),
  color: get(effectiveColor),
  textColor: get(effectiveTextColor),
  validation: get(validation),
}));

function input(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    set(modelValue, target.value);
  }
}

function clearIconClicked(): void {
  set(modelValue, '');
  emit('clear');
}

watch(focused, (value) => {
  if (value) {
    // a refocus within the delay keeps the button
    cancelClearHide();
    set(showClearButton, true);
  }
  else {
    delayClearHide(() => set(showClearButton, false), 500);
  }
});

defineExpose({
  setSelectionRange: (start: number, end: number) => {
    get(inputRef)?.setSelectionRange(start, end);
  },
  focus: () => get(inputRef)?.focus(),
  element: inputRef,
});
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <RuiFieldLabel
      v-if="label"
      :text="label"
      :for="inputId"
      :hidden="placement === 'hidden'"
      :required="required"
      :disabled="disabled"
    />
    <div
      :class="ui.wrapper()"
      data-id="wrapper"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        v-if="$slots.prepend || prependIcon"
        :class="ui.prepend()"
        data-id="prepend"
      >
        <slot
          v-if="$slots.prepend"
          name="prepend"
        />
        <div
          v-else-if="prependIcon"
          :class="ui.icon()"
        >
          <RuiIcon
            :name="prependIcon"
            :size="18"
          />
        </div>
      </div>
      <div
        :class="ui.inputWrapper()"
        @click="emit('focus-input', $event)"
      >
        <input
          :id="inputId"
          ref="inputRef"
          :value="modelValue"
          :placeholder="placeholder || ' '"
          :class="ui.input()"
          :disabled="disabled"
          :readonly="readonly"
          :aria-invalid="hasError"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
          @blur="emit('blur', $event)"
          @remove="emit('remove', $event)"
        />
        <fieldset :class="ui.fieldset()" />
      </div>
      <div
        v-if="$slots.append || appendIcon || showClearIcon"
        :class="ui.append()"
        data-id="append"
      >
        <RuiButton
          v-if="showClearIcon"
          :class="[ui.clearButton(), { hidden: !showClearButton }]"
          variant="text"
          type="button"
          icon
          data-id="clear-btn"
          aria-label="Clear"
          tabindex="-1"
          @click.stop="clearIconClicked()"
        >
          <RuiIcon
            name="lu-x"
            size="16"
          />
        </RuiButton>
        <slot
          v-if="$slots.append"
          name="append"
        />
        <div
          v-else-if="appendIcon"
          :class="ui.icon()"
        >
          <RuiIcon
            :name="appendIcon"
            :size="18"
          />
        </div>
      </div>
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :class="ui.details()"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
