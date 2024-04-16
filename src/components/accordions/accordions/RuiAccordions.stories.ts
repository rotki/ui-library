import RuiAccordion from '@/components/accordions/accordion/RuiAccordion.vue';
import RuiAccordions, { type Props as AccordionsProps } from '@/components/accordions/accordions/RuiAccordions.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<AccordionsProps> = args => ({
  components: { RuiAccordion, RuiAccordions },
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
      <RuiAccordions v-bind="args" v-model='modelValue'>
        <RuiAccordion>
          <template #header>
            Accordion 1 header
          </template>
          <template #default>
            Accordion 1 content
          </template>
        </RuiAccordion>
        <RuiAccordion eager>
          <template #header>
            Accordion 2 header
          </template>
          <template #default>
            Accordion 2 content
          </template>
        </RuiAccordion>
      </RuiAccordions>
    </div>
  `,
});

const meta: Meta<AccordionsProps> = {
  argTypes: {
    modelValue: { control: 'text' },
    multiple: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiAccordions,
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
