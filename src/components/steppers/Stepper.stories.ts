import { type Meta, type StoryFn } from '@storybook/vue3';
import { StepperOrientation, StepperState } from '@/types/stepper';
import Stepper from './Stepper.vue';

const render: StoryFn<typeof Stepper> = (_, { argTypes }) => ({
  components: { Stepper },
  props: Object.keys(argTypes),
  template: `<Stepper v-bind="$props" />`,
});

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  render,
  argTypes: {
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

export const Default = {
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

export const VerticalOrientation = {
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

export const TitleOnly = {
  args: {
    steps: [
      { title: 'Step', state: StepperState.done },
      { title: 'Step', state: StepperState.active },
      { title: 'Step', state: StepperState.inactive },
      { title: 'Step', state: StepperState.inactive },
    ],
  },
};

export const TitleOnlyAndVertical = {
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

export const DescriptionOnly = {
  args: {
    steps: [
      { description: 'Lorem ipsum', state: StepperState.done },
      { description: 'Lorem ipsum', state: StepperState.active },
      { description: 'Lorem ipsum', state: StepperState.inactive },
      { description: 'Lorem ipsum', state: StepperState.inactive },
    ],
  },
};

export const DescriptionOnlyAndVertical = {
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

export const StepOnly = {
  args: {
    steps: [
      { state: StepperState.done },
      { state: StepperState.active },
      { state: StepperState.inactive },
      { state: StepperState.inactive },
    ],
  },
};

export const StepOnlyAndVertical = {
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

export const Custom = {
  args: {
    custom: true,
    steps: [
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
    ],
  },
};

export const CustomVertical = {
  args: {
    custom: true,
    orientation: StepperOrientation.vertical,
    steps: [
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
    ],
  },
};

export const CustomWithColor = {
  args: {
    custom: true,
    titleClass: 'text-rui-primary',
    subtitleClass: 'text-rui-primary/80',
    steps: [
      { title: 'Done', description: 'Lorem ipsum', state: StepperState.done },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
    ],
  },
};

export default meta;
