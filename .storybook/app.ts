import { createApp } from 'vue';
import { RuiPlugin } from '../src';

const app = createApp({ template: '<div />' });
app.use(RuiPlugin, {}).mount(null);

export const vueInstance = app;
