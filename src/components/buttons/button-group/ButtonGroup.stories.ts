import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import { contextColors } from '@/consts/colors';
import { default as ButtonGroup, type Props } from './ButtonGroup.vue';

const render: StoryFn<Props> = (args) => ({
  components: { ButtonGroup, Button, Icon },
  setup() {
    const count = ref(0);
    return { count, args };
  },
  template: `
    <ButtonGroup v-bind="args">
      <Button @click="count--">Decrease</Button>
      <Button @click="count++">Increase</Button>
      <Button @click='count++'>
        <Icon name="add-line"></Icon>
      </Button>
    </ButtonGroup>
    <div class='mt-4 text-rui-text'>Count: {{ count }}</div>
  `,
});

const meta: Meta<Props> = {
  title: 'Components/Button/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  render,
  argTypes: {
    vertical: { control: 'boolean' },
    color: { control: 'select', options: contextColors },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text'],
      table: { category: 'Shape' },
    },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export default meta;
