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

      // the panel clips the hover fill to its corners, so the focus ring is drawn inside the header
      const classNames = { header: 'px-4 py-3 font-medium hover:bg-rui-hover focus-visible:-outline-offset-2 focus-visible:rounded-none' };

      return { args, classNames, modelValue };
    },
    template: `
      <div class="max-w-xl overflow-hidden rounded-rui-panel border border-rui-divider bg-rui-surface">
        <RuiAccordions v-bind="args" v-model="modelValue" class="divide-y divide-rui-divider">
          <RuiAccordion header-grow :class-names="classNames">
            <template #header>
              Accordion 1 header
            </template>
            <template #default>
              <p class="px-4 pb-4 text-body-2 text-rui-text-secondary">Accordion 1 content</p>
            </template>
          </RuiAccordion>
          <RuiAccordion eager header-grow :class-names="classNames">
            <template #header>
              Accordion 2 header
            </template>
            <template #default>
              <p class="px-4 pb-4 text-body-2 text-rui-text-secondary">Accordion 2 content</p>
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
  title: 'Navigation/Accordion',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const header = canvas.getByText('Accordion 1 header');
    await userEvent.click(header);
    await expect(canvas.getByText('Accordion 1 content')).toBeVisible();
    // Close accordion for cleanup, without leaving a focus ring on the resting story
    await userEvent.click(header);
    canvas.getByRole('button', { name: 'Accordion 1 header' }).blur();
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
    // Close both for cleanup, without leaving a focus ring on the resting story
    await userEvent.click(header1);
    await userEvent.click(header2);
    canvas.getByRole('button', { name: 'Accordion 2 header' }).blur();
  },
});

/**
 * The accordion draws no frame of its own, so a list takes its look from the app: here a panel with
 * dividers, full-width headers through `header-grow`, and the padding on the header and the content.
 * The panel clips the hover fill to its corners, so the focus ring is drawn inside the header.
 */
export const DividedList = meta.story({
  render: args => ({
    components: { RuiAccordion, RuiAccordions },
    setup() {
      const open = ref<number | number[]>(0);
      const items = [
        { answer: 'Your data stays on your machine. Nothing is sent anywhere unless you connect a service.', question: 'Where is my data stored?' },
        { answer: 'Add the account under Accounts and the balances load on the next refresh.', question: 'How do I track a new account?' },
        { answer: 'Reports take every trade in the period and price it at the time it happened.', question: 'How are reports calculated?' },
      ];
      return { args, items, open };
    },
    template: `
      <div class="max-w-xl overflow-hidden rounded-rui-panel border border-rui-divider bg-rui-surface">
        <RuiAccordions v-model="open" :multiple="args.multiple" class="divide-y divide-rui-divider">
          <RuiAccordion
            v-for="item in items"
            :key="item.question"
            header-grow
            :class-names="{ header: 'px-4 py-3 font-medium hover:bg-rui-hover focus-visible:-outline-offset-2 focus-visible:rounded-none' }"
          >
            <template #header>{{ item.question }}</template>
            <p class="px-4 pb-4 text-body-2 text-rui-text-secondary">{{ item.answer }}</p>
          </RuiAccordion>
        </RuiAccordions>
      </div>
    `,
  }),
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText(/stays on your machine/)).toBeVisible();
    await userEvent.click(canvas.getByText('How are reports calculated?'));
    await expect(canvas.getByText(/every trade in the period/)).toBeVisible();
    await expect(canvas.queryByText(/stays on your machine/)).toBeNull();
  },
});

export default meta;
