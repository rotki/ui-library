<script lang="ts" setup>
import type { ClassValue } from 'vue';
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import { objectOmit } from '@vueuse/shared';
import { useIcons } from '@/composables/icons';
import { cn, tv } from '@/utils/tv';

export interface Props {
  name: RuiIcons;
  size?: number | string;
  color?: ContextColorsType;
}

defineOptions({
  name: 'RuiIcon',
  // A fallthrough class would land beside the variant classes and leave the cascade to break the tie; `ui` merges instead
  inheritAttrs: false,
});

const { name, size, color } = defineProps<Props>();

const { registeredIcons } = useIcons();

type SvgComponent = [tag: string, attrs: Record<string, string>];

/**
 * The icon's box is always driven by `--rui-icon-size`, so flex shrinking is
 * never wanted: `shrink-0` keeps the size beside a long flex-grow sibling,
 * such as a `w-full` button label in `variant="list"`. Without it the svg is
 * compressed along the main axis while its height stays put, drawing a sliver
 * of a glyph.
 */
const iconStyles = tv({
  base: 'shrink-0 w-[var(--rui-icon-size,1.5rem)] h-[var(--rui-icon-size,1.5rem)]',
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

function ui(attrsClass: ClassValue): string {
  return iconStyles({ color, class: cn(attrsClass) });
}

/**
 * The `size` prop as an inline CSS custom property on the svg. Inline style
 * beats any inherited value for the same property on this element, so a
 * consumer's size beats the button's `--rui-icon-size` without !important.
 *
 * A bare number is coerced to px, including the numeric string a template
 * binding like `:size="16"` resolves to, while a value that already carries a
 * unit passes through. CSS needs that coercion; the `width`/`height`
 * presentation attributes this replaced treated bare numbers as px themselves.
 */
const sizeStyle = computed<Record<string, string> | undefined>(() => {
  if (!get(hasExplicitSize))
    return undefined;
  const raw = String(size);
  const value = /^\d+(?:\.\d+)?$/.test(raw) ? `${raw}px` : raw;
  return { '--rui-icon-size': value };
});

const isFill = computed<boolean>(() => name.endsWith('-fill'));

/**
 * What is registered is the only thing that matters here. An app may register
 * its own icons through `createRui(\{ theme: \{ icons \} \})`, brand logos
 * among them since the library carries none, and those names never appear in
 * the generated `RuiIcons` list. Validating against that list warned for
 * precisely the icons the registration API exists to support. A genuinely
 * unknown name is still caught by the check that decides whether anything
 * renders.
 */
const components = computed<SvgComponent[] | undefined>(() => {
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
    :class="ui($attrs.class)"
    :style="sizeStyle"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="objectOmit($attrs, ['class'])"
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
