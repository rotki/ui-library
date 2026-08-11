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
  // the svg is the only root, so a fallthrough class would land beside the
  // variant classes and leave the cascade to break the tie; `ui` merges instead
  inheritAttrs: false,
});

const { name, size, color } = defineProps<Props>();

const { registeredIcons } = useIcons();

type SvgComponent = [tag: string, attrs: Record<string, string>];

const iconStyles = tv({
  // `shrink-0` keeps the icon at its declared `--rui-icon-size` when it sits
  // in a flex container next to a long flex-grow sibling (e.g. a `w-full`
  // button label in `variant="list"`). Without it, the SVG — even with an
  // explicit width — gets compressed along the main axis when the row is
  // narrower than the label's intrinsic width, while the height stays put,
  // producing a sliver glyph. The icon's box is always intentionally driven
  // by `--rui-icon-size`, so flex shrinking is never the desired behavior.
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

// What is registered is the only thing that matters here. An app may register
// its own icons through `createRui({ theme: { icons } })` — brand logos, since
// the library carries none — and those names can never appear in the generated
// `RuiIcons` list, so validating against that list warned for precisely the
// icons the registration API exists to support. A genuinely unknown name is
// still caught below, by the check that decides whether anything renders.
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
