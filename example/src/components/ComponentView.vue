<script setup lang='ts'>
import { objectOmit, objectPick } from '@vueuse/shared';

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div v-bind="objectOmit($attrs, ['data-cy'])">
    <h2
      class="text-h4 mb-6"
      v-bind="objectPick($attrs, ['data-cy'])"
    >
      <slot name="title" />
    </h2>
    <slot />
  </div>
</template>
