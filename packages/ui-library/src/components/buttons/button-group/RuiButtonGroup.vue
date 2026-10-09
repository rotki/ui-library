<script lang="ts" generic="T = undefined" setup>
import type { ButtonSize } from '@/components/buttons/button/button-props';
import type { ContextColorsType } from '@/consts/colors';
import { type ButtonGroupContext, ButtonGroupKey } from '@/components/buttons/button-group/button-group-context';
import { cn, tv } from '@/utils/tv';

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  activeColor?: ContextColorsType;
  /**
   * `segmented` draws the options as `RuiTabs variant="segmented"` does: a neutral track whose active
   * option is a raised surface. It is neutral, so it ignores `color` and `activeColor`.
   */
  variant?: 'default' | 'outlined' | 'text' | 'segmented';
  size?: ButtonSize;
  gap?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

defineOptions({
  name: 'RuiButtonGroup',
  inheritAttrs: false,
});

const modelValue = defineModel<T | T[]>();

const {
  vertical = false,
  color,
  activeColor,
  variant = 'default',
  size,
  gap,
  required = false,
  disabled = false,
} = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();

const buttonGroupStyles = tv({
  slots: {
    /*
     * `w-fit`: a flex column stretches its children, inline-flex or not, which drew an outlined
     * group's frame across the whole row. A consumer's own width still wins through the class merge.
     * Between filled buttons a separator only needs to part the fills, so it takes the light divider.
     */
    root: 'inline-flex w-fit max-w-full rounded-rui-control between:border-l between:border-r-0 between:border-rui-divider outline-solid outline-1 outline-transparent -outline-offset-1',
    button: 'border-0 inset-ring-0 focus:z-1',
  },
  variants: {
    vertical: {
      true: {
        root: 'flex-col items-start between:border-l-0 between:border-t between:border-b-0 *:w-full',
        button: 'w-full',
      },
      false: {},
    },
    gap: {
      none: {
        button: 'rounded-none!',
      },
      sm: {
        root: 'between:border-0 outline-0 gap-2',
        button: 'inset-ring',
      },
      md: {
        root: 'between:border-0 outline-0 gap-4',
        button: 'inset-ring',
      },
      lg: {
        root: 'between:border-0 outline-0 gap-6',
        button: 'inset-ring',
      },
    },
    variant: {
      default: {},
      outlined: {
        // the control edge, matching RuiButton's colourless outlined treatment
        root: 'outline-rui-outline between:border-rui-outline',
      },
      text: {},
      // the segmented tabs' track and pill; the 32px options make a 36px control, a field's height
      segmented: {
        root: 'rounded-rui-panel bg-rui-neutral-200 p-0.5 gap-0.5 outline-0 between:border-0 dark:bg-rui-neutral-800',
        button: [
          'h-8 px-3 text-rui-text-secondary transition-colors hover:text-rui-text focus-visible:-outline-offset-2',
          'data-[active]:bg-rui-surface data-[active]:text-rui-text data-[active]:shadow-rui-control dark:data-[active]:bg-rui-neutral-700',
        ].join(' '),
      },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    /*
     * The outer corners go to the button that is, or sits inside, the group's first or last item, so a
     * button wrapped in a tooltip or a menu activator rounds like a direct child.
     */
    { gap: 'none', vertical: false, class: { button: '[&:is([data-button-group]>:first-child,[data-button-group]>:first-child_*)]:rounded-l-rui-control! [&:is([data-button-group]>:last-child,[data-button-group]>:last-child_*)]:rounded-r-rui-control!' } },
    { gap: 'none', vertical: true, class: { button: '[&:is([data-button-group]>:first-child,[data-button-group]>:first-child_*)]:rounded-t-rui-control! [&:is([data-button-group]>:last-child,[data-button-group]>:last-child_*)]:rounded-b-rui-control!' } },
    // each segment is its own rounded pill inside the track, not a slice of one joined bar
    { variant: 'segmented', class: { button: 'rounded-rui-control!' } },

    // Color dividers for outlined/text (overrides darker dividers above)
    { color: 'primary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-primary/50' } },
    { color: 'secondary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-secondary/50' } },
    { color: 'error', variant: ['outlined', 'text'], class: { root: 'between:border-rui-error/50' } },
    { color: 'warning', variant: ['outlined', 'text'], class: { root: 'between:border-rui-warning/50' } },
    { color: 'info', variant: ['outlined', 'text'], class: { root: 'between:border-rui-info/50' } },
    { color: 'success', variant: ['outlined', 'text'], class: { root: 'between:border-rui-success/50' } },

    // Color outline for outlined variant
    { color: 'primary', variant: 'outlined', class: { root: 'outline-rui-primary/50' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'outline-rui-secondary/50' } },
    { color: 'error', variant: 'outlined', class: { root: 'outline-rui-error/50' } },
    { color: 'warning', variant: 'outlined', class: { root: 'outline-rui-warning/50' } },
    { color: 'info', variant: 'outlined', class: { root: 'outline-rui-info/50' } },
    { color: 'success', variant: 'outlined', class: { root: 'outline-rui-success/50' } },
  ],
  defaultVariants: {
    vertical: false,
    gap: 'none',
    variant: 'default',
  },
});

const ui = computed<ReturnType<typeof buttonGroupStyles>>(() => buttonGroupStyles({
  vertical,
  gap: gap ?? 'none',
  variant,
  color,
}));

/**
 * The color a button takes: the pressed one's `activeColor` when set, otherwise the group's. The
 * segmented variant is neutral, like the segmented tabs, so its buttons take none.
 *
 * @param active - whether the button is the pressed one
 * @returns the color to set, or undefined to leave the button grey
 */
function buttonColor(active: boolean): ContextColorsType | undefined {
  if (variant === 'segmented')
    return undefined;
  return active && activeColor ? activeColor : color;
}

function isActive(id: T, selected?: T | T[]): boolean {
  if (Array.isArray(selected))
    return selected.includes(id);

  return selected === id;
}

function onClick(id: T): void {
  const selected = get(modelValue);

  if (Array.isArray(selected)) {
    const index = selected.indexOf(id);
    if (index >= 0) {
      if (required && selected.length === 1)
        return;

      set(modelValue, selected.filter((_, i) => i !== index));
    }
    else {
      set(modelValue, [...selected, id]);
    }
  }
  else if (required) {
    set(modelValue, id);
  }
  else {
    set(modelValue, isActive(id, selected) ? undefined : id);
  }
}

// a button that sets its own size keeps it; the rest take the group's
provide(ButtonGroupKey, {
  variant: () => variant === 'segmented' ? 'text' : variant,
  size: () => size,
  disabled: () => disabled,
  color: buttonColor,
  itemClass: () => get(ui).button(),
  isActive: (value: T) => isActive(value, get(modelValue)),
  toggle: onClick,
} satisfies ButtonGroupContext<T>);
</script>

<template>
  <div
    :class="ui.root({ class: cn($attrs.class) })"
    data-button-group
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot />
  </div>
</template>
