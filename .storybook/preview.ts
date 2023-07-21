import '../src/style.scss';
import './preview.scss';
import type { Preview } from '@storybook/vue3';
import { vueInstance } from './app';

import { useEffect, useGlobals } from '@storybook/addons';
import { useRotkiTheme } from '../src';

export const useTheme = (StoryFn) => {
  const [{ theme }] = useGlobals();
  const { switchThemeScheme } = useRotkiTheme();

  useEffect(() => {
    switchThemeScheme(theme);
  }, [theme]);

  return StoryFn();
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    vueInstance: {
      defaultValue: vueInstance,
      control: { type: 'object' }
    }
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' }
        ],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
  decorators: [useTheme],
};

export default preview;
