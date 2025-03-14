<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import {
  type ButtonProps,
  type CardProps,
  RuiButton,
  RuiCard,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';

interface CardData {
  title: string;
  cards: (CardProps & {
    image?: string;
    header?: string;
    customHeader?: string;
    subheader?: string;
    content?: string;
    prepend?: string;
    actions?: (ButtonProps & {
      text: string;
      clicks: number;
    })[];
  })[];
}

const sections = ref<CardData[]>([
  {
    title: 'Outline cards: default',
    cards: [
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card header',
        subheader: 'Card subheader',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with divider',
        subheader: 'Card subheader',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        actions: [
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            clicks: 0,
          },
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            clicks: 0,
          },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        divide: true,
        actions: [
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            clicks: 0,
          },
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            clicks: 0,
          },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        dense: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card without footer',
        subheader: 'Card subheader',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card without footer',
        subheader: 'Card subheader',
        divide: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card without footer',
        subheader: 'Card subheader',
        prepend: 'OP',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card without footer',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card without footer',
        subheader: 'Card subheader',
        prepend: 'OP',
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Divided Card without footer',
        subheader: 'Card subheader',
        prepend: 'OP',
        divide: true,
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        customHeader: 'Dense with Custom header',
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        customHeader: 'Divided with Custom header',
        divide: true,
        dense: true,
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with divider',
        subheader: 'Card subheader',
        divide: true,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Dense Card',
        subheader: 'Card subheader',
        dense: true,
        actions: [
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            clicks: 0,
          },
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            clicks: 0,
          },
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
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 1',
            color: 'secondary',
            clicks: 0,
          },
          {
            size: 'sm',
            variant: 'text',
            text: 'Action 2',
            color: 'primary',
            clicks: 0,
          },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Elevated Card',
        subheader: 'Card subheader',
        elevation: 1,
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with Image',
        subheader: 'Card subheader',
        image: 'https://placehold.co/480x160',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        variant: 'flat',
        header: 'Card with title prepend',
        subheader: 'Card subheader',
        prepend: 'OP',
        actions: [
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
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
          { variant: 'text', text: 'Action 1', color: 'secondary', clicks: 0 },
          { variant: 'text', text: 'Action 2', color: 'primary', clicks: 0 },
        ],
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
        divide: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
        prepend: 'OP',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
        prepend: 'OP',
        divide: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
        prepend: 'OP',
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Dense Divided Card without footer',
        subheader: 'Card subheader',
        variant: 'flat',
        prepend: 'OP',
        divide: true,
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        customHeader: 'Dense with Custom header',
        variant: 'flat',
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        customHeader: 'Divided with Custom header',
        variant: 'flat',
        divide: true,
        dense: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with small border radius',
        subheader: 'Card subheader',
        variant: 'outlined',
        prepend: 'OP',
        rounded: 'sm',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Divided Card with large border radius',
        subheader: 'Card subheader',
        variant: 'outlined',
        prepend: 'OP',
        rounded: 'lg',
        divide: true,
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with image and small border radius',
        subheader: 'Card subheader',
        variant: 'outlined',
        prepend: 'OP',
        rounded: 'sm',
        image: 'https://placehold.co/480x160',
      },
      {
        content: 'Lorem ipsum dolor sit amet consect '.repeat(4),
        header: 'Card with image and large border radius',
        subheader: 'Card subheader',
        variant: 'outlined',
        prepend: 'OP',
        rounded: 'lg',
        image: 'https://placehold.co/480x160',
      },
    ],
  },
]);
</script>

<template>
  <ComponentView data-cy="cards">
    <template #title>
      Cards
    </template>

    <div
      v-for="({ title, cards }, i) in sections"
      :key="title"
      class="flex flex-col space-y-3 mb-14"
    >
      <h4>{{ title }}</h4>
      <div class="grid gap-6 grid-cols-2">
        <div
          v-for="(card, j) in cards"
          :key="j"
        >
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
            <template
              v-if="card.image"
              #image
            >
              <img
                :src="card.image"
                alt="card image"
              />
            </template>

            <template
              v-if="card.customHeader"
              #custom-header
            >
              <h5 class="p-4 text-rui-error text-h5">
                {{ card.customHeader }}
              </h5>
            </template>

            <template
              v-if="card.prepend"
              #prepend
            >
              {{ card.prepend }}
            </template>

            <template
              v-if="card.header"
              #header
            >
              {{ card.header }}
            </template>

            <template
              v-if="card.subheader"
              #subheader
            >
              {{ card.subheader }}
            </template>

            <p v-if="card.content">
              {{ card.content }}
            </p>

            <template
              v-if="card.actions"
              #footer
            >
              <RuiButton
                v-for="(action, k) in card.actions"
                v-bind="objectOmit(action, ['clicks', 'text'])"
                :key="k"
                :data-cy="`card-action-${k}`"
                @click="action.clicks++"
              >
                {{ action.text }}
                {{ action.clicks ? ` [clicks: ${action.clicks}]` : '' }}
              </RuiButton>
            </template>
          </RuiCard>
        </div>
      </div>
    </div>
  </ComponentView>
</template>
