<script lang="ts" setup>
import { RuiButton, RuiCategoryPicker } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface CountryOption { id: number; label: string; continent: string }

interface ActionOption { id: string; label: string; category: string }

const countries: CountryOption[] = [
  { continent: 'Europe', id: 1, label: 'Germany' },
  { continent: 'Europe', id: 2, label: 'France' },
  { continent: 'Europe', id: 3, label: 'Spain' },
  { continent: 'Europe', id: 4, label: 'Italy' },
  { continent: 'Asia', id: 5, label: 'India' },
  { continent: 'Asia', id: 6, label: 'Indonesia' },
  { continent: 'Asia', id: 7, label: 'Japan' },
  { continent: 'Africa', id: 8, label: 'Nigeria' },
  { continent: 'Africa', id: 9, label: 'Kenya' },
  { continent: 'Americas', id: 10, label: 'Brazil' },
  { continent: 'Americas', id: 11, label: 'Canada' },
];

// A catalogue at rotki's real scale: 16 categories of history-event verbs.
const actionCatalogue: Record<string, string[]> = {
  Airdrop: ['Claim airdrop', 'Receive airdrop'],
  Approval: ['Approve spender', 'Revoke approval'],
  Bridge: ['Bridge deposit', 'Bridge withdraw', 'Bridge refund'],
  Deposit: ['Deposit asset', 'Deposit collateral', 'Bridge in', 'Fund account'],
  Fee: ['Gas fee', 'Protocol fee', 'Exchange fee'],
  Governance: ['Propose', 'Vote', 'Delegate', 'Execute'],
  Liquidity: ['Add liquidity', 'Remove liquidity', 'Collect fees', 'Migrate position'],
  Loan: ['Borrow', 'Repay', 'Liquidate', 'Roll over'],
  Migration: ['Migrate balance', 'Upgrade contract', 'Move position'],
  NFT: ['Mint', 'Buy NFT', 'Sell NFT', 'Transfer NFT'],
  Reward: ['Claim reward', 'Compound', 'Distribute'],
  Staking: ['Stake', 'Unstake', 'Restake rewards', 'Claim reward', 'Withdraw stake'],
  Swap: ['Swap', 'Wrap', 'Unwrap'],
  Trade: ['Buy', 'Sell', 'Limit order'],
  Transfer: ['Send', 'Receive', 'Internal transfer', 'Gift'],
  Withdrawal: ['Withdraw asset', 'Withdraw collateral', 'Bridge out', 'Redeem'],
};

const actions: ActionOption[] = Object.entries(actionCatalogue).flatMap(
  ([category, labels], groupIndex) => labels.map((label, itemIndex) => ({
    category,
    id: `${groupIndex}-${itemIndex}`,
    label,
  })),
);

const countryValue = ref<number>();
const actionValue = ref<string>();
const denseValue = ref<number>();
const noSearchValue = ref<number>();
</script>

<template>
  <ComponentView data-id="category-pickers">
    <template #title>
      Category Pickers
    </template>

    <div class="grid gap-6 grid-cols-2">
      <div>
        <h3 class="text-subtitle-1 mb-2">
          Default
        </h3>
        <RuiCategoryPicker
          v-model="countryValue"
          :items="countries"
          category-attr="continent"
          key-attr="id"
          text-attr="label"
          label="Country"
          clearable
          data-id="cp-default"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Large catalogue (16 × ~4)
        </h3>
        <RuiCategoryPicker
          v-model="actionValue"
          :items="actions"
          category-attr="category"
          key-attr="id"
          text-attr="label"
          label="Action"
          clearable
          data-id="cp-actions"
        >
          <template #footer="{ close }">
            <div class="flex items-center justify-between gap-2">
              <span class="text-caption text-rui-text-secondary">{{ actions.length }} actions</span>
              <RuiButton
                size="sm"
                variant="text"
                @click="close()"
              >
                Close
              </RuiButton>
            </div>
          </template>
        </RuiCategoryPicker>
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Dense
        </h3>
        <RuiCategoryPicker
          v-model="denseValue"
          :items="countries"
          category-attr="continent"
          key-attr="id"
          text-attr="label"
          label="Country"
          dense
          data-id="cp-dense"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Without search
        </h3>
        <RuiCategoryPicker
          v-model="noSearchValue"
          :items="countries"
          category-attr="continent"
          key-attr="id"
          text-attr="label"
          label="Country"
          :searchable="false"
          data-id="cp-no-search"
        />
      </div>
    </div>
  </ComponentView>
</template>
