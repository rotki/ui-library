import {
  createRui,
  createRuiI8nPlugin,
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
import { createI18n } from 'vue-i18n';

import App from '@/App.vue';
import { router } from '@/router';
import { useDefaultsStore } from '@/stores/defaults';
import '@/assets/main.css';
import '@rotki/ui-library/style.css';
import '@fontsource/roboto/latin.css';

// Create i18n instance
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      // UI library translations
      rui: {
        date_time_picker: {
          date_after_max: 'Date cannot be after {date}',
          date_before_min: 'Date cannot be before {date}',
          date_in_future: 'The selected date cannot be in the future',
        },
      },
    },
  },
});

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

// Create and use the Rotki UI i18n plugin
const RuiI18nPlugin = createRuiI8nPlugin(i18n);

app.use(router);
app.use(RuiPlugin);
app.use(RuiI18nPlugin);
app.use(i18n);

app.mount('#app');
