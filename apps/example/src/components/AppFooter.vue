<script lang="ts" setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="wrapper flex flex-wrap items-center justify-center text-slate-900 dark:text-white sm:px-6 lg:px-8 px-4 py-5 border-t-2 border-slate-100 dark:border-slate-800">
    &copy; {{ year }} Rotki
  </footer>
</template>
