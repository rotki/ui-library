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

const { name, size = 24, color } = defineProps<Props>();

const { registeredIcons } = useIcons();

type SvgComponent = [tag: string, attrs: Record<string, string>];

const iconStyles = tv({
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

const ui = computed<string>(() => iconStyles({ color }));

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
    :class="ui"
    :height="size"
    :width="size"
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
