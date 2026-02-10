import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiDivider from '@/components/divider/RuiDivider.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiDivider>) {
  return {
    components: { RuiDivider },
    setup() {
      return { args };
    },
    template: `
      <RuiDivider :class="args.vertical ? 'h-96 mx-4' : 'w-96 my-4'" v-bind="args" />`,
  };
}

const meta = preview.meta({
  argTypes: {
    vertical: { control: 'boolean' },
  },
  component: RuiDivider,
  render,
  tags: ['autodocs'],
  title: 'Components/Divider',
});

export const Default = meta.story({
  args: {},
});

export const Vertical = meta.story({
  args: {
    vertical: true,
  },
});

export default meta;
