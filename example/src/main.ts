import '@/assets/main.css';
import '@rotki/ui-library/style.css';
import '@fontsource/roboto/latin.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
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
  RuiPlugin,
} from '@rotki/ui-library';
import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(RuiPlugin, {
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
});

app.mount('#app');
