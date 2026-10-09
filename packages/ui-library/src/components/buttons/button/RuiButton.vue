<script lang="ts" generic="T = undefined" setup>
import type { ContextColorsType } from '@/consts/colors';
import { ButtonGroupKey } from '@/components/buttons/button-group/button-group-context';
import { type ButtonSize, ButtonVariant, getButtonSpinnerSize } from '@/components/buttons/button/button-props';
import { buttonStyles } from '@/components/buttons/button/button-styles';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { cn } from '@/utils/tv';

export interface Props<T = undefined> {
  disabled?: boolean;
  loading?: boolean;
  color?: ContextColorsType;
  rounded?: boolean;
  variant?: ButtonVariant;
  icon?: boolean;
  active?: boolean;
  size?: ButtonSize;
  tag?: 'button' | 'a';
  type?: 'button' | 'submit';
  modelValue?: T;
  hideFocusIndicator?: boolean;
}

defineOptions({
  name: 'RuiButton',
  inheritAttrs: false,
});

const {
  disabled = false,
  loading = false,
  color = undefined,
  rounded = false,
  variant = ButtonVariant.default,
  icon = false,
  active = false,
  size = undefined,
  tag = 'button',
  type = 'button',
  modelValue = undefined,
  hideFocusIndicator = false,
} = defineProps<Props<T>>();

const emit = defineEmits<{
  'update:model-value': [value?: T];
}>();

const slots = defineSlots<{
  prepend?: () => any;
  append?: () => any;
  default?: () => any;
}>();

// a RuiButtonGroup anywhere above, unless an overlay's content sits in between
const group = inject(ButtonGroupKey, undefined);

const btnValue = computed<T | undefined>(() => modelValue);

const resolvedVariant = computed<ButtonVariant>(() => group?.variant() ?? variant);

const resolvedSize = computed<ButtonSize | undefined>(() => size ?? group?.size());

const resolvedDisabled = computed<boolean>(() => disabled || (group?.disabled() ?? false));

// a grouped button is pressed when the group's model holds its value; it needs one to take part
const resolvedActive = computed<boolean>(() => active || (!!group && modelValue !== undefined && group.isActive(modelValue)));

const resolvedColor = computed<ContextColorsType | undefined>(() => group?.color(get(resolvedActive)) ?? color);

const spinnerSize = computed<number>(() => getButtonSpinnerSize(get(resolvedSize)));

const ui = computed<ReturnType<typeof buttonStyles>>(() => buttonStyles({
  variant: get(resolvedVariant),
  color: get(resolvedColor) ?? 'grey',
  size: get(resolvedSize),
  rounded,
  icon,
  active: get(resolvedActive),
  loading,
  hideFocusIndicator,
}));

function onClick(): void {
  emit('update:model-value', get(btnValue));
  if (group && modelValue !== undefined)
    group.toggle(modelValue);
}
</script>

<template>
  <Component
    :is="tag"
    :class="ui.root({ class: cn([group?.itemClass(), $attrs.class]) })"
    :disabled="resolvedDisabled || loading"
    :type="tag === 'button' ? type : undefined"
    :data-variant="resolvedVariant"
    :data-size="resolvedSize ?? 'md'"
    :data-color="resolvedColor"
    :data-active="resolvedActive || undefined"
    :aria-busy="loading || undefined"
    v-bind="{ ...$attrs, class: undefined }"
    @click="onClick()"
  >
    <slot name="prepend" />
    <span
      v-if="slots.default"
      :class="ui.label()"
      data-id="btn-label"
    >
      <slot />
    </span>
    <slot name="append" />
    <!-- the button's aria-busy announces the wait, so the spinner stays out of the accessibility tree -->
    <RuiProgress
      v-if="loading"
      circular
      data-spinner
      aria-hidden="true"
      :class="ui.spinner()"
      variant="indeterminate"
      thickness="2"
      :size="spinnerSize"
    />
  </Component>
</template>
