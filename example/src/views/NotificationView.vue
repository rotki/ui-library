<script setup lang='ts'>
import {
  RuiButton,
  RuiMenuSelect,
  RuiNotification,
  RuiTextField,
} from '@rotki/ui-library';
import { ref } from 'vue';
import ComponentView from '@/components/ComponentView.vue';

const visible = ref(false);
const timeout = ref('0');
const timeoutNum = useToNumber(timeout);

const theme = ref<'light' | 'dark'>();
const options = ['light', 'dark'];
</script>

<template>
  <ComponentView data-cy="notification">
    <template #title>
      Notification
    </template>

    <div>
      <RuiButton
        data-cy="visibility-toggle"
        @click="visible = !visible"
      >
        {{ visible ? 'Hide' : 'Show' }}
      </RuiButton>
      <RuiTextField
        v-model="timeout"
        type="number"
        label="timeout"
        class="mt-4"
        data-cy="timeout"
      />
      <RuiMenuSelect
        v-model="theme"
        :options="options"
        label="theme"
        variant="outlined"
        clearable
        data-cy="menu"
      />
    </div>

    <RuiNotification
      v-model="visible"
      :timeout="timeoutNum"
      :theme="theme"
    >
      <div
        class="m-4"
        data-cy="notification-content"
      >
        This is a notification
      </div>
    </RuiNotification>
  </ComponentView>
</template>
