<script lang="ts" setup>
import { RuiLogo } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';
</script>

<template>
  <ComponentView data-cy="logos">
    <template #title>
      Logos
    </template>

    <div class="flex flex-col gap-6">
      <div>
        <h3 class="text-subtitle-1 mb-2">
          Default (Fallback)
        </h3>
        <div data-cy="logo-default">
          <RuiLogo />
        </div>
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          With Text
        </h3>
        <div data-cy="logo-text">
          <RuiLogo text />
        </div>
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Custom Size (5rem)
        </h3>
        <div data-cy="logo-size">
          <RuiLogo :size="5" />
        </div>
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Small Size (1.5rem)
        </h3>
        <div data-cy="logo-small">
          <RuiLogo :size="1.5" />
        </div>
      </div>
    </div>
  </ComponentView>
</template>
