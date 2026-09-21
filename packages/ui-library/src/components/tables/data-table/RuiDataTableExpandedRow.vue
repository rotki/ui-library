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

/**
 * On mobile the expanded content attaches beneath its card: matching side
 * borders and a rounded, bordered bottom edge. It carries no top border, since
 * the parent card's flattened bottom edge is the divider, and `!border-b`
 * defeats the `divide-y-0` on the mobile tbody.
 */
const mobileExpandedClass = 'block border-x !border-b border-black/[0.12] dark:border-white/[0.12] rounded-b-lg mb-3 overflow-hidden';

/**
 * Caps the panel to the table's visible width, less the cell's 16px sides, and
 * pins it to the left edge while the table scrolls sideways. Wider content,
 * such as a nested table, scrolls inside its own scroller. Where the table
 * resets `--rui-table-viewport` the calc is invalid and the width stays auto.
 */
const panelStyle = { width: 'calc(var(--rui-table-viewport) - 2rem)' };
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
      <div
        :class="{ 'sticky left-4': !isMobile }"
        :style="panelStyle"
        data-id="expanded-panel"
      >
        <slot
          name="expanded-item"
          :row="row"
          :index="index"
        />
      </div>
    </td>
  </tr>
</template>
