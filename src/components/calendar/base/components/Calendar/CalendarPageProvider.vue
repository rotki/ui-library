<script setup lang="ts">
import type { Page } from '../../utils/page';
import { toRef } from 'vue';
import { createPage } from '../../use/page';

const props = defineProps<{
  page: Page;
}>();

createPage(toRef(props, 'page'));
</script>

<template>
  <slot />
</template>
