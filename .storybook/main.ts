import type { StorybookConfig } from '@storybook/vue3-vite';
import path = require("node:path");

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    }
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: true
  }
};
export default config;
