import '@/assets/main.css';
import '@rotki/ui-library/style.css';
import '@fontsource/roboto/latin.css';

import { createApp } from 'vue';
import { createPinia, storeToRefs } from 'pinia';
import {
  RiAddFill,
  RiAlertLine,
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowDownCircleLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiCheckboxCircleLine,
  RiCloseFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiMacbookLine,
  RiMoonLine,
  RiStarFill,
  RiSunLine,
  createRui,
} from '@rotki/ui-library';
import App from '@/App.vue';
import router from '@/router';
import { useCounterStore } from '@/stores/counter';

const app = createApp(App);

app.use(createPinia());
const { itemsPerPage } = storeToRefs(useCounterStore());
const RuiPlugin = createRui({
  theme: {
    icons: [
      RiMoonLine,
      RiStarFill,
      RiSunLine,
      RiMacbookLine,
      RiArrowLeftLine,
      RiArrowRightLine,
      RiAddFill,
      RiAlertLine,
      RiAlignCenter,
      RiAlignLeft,
      RiAlignRight,
      RiAlignJustify,
      RiCheckboxCircleLine,
      RiCloseFill,
      RiInformationLine,
      RiErrorWarningLine,
      RiArrowLeftSLine,
      RiArrowRightSLine,
      RiArrowUpSLine,
      RiArrowDownSLine,
      RiArrowDownCircleLine,
    ],
  },
  defaults: {
    table: {
      itemsPerPage,
      globalItemsPerPage: false,
    },
  },
});

app.use(router);
app.use(RuiPlugin);

app.mount('#app');
