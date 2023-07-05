<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number;
    color?: ContextColorsType;
  }>(),
  {
    size: 24,
    color: undefined,
  }
);

const css = useCssModule();
const { registeredIcons } = useIcons();

const { name } = toRefs(props);

const path: ComputedRef<string | undefined> = computed(() => {
  const nameVal = get(name);
  const iconName = `ri-${nameVal}`;
  const found = get(registeredIcons)[iconName];

  if (!found) {
    console.error(
      `Icons "${nameVal}" not found. Make sure that you have register the icon when installing the RuiPlugin`
    );
  }
  return found;
});

const iconColor: ComputedRef<string | undefined> = computed(
  () => props.color && css[props.color]
);
</script>

<template>
  <svg
    :class="[css.remixicon, iconColor]"
    :height="size"
    :width="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<style lang="scss" module>
.remixicon {
  &.primary {
    @apply text-rui-primary;
  }

  &.secondary {
    @apply text-rui-secondary;
  }

  &.error {
    @apply text-rui-error;
  }

  &.warning {
    @apply text-rui-warning;
  }

  &.info {
    @apply text-rui-info;
  }

  &.success {
    @apply text-rui-success;
  }
}
</style>
