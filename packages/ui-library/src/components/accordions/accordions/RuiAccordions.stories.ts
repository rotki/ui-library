import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiAccordion from '@/components/accordions/accordion/RuiAccordion.vue';
import RuiAccordions from '@/components/accordions/accordions/RuiAccordions.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiAccordions>) {
  return {
    components: { RuiAccordion, RuiAccordions },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
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
  };
}

const meta = preview.meta({
  argTypes: {
    modelValue: { control: 'text' },
    multiple: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiAccordions,
  render,
  tags: ['autodocs'],
  title: 'Components/Accordions',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const header = canvas.getByText('Accordion 1 header');
    await userEvent.click(header);
    await expect(canvas.getByText('Accordion 1 content')).toBeVisible();
    // Close accordion for cleanup
    await userEvent.click(header);
  },
});

export const Multiple = meta.story({
  args: {
    multiple: true,
  },
  async play({ canvas, userEvent }) {
    const header1 = canvas.getByText('Accordion 1 header');
    const header2 = canvas.getByText('Accordion 2 header');
    // Open first accordion
    await userEvent.click(header1);
    await expect(canvas.getByText('Accordion 1 content')).toBeVisible();
    // Open second accordion — both should stay open in multiple mode
    await userEvent.click(header2);
    await expect(canvas.getByText('Accordion 1 content')).toBeVisible();
    await expect(canvas.getByText('Accordion 2 content')).toBeVisible();
    // Close both for cleanup
    await userEvent.click(header1);
    await userEvent.click(header2);
  },
});

export default meta;
