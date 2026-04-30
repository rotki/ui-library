<script lang="ts" setup generic="T extends { id: string }">
defineProps<{
  cells: T[];
  cellWidth?: string;
  columns?: number;
}>();

defineSlots<{
  default: (props: { cell: T }) => any;
}>();
</script>

<template>
  <div class="p-8 bg-white">
    <div
      class="grid gap-8"
      :style="{
        gridTemplateColumns: `repeat(${columns ?? 2}, minmax(0, max-content))`,
      }"
    >
      <div
        v-for="cell in cells"
        :key="cell.id"
        :data-id="`cell-${cell.id}`"
        class="px-4 py-3 bg-white"
        :class="cellWidth ?? 'w-[360px]'"
      >
        <slot
          :cell="cell"
        />
      </div>
    </div>
  </div>
</template>
