<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '~/src';

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

const css = useCssModule();
const { registeredIcons } = useIcons();

const { name } = toRefs(props);

const path: ComputedRef<string | undefined> = computed(() => {
  const nameVal = get(name);
  const iconName = `ri-${nameVal}`;
  const found = get(registeredIcons)[iconName];

  if (!found) {
    console.error(
      `Icons "${nameVal}" not found. Make sure that you have register the icon when installing the RuiPlugin`,
    );
  }
  return found;
});
</script>

<template>
  <svg
    :class="[css.remixicon, css[color ?? '']]"
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
