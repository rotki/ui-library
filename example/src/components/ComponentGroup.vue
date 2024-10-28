<script setup lang="ts" generic='T'>
import { objectOmit, objectPick } from '@vueuse/shared';

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  items: T[];
}>();
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
    >
      <slot
        name="item"
        :index="i"
        :item="item"
      />
    </div>
  </div>
</template>
