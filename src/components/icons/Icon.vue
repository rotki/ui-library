<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    size?: number;
  }>(),
  {
    size: 24,
  }
);

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
</script>

<template>
  <svg
    class="remixicon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
  >
    <path fill="currentColor" :d="path" />
  </svg>
</template>
