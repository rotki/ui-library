import { createApp } from 'vue';
import { RuiPlugin } from '../src';
import * as Icons from '../all-icons';

const app = createApp({ template: '<div />' });
app
  .use(RuiPlugin, {
    icons: Object.values(Icons),
  })
  .mount(null);

export const vueInstance = app;
