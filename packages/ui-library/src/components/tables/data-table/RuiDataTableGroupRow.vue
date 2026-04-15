<script lang="ts" setup generic="T extends object">
import type { GroupHeader } from '@/composables/tables/data-table/types';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { useDataTableGrouping, useDataTableStyling } from '@/components/tables/data-table/context';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';
import { GroupExpandButtonPosition } from '@/components/tables/table-props';

const { row } = defineProps<{
  row: GroupHeader<T>;
}>();

defineSlots<{
  'group.header'?: (props: {
    colspan: number;
    header: GroupHeader<T>;
    isOpen: boolean;
    toggle: () => void;
  }) => any;
  'group.header.content'?: (props: { header: GroupHeader<T>; groupKey: string }) => any;
}>();

const { classes, colspan } = useDataTableStyling();
const {
  groupExpandButtonPosition,
  groupKey,
  isExpandedGroup,
  onCopyGroup,
  onToggleExpandGroup,
  onUngroup,
} = useDataTableGrouping<T>();

const isOpen = computed<boolean>(() => isExpandedGroup(row.group));
</script>

<template>
  <tr
    :class="classes.trGroup"
    data-id="row-group"
  >
    <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
    <slot
      name="group.header"
      :colspan="colspan"
      :header="row"
      :is-open="isOpen"
      :toggle="() => onToggleExpandGroup(row.group, row.identifier)"
    >
      <td
        :class="classes.td"
        class="!p-2"
        :colspan="colspan"
      >
        <div class="flex items-center gap-2">
          <RuiExpandButton
            v-if="groupExpandButtonPosition === GroupExpandButtonPosition.start"
            :expanded="isOpen"
            @click="onToggleExpandGroup(row.group, row.identifier)"
          />
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            :group-key="groupKey ?? ''"
            name="group.header.content"
            :header="row"
          >
            <span>{{ groupKey }}: {{ row.identifier }}</span>
            <RuiButton
              size="sm"
              variant="text"
              icon
              data-id="group-copy-button"
              @click="onCopyGroup(row)"
            >
              <RuiIcon
                name="lu-copy"
                size="16"
              />
            </RuiButton>
          </slot>
          <RuiTooltip
            :options="{ placement: 'top' }"
            class="ml-auto mr-2"
          >
            <template #activator>
              <RuiButton
                size="sm"
                variant="text"
                icon
                data-id="group-ungroup-button"
                @click="onUngroup()"
              >
                <RuiIcon
                  name="lu-trash-2"
                  size="14"
                />
              </RuiButton>
            </template>
            Ungroup
          </RuiTooltip>
          <RuiExpandButton
            v-if="groupExpandButtonPosition === GroupExpandButtonPosition.end"
            :expanded="isOpen"
            @click="onToggleExpandGroup(row.group, row.identifier)"
          />
        </div>
      </td>
    </slot>
  </tr>
</template>
