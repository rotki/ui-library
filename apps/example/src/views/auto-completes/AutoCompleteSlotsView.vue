<script lang="ts" setup>
import { RuiAutoComplete, RuiIcon } from '@rotki/ui-library/components';
import { createOptions } from '@/data/options';

const options = createOptions();

const placeholderValue = ref<number>();
const footerValue = ref<number>();
const combinedValue = ref<number>();
</script>

<template>
  <div data-id="auto-completes-slots">
    <h2 class="text-2xl font-bold mb-6">
      Custom Slots — Placeholder &amp; Footer
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="placeholderValue"
          clearable
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Custom placeholder slot"
          data-id="ac-slots-placeholder"
        >
          <template #placeholder>
            <span class="flex items-center gap-2 text-rui-text-secondary">
              <RuiIcon
                name="lu-search"
                size="16"
              />
              <span class="italic">Find a country…</span>
            </span>
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="footerValue"
          clearable
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Custom footer slot"
          data-id="ac-slots-footer"
        >
          <template #footer>
            <div
              class="flex items-center justify-between px-3 py-2 text-xs text-rui-text-secondary"
              data-id="footer-hint"
            >
              <span>↑↓ navigate · ↵ select · esc close</span>
              <span class="font-mono">{{ options.length }} items</span>
            </div>
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4 col-span-2">
        <RuiAutoComplete
          v-model="combinedValue"
          clearable
          variant="outlined"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Both slots combined"
          data-id="ac-slots-combined"
        >
          <template #placeholder="{ disabled }">
            <span
              class="flex items-center gap-2"
              :class="disabled ? 'text-rui-text-disabled' : 'text-rui-primary'"
            >
              <RuiIcon
                name="lu-globe"
                size="16"
              />
              <span>Search countries</span>
            </span>
          </template>
          <template #footer>
            <div class="flex items-center gap-2 px-3 py-2 text-xs text-rui-text-secondary">
              <RuiIcon
                name="lu-info"
                size="14"
              />
              <span>Tip: start typing to narrow results.</span>
            </div>
          </template>
        </RuiAutoComplete>
      </div>
    </div>
  </div>
</template>
