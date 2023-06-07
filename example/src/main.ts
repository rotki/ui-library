import '@/assets/main.css';
import '@rotki/ui-library/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  RiArrowRightLine,
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
  icons: [RiMoonLine, RiSunLine, RiMacbookLine, RiArrowRightLine],
});

app.mount('#app');
