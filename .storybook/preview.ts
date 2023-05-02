import '../src/style.css';
import type { Preview } from '@storybook/vue';
import { vueInstance } from './app';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    vueInstance: {
      defaultValue: vueInstance,
      control: { type: 'object' }
    }
  }
};

export default preview;
