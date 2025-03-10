<script setup lang="ts">
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';
import {
  RuiCard,
  RuiIcon,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
  RuiTabs,
  type TabsProps,
} from '@rotki/ui-library';

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const verticalAttributes = [false, true] as const;

const tabs = ref<TabsProps[]>([]);

function createTab(color: typeof colors[number], vertical: boolean = false): TabsProps {
  return {
    color,
    vertical,
    modelValue: undefined,
  };
}

function generateTabs(): TabsProps[] {
  const tabs: TabsProps[] = [];
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
