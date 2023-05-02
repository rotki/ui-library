import type { StorybookConfig } from '@storybook/vue-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling'
  ],
  framework: {
    name: '@storybook/vue-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};
export default config;
