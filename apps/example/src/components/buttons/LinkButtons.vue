<script lang="ts" setup>
import { contextColors, RuiButton, RuiIcon } from '@rotki/ui-library';

const textSizes = ['text-caption', 'text-sm', 'text-body-1', 'text-h6'] as const;
</script>

<template>
  <div class="mb-14">
    <h3 class="text-h6 mb-3">
      Link variant
    </h3>
    <div class="flex flex-col gap-3 text-rui-text">
      <p
        v-for="textSize in textSizes"
        :key="textSize"
        :class="textSize"
        :data-id="`link-text-${textSize}`"
      >
        Balances are out of date.
        <RuiButton
          variant="link"
          color="primary"
          :data-id="`link-button-${textSize}`"
        >
          Refresh now
          <template #append>
            <RuiIcon name="lu-arrow-right" />
          </template>
        </RuiButton>
        to fetch them again.
      </p>
      <p
        class="text-sm"
        data-id="link-colors"
      >
        <template
          v-for="color in contextColors"
          :key="color"
        >
          <RuiButton
            variant="link"
            :color="color"
            class="mr-3 capitalize"
          >
            {{ color }}
          </RuiButton>
        </template>
        <RuiButton
          variant="link"
          class="mr-3"
        >
          grey
        </RuiButton>
        <RuiButton
          variant="link"
          color="primary"
          disabled
        >
          disabled
        </RuiButton>
      </p>
    </div>
  </div>
</template>
