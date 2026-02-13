<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const multiNonChipsValue = ref<string[]>(['Lorem', 'Ipsum', 'Dolor']);
const multiChipsValue = ref<string[]>(['Lorem', 'Ipsum', 'Dolor']);
const chipNavValue = ref<string[]>(['Lorem', 'Ipsum', 'Dolor', 'Sit amet']);
const escapeValue = ref<string>();
const formValue = ref<string>('Lorem');
const formSubmitted = ref<boolean>(false);
const reopenValue = ref<string>();

function onFormSubmit(): void {
  formSubmitted.value = true;
}
</script>

<template>
  <div data-cy="auto-completes-keyboard">
    <h2 class="text-2xl font-bold mb-6">
      Keyboard
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="multiNonChipsValue"
          :options="primitiveOptions"
          label="Multi Non-Chips (Backspace)"
          data-cy="ac-kb-multi-no-chips"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="multiChipsValue"
          chips
          :options="primitiveOptions"
          label="Multi Chips (Backspace)"
          data-cy="ac-kb-multi-chips"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="chipNavValue"
          chips
          :options="primitiveOptions"
          label="Chip Navigation (Arrows)"
          data-cy="ac-kb-chip-nav"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="escapeValue"
          :options="primitiveOptions"
          label="Escape to Close"
          data-cy="ac-kb-escape"
        />
      </div>

      <div class="py-4">
        <form
          data-cy="ac-kb-form"
          @submit.prevent="onFormSubmit()"
        >
          <RuiAutoComplete
            v-model="formValue"
            :options="primitiveOptions"
            label="Form Submit (Enter)"
            data-cy="ac-kb-form-submit"
          />
          <div
            v-if="formSubmitted"
            data-cy="form-submitted"
            class="mt-2 text-green-600"
          >
            Form submitted!
          </div>
        </form>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="reopenValue"
          :options="primitiveOptions"
          label="Re-open Highlight"
          data-cy="ac-kb-reopen"
        />
      </div>
    </div>
  </div>
</template>
