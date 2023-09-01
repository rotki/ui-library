import { createRouter, createWebHistory } from 'vue-router';
import ButtonView from '@/views/ButtonView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return new Promise((resolve) => {
        savedPosition.behavior = 'smooth';
        setTimeout(() => resolve(savedPosition), 100);
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve({ left: 0, top: 0, behavior: 'smooth' }), 100);
    });
  },
  routes: [
    {
      path: '/',
      name: 'buttons',
      component: ButtonView,
    },
    {
      path: '/icons',
      name: 'icons',
      component: () => import('@/views/IconView.vue'),
    },
    {
      path: '/checkboxes',
      name: 'checkboxes',
      component: () => import('@/views/CheckboxView.vue'),
    },
    {
      path: '/radios',
      name: 'radios',
      component: () => import('@/views/RadioView.vue'),
    },
    {
      path: '/text-fields',
      name: 'text-fields',
      component: () => import('@/views/TextFieldView.vue'),
    },
    {
      path: '/auto-complete',
      name: 'auto-complete',
      component: () => import('@/views/AutoCompleteView.vue'),
    },
    {
      path: '/steppers',
      name: 'steppers',
      component: () => import('@/views/StepperView.vue'),
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/ProgressView.vue'),
    },
    {
      path: '/chips',
      name: 'chips',
      component: () => import('@/views/ChipView.vue'),
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@/views/AlertView.vue'),
    },
    {
      path: '/tooltips',
      name: 'tooltips',
      component: () => import('@/views/TooltipView.vue'),
    },
    {
      path: '/data-tables',
      name: 'data-tables',
      component: () => import('@/views/DataTableView.vue'),
    },
    {
      path: '/dialogs',
      name: 'dialogs',
      component: () => import('@/views/DialogView.vue'),
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('@/views/CardView.vue'),
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: () => import('@/views/TabView.vue'),
    },
  ],
});

export default router;
