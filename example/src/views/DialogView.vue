<script lang="ts" setup>
import {
  type ButtonProps,
  type DialogProps,
  RuiButton,
  RuiDialog,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const sections = ref<
  {
    title: string;
    dialogs: (DialogProps & {
      title?: string;
      description?: string;
      content?: string;
      triggerText?: string;
      actions?: (ButtonProps & { text: string })[];
    })[];
  }[]
>([
  {
    title: 'Medium dialogs: default',
    dialogs: [
      {
        modelValue: false,
        dismissible: false,
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-dismissible',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
          },
        ],
      },
      {
        modelValue: false,
        dismissible: true,
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'dismissible',
      },
      {
        modelValue: false,
        persistent: false,
        dismissible: true,
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-persistent',
      },
      {
        modelValue: false,
        persistent: true,
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'persistent',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
          },
        ],
      },
      {
        modelValue: false,
        persistent: true,
        title: 'Privacy policy',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet consecteur bla blaa '.repeat(1000),
        triggerText: 'scrollable',
        actions: [
          {
            variant: 'text',
            text: 'Disagree',
            color: 'secondary',
          },
          {
            variant: 'text',
            text: 'Agree',
            color: 'primary',
          },
        ],
      },
    ],
  },
  {
    title: 'Small dialogs',
    dialogs: [
      {
        modelValue: false,
        dismissible: false,
        size: 'sm',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-dismissible',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            size: 'sm',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            size: 'sm',
          },
        ],
      },
      {
        modelValue: false,
        dismissible: true,
        size: 'sm',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'dismissible',
      },
      {
        modelValue: false,
        persistent: false,
        dismissible: true,
        size: 'sm',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-persistent',
      },
      {
        modelValue: false,
        persistent: true,
        size: 'sm',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'persistent',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            size: 'sm',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            size: 'sm',
          },
        ],
      },
      {
        modelValue: false,
        persistent: true,
        size: 'sm',
        title: 'Privacy policy',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet consecteur bla blaa '.repeat(1000),
        triggerText: 'scrollable',
        actions: [
          {
            variant: 'text',
            text: 'Disagree',
            color: 'secondary',
            size: 'sm',
          },
          {
            variant: 'text',
            text: 'Agree',
            color: 'primary',
            size: 'sm',
          },
        ],
      },
    ],
  },
  {
    title: 'Large dialogs',
    dialogs: [
      {
        modelValue: false,
        dismissible: false,
        size: 'lg',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-dismissible',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            size: 'lg',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            size: 'lg',
          },
        ],
      },
      {
        modelValue: false,
        dismissible: true,
        size: 'lg',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'dismissible',
      },
      {
        modelValue: false,
        persistent: false,
        dismissible: true,
        size: 'lg',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'non-persistent',
      },
      {
        modelValue: false,
        persistent: true,
        size: 'lg',
        title: 'Dialog title',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet...',
        triggerText: 'persistent',
        actions: [
          {
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            size: 'lg',
          },
          {
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            size: 'lg',
          },
        ],
      },
      {
        modelValue: false,
        persistent: true,
        size: 'lg',
        title: 'Privacy policy',
        description: 'Dialog description',
        content: 'Lorem ipsum dolor sit amet consecteur bla blaa '.repeat(1000),
        triggerText: 'scrollable',
        actions: [
          {
            variant: 'text',
            text: 'Disagree',
            color: 'secondary',
            size: 'lg',
          },
          {
            variant: 'text',
            text: 'Agree',
            color: 'primary',
            size: 'lg',
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="dialogs">Dialogs</h2>
    <div
      v-for="{ title, dialogs } in sections"
      :key="title"
      class="flex flex-col space-y-3 mb-14"
    >
      <h4>{{ title }}</h4>
      <div class="grid gap-2 grid-cols-5">
        <div v-for="(dialog, i) in dialogs" :key="i">
          <RuiButton color="primary" @click="dialog.modelValue = true">
            {{ dialog.triggerText }}
          </RuiButton>
          <RuiDialog
            v-bind="
              objectOmit(dialog, ['title', 'description', 'content', 'actions'])
            "
            v-model="dialog.modelValue"
            :data-cy="`dialog-${i}`"
          >
            <template v-if="dialog.description" #description>
              {{ dialog.description }}
            </template>
            <template v-if="dialog.title" #title>{{ dialog.title }}</template>
            <p v-if="dialog.content">{{ dialog.content }}</p>
            <template v-if="dialog.actions" #actions>
              <RuiButton
                v-for="(action, j) in dialog.actions"
                v-bind="action"
                :key="j"
                @click="dialog.modelValue = false"
              >
                {{ action.text }}
              </RuiButton>
            </template>
          </RuiDialog>
        </div>
      </div>
    </div>
  </div>
</template>
