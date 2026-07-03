import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return new Promise((resolve) => {
        savedPosition.behavior = 'smooth';
        setTimeout(resolve, 100, savedPosition);
      });
    }

    return new Promise((resolve) => {
      setTimeout(resolve, 100, { left: 0, top: 0, behavior: 'smooth' });
    });
  },
  routes,
});
