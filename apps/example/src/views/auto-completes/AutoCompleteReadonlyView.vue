<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';
import { ref } from 'vue';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const readonlyDefault = ref<string | undefined>('Lorem');
const readonlyOutlined = ref<string | undefined>('Lorem');
const readonlyMulti = ref<string[]>(['Lorem', 'Ipsum']);
</script>

<template>
  <div data-cy="auto-completes-readonly">
    <h2 class="text-2xl font-bold mb-6">
      Read-only
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="readonlyDefault"
          read-only
          :options="primitiveOptions"
          label="Read-only Default"
          data-cy="ac-readonly-default"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="readonlyOutlined"
          read-only
          variant="outlined"
          :options="primitiveOptions"
          label="Read-only Outlined"
          data-cy="ac-readonly-outlined"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="readonlyMulti"
          read-only
          chips
          :options="primitiveOptions"
          label="Read-only Multi"
          data-cy="ac-readonly-multi"
        />
      </div>
    </div>
  </div>
</template>
