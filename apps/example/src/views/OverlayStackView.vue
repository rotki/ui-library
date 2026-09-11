<script lang="ts" setup>
import { RuiBottomSheet, RuiButton, RuiCard, RuiDialog, useOverlayStack } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const outer = ref<boolean>(false);
const inner = ref<boolean>(false);
const guarded = ref<boolean>(false);
const sheet = ref<boolean>(false);
const refusals = ref<number>(0);

const { hasOverlay } = useOverlayStack();

function onGuardedDismiss(): void {
  set(refusals, get(refusals) + 1);
}
</script>

<template>
  <ComponentView data-id="overlay-stack">
    <template #title>
      Overlay stack
    </template>

    <div class="flex flex-col gap-4 items-start">
      <p
        class="text-body-1"
        data-id="has-overlay"
      >
        Something is covering the page: {{ hasOverlay }}
      </p>

      <div class="flex gap-3">
        <RuiButton
          color="primary"
          data-id="open-outer"
          @click="outer = true"
        >
          Open a dialog
        </RuiButton>
        <RuiButton
          color="warning"
          data-id="open-guarded"
          @click="guarded = true"
        >
          Open a persistent one
        </RuiButton>
        <RuiButton
          color="secondary"
          data-id="open-sheet"
          @click="sheet = true"
        >
          Open a bottom sheet
        </RuiButton>
      </div>

      <p
        class="text-body-2 text-rui-text-secondary"
        data-id="refusals"
      >
        The persistent dialog refused {{ refusals }} times
      </p>
    </div>

    <RuiDialog
      v-model="outer"
      data-id="outer-dialog"
      max-width="500px"
    >
      <RuiCard>
        <template #header>
          Outer
        </template>
        <p class="mb-4">
          Press back and this closes instead of leaving the page.
        </p>
        <div class="flex gap-3 items-center">
          <RuiButton
            color="primary"
            data-id="open-inner"
            @click="inner = true"
          >
            Open another on top
          </RuiButton>
          <RouterLink
            class="text-rui-primary underline"
            data-id="link-from-dialog"
            to="/tables"
          >
            Go somewhere else
          </RouterLink>
        </div>

        <RuiDialog
          v-model="inner"
          data-id="inner-dialog"
          max-width="400px"
        >
          <RuiCard>
            <template #header>
              Inner
            </template>
            <p>Back takes this one first, then the outer one.</p>
          </RuiCard>
        </RuiDialog>
      </RuiCard>
    </RuiDialog>

    <RuiBottomSheet
      v-model="sheet"
      data-id="sheet"
    >
      <RuiCard>
        <template #header>
          Bottom sheet
        </template>
        <p data-id="sheet-body">
          A sheet is a dialog, so back reaches it the same way.
        </p>
      </RuiCard>
    </RuiBottomSheet>

    <RuiDialog
      v-model="guarded"
      data-id="guarded-dialog"
      max-width="500px"
      persistent
      @dismiss="onGuardedDismiss()"
    >
      <RuiCard>
        <template #header>
          Persistent
        </template>
        <p class="mb-4">
          Back is swallowed rather than passed through, and this stays up.
        </p>
        <RuiButton
          color="primary"
          data-id="close-guarded"
          @click="guarded = false"
        >
          Close
        </RuiButton>
      </RuiCard>
    </RuiDialog>
  </ComponentView>
</template>
