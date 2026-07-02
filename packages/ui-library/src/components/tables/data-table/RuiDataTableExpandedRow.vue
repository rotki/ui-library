<script lang="ts" setup generic="T extends object">
import { useDataTableStyling } from '@/components/tables/data-table/context';

defineProps<{
  row: T;
  index: number;
}>();

defineSlots<{
  'expanded-item': (props: { row: T; index: number }) => any;
}>();

const { classes, colspan, isMobile } = useDataTableStyling();

// On mobile the expanded content attaches beneath its card: matching side
// borders and a rounded, bordered bottom edge. The top border is intentionally
// left off — the parent card's flattened bottom edge acts as the divider.
// `!border-b` defeats the `divide-y-0` on the mobile tbody.
const mobileExpandedClass = 'block border-x !border-b border-black/[0.12] dark:border-white/[0.12] rounded-b-lg mb-3 overflow-hidden';
</script>

<template>
  <tr
    :class="[classes.trExpandable, isMobile ? mobileExpandedClass : '']"
    data-id="row-expanded"
  >
    <td
      :colspan="colspan"
      :class="classes.td"
    >
      <slot
        name="expanded-item"
        :row="row"
        :index="index"
      />
    </td>
  </tr>
</template>
