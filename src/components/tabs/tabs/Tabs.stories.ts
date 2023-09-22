import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';
import Card from '@/components/cards/Card.vue';
import Tab from '@/components/tabs/tab/Tab.vue';
import TabItems from '@/components/tabs/tab-items/TabItems.vue';
import TabItem from '@/components/tabs/tab-item/TabItem.vue';
import Tabs, { type Props as TabsProps } from './Tabs.vue';

type Props = TabsProps & { class?: string };

const render: StoryFn<Props> = (args) => ({
  components: { Tabs, Tab, TabItems, TabItem, Card, Icon },
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
    <div class="flex" :class="args.vertical ? 'flex-row' : 'flex-col'">
      <Tabs v-bind="args" v-model='modelValue'>
        <Tab>
          <template #prepend>
            <Icon name='add-line' />
          </template>
          Tab 1
        </Tab>
        <Tab disabled>Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <Tab>Tab 4</Tab>
        <Tab>Tab 5</Tab>
        <Tab>Tab 6</Tab>
        <Tab>Tab 7</Tab>
        <Tab>Tab 8</Tab>
        <Tab>
          Tab 9
          <template #append>
            <Icon name='add-line' />
          </template>
        </Tab>
      </Tabs>
      <TabItems v-model="modelValue">
        <TabItem><Card>Tab 1 Content</Card></TabItem>
        <TabItem><Card>Tab 2 Content</Card></TabItem>
        <TabItem eager><Card>Tab 3 Content</Card></TabItem>
        <TabItem><Card>Tab 4 Content</Card></TabItem>
        <TabItem><Card>Tab 5 Content</Card></TabItem>
        <TabItem><Card>Tab 6 Content</Card></TabItem>
        <TabItem><Card>Tab 7 Content</Card></TabItem>
        <TabItem>
          <Card>
            Tab 8 Long Long Long Long Long Long Long Long Long Long Long Long
            Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content
          </Card>
        </TabItem>
        <TabItem eager><Card>Tab 9 Content</Card></TabItem>
      </TabItems>
    </div>
  `,
});

const meta: Meta<Props> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'text' },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    grow: { control: 'boolean', table: { category: 'State' } },
    vertical: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    class: { control: 'string' },
  },
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
    vertical: true,
    class: 'w-[200px] h-[300px]',
  },
};

export default meta;
