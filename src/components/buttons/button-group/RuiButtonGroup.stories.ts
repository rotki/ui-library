import RuiIcon from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiButtonGroup, { type Props as ButtonProps } from '@/components/buttons/button-group/RuiButtonGroup.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = ButtonProps<string | number>;

const render: StoryFn<Props> = args => ({
  components: { RuiButton, RuiButtonGroup, RuiIcon },
  setup() {
    const count = ref(0);
    return { args, count };
  },
  template: `
    <div v-if="'modelValue' in args">
      <RuiButtonGroup v-bind="args" v-model="args.modelValue">
        <RuiButton>
          <RuiIcon name="lu-align-left" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-center" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-right" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-justify" />
        </RuiButton>
      </RuiButtonGroup>
      <div v-if="args.required" class="mt-4 text-rui-error">required: *</div>
    </div>
    <div v-else>
      <RuiButtonGroup v-bind="args">
        <RuiButton @click="count--">Decrease</RuiButton>
        <RuiButton @click="count++">Increase</RuiButton>
        <RuiButton @click="count++">
          <RuiIcon name="add-line"></RuiIcon>
        </RuiButton>
      </RuiButtonGroup>
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
  component: RuiButtonGroup as any,
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
