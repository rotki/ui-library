import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { definePreview, setup } from '@storybook/vue3-vite';
import { useEffect, useGlobals } from 'storybook/preview-api';
import { useRotkiTheme } from '@/composables/theme';
import { RuiPlugin } from './rui';
import './preview.css';
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/geist-mono';

setup((app) => {
  app.use(RuiPlugin);
});

// A docs page without stories never runs the theme decorator, so the theme class is set on load too
useRotkiTheme();

export default definePreview({
  addons: [addonA11y(), addonDocs()],
  parameters: {
    // every story passes axe, so a new violation fails the story test run; exceptions are set per story
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    /*
     * Grouped by purpose, foundations first. Components are listed rather than sorted, since the
     * alphabetical method would also reorder each component's stories and move Default down.
     */
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colors', 'Tokens', 'Typography', 'Icons'],
          'Actions',
          ['Button', 'Button Group'],
          'Forms',
          ['Text Field', 'Text Area', 'Revealable Text Field', 'Menu Select', 'Auto Complete', 'Simple Select', 'Category Picker', 'Checkbox', 'Checkbox Group', 'Radio', 'Radio Group', 'Switch', 'Slider', 'Color Picker', 'File Upload'],
          'Date & Time',
          ['Calendar', 'Date Time Picker', 'Time Picker', 'Timezone Select'],
          'Data Display',
          ['Data Table', 'Table', 'Chip', 'Badge', 'Avatar', 'Avatar Group', 'Card', 'Divider', 'Icon', 'Logo'],
          'Feedback',
          ['Alert', 'Notification', 'Progress', 'Skeleton'],
          'Navigation',
          ['Tabs', 'Stepper', 'Footer Stepper', 'Accordion', 'Navigation Drawer'],
          'Overlays',
          ['Dialog', 'Bottom Sheet', 'Menu', 'Tooltip'],
        ],
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
});
