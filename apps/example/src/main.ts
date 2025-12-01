import {
  createRui,
  createRuiI8nPlugin,
} from '@rotki/ui-library';
import { createPinia, storeToRefs } from 'pinia';
import detectedIcons from 'virtual:rotki-icons';
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
    // Auto-detected icons from source files
    icons: detectedIcons,
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
