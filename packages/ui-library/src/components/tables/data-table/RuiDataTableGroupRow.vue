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

const { classes, colspan, isMobile } = useDataTableStyling();

/**
 * On mobile the group header reads as a rounded section label, separated from
 * the previous group's cards above and its own below, aligned to the card
 * content padding.
 */
const mobileGroupClass = 'mt-6 first:mt-0 mb-2 rounded-lg';
const {
  getGroupSize,
  groupExpandButtonPosition,
  groupKey,
  groupLabels,
  isExpandedGroup,
  onCopyGroup,
  onToggleExpandGroup,
  onUngroup,
} = useDataTableGrouping<T>();

const isOpen = computed<boolean>(() => isExpandedGroup(row.group));
const groupSize = computed<number>(() => getGroupSize(row.identifier));

/** One label/value pair per grouped column, e.g. `Username: amartin`. */
const groupParts = computed<{ key: string; label: string; value: string }[]>(() => {
  const values = new Map<string, unknown>(Object.entries(row.group));
  return get(groupLabels).map(({ key, label }) => {
    const value = values.get(key);
    return { key, label, value: value === undefined || value === null ? '' : String(value) };
  });
});
</script>

<template>
  <tr
    :class="[classes.trGroup, isMobile ? mobileGroupClass : '']"
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
        :class="[classes.td, isMobile ? '!px-4 !py-2' : '!p-2']"
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
            <span
              class="flex flex-wrap items-baseline gap-x-3"
              data-id="group-label"
            >
              <span
                v-for="part in groupParts"
                :key="part.key"
              >
                <span class="text-rui-text-secondary">{{ part.label }}:</span>
                <span class="font-medium ml-1">{{ part.value }}</span>
              </span>
            </span>
            <span
              class="rounded-full bg-black/[0.06] dark:bg-white/[0.08] px-2 text-caption text-rui-text-secondary"
              data-id="group-size"
            >
              {{ groupSize }}
            </span>
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
                  name="lu-ungroup"
                  size="16"
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
