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

const path: ComputedRef<string | undefined> = computed(() => {
  const name = props.name;
  if (!isRuiIcon(name)) {
    console.warn(`icon ${name} must be a valid RuiIcon`);
  }
  const iconName = `ri-${name}`;
  const found = get(registeredIcons)[iconName];

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
    <path
      :d="path"
      fill="currentColor"
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
