import { contextColors } from '@/consts/colors';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiTabItems from '@/components/tabs/tab-items/RuiTabItems.vue';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import RuiTabs, { type Props as TabsProps } from '@/components/tabs/tabs/RuiTabs.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = TabsProps & { class?: string };

const render: StoryFn<Props> = args => ({
  components: {
    RuiCard,
    RuiIcon,
    RuiTab,
    RuiTabItem,
    RuiTabItems: RuiTabItems as any,
    RuiTabs,
  },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    return { args, modelValue };
  },
  template: `
    <div class="flex" :class="args.vertical ? 'flex-row gap-x-6' : 'flex-col'">
      <RuiTabs v-bind="args" v-model='modelValue'>
        <RuiTab>
          <template #prepend>
            <RuiIcon name='add-line' />
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
            <RuiIcon name='add-line' />
          </template>
        </RuiTab>
      </RuiTabs>
      <RuiTabItems v-model="modelValue">
        <RuiTabItem><RuiCard>Tab 1 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard>Tab 2 Content</RuiCard></RuiTabItem>
        <RuiTabItem eager><RuiCard>Tab 3 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard>Tab 4 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard>Tab 5 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard>Tab 6 Content</RuiCard></RuiTabItem>
        <RuiTabItem><RuiCard>Tab 7 Content</RuiCard></RuiTabItem>
        <RuiTabItem>
          <RuiCard>
            Tab 8 Long Long Long Long Long Long Long Long Long Long Long Long
            Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content
          </RuiCard>
        </RuiTabItem>
        <RuiTabItem eager><RuiCard>Tab 9 Content</RuiCard></RuiTabItem>
      </RuiTabItems>
    </div>
  `,
});

const meta: Meta<Props> = {
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
    modelValue: { control: 'text' },
    vertical: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiTabs,
  render,
  tags: ['autodocs'],
  title: 'Components/Tabs',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Grow: Story = {
  args: {
    grow: true,
  },
};

export const Vertical: Story = {
  args: {
    class: 'w-[200px]',
    vertical: true,
  },
};

export const DefaultWithArrow: Story = {
  args: {
    class: 'w-[500px]',
  },
};

export const VerticalWithArrow: Story = {
  args: {
    class: 'w-[200px] h-[300px]',
    vertical: true,
  },
};

export default meta;
