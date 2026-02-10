import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiLogo from '@/components/logos/RuiLogo.vue';
import preview from '~/.storybook/preview';

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
    branch: { control: 'text' },
    logo: { control: 'text' },
    size: { control: 'text' },
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

export const WithCustomSrc = meta.story({
  args: {
    logo: 'drawer_logo',
  },
});

export const WithCustomSrcAndFallback = meta.story({
  args: {
    logo: 'notfoundkey',
  },
});

export default meta;
