import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiStepper, { type Props } from '@/components/steppers/RuiStepper.vue';
import { StepperOrientation, StepperState } from '@/types/stepper';

const render: StoryFn<Props> = args => ({
  components: { RuiStepper },
  setup() {
    return { args };
  },
  template: `<RuiStepper v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    custom: { control: 'boolean', table: { category: 'State' } },
    iconTop: { control: 'boolean', table: { category: 'State' } },
    orientation: {
      control: 'select',
      options: [StepperOrientation.horizontal, StepperOrientation.vertical],
      table: { category: 'State' },
    },
    step: { control: 'number', table: { category: 'State' } },
    steps: { control: 'object', table: { category: 'State' } },
  },
  component: RuiStepper,
  parameters: {
    docs: {
      controls: { exclude: ['icon', 'titleClass', 'subtitleClass'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Stepper',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    steps: [
      {
        description: 'Lorem ipsum',
        state: StepperState.inactive,
        title: 'Inactive',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.active,
        title: 'Active',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.done,
        title: 'Done',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.error,
        title: 'Error',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.warning,
        title: 'Warning',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.info,
        title: 'Info',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.success,
        title: 'Success',
      },
    ],
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      {
        description: 'Lorem ipsum',
        state: StepperState.inactive,
        title: 'Inactive',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.active,
        title: 'Active',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.done,
        title: 'Done',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.error,
        title: 'Error',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.warning,
        title: 'Warning',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.info,
        title: 'Info',
      },
      {
        description: 'Lorem ipsum',
        state: StepperState.success,
        title: 'Success',
      },
    ],
  },
};

export const TitleOnly: Story = {
  args: {
    steps: [
      { state: StepperState.done, title: 'Step' },
      { state: StepperState.active, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
    ],
  },
};

export const Loading: Story = {
  args: {
    steps: [
      { state: StepperState.done, title: 'Step' },
      { loading: true, state: StepperState.active, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
    ],
  },
};

export const TitleOnlyAndVertical: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      { state: StepperState.done, title: 'Step' },
      { state: StepperState.active, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
      { state: StepperState.inactive, title: 'Step' },
    ],
  },
};

export const DescriptionOnly: Story = {
  args: {
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done },
      { description: 'Lorem ipsum', state: StepperState.active },
      { description: 'Lorem ipsum', state: StepperState.inactive },
      { description: 'Lorem ipsum', state: StepperState.inactive },
    ],
  },
};

export const DescriptionOnlyAndVertical: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done },
      { description: 'Lorem ipsum', state: StepperState.active },
      { description: 'Lorem ipsum', state: StepperState.inactive },
      { description: 'Lorem ipsum', state: StepperState.inactive },
    ],
  },
};

export const StepOnly: Story = {
  args: {
    steps: [
      { state: StepperState.done },
      { state: StepperState.active },
      { state: StepperState.inactive },
      { state: StepperState.inactive },
    ],
  },
};

export const StepOnlyAndVertical: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      { state: StepperState.done },
      { state: StepperState.active },
      { state: StepperState.inactive },
      { state: StepperState.inactive },
    ],
  },
};

export const Custom: Story = {
  args: {
    custom: true,
    step: 1,
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done, title: 'Done' },
      {
        description: 'Lorem ipsum',
        title: 'Active',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
    ],
  },
};

export const CustomVertical: Story = {
  args: {
    custom: true,
    orientation: StepperOrientation.vertical,
    step: 1,
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done, title: 'Done' },
      {
        description: 'Lorem ipsum',
        title: 'Active',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
    ],
  },
};

export const CustomWithColor: Story = {
  args: {
    custom: true,
    step: 1,
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done, title: 'Done' },
      {
        description: 'Lorem ipsum',
        title: 'Active',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
      {
        description: 'Lorem ipsum',
        title: 'Inactive',
      },
    ],
    subtitleClass: 'text-rui-primary/80',
    titleClass: 'text-rui-primary',
  },
};

export default meta;
