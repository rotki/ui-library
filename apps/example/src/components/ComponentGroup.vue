<script setup lang="ts" generic='T'>
import { objectOmit, objectPick } from '@vueuse/shared';

type StaticClassProps = string | Record<string, boolean>;

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  items: T[];
  itemClass?: StaticClassProps | StaticClassProps[];
  getItemClass?: (item: T, index: number) => StaticClassProps;
  getItemDataCy?: (item: T, index: number) => string;
}>();

function getItemClass(item: T, index: number): StaticClassProps | StaticClassProps[] | undefined {
  const dynamicClass = props.getItemClass?.(item, index);
  const staticClass = props.itemClass;

  if (!dynamicClass) {
    return staticClass;
  }

  if (Array.isArray(staticClass)) {
    return [...staticClass, dynamicClass];
  }

  return staticClass ? [staticClass, dynamicClass] : dynamicClass;
}
</script>

<template>
  <h4
    v-if="$slots.title"
    class="text-h4 mb-6 mt-14"
    v-bind="objectPick($attrs, ['data-cy'])"
  >
    <slot name="title" />
  </h4>
  <div v-bind="objectOmit($attrs, ['data-cy'])">
    <div
      v-for="(item, i) in items"
      :key="i"
      :class="getItemClass(item, i)"
      :data-cy="getItemDataCy?.(item, i)"
    >
      <slot
        name="item"
        :index="i"
        :item="item"
      />
    </div>
  </div>
</template>
