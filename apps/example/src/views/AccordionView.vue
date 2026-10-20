<script lang="ts" setup>
import { RuiAccordion, RuiAccordions } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface AccordionItem {
  label: string;
  multiple?: boolean;
  modelValue?: number | number[];
}

const accordions = ref<AccordionItem[]>([
  {
    label: 'Single',
    multiple: false,
  },
  {
    label: 'Multiple',
    multiple: true,
  },
]);

const stickyOpen = ref<number>(0);

// the panel clips the hover fill to its corners, so the focus ring is drawn inside the header
const headerClass = 'px-4 py-3 font-medium hover:bg-rui-hover focus-visible:-outline-offset-2 focus-visible:rounded-none';
</script>

<template>
  <ComponentView data-id="accordions">
    <template #title>
      Accordions
    </template>

    <div
      class="grid gap-4 grid-cols-2 mb-14"
      data-id="accordions-wrapper"
    >
      <template
        v-for="(accordion, i) in accordions"
        :key="i"
      >
        <div
          class="flex flex-col gap-3"
          :data-id="`wrapper-${i}`"
        >
          <h3 class="text-body-1 font-medium">
            {{ accordion.label }}
          </h3>
          <div class="overflow-hidden rounded-rui-panel border border-rui-divider bg-rui-surface">
            <RuiAccordions
              v-model="accordion.modelValue"
              :multiple="accordion.multiple"
              class="divide-y divide-rui-divider"
              data-id="accordions"
            >
              <RuiAccordion
                v-for="n in 2"
                :key="n"
                header-grow
                :class-names="{ header: headerClass }"
              >
                <template #header>
                  Accordion {{ n }} Header
                </template>
                <p class="px-4 pb-4 text-body-2 text-rui-text-secondary">
                  Accordion {{ n }} Content
                </p>
              </RuiAccordion>
            </RuiAccordions>
          </div>
          <div class="text-body-2 text-rui-text-secondary">
            Selected value: {{ accordion.modelValue ?? 'none' }}
          </div>
        </div>
      </template>
    </div>

    <h4 class="mt-10 mb-3">
      Sticky content inside an open accordion
    </h4>
    <RuiAccordions
      v-model="stickyOpen"
      data-id="sticky-accordions"
    >
      <RuiAccordion header-grow>
        <template #header>
          Transactions
        </template>
        <div
          class="sticky top-0 z-1 bg-rui-surface-muted px-4 py-2 text-body-2 font-medium"
          data-id="sticky-accordion-header"
        >
          Date and amount
        </div>
        <p
          v-for="n in 40"
          :key="n"
          class="px-4 py-2 text-body-2"
        >
          Transaction {{ n }}
        </p>
      </RuiAccordion>
    </RuiAccordions>
  </ComponentView>
</template>
