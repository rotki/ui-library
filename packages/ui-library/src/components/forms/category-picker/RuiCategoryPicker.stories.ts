import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import { groupedOptions, type GroupedSelectOption } from '@/__test__/options';
import RuiCategoryPicker from '@/components/forms/category-picker/RuiCategoryPicker.vue';
import preview from '~/.storybook/preview';

interface ActionOption { id: string; label: string; category: string }

// A catalogue at the scale that motivated the component: 16 categories of
// history-event verbs (~4 each ≈ 64 options), from rotki/ui-library#544.
const actionCategories: Record<string, string[]> = {
  Deposit: ['Deposit asset', 'Deposit collateral', 'Bridge in', 'Fund account'],
  Withdrawal: ['Withdraw asset', 'Withdraw collateral', 'Bridge out', 'Redeem'],
  Trade: ['Buy', 'Sell', 'Limit order'],
  Staking: ['Stake', 'Unstake', 'Restake rewards', 'Claim reward', 'Withdraw stake'],
  Transfer: ['Send', 'Receive', 'Internal transfer', 'Gift'],
  Swap: ['Swap', 'Wrap', 'Unwrap'],
  Fee: ['Gas fee', 'Protocol fee', 'Exchange fee'],
  Airdrop: ['Claim airdrop', 'Receive airdrop'],
  Approval: ['Approve spender', 'Revoke approval'],
  Governance: ['Propose', 'Vote', 'Delegate', 'Execute'],
  Liquidity: ['Add liquidity', 'Remove liquidity', 'Collect fees', 'Migrate position'],
  Bridge: ['Bridge deposit', 'Bridge withdraw', 'Bridge refund'],
  NFT: ['Mint', 'Buy NFT', 'Sell NFT', 'Transfer NFT'],
  Loan: ['Borrow', 'Repay', 'Liquidate', 'Roll over'],
  Reward: ['Claim reward', 'Compound', 'Distribute'],
  Migration: ['Migrate balance', 'Upgrade contract', 'Move position'],
};

const actionOptions: ActionOption[] = Object.entries(actionCategories).flatMap(
  ([category, labels], groupIndex) => labels.map((label, itemIndex) => ({
    category,
    id: `${groupIndex}-${itemIndex}`,
    label,
  })),
);

type CategoryPickerProps = ComponentPropsAndSlots<typeof RuiCategoryPicker<string, GroupedSelectOption>>;

function render(args: CategoryPickerProps) {
  return {
    components: { RuiCategoryPicker: RuiCategoryPicker<string, GroupedSelectOption> },
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
    template: `<RuiCategoryPicker v-bind="args" v-model="modelValue" />`,
  };
}

const meta = preview.meta<
  typeof RuiCategoryPicker<string, GroupedSelectOption>,
  Decorator,
  Required<Pick<CategoryPickerProps, 'items'>>
>({
  args: {
    categoryAttr: 'category',
    items: groupedOptions,
    keyAttr: 'id',
    textAttr: 'label',
  },
  argTypes: {
    dense: { control: 'boolean' },
    searchable: { control: 'boolean' },
    showAll: { control: 'boolean' },
  },
  component: RuiCategoryPicker<string, GroupedSelectOption>,
  parameters: {
    docs: { controls: { exclude: ['update:model-value', 'update:search', 'select'] } },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/CategoryPicker',
});

export const Default = meta.story({
  args: {
    label: 'Country',
    modelValue: undefined,
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole('combobox'));
    await waitFor(() => expect(body.getByRole('tablist')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
});

// Density spike at rotki's real scale (16 categories × ~4 verbs).
export const LargeCatalogue = meta.story({
  args: {
    // @ts-expect-error the spike uses the ActionOption shape
    items: actionOptions,
    label: 'Action',
    modelValue: undefined,
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    label: 'Country',
    modelValue: undefined,
  },
});

export const NoSearch = meta.story({
  args: {
    label: 'Country',
    modelValue: undefined,
    searchable: false,
  },
});

export const WithoutAll = meta.story({
  args: {
    label: 'Country',
    modelValue: undefined,
    showAll: false,
  },
});

export const Validation = meta.story({
  args: {
    hint: 'Pick from the grouped list',
    label: 'Country',
    modelValue: undefined,
    required: true,
  },
  render(args: CategoryPickerProps) {
    return {
      components: { RuiCategoryPicker: RuiCategoryPicker<string, GroupedSelectOption> },
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
        const errorMessages = computed<string[]>(() =>
          get(modelValue) ? [] : ['Please choose a country'],
        );
        return { args, errorMessages, modelValue };
      },
      template: `<RuiCategoryPicker v-bind="args" v-model="modelValue" :error-messages="errorMessages" />`,
    };
  },
});

// Force the mobile bottom-sheet + single-pane drill-in on a desktop canvas by
// treating everything below 2xl as "mobile".
export const DrillIn = meta.story({
  args: {
    label: 'Country',
    mobileBreakpoint: '2xl',
    modelValue: undefined,
  },
});

export const CustomSlots = meta.story({
  args: {
    label: 'Country',
    modelValue: undefined,
  },
  render(args: CategoryPickerProps) {
    return {
      components: { RuiCategoryPicker: RuiCategoryPicker<string, GroupedSelectOption> },
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
        <RuiCategoryPicker v-bind="args" v-model="modelValue">
          <template #category="{ label, count }">
            <span class="font-medium truncate">{{ label }}</span>
            <span class="ml-auto pl-2 text-xs opacity-60">{{ count }}</span>
          </template>
          <template #item="{ item, selected }">
            <span :class="{ 'font-bold': selected }">{{ item.label }}</span>
            <span class="ml-2 text-xs opacity-50">{{ item.category }}</span>
          </template>
          <template #selection="{ item }">
            <span class="font-medium">{{ item.label }}</span>
            <span class="ml-2 text-xs opacity-60">({{ item.category }})</span>
          </template>
        </RuiCategoryPicker>
      `,
    };
  },
});
