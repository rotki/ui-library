<script setup lang="ts">
/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never rendered. The text inputs declare
 * the `v-model` modifiers they take, so a modifier is checked like any other prop.
 */
import { RuiRevealableTextField, RuiTextArea, RuiTextField } from '@/components';

const text = ref<string>('');
</script>

<template>
  <RuiTextField v-model.trim="text" />
  <RuiRevealableTextField v-model.trim="text" />
  <RuiTextArea v-model.trim="text" />

  <!-- @vue-expect-error `number` is not a modifier a text field takes -->
  <RuiTextField v-model.number="text" />
</template>
