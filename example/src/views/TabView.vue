<script setup lang="ts">
import {
  RuiCard,
  RuiIcon,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
  RuiTabs,
  type TabsProps,
} from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const tabs = ref<TabsProps[]>([
  {
    color: 'primary',
    modelValue: undefined,
  },
  {
    color: 'secondary',
    modelValue: undefined,
  },
  {
    color: 'error',
    modelValue: undefined,
  },
  {
    color: 'warning',
    modelValue: undefined,
  },
  {
    color: 'info',
    modelValue: '',
  },
  {
    color: 'success',
    modelValue: undefined,
  },
  {
    color: 'primary',
    vertical: true,
    modelValue: undefined,
  },
  {
    color: 'secondary',
    vertical: true,
    modelValue: undefined,
  },
  {
    color: 'error',
    vertical: true,
    modelValue: undefined,
  },
  {
    color: 'warning',
    vertical: true,
    modelValue: undefined,
  },
  {
    color: 'info',
    vertical: true,
    modelValue: undefined,
  },
  {
    color: 'success',
    vertical: true,
    modelValue: undefined,
  },
]);
</script>

<template>
  <ComponentView data-cy="tabs">
    <template #title>
      Tabs
    </template>

    <div
      v-for="(data, i) in tabs"
      :key="i"
      class="flex mb-6 gap-x-6"
      :class="data.vertical ? 'flex-row' : 'flex-col'"
      :data-cy="`wrapper-${i}`"
    >
      <RuiTabs
        v-bind="data"
        v-model="data.modelValue"
        data-cy="tabs"
      >
        <RuiTab>
          <template #prepend>
            <RuiIcon name="add-fill" />
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
        v-model="data.modelValue"
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
    </div>
  </ComponentView>
</template>
