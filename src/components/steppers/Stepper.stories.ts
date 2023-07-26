import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { StepperOrientation, StepperState } from '@/types/stepper';
import { type Props, default as Stepper } from './Stepper.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Stepper },
  setup() {
    return { args };
  },
  template: `<Stepper v-bind="args" />`,
});

const meta: Meta<Props> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  render,
  argTypes: {
    step: { control: 'number', table: { category: 'State' } },
    steps: { control: 'array', table: { category: 'State' } },
    iconTop: { control: 'boolean', table: { category: 'State' } },
    custom: { control: 'boolean', table: { category: 'State' } },
    orientation: {
      control: 'select',
      options: [StepperOrientation.horizontal, StepperOrientation.vertical],
      table: { category: 'State' },
    },
  },
  parameters: {
    docs: {
      controls: { exclude: ['icon', 'titleClass', 'subtitleClass'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
};

export const TitleOnly: Story = {
  args: {
    steps: [
      { title: 'Step', state: StepperState.done },
      { title: 'Step', state: StepperState.active },
      { title: 'Step', state: StepperState.inactive },
      { title: 'Step', state: StepperState.inactive },
    ],
  },
};

export const TitleOnlyAndVertical: Story = {
  args: {
    orientation: StepperOrientation.vertical,
    steps: [
      { title: 'Step', state: StepperState.done },
      { title: 'Step', state: StepperState.active },
      { title: 'Step', state: StepperState.inactive },
      { title: 'Step', state: StepperState.inactive },
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
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
    ],
  },
};

export const CustomVertical: Story = {
  args: {
    custom: true,
    step: 1,
    orientation: StepperOrientation.vertical,
    steps: [
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
    ],
  },
};

export const CustomWithColor: Story = {
  args: {
    custom: true,
    step: 1,
    titleClass: 'text-rui-primary',
    subtitleClass: 'text-rui-primary/80',
    steps: [
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
      },
    ],
  },
};

export default meta;
