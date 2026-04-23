<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { useIcons } from '@/composables/icons';
import { isRuiIcon, type RuiIcons } from '@/icons';
import { tv } from '@/utils/tv';

export interface Props {
  name: RuiIcons;
  size?: number | string;
  color?: ContextColorsType;
}

defineOptions({
  name: 'RuiIcon',
});

const { name, size, color } = defineProps<Props>();

const { registeredIcons } = useIcons();

type SvgComponent = [tag: string, attrs: Record<string, string>];

const iconStyles = tv({
  base: 'w-[var(--rui-icon-size,1.5rem)] h-[var(--rui-icon-size,1.5rem)]',
  variants: {
    color: {
      primary: 'text-rui-primary',
      secondary: 'text-rui-secondary',
      error: 'text-rui-error',
      warning: 'text-rui-warning',
      info: 'text-rui-info',
      success: 'text-rui-success',
    },
  },
});

const hasExplicitSize = computed<boolean>(() => size !== undefined);
const ui = computed<string>(() => iconStyles({ color }));

// Render the `size` prop as an inline CSS custom property on the svg. Because
// inline style wins against any inherited value for the same property on this
// element, the consumer-supplied size beats the button's `--rui-icon-size`
// assignment without needing !important. A bare number (or numeric string —
// `:size="16"` resolves to a string in the template binding) is coerced to px;
// values that already include a unit (`1rem`, `18px`, `calc(...)`) pass
// through unchanged. The previous SVG-attr path accepted bare numbers because
// `width`/`height` presentation attrs treat them as px; CSS does not.
const sizeStyle = computed<Record<string, string> | undefined>(() => {
  if (!get(hasExplicitSize))
    return undefined;
  const raw = String(size);
  const value = /^\d+(?:\.\d+)?$/.test(raw) ? `${raw}px` : raw;
  return { '--rui-icon-size': value };
});

const isFill = computed<boolean>(() => name.endsWith('-fill'));

const components = computed<SvgComponent[] | undefined>(() => {
  if (!isRuiIcon(name)) {
    console.warn(`icon ${name} must be a valid RuiIcon`);
  }
  const found = registeredIcons[name];

  if (!found) {
    console.error(
      `Icons "${name}" not found. Make sure that you have register the icon when installing the RuiPlugin`,
    );
  }
  return found;
});
</script>

<template>
  <svg
    aria-hidden="true"
    class="rui-icon"
    :class="ui"
    :style="sizeStyle"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <component
      :is="component[0]"
      v-for="(component, index) in components"
      :key="index"
      v-bind="component[1]"
      :fill="!isFill ? 'none' : 'currentColor'"
      :stroke="!isFill ? 'currentColor' : 'none'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>
