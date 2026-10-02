import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiLogo from '@/components/logos/RuiLogo.vue';
import { type LogoResolver, LogoSymbol } from '@/composables/defaults/logo';
import preview from '~/.storybook/preview';

const seasonalLogo = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#7e4a3b"/><text x="24" y="31" font-size="20" text-anchor="middle" fill="white">r</text></svg>',
)}`;

function renderWithResolver(resolve: LogoResolver) {
  return (args: ComponentPropsAndSlots<typeof RuiLogo>) => ({
    components: { RuiLogo },
    setup() {
      provide(LogoSymbol, { resolve });
      return { args };
    },
    template: `<RuiLogo v-bind="args" />`,
  });
}

function render(args: ComponentPropsAndSlots<typeof RuiLogo>) {
  return {
    components: { RuiLogo },
    setup() {
      return { args };
    },
    template: `<RuiLogo v-bind="args" />`,
  };
}

const meta = preview.meta({
  argTypes: {
    logo: { control: 'text' },
    size: { control: 'text' },
    src: { control: 'text' },
    text: { control: 'boolean' },
  },
  component: RuiLogo,
  render,
  tags: ['autodocs'],
  title: 'Components/Logo',
});

export const Default = meta.story({
  args: {},
});

export const WithText = meta.story({
  args: {
    text: true,
  },
});

export const WithSrc = meta.story({
  args: {
    src: seasonalLogo,
  },
});

export const WithResolver = meta.story({
  args: {
    logo: 'app',
  },
  render: renderWithResolver(() => seasonalLogo),
});

export const WithResolverMiss = meta.story({
  args: {
    logo: 'notfoundkey',
  },
  render: renderWithResolver(() => undefined),
});

export default meta;
