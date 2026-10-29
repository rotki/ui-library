<script lang="ts" setup>
import type { StyleValue } from 'vue';
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import type { VueClassValue } from '@/types/class-value';
import { objectOmit } from '@vueuse/shared';
import { CHIP_CLOSE_ICON_SIZES, ChipSize, ChipVariant } from '@/components/chips/chip-props';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { cn } from '@/utils/tv';
import { chipStyles } from './chip-styles';

export interface RuiChipClassNames {
  root?: VueClassValue;
  content?: VueClassValue;
}

export interface Props {
  tile?: boolean;
  clickable?: boolean;
  closeable?: boolean;
  disabled?: boolean;
  size?: ChipSize;
  variant?: ChipVariant;
  color?: 'grey' | ContextColorsType;
  closeIcon?: RuiIcons;
  /**
   * Takes the close button out of the tab order, for a chip inside a widget that removes chips from
   * the keyboard itself, as RuiAutoComplete does with Backspace. The button still takes clicks.
   */
  closeUnfocusable?: boolean;
  bgColor?: string;
  textColor?: string;
  classNames?: RuiChipClassNames;
}

defineOptions({
  name: 'RuiChip',
  inheritAttrs: false,
});

const {
  tile = false,
  size = ChipSize.md,
  color = 'grey',
  clickable = false,
  closeable = false,
  disabled = false,
  variant = ChipVariant.filled,
  closeIcon = 'lu-x',
  closeUnfocusable = false,
  bgColor = undefined,
  textColor = undefined,
  classNames,
} = defineProps<Props>();

const emit = defineEmits<{
  'click:close': [];
  'click': [e: MouseEvent];
}>();

const slots = defineSlots<{
  prepend?: () => any;
  default?: () => any;
}>();

const root = useTemplateRef<HTMLDivElement>('root');

const ui = computed<ReturnType<typeof chipStyles>>(() => chipStyles({
  tile,
  size,
  color,
  variant,
  disabled,
  clickable,
  prepended: !!slots.prepend,
  closeable,
}));

const style = computed<Partial<StyleValue>>(() => {
  const s: Partial<StyleValue> = {};
  if (bgColor)
    s.backgroundColor = bgColor;
  if (textColor)
    s.color = textColor;
  return s;
});

function click(e: MouseEvent): void {
  if (!clickable || disabled)
    return;

  emit('click', e);
}

/**
 * Enter and Space activate a clickable chip as they would a button, through a
 * real click so the handler still gets a `MouseEvent`.
 *
 * @param e - the key press on the chip
 */
function onKeydown(e: KeyboardEvent): void {
  if (!clickable || disabled || e.target !== get(root))
    return;
  if (e.key !== 'Enter' && e.key !== ' ')
    return;

  e.preventDefault();
  get(root)?.click();
}
</script>

<template>
  <div
    ref="root"
    :class="ui.root({ class: cn(classNames?.root) })"
    :style="style"
    :data-variant="variant"
    :data-color="color"
    :data-disabled="disabled || undefined"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : undefined"
    :aria-disabled="clickable && disabled ? true : undefined"
    v-bind="objectOmit($attrs, ['onClick'])"
    @click="click($event)"
    @keydown="onKeydown($event)"
  >
    <div
      v-if="$slots.prepend"
      :class="ui.prepend()"
    >
      <slot name="prepend" />
    </div>
    <span :class="ui.label({ class: cn(classNames?.content) })">
      <slot />
    </span>
    <button
      v-if="closeable"
      :class="ui.close()"
      :disabled="disabled"
      type="button"
      aria-label="Remove"
      :tabindex="closeUnfocusable ? -1 : undefined"
      @click.stop="emit('click:close')"
    >
      <RuiIcon
        :class="ui.closeIcon()"
        :size="CHIP_CLOSE_ICON_SIZES[size]"
        :name="closeIcon"
      />
    </button>
  </div>
</template>
