<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { useIcons } from '@/composables/icons';
import { isRuiIcon, type RuiIcons } from '@/icons';

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

const isFill = computed(() => props.name.endsWith('-fill'));

const components: ComputedRef<[string, Record<string, string>][] | undefined> = computed(() => {
  const name = props.name;
  if (!isRuiIcon(name)) {
    console.warn(`icon ${name} must be a valid RuiIcon`);
  }
  const found = registeredIcons[name];

  if (!found) {
    console.error(`Icons "${name}" not found. Make sure that you have register the icon when installing the RuiPlugin`);
  }
  return found;
});
</script>

<template>
  <svg
    :class="[$style['rui-icon'], $style[color ?? '']]"
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
      :fill="(!isFill) ? 'none' : 'currentColor'"
      :stroke="(!isFill) ? 'currentColor' : 'none'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.rui-icon {
  @each $color in c.$context-colors {
    &.#{$color} {
      @apply text-rui-#{$color};
    }
  }
}
</style>
