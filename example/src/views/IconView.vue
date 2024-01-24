<script lang="ts" setup>
import { RuiIcon } from '@rotki/ui-library';
import { ref } from 'vue';

const icons = ref([
  { name: 'moon-line', size: 24 },
  { name: 'sun-line', size: 24 },
  { name: 'arrow-right-line', size: 24 },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="icons"
    >
      Icons
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <RuiIcon
        v-for="(icon, i) in icons"
        :key="i"
        v-bind="icon"
      />
    </div>
  </div>
</template>
