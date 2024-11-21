<script lang="ts" setup>
import { type RuiIcons, isRuiIcon } from '@/icons';
import type { ContextColorsType } from '@/consts/colors';

export interface Props {
  name: RuiIcons;
  size?: number | string;
  color?: ContextColorsType;
}

defineOptions({
  name: 'RuiIcon',
});

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: undefined,
});

const { registeredIcons } = useIcons();

const isLucide = computed(() => props.name.startsWith('lu-'));

const components: ComputedRef<[string, Record<string, string>][] | undefined> = computed(() => {
  const name = props.name;
  if (!isRuiIcon(name)) {
    console.warn(`icon ${name} must be a valid RuiIcon`);
  }
  const prefix = get(isLucide) ? '' : 'ri-';
  const iconName = `${prefix}${name}`;
  const found = registeredIcons[iconName];

  if (!found) {
    console.error(`Icons "${name}" not found. Make sure that you have register the icon when installing the RuiPlugin`);
  }
  return found;
});
</script>

<template>
  <svg
    :class="[$style.remixicon, $style[color ?? '']]"
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
      :fill="isLucide ? 'none' : 'currentColor'"
      :stroke="isLucide ? 'currentColor' : 'none'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.remixicon {
  @each $color in c.$context-colors {
    &.#{$color} {
      @apply text-rui-#{$color};
    }
  }
}
</style>
