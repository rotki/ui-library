<script lang="ts" setup>
import { RuiMenuSelect } from '@rotki/ui-library';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const readonlyDefault = ref<string>('Lorem');
const readonlyOutlined = ref<string>('Lorem');
</script>

<template>
  <div data-cy="menu-selects-readonly">
    <h2 class="text-2xl font-bold mb-6">
      Menu Selects: Read-only
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="flex flex-col space-y-2">
        <h4>Read-only Default</h4>
        <RuiMenuSelect
          v-model="readonlyDefault"
          :options="primitiveOptions"
          read-only
          data-cy="ms-readonly-default"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Read-only Outlined</h4>
        <RuiMenuSelect
          v-model="readonlyOutlined"
          :options="primitiveOptions"
          read-only
          variant="outlined"
          data-cy="ms-readonly-outlined"
        />
      </div>
    </div>
  </div>
</template>
