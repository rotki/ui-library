<script lang="ts" setup>
import { logicAnd, logicNot } from '@vueuse/math';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';

export interface TextFieldProps {
  label?: string;
  labelPosition?: 'floating' | 'outside';
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  color?: ContextColorsType;
  textColor?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  as?: string | object;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
}

defineOptions({
  name: 'RuiTextField',
  inheritAttrs: false,
});

const modelValue = defineModel<string>({ required: true });

const props = withDefaults(defineProps<TextFieldProps>(), {
  label: '',
  labelPosition: 'floating',
  placeholder: '',
  disabled: false,
  variant: 'default',
  color: undefined,
  textColor: undefined,
  dense: false,
  hint: '',
  as: 'input',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  prependIcon: undefined,
  appendIcon: undefined,
  readonly: false,
  clearable: false,
});

const emit = defineEmits<{
  (e: 'focus-input', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'remove', value: unknown): void;
  (e: 'clear'): void;
}>();

const {
  label,
  labelPosition,
  clearable,
  disabled,
  readonly,
  errorMessages,
  successMessages,
} = toRefs(props);

function input(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  set(modelValue, value);
}

const prepend = ref<HTMLDivElement>();
const append = ref<HTMLDivElement>();
const innerWrapper = ref<HTMLDivElement>();
const inputRef = ref();

const prependWidth = ref('0px');
const appendWidth = ref('0px');

const { width } = useElementBounding(innerWrapper);

useResizeObserver(prepend, (entries) => {
  const [entry] = entries;
  const { width, left } = entry.contentRect;
  set(prependWidth, `${width + left}px`);
});

useResizeObserver(append, (entries) => {
  const [entry] = entries;
  const { width, right } = entry.contentRect;
  set(appendWidth, `${width + right}px`);
});

const { hasError, hasSuccess, hasMessages } = useFormTextDetail(
  errorMessages,
  successMessages,
);

const { focused } = useFocus(inputRef);
const focusedDebounced = refDebounced(focused, 500);

const showClearIcon = logicAnd(
  clearable,
  modelValue,
  logicNot(disabled),
  logicNot(readonly),
);

function clearIconClicked() {
  set(modelValue, '');
  emit('clear');
}
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      v-if="label && labelPosition === 'outside'"
      :class="$style.outsideLabel"
    >
      {{ label }}
    </label>
    <div
      :class="[
        $style.wrapper,
        $style[color ?? ''],
        $style[variant ?? ''],
        {
          [$style.dense]: dense,
          [$style.disabled]: disabled,
          [$style['no-label']]: !label,
          [$style['with-error']]: hasError,
          [$style['with-success']]: hasSuccess && !hasError,
          [$style[`text_${textColor}`]]: textColor && !hasMessages,
          [$style['label-outside']]: labelPosition === 'outside',
        },
      ]"
    >
      <div
        v-if="$slots.prepend || prependIcon"
        ref="prepend"
        class="flex items-center gap-1 shrink-0"
        :class="$style.prepend"
      >
        <slot
          v-if="$slots.prepend"
          name="prepend"
        />
        <div
          v-else-if="prependIcon"
          :class="[$style.icon]"
        >
          <RuiIcon :name="prependIcon" />
        </div>
      </div>
      <div
        ref="innerWrapper"
        class="flex flex-1 overflow-hidden"
        @click="emit('focus-input', $event)"
      >
        <Component
          :is="as"
          ref="inputRef"
          :value="modelValue"
          :placeholder="placeholder || ' '"
          :class="$style.input"
          :disabled="disabled"
          :dense="dense"
          :variant="variant"
          :readonly="readonly"
          :wrapper-width="width"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
          @blur="emit('blur', $event)"
          @remove="emit('remove', $event)"
        />
        <label
          v-if="label && labelPosition === 'floating'"
          :class="$style.label"
        >
          <span>
            {{ label }}
          </span>
        </label>
        <fieldset
          v-if="variant === 'outlined'"
          :class="$style.fieldset"
        >
          <legend :class="{ [$style.show]: label }" />
        </fieldset>
      </div>
      <div
        v-if="$slots.append || appendIcon || showClearIcon"
        ref="append"
        class="flex items-center gap-1 shrink-0"
        :class="$style.append"
      >
        <RuiButton
          v-if="showClearIcon"
          :class="{ hidden: !focusedDebounced }"
          variant="text"
          type="button"
          icon
          class="!p-2 clear-btn"
          color="error"
          tabindex="-1"
          @click.stop="clearIconClicked()"
        >
          <RuiIcon
            name="close-line"
            size="20"
          />
        </RuiButton>
        <slot
          v-if="$slots.append"
          name="append"
        />
        <div
          v-else-if="appendIcon"
          :class="[$style.icon]"
        >
          <RuiIcon :name="appendIcon" />
        </div>
      </div>
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :class="[$style.details, { [$style.detailsOutside]: labelPosition === 'outside' }]"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@import './RuiTextField.styles.scss';
</style>
