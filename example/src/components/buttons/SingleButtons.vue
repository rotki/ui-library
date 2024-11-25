<script lang='ts' setup>
import { type ButtonProps, type ContextColorsType, RuiButton, RuiIcon, type RuiIcons, contextColors } from '@rotki/ui-library';
import ComponentGroup from '@/components/ComponentGroup.vue';

interface ExtraProperties {
  clicks: number;
  prepend?: RuiIcons;
  append?: RuiIcons;
  iconName?: RuiIcons;
}

type ButtonData = ButtonProps & ExtraProperties;

const attributes: Partial<ButtonData>[] = [
  {}, // Base button
  { variant: 'outlined' }, // Outlined button
  { prepend: 'lu-arrow-right' }, // Button with prepend icon
  { append: 'lu-arrow-right' }, // Button with append icon
  { variant: 'text' }, // Text variant button
  { disabled: true }, // Disabled button
  { disabled: false, rounded: true }, // Rounded button
  { variant: 'outlined', rounded: true }, // Outlined and rounded button
  { variant: 'outlined', rounded: true, size: 'lg' }, // Outlined, rounded, large button
  { variant: 'outlined', rounded: true, size: 'sm' }, // Outlined, rounded, small button
  { variant: 'text', rounded: true }, // Rounded text variant button
  { disabled: true, rounded: true }, // Disabled rounded text variant
  { loading: true, rounded: true }, // Loading and rounded button
  { variant: 'fab' }, // FAB button
  { variant: 'fab', icon: true, iconName: 'lu-plus' },
  { variant: 'text', icon: true, iconName: 'lu-plus' },
  { variant: 'outlined', icon: true, iconName: 'lu-plus' },
];

const buttons = ref<ButtonData[]>([]);

function createButtonData(color: ContextColorsType, extraProps: Partial<ButtonData> = {}): ButtonData {
  return { clicks: 0, color, ...extraProps };
}

function generateButtonData(): ButtonData[] {
  const buttonData: ButtonData[] = [];

  for (const attrs of attributes) {
    for (const color of contextColors) {
      buttonData.push(createButtonData(color, attrs));
    }
  }

  return buttonData;
}

onMounted(() => {
  set(buttons, generateButtonData());
});
</script>

<template>
  <ComponentGroup
    :items="buttons"
    class="grid gap-4 grid-rows-2 grid-cols-6 justify-items-start mb-14"
  >
    <template #item="{ item, index }">
      <RuiButton
        :key="index"
        :class="{ 'w-full': !item.icon && item.variant !== 'fab' }"
        v-bind="item"
        @click="item.clicks++"
      >
        <template
          v-if="item.prepend"
          #prepend
        >
          <RuiIcon :name="item.prepend" />
        </template>
        <span
          v-if="!item.icon"
          class="capitalize"
        >
          {{ item.color }} {{ item.clicks }}
        </span>
        <RuiIcon
          v-else-if="item.iconName"
          :name="item.iconName"
        />
        <template
          v-if="item.append"
          #append
        >
          <RuiIcon :name="item.append" />
        </template>
      </RuiButton>
    </template>
  </ComponentGroup>
</template>
