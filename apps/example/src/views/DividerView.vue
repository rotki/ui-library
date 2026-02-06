<script lang="ts" setup>
import { RuiDivider } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';
</script>

<template>
  <ComponentView data-cy="dividers">
    <template #title>
      Dividers
    </template>

    <div class="flex flex-col gap-6">
      <div>
        <h3 class="text-subtitle-1 mb-2">
          Horizontal (Default)
        </h3>
        <div
          class="p-4 border rounded"
          data-cy="divider-horizontal"
        >
          <p>Content above</p>
          <RuiDivider class="my-4" />
          <p>Content below</p>
        </div>
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Vertical
        </h3>
        <div
          class="flex items-center gap-4 p-4 border rounded h-20"
          data-cy="divider-vertical"
        >
          <span>Left</span>
          <RuiDivider
            vertical
            class="h-full"
          />
          <span>Right</span>
        </div>
      </div>
    </div>
  </ComponentView>
</template>
