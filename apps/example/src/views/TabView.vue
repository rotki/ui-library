<script setup lang="ts">
import {
  type ContextColorsType,
  RuiCard,
  RuiIcon,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
  RuiTabs,
} from '@rotki/ui-library';
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';

interface TabItem {
  color?: ContextColorsType;
  vertical?: boolean;
  modelValue?: number | string;
}

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const verticalAttributes = [false, true] as const;

const tabs = ref<TabItem[]>([]);

function createTab(color: ContextColorsType, vertical: boolean = false): TabItem {
  return {
    color,
    vertical,
  };
}

function generateTabs(): TabItem[] {
  const tabs: TabItem[] = [];
  for (const color of colors) {
    for (const vertical of verticalAttributes) {
      tabs.push(createTab(color, vertical));
    }
  }

  return tabs;
}

onBeforeMount(() => {
  set(tabs, generateTabs());
});
</script>

<template>
  <ComponentView data-cy="tabs">
    <template #title>
      Tabs
    </template>

    <ComponentGroup
      :items="tabs"
      item-class="flex mb-6 gap-x-6"
      :get-item-class="item => item.vertical ? 'flex-row' : 'flex-col'"
      :get-item-data-cy="(_, i) => `wrapper-${i}`"
    >
      <template #item="{ item }">
        <RuiTabs
          v-bind="item"
          v-model="item.modelValue"
          data-cy="tabs"
        >
          <RuiTab>
            <template #prepend>
              <RuiIcon name="lu-plus" />
            </template>
            Tab 1
          </RuiTab>
          <RuiTab disabled>
            Tab 2
          </RuiTab>
          <RuiTab
            v-for="n in 3"
            :key="n"
          >
            Tab {{ n + 2 }}
          </RuiTab>
          <RuiTab
            link
            to="/steppers"
          >
            Stepper View
          </RuiTab>
        </RuiTabs>
        <RuiTabItems
          v-model="item.modelValue"
          data-cy="tab-items"
        >
          <RuiTabItem
            v-for="n in 4"
            :key="n"
          >
            <RuiCard>Tab {{ n }} Content</RuiCard>
          </RuiTabItem>
          <RuiTabItem>
            <RuiCard>
              Tab 5 Long Long Long Long Long Long Long Long Long Long Long Long
              Long Long Long Long Long Long Long Long Long Long Long Long Long
              Long Long Long Long Long Long Long Long Content
            </RuiCard>
          </RuiTabItem>
        </RuiTabItems>
      </template>
    </ComponentGroup>
  </ComponentView>
</template>
