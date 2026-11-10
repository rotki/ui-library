<script setup lang="ts">
/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never rendered. A component that passes
 * its slots on to another one types them as that component does.
 */
import { RuiBottomSheet } from '@/components';

const open = ref<boolean>(false);
</script>

<template>
  <RuiBottomSheet v-model="open">
    <template #activator="{ attrs, isOpen }">
      <button
        type="button"
        v-bind="attrs"
        :aria-expanded="isOpen"
      />
    </template>
    <template #default="{ close, isOpen }">
      <button
        type="button"
        :disabled="!isOpen"
        @click="close()"
      />
    </template>
  </RuiBottomSheet>
  <RuiBottomSheet v-model="open">
    <template #default="{ close }">
      <!-- @vue-expect-error `close` takes no arguments -->
      <button
        type="button"
        @click="close(true)"
      />
    </template>
  </RuiBottomSheet>
</template>
