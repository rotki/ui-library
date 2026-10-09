<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const readonlyDefault = ref<string>('Lorem');
const readonlyMulti = ref<string[]>(['Lorem', 'Ipsum']);
</script>

<template>
  <div data-id="auto-completes-readonly">
    <h2 class="text-2xl font-bold mb-6">
      Read-only
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="readonlyDefault"
          read-only
          :options="primitiveOptions"
          label="Read-only"
          data-id="ac-readonly-default"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="readonlyMulti"
          read-only
          chips
          :options="primitiveOptions"
          label="Read-only Multi"
          data-id="ac-readonly-multi"
        />
      </div>
    </div>
  </div>
</template>
