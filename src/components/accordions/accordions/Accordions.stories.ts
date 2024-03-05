import Accordion from '@/components/accordions/accordion/Accordion.vue';
import Accordions, { type Props as AccordionsProps } from './Accordions.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<AccordionsProps> = args => ({
  components: { Accordion, Accordions },
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
    <div>
      <Accordions v-bind="args" v-model='modelValue'>
        <Accordion>
          <template #header>
            Accordion 1 header
          </template>
          <template #default>
            Accordion 1 content
          </template>
        </Accordion>
        <Accordion eager>
          <template #header>
            Accordion 2 header
          </template>
          <template #default>
            Accordion 2 content
          </template>
        </Accordion>
      </Accordions>
    </div>
  `,
});

const meta: Meta<AccordionsProps> = {
  argTypes: {
    modelValue: { control: 'text' },
    multiple: { control: 'boolean', table: { category: 'State' } },
  },
  component: Accordions,
  render,
  tags: ['autodocs'],
  title: 'Components/Accordions',
};

type Story = StoryObj<AccordionsProps>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export default meta;
