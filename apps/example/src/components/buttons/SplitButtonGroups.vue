<script setup lang='ts'>
import { RuiButton, RuiButtonGroup, RuiIcon, RuiMenu, RuiTooltip } from '@rotki/ui-library';

const variants = ['default', 'outlined'] as const;

const refreshed = ref<number>(0);
</script>

<template>
  <h4
    class="text-h4 mb-6 mt-14"
    data-id="split-button-groups"
  >
    Split Buttons
  </h4>
  <div class="mb-14">
    <div class="flex flex-wrap items-center gap-6">
      <RuiButtonGroup
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        color="primary"
        :data-id="`split-button-${variant}`"
      >
        <RuiTooltip :open-delay="400">
          <template #activator>
            <RuiButton
              data-id="split-button-action"
              @click="refreshed++"
            >
              Refresh
            </RuiButton>
          </template>
          Refresh all balances
        </RuiTooltip>
        <RuiMenu>
          <template #activator="{ attrs }">
            <RuiButton
              icon
              aria-label="More refresh options"
              data-id="split-button-menu"
              v-bind="attrs"
            >
              <RuiIcon name="lu-chevron-down" />
            </RuiButton>
          </template>
          <div class="py-1">
            <RuiButton
              variant="list"
              data-id="split-button-option"
            >
              Refresh prices
            </RuiButton>
          </div>
        </RuiMenu>
      </RuiButtonGroup>
      <span>Refreshed: {{ refreshed }}</span>
    </div>
  </div>
</template>
