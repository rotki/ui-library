<script setup lang="ts" generic='T'>
import { objectOmit, objectPick } from '@vueuse/shared';

type StaticClassProps = string | Record<string, boolean>;

defineOptions({
  inheritAttrs: false,
});

const { items, itemClass, getItemClass: getItemClassFn, itemDataId } = defineProps<{
  items: T[];
  itemClass?: StaticClassProps | StaticClassProps[];
  getItemClass?: (item: T, index: number) => StaticClassProps;
  /** The `data-id` of every item, which also gets its index as `data-index` */
  itemDataId?: string;
}>();

defineSlots<{
  title?: () => any;
  item?: (props: { item: T; index: number }) => any;
}>();

function getItemClass(item: T, index: number): StaticClassProps | StaticClassProps[] | undefined {
  const dynamicClass = getItemClassFn?.(item, index);
  const staticClass = itemClass;

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
    v-bind="objectPick($attrs, ['data-id'])"
  >
    <slot name="title" />
  </h4>
  <div v-bind="objectOmit($attrs, ['data-id'])">
    <div
      v-for="(item, i) in items"
      :key="i"
      :class="getItemClass(item, i)"
      :data-id="itemDataId"
      :data-index="itemDataId ? i : undefined"
    >
      <slot
        name="item"
        :index="i"
        :item="item"
      />
    </div>
  </div>
</template>
