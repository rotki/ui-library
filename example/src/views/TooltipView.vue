<script lang="ts" setup>
import {
  type ButtonProps,
  RuiButton,
  RuiTooltip,
  type TooltipProps,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';
import { capitalizeFirstLetter } from '@/utils';

type TooltipData = TooltipProps & {
  buttonColor?: ButtonProps<undefined>['color'];
  buttonText?: string;
};

interface TextGetter {
  getText: (placement: string) => string;
  getButtonText?: (placement: string) => string;
}

const colors = ['primary', 'secondary', 'error', 'info'] as const;
const placements = ['bottom', 'top', 'left', 'right'] as const;
const attributes: (Partial<TooltipData> & TextGetter)[] = [
  {
    getText: (placement: string) => capitalizeFirstLetter(placement),
  },
  {
    hideArrow: false,
    getText: (placement: string) => `${capitalizeFirstLetter(placement)} With arrow`,
  },
  {
    getText: (): string => 'Lorem ipsum dolor sit amet consecteur '.repeat(6),
    getButtonText: (placement: string): string => `${capitalizeFirstLetter(placement)} With long content`,
    tooltipClass: 'max-w-sm',
  },
  {
    disabled: true,
    getText: (): string => `Tooltip disabled`,
  },
];

const tooltips = ref<(TooltipData)[]>([]);

function createToolip(
  color: typeof colors[number],
  placement: typeof placements[number],
  options: Partial<TooltipData>,
): TooltipData {
  return {
    disabled: false,
    hideArrow: true,
    ...options,
    buttonColor: color,
    popper: { placement },
  };
}

function generateTooltips(): TooltipData[] {
  const tooltips: TooltipData[] = [];

  for (const attrs of attributes) {
    const { getText, getButtonText } = attrs;

    for (const [i, color] of colors.entries()) {
      const placement = placements[i];
      if (!placement)
        continue;
      const options = {
        ...objectOmit(attrs, ['getText', 'getButtonText']),
        text: getText(placement),
        buttonText: getButtonText?.(placement),
      };
      tooltips.push(createToolip(color, placement, options));
    }
  }
  return tooltips;
}

onBeforeMount(() => {
  set(tooltips, generateTooltips());
});
</script>

<template>
  <ComponentView data-cy="tooltips">
    <template #title>
      Tooltips
    </template>

    <ComponentGroup
      class="grid gap-6 grid-cols-4"
      :items="tooltips"
    >
      <template #item="{ item, index }">
        <RuiTooltip
          v-bind="objectOmit(item, ['buttonColor'])"
          :data-cy="`tooltip-${index}`"
        >
          <template #activator>
            <RuiButton
              id="activator"
              :color="item.buttonColor"
            >
              {{ item.buttonText ?? item.text }}
            </RuiButton>
          </template>
          {{ item.text }}
        </RuiTooltip>
      </template>
    </ComponentGroup>

    <ComponentGroup
      class="flex space-x-4"
      :items="tooltips.slice(0, 4)"
      data-cy="tooltips"
    >
      <template #title>
        Full width content
      </template>

      <template #item="{ item, index }">
        <RuiTooltip
          :key="index"
          v-bind="objectOmit(item, ['buttonColor'])"
          class="w-full"
          :data-cy="`tooltip-full-${index}`"
        >
          <template #activator>
            <RuiButton
              id="activator"
              :color="item.buttonColor"
              class="w-full"
            >
              {{ item.buttonText ?? item.text }}
            </RuiButton>
          </template>
          {{ item.text }}
        </RuiTooltip>
      </template>
    </ComponentGroup>
  </ComponentView>
</template>
