<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiFieldLabel from '@/components/forms/field-label/RuiFieldLabel.vue';
import { textFieldStyles, type TextFieldVariant } from '@/components/forms/text-field/text-field-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type LabelPlacement, useLabelPlacement } from '@/composables/defaults/field';
import { usePrependAppendWidth } from '@/composables/forms/use-prepend-append-width';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Where the label shows; falls back to the nearest `RuiFieldDefaults`, then the app default, then `top`. */
  labelPlacement?: LabelPlacement;
  /** @deprecated Only applies with `labelPlacement="floating"`; every other placement draws the outlined field. */
  variant?: TextFieldVariant;
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
  variant = 'default',
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

const prepend = useTemplateRef<HTMLDivElement>('prepend');
const append = useTemplateRef<HTMLDivElement>('append');
const inputRef = useTemplateRef<HTMLInputElement>('inputRef');

const generatedId = useId();
const attrs = useAttrs();

const { focused } = useFocus(inputRef);
const placement = useLabelPlacement(() => labelPlacement);
const { create: delayClearHide } = useTimeoutManager();
const { prependWidth, appendWidth } = usePrependAppendWidth(prepend, append);
const { hasError, hasSuccess, hasMessages, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const active = computed<boolean>(() => get(focused) || !!get(modelValue));

const floating = computed<boolean>(() => get(placement) === 'floating');

// Only the floating placement keeps the 2.x variants; the others always draw the bordered field
const fieldVariant = computed<TextFieldVariant>(() => get(floating) ? variant : 'outlined');

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
  variant: get(fieldVariant),
  placement: get(placement),
  dense,
  disabled,
  hovered: get(isHovered),
  focused: get(focused),
  active: get(active),
  noLabel: !get(floating) || !label,
  color: get(effectiveColor),
  textColor: get(effectiveTextColor),
  validation: get(validation),
  showLabel: get(floating) && !!label,
}));

const labelStyle = computed<Record<string, string>>(() => ({
  '--prepend-w': get(prependWidth),
  '--append-w': get(appendWidth),
}));

const legendText = computed<string>(() => {
  if (!get(floating) || !get(active) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

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
      v-if="!floating && label"
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
        ref="prepend"
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
            :size="floating ? undefined : 18"
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
        <label
          v-if="floating"
          :class="ui.label()"
          :style="labelStyle"
        >
          <span :class="ui.labelText()">
            {{ label }}
            <span
              v-if="required"
              :class="ui.required()"
            >
              ﹡
            </span>
          </span>
        </label>
        <fieldset
          v-if="fieldVariant === 'outlined'"
          :class="ui.fieldset()"
        >
          <legend :class="ui.legend()">
            {{ legendText }}
          </legend>
        </fieldset>
      </div>
      <div
        v-if="$slots.append || appendIcon || showClearIcon"
        ref="append"
        :class="ui.append()"
        data-id="append"
      >
        <RuiButton
          v-if="showClearIcon"
          :class="[ui.clearButton(), { hidden: !showClearButton }]"
          variant="text"
          type="button"
          icon
          color="error"
          data-id="clear-btn"
          tabindex="-1"
          @click.stop="clearIconClicked()"
        >
          <RuiIcon
            name="lu-x"
            size="20"
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
            :size="floating ? undefined : 18"
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
