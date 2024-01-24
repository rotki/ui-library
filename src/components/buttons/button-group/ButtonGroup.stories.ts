import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import { contextColors } from '@/consts/colors';
import {
  default as ButtonGroup,
  type Props as ButtonProps,
} from './ButtonGroup.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = ButtonProps<string | number>;

const render: StoryFn<Props> = args => ({
  components: { Button, ButtonGroup, Icon },
  setup() {
    const count = ref(0);
    return { args, count };
  },
  template: `
    <div v-if="'modelValue' in args">
      <ButtonGroup v-bind="args" v-model="args.modelValue">
        <Button>
          <Icon name="align-left" />
        </Button>
        <Button>
          <Icon name="align-center" />
        </Button>
        <Button>
          <Icon name="align-right" />
        </Button>
        <Button>
          <Icon name="align-justify" />
        </Button>
      </ButtonGroup>
      <div v-if="args.required" class="mt-4 text-rui-error">required: *</div>
    </div>
    <div v-else>
      <ButtonGroup v-bind="args">
        <Button @click="count--">Decrease</Button>
        <Button @click="count++">Increase</Button>
        <Button @click="count++">
          <Icon name="add-line"></Icon>
        </Button>
      </ButtonGroup>
      <div class="mt-4 text-rui-text">Count: {{ count }}</div>
    </div>
  `,
});

const meta: Meta<Props> = {
  argTypes: {
    activeColor: { control: 'select', options: contextColors },
    color: { control: 'select', options: contextColors },
    gap: { control: 'select', options: ['md', 'sm', 'lg'] },
    size: { control: 'select', options: ['md', 'sm', 'lg'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text'],
      table: { category: 'Shape' },
    },
    vertical: { control: 'boolean' },
  },
  component: ButtonGroup as any,
  render,
  tags: ['autodocs'],
  title: 'Components/Button/ButtonGroup',
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

export const DefaultToggle: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
  },
};

export const ToggleRequired: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
    required: true,
  },
};

export const VerticalToggle: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
    vertical: true,
  },
};

export const Toggle: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
  },
};

export const OutlinedToggle: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
    variant: 'outlined',
  },
};

export const TextToggle: Story = {
  args: {
    color: 'primary',
    modelValue: 0,
    variant: 'text',
  },
};

export const ActiveColorToggle: Story = {
  args: {
    activeColor: 'warning',
    color: 'primary',
    modelValue: 0,
    variant: 'text',
  },
};

export const DefaultToggleMultiple: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
  },
};

export const ToggleMultipleRequired: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
    required: true,
  },
};

export const VerticalToggleMultiple: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
    vertical: true,
  },
};

export const ToggleMultiple: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
  },
};

export const OutlinedToggleMultiple: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
    variant: 'outlined',
  },
};

export const TextToggleMultiple: Story = {
  args: {
    color: 'primary',
    modelValue: [0],
    variant: 'text',
  },
};

export const ActiveColorMultiple: Story = {
  args: {
    activeColor: 'warning',
    color: 'primary',
    modelValue: [0],
    variant: 'text',
  },
};

export default meta;
