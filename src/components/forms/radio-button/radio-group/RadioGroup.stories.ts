import { type Meta, type StoryFn } from '@storybook/vue3';
import Radio from '@/components/forms/radio-button/radio/Radio.vue';
import RadioGroup from './RadioGroup.vue';

const render: StoryFn<typeof RadioGroup> = (_, { argTypes }) => ({
  components: { RadioGroup, Radio },
  props: Object.keys(argTypes),
  template: `<RadioGroup v-bind="$props" :error-messages="$props.errorMessages ? [$props.errorMessages] : []">
    <div>
      <Radio value="yes">yes</Radio>
      <Radio value="no">no</Radio>
    </div>
  </RadioGroup>`,
});

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Forms/Radio/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'text' },
    inline: { control: 'boolean' },
    hint: { control: 'text' },
    errorMessages: { control: 'text' },
    hideDetails: { control: 'boolean' },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
};

export const Default = {
  args: {},
};

export const Inline = {
  args: {
    inline: true,
  },
};

export const WithErrorMessage = {
  args: {
    errorMessages: 'With error messages',
  },
};

export const WithHint = {
  args: {
    hint: 'With hint',
  },
};

export const HideDetails = {
  args: {
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export default meta;
