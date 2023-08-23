<script lang="ts" setup>
import {
  type ButtonProps,
  type CardProps,
  RuiButton,
  RuiCard,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const sections = ref<
  {
    title: string;
    cards: (CardProps & {
      image?: string;
      header?: string;
      subheader?: string;
      content?: string;
      prepend?: string;
      actions?: (ButtonProps & { text: string })[];
    })[];
  }[]
>([
  {
    title: 'Outline cards: default',
    cards: [
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card header',
        subheader: 'Card subheader',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with divider',
        subheader: 'Card subheader',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        actions: [
          { size: 'sm', variant: 'text', text: 'Action 1', color: 'secondary' },
          { size: 'sm', variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        divide: true,
        actions: [
          { size: 'sm', variant: 'text', text: 'Action 1', color: 'secondary' },
          { size: 'sm', variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        dense: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Divided Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        dense: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
    ],
  },
  {
    title: 'Flat cards',
    cards: [
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card header',
        subheader: 'Card subheader',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with divider',
        subheader: 'Card subheader',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        actions: [
          { size: 'sm', variant: 'text', text: 'Action 1', color: 'secondary' },
          { size: 'sm', variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        divide: true,
        actions: [
          { size: 'sm', variant: 'text', text: 'Action 1', color: 'secondary' },
          { size: 'sm', variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Divided Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Divided Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Dense Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        dense: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Dense Divided Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        dense: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary' },
          { variant: 'text', text: 'Action 2', color: 'primary' },
        ],
      },
    ],
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="cards">Cards</h2>
    <div
      v-for="({ title, cards }, i) in sections"
      :key="title"
      class="flex flex-col space-y-3 mb-14"
    >
      <h4>{{ title }}</h4>
      <div class="grid gap-6 grid-cols-2">
        <div v-for="(card, j) in cards" :key="j">
          <RuiCard
            v-bind="
              objectOmit(card, [
                'image',
                'header',
                'subheader',
                'content',
                'actions',
              ])
            "
            :data-cy="`card-${i}-${j}`"
          >
            <template v-if="card.image" #image>
              <img :src="card.image" alt="card image" />
            </template>

            <template v-if="card.prepend" #prepend>{{ card.prepend }}</template>

            <template v-if="card.header" #header>{{ card.header }}</template>

            <template v-if="card.subheader" #subheader>
              {{ card.subheader }}
            </template>

            <p v-if="card.content">{{ card.content }}</p>

            <template v-if="card.actions" #footer>
              <RuiButton
                v-for="(action, k) in card.actions"
                v-bind="action"
                :key="k"
              >
                {{ action.text }}
              </RuiButton>
            </template>
          </RuiCard>
        </div>
      </div>
    </div>
  </div>
</template>
