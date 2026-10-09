import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor } from 'storybook/test';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import RuiTabItems from '@/components/tabs/tab-items/RuiTabItems.vue';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';
import RuiTabs from '@/components/tabs/tabs/RuiTabs.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiTabs>) {
  return {
    components: {
      RuiCard,
      RuiIcon,
      RuiTab,
      RuiTabItem,
      RuiTabItems: RuiTabItems<number>,
      RuiTabs,
    },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      return { args, modelValue };
    },
    // flat panels: the tab rail already draws the line between the tabs and their content
    template: `
    <div class="flex" :class="args.vertical ? 'flex-row gap-x-6' : 'flex-col'">
      <RuiTabs v-bind="args" v-model='modelValue'>
        <RuiTab>
          <template #prepend>
            <RuiIcon name='lu-plus' />
          </template>
          Tab 1
        </RuiTab>
        <RuiTab disabled>Tab 2</RuiTab>
        <RuiTab>Tab 3</RuiTab>
        <RuiTab>Tab 4</RuiTab>
        <RuiTab>Tab 5</RuiTab>
        <RuiTab>Tab 6</RuiTab>
        <RuiTab>Tab 7</RuiTab>
        <RuiTab>Tab 8</RuiTab>
        <RuiTab>
          Tab 9
          <template #append>
            <RuiIcon name='lu-plus' />
          </template>
        </RuiTab>
      </RuiTabs>
      <RuiTabItems v-model="modelValue">
        <RuiTabItem><RuiCard variant="flat">Tab 1 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard variant="flat">Tab 2 Content</RuiCard></RuiTabItem>
        <RuiTabItem eager><RuiCard variant="flat">Tab 3 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard variant="flat">Tab 4 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard variant="flat">Tab 5 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard variant="flat">Tab 6 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard variant="flat">Tab 7 Content</RuiCard></RuiTabItem>
        <RuiTabItem>
          <RuiCard variant="flat">
            Tab 8 Long Long Long Long Long Long Long Long Long Long Long Long
            Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content
          </RuiCard>
        </RuiTabItem>
        <RuiTabItem eager><RuiCard variant="flat">Tab 9 Content</RuiCard></RuiTabItem>
      </RuiTabItems>
    </div>
  `,
  };
}

const meta = preview.meta({
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    class: { control: 'text' },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    grow: { control: 'boolean', table: { category: 'State' } },
    indicatorPosition: { control: 'select', options: ['start', 'end'] },
    modelValue: { control: 'text' },
    variant: { control: 'select', options: ['underline', 'segmented'] },
    vertical: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiTabs,
  render,
  tags: ['autodocs'],
  title: 'Navigation/Tabs',
});

/**
 * Waits for the panels to finish fading, so the accessibility check that runs after a play does not
 * measure a panel mid-transition, squeezed into overflow it never has at rest.
 *
 * @param canvasElement - the story's root
 */
async function panelsSettled(canvasElement: HTMLElement): Promise<void> {
  await waitFor(() => expect(canvasElement.querySelector('[class*="v-enter-"],[class*="v-leave-"]')).toBeNull());
}

export const Default = meta.story({
  args: {},
  async play({ canvas, canvasElement, userEvent }) {
    const tab1 = canvas.getByRole('tab', { name: /Tab 1/ });
    await expect(tab1).toHaveAttribute('aria-selected', 'true');
    const tab3 = canvas.getByRole('tab', { name: 'Tab 3' });
    await userEvent.click(tab3);
    await expect(tab3).toHaveAttribute('aria-selected', 'true');
    await expect(tab1).toHaveAttribute('aria-selected', 'false');
    await panelsSettled(canvasElement);
    tab3.blur();
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
  async play({ canvas, userEvent }) {
    const tab3 = canvas.getByRole('tab', { name: 'Tab 3' });
    // All tabs should be disabled when parent is disabled
    await expect(tab3).toBeDisabled();
    await userEvent.click(tab3);
    // Tab should remain disabled and unselected after click
    await expect(tab3).toHaveAttribute('aria-selected', 'false');
  },
});

export const Grow = meta.story({
  args: {
    grow: true,
  },
});

export const Vertical = meta.story({
  args: {
    class: 'w-[200px]',
    vertical: true,
  },
});

export const DefaultWithArrow = meta.story({
  args: {
    class: 'w-[500px]',
  },
});

export const VerticalWithArrow = meta.story({
  args: {
    class: 'w-[200px] h-[300px]',
    vertical: true,
  },
});

export const IndicatorPositionOnTop = meta.story({
  args: {
    class: 'w-[500px]',
    indicatorPosition: 'start',
  },
});

export const IndicatorPositionOnLeft = meta.story({
  args: {
    class: 'w-[200px] h-[300px]',
    indicatorPosition: 'start',
    vertical: true,
  },
});

export const KeyboardNavigation = meta.story({
  args: {},
  async play({ canvas, canvasElement, userEvent }) {
    const tab1 = canvas.getByRole('tab', { name: /Tab 1/ });
    await expect(tab1).toHaveAttribute('tabindex', '0');
    tab1.focus();
    // Tab 2 is disabled, so the arrow skips to Tab 3
    await userEvent.keyboard('{ArrowRight}');
    const tab3 = canvas.getByRole('tab', { name: 'Tab 3' });
    await expect(tab3).toHaveFocus();
    await expect(tab3).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: /Tab 9/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(tab1).toHaveAttribute('aria-selected', 'true');
    await panelsSettled(canvasElement);
    tab1.blur();
  },
});

/**
 * A segmented control: a few short options that switch a view in place.
 *
 * @param args - the story args
 */
function renderSegmented(args: ComponentPropsAndSlots<typeof RuiTabs>) {
  return {
    components: { RuiCard, RuiTab, RuiTabItem, RuiTabItems: RuiTabItems<number>, RuiTabs },
    setup() {
      const modelValue = ref<number | string>(0);
      const ranges = ['1D', '1W', '1M', '1Y', 'All'];
      return { args, modelValue, ranges };
    },
    template: `
    <div class="flex gap-4" :class="args.vertical ? 'flex-row' : 'flex-col items-start'">
      <RuiTabs v-bind="args" v-model="modelValue">
        <RuiTab v-for="range in ranges" :key="range">{{ range }}</RuiTab>
      </RuiTabs>
      <RuiTabItems v-model="modelValue" class="w-full">
        <RuiTabItem v-for="range in ranges" :key="range"><RuiCard>Balances over {{ range }}</RuiCard></RuiTabItem>
      </RuiTabItems>
    </div>
  `,
  };
}

export const Segmented = meta.story({
  args: { variant: 'segmented' },
  render: renderSegmented,
  async play({ canvas, canvasElement, userEvent }) {
    const week = canvas.getByRole('tab', { name: '1W' });
    await userEvent.click(week);
    await expect(week).toHaveAttribute('aria-selected', 'true');
    await expect(week).toHaveAttribute('data-variant', 'segmented');
    await panelsSettled(canvasElement);
    week.blur();
  },
});

export const SegmentedGrow = meta.story({
  args: { class: 'w-[420px]', grow: true, variant: 'segmented' },
  render: renderSegmented,
});

export const SegmentedVertical = meta.story({
  args: { class: 'w-[120px]', variant: 'segmented', vertical: true },
  render: renderSegmented,
});

export const SegmentedWithIcons = meta.story({
  args: { variant: 'segmented' },
  render: args => ({
    components: { RuiIcon, RuiTab, RuiTabs },
    setup() {
      return { args };
    },
    template: `
      <RuiTabs v-bind="args">
        <RuiTab><template #prepend><RuiIcon name="lu-list" /></template>List</RuiTab>
        <RuiTab><template #prepend><RuiIcon name="lu-layout-grid" /></template>Grid</RuiTab>
      </RuiTabs>`,
  }),
});

export default meta;
