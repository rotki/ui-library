<script setup lang='ts'>
import {
  RuiButton,
  RuiMenuSelect,
  RuiNotification,
  RuiTextField,
} from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const visible = ref<boolean>(false);
const timeout = ref<string>('0');
const timeoutNum = useToNumber(timeout);

const theme = ref<'light' | 'dark'>();
const options = ['light', 'dark'];
</script>

<template>
  <ComponentView data-id="notification">
    <template #title>
      Notification
    </template>

    <div>
      <RuiButton
        data-id="visibility-toggle"
        @click="visible = !visible"
      >
        {{ visible ? 'Hide' : 'Show' }}
      </RuiButton>
      <RuiTextField
        v-model="timeout"
        type="number"
        variant="outlined"
        label="timeout"
        class="mt-4"
        data-id="timeout"
      />
      <RuiMenuSelect
        v-model="theme"
        :options="options"
        label="theme"
        variant="outlined"
        clearable
        data-id="menu"
      />
    </div>

    <RuiNotification
      v-model="visible"
      :timeout="timeoutNum"
      :theme="theme"
    >
      <div
        class="m-4"
        data-id="notification-content"
      >
        This is a notification
      </div>
    </RuiNotification>
  </ComponentView>
</template>
