import { useEffect, useGlobals } from '@storybook/preview-api';
import { type Preview, setup } from '@storybook/vue3';
import { ref } from 'vue';
import { createRui } from '../src';
import { useRotkiTheme } from '../src/composables/theme';
import * as Icons from '../src/icons';
import '../src/style.scss';
import './preview.scss';
import '@fontsource/roboto/latin.css';

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

setup((app) => {
  app.use(RuiPlugin);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: [
          { value: 'auto', title: 'Auto' },
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(story) => {
    const [{ theme }] = useGlobals();
    const { switchThemeScheme } = useRotkiTheme();

    useEffect(() => {
      switchThemeScheme(theme);
    }, [theme]);

    return story();
  }],
};

export default preview;
