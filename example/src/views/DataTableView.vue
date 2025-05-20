<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import { useFetch } from '@vueuse/core';
import { computed, onBeforeMount } from 'vue';
import ApiTables from '../components/tables/ApiTables.vue';
import BasicTables from '../components/tables/BasicTables.vue';
import EmptyTables from '../components/tables/EmptyTables.vue';
import ExpandableTables from '../components/tables/ExpandableTables.vue';
import { normalize } from '../data/tables';

const {
  data: userData,
  isFetching,
  execute,
} = useFetch<string>('https://jsonplaceholder.typicode.com/users');

const users = computed(() =>
  JSON.parse(get(userData) ?? '[]').map(normalize),
);

onBeforeMount(async () => {
  if (isFetching.value)
    await execute().catch();
});
</script>

<template>
  <ComponentView data-cy="datatables">
    <template #title>
      Data Tables
    </template>

    <template v-if="!isFetching">
      <EmptyTables />
      <ExpandableTables />
      <BasicTables />
      <ApiTables :users="users" />
    </template>
  </ComponentView>
</template>
