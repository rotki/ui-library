import { createApp } from 'vue';
import { createRui } from '../src';
import * as Icons from '../src/all-icons';

const RuiPlugin = createRui({
  theme: {
    icons: Object.values(Icons),
  }
})

const app = createApp({ template: '<div />' });
app
  .use(RuiPlugin)
  .mount(null);

export const vueInstance = app;
