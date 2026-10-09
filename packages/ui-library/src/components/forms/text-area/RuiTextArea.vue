<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiFieldLabel from '@/components/forms/field-label/RuiFieldLabel.vue';
import { textAreaStyles } from '@/components/forms/text-area/text-area-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type LabelPlacement, useLabelPlacement } from '@/composables/defaults/field';
import { usePrependAppendWidth } from '@/composables/forms/use-prepend-append-width';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface TextAreaProps {
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
  noResize?: boolean;
  minRows?: number | string;
  maxRows?: number | string;
  rowHeight?: number | string;
  autoGrow?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiTextArea',
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
  noResize = false,
  minRows = 2,
  rowHeight = 1.5,
  maxRows = undefined,
  autoGrow = false,
  required = false,
} = defineProps<TextAreaProps>();

const emit = defineEmits<{
  'click:clear': [];
}>();

defineSlots<{
  prepend?: () => any;
  append?: () => any;
}>();

const isHovered = ref<boolean>(false);
const showClearButton = ref<boolean>(false);

const prepend = useTemplateRef<HTMLDivElement>('prepend');
const append = useTemplateRef<HTMLDivElement>('append');
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea');
const textareaSizer = useTemplateRef<HTMLTextAreaElement>('textareaSizer');

const generatedId = useId();
const attrs = useAttrs();

const { focused } = useFocus(textarea);
const placement = useLabelPlacement(() => labelPlacement);
const { clear: cancelClearHide, create: delayClearHide } = useTimeoutManager();
const { prependWidth, appendWidth } = usePrependAppendWidth(prepend, append, 24);
const { hasError, hasSuccess, hasMessages, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const textareaId = computed<string>(() => {
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

const ui = computed<ReturnType<typeof textAreaStyles>>(() => textAreaStyles({
  dense,
  disabled,
  readonly,
  noResize,
  hovered: get(isHovered),
  focused: get(focused),
  color: get(effectiveColor),
  textColor: get(effectiveTextColor),
  validation: get(validation),
}));

const wrapperStyle = computed<Record<string, string>>(() => ({
  '--prepend-w': get(prependWidth),
  '--append-w': get(appendWidth),
}));

const fieldStyles = computed<{ minHeight: string; maxHeight?: string }>(() => {
  const height = Number(rowHeight);
  const min = Number(minRows);
  const max = Number(maxRows);
  const value: { minHeight: string; maxHeight?: string } = {
    minHeight: `${min * height + 0.75}rem`,
  };
  if (max)
    value.maxHeight = `${max * height + 0.75}rem`;

  return value;
});

function clearIconClicked(): void {
  set(modelValue, '');
  emit('click:clear');
}

function computeFieldHeight(newVal?: string, oldVal?: string): void {
  if (!autoGrow)
    return;

  const field = get(textarea);
  const fieldValue = newVal ?? get(modelValue);
  const fieldSizer = get(textareaSizer);
  if (!(field && fieldSizer))
    return;

  nextTick(() => {
    const sizerHeight = fieldSizer.scrollHeight;
    const fieldHeight = field.scrollHeight;
    let height = `${Math.max(sizerHeight, fieldHeight) / 16}rem`;
    if (oldVal && oldVal.length > fieldValue.length)
      height = `${Math.min(sizerHeight, fieldHeight) / 16}rem`;

    field.style.height = height;
  });
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

watchDebounced(modelValue, computeFieldHeight, { debounce: 50 });

onMounted(computeFieldHeight);

defineExpose({
  focus: () => get(textarea)?.focus(),
  element: textarea,
});
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <RuiFieldLabel
      v-if="label"
      :text="label"
      :for="textareaId"
      :hidden="placement === 'hidden'"
      :required="required"
      :disabled="disabled"
    />
    <div
      :class="ui.wrapper()"
      :style="wrapperStyle"
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
            :size="18"
          />
        </div>
      </div>
      <div :class="ui.inputWrapper()">
        <textarea
          v-if="autoGrow"
          ref="textareaSizer"
          :value="modelValue"
          :class="ui.textareaSizer()"
          :style="fieldStyles"
          aria-hidden="true"
          disabled
          readonly
        />
        <textarea
          :id="textareaId"
          ref="textarea"
          v-model="modelValue"
          :placeholder="placeholder || ' '"
          :class="ui.textarea()"
          :style="fieldStyles"
          :disabled="disabled"
          :readonly="readonly"
          :aria-invalid="hasError"
          v-bind="getNonRootAttrs($attrs)"
        />
        <fieldset :class="ui.fieldset()" />
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
