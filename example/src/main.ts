import '@/assets/main.css';
import '@rotki/ui-library/style.css';
import '@fontsource/roboto/latin.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  RiAddFill,
  RiAlertLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCloseFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiMacbookLine,
  RiMoonLine,
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
    RiSunLine,
    RiMacbookLine,
    RiArrowLeftLine,
    RiArrowRightLine,
    RiAddFill,
    RiAlertLine,
    RiCheckboxCircleLine,
    RiCloseFill,
    RiInformationLine,
    RiErrorWarningLine,
  ],
});

app.mount('#app');
