<script lang="ts" setup>
import { ref } from 'vue';
import {
  type DialogProps,
  RuiButton,
  RuiCard,
  RuiDialog,
} from '@rotki/ui-library';

interface ExtraProperties {
  label: string;
}

type DialogData = DialogProps & ExtraProperties;
const dialogs = ref<DialogData[]>([
  { label: 'Persistent', persistent: true },
  { label: 'Non Persistent', persistent: false },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="dialogs"
    >
      Dialogs
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6 justify-items-start mb-14">
      <RuiDialog
        v-for="(dialog, i) in dialogs"
        :key="i"
        v-bind="dialog"
        width="900px"
        :data-cy="`dialog-${i}`"
      >
        <template #activator="{ attrs }">
          <RuiButton
            data-cy="activator"
            v-bind="attrs"
          >
            {{ dialog.label }}
          </RuiButton>
        </template>
        <template #default="{ close }">
          <RuiCard no-padding>
            <template #header>
              Header
            </template>
            <template #subheader>
              Subheader
            </template>

            <div class="p-4 pb-0">
              <div class="h-[100px]">
                Contents {{ i }}
              </div>

              <div class="border-t border-default py-4">
                <div class="flex gap-2 w-full justify-end">
                  <RuiButton
                    data-cy="close"
                    variant="outlined"
                    color="primary"
                    @click="close()"
                  >
                    Close
                  </RuiButton>
                </div>
              </div>
            </div>
          </RuiCard>
        </template>
      </RuiDialog>
    </div>
  </div>
</template>
