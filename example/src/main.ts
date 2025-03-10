import App from '@/App.vue';
import { router } from '@/router';
import { useDefaultsStore } from '@/stores/defaults';

import {
  createRui,
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuArrowLeft,
  LuArrowRight,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuCircleAlert,
  LuCircleArrowDown,
  LuCircleCheck,
  LuCopy,
  LuInfo,
  LuMonitor,
  LuMoon,
  LuPlus,
  LuStar,
  LuSun,
  LuTrash2,
  LuX,
} from '@rotki/ui-library';
import { createPinia, storeToRefs } from 'pinia';
import '@/assets/main.css';
import '@rotki/ui-library/style.css';
import '@fontsource/roboto/latin.css';

const app = createApp(App);

app.use(createPinia());
const { itemsPerPage, stickyOffset } = storeToRefs(useDefaultsStore());
const RuiPlugin = createRui({
  theme: {
    icons: [
      LuMoon,
      LuStar,
      LuSun,
      LuMonitor,
      LuArrowLeft,
      LuArrowRight,
      LuPlus,
      LuCircleAlert,
      LuAlignCenter,
      LuAlignLeft,
      LuAlignRight,
      LuAlignJustify,
      LuCopy,
      LuTrash2,
      LuChevronUp,
      LuChevronDown,
      LuChevronLeft,
      LuChevronRight,
      LuInfo,
      LuX,
      LuCircleAlert,
      LuCircleArrowDown,
      LuCircleCheck,
    ],
  },
  defaults: {
    table: {
      itemsPerPage,
      stickyOffset,
      globalItemsPerPage: false,
      limits: [5, 10, 15, 25, 50, 100, 200],
    },
  },
});

app.use(router);
app.use(RuiPlugin);

app.mount('#app');
