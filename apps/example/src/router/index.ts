import { useOverlayStack } from '@rotki/ui-library';
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

/**
 * Turns a back gesture into "close the topmost overlay" whenever one is up.
 *
 * A dialog is not a history entry, so without this a back press pops the entry
 * underneath it and leaves the page it was sitting on. Telling a pop from a push
 * apart is the consumer's business rather than the library's, and vue-router
 * already knows: its own history listener is handed the direction, and it runs
 * before the guards because it is what starts the navigation. A raw `popstate`
 * listener cannot be relied on here, since the restoration of an aborted pop is
 * itself a pop and would read as a second gesture.
 */
const { dismissTop } = useOverlayStack();

let direction: string | undefined;

router.options.history.listen((_to, _from, info) => {
  direction = info.direction;
});

router.beforeEach(() => {
  const isBack = direction === 'back';
  direction = undefined;

  if (!isBack)
    return true;

  // Aborting the pop makes vue-router restore the entry it moved from
  return !dismissTop();
});
