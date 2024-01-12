import { createApp, ref } from 'vue';
import { createRui } from '../src';
import * as Icons from '../src/icons';

const RuiPlugin = createRui({
  theme: {
    icons: Object.values(Icons),
  },
  defaults: {
    table: {
      itemsPerPage: ref(10),
      globalItemsPerPage: false,
      limits: [5, 10, 15, 25, 50, 100, 200],
    },
  },
});

const app = createApp({ template: '<div />' });
app.use(RuiPlugin).mount(null);

export const vueInstance = app;
