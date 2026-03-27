<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { textAreaStyles, type TextAreaVariant } from '@/components/forms/text-area/text-area-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { usePrependAppendWidth } from '@/composables/forms/use-prepend-append-width';
import { useTimeoutManager } from '@/composables/timeout-manager';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: TextAreaVariant;
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

const { focused } = useFocus(textarea);
const { create: delayClearHide } = useTimeoutManager();
const { prependWidth, appendWidth } = usePrependAppendWidth(prepend, append, 24);
const { hasError, hasSuccess, hasMessages, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const active = computed<boolean>(() => get(focused) || !!get(modelValue));

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
  variant,
  dense,
  disabled,
  noResize,
  hovered: get(isHovered),
  focused: get(focused),
  active: get(active),
  noLabel: !label,
  color: get(effectiveColor),
  textColor: get(effectiveTextColor),
  validation: get(validation),
  showLabel: !!label,
}));

const wrapperStyle = computed<Record<string, string>>(() => ({
  '--prepend-w': get(prependWidth),
  '--append-w': get(appendWidth),
}));

const legendText = computed<string>(() => {
  if (!get(active) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

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
          <RuiIcon :name="prependIcon" />
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
        <label :class="ui.label()">
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
          v-if="variant === 'outlined'"
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
          <RuiIcon :name="appendIcon" />
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
