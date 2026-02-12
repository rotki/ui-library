import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiNavigationDrawer from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiNavigationDrawer>) {
  return {
    components: { RuiButton, RuiNavigationDrawer },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      return { args, modelValue };
    },
    template: `
      <RuiNavigationDrawer v-bind="args" v-model='modelValue'>
        <template #activator="{ attrs }">
          <RuiButton v-bind="attrs">
            Click me!
          </RuiButton>
        </template>
        <div class="p-4">
          Navigation Drawer
        </div>
      </RuiNavigationDrawer>
    `,
  };
}

const meta = preview.meta({
  args: {
    modelValue: false,
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right'],
      table: { category: 'State' },
    },
    temporary: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: RuiNavigationDrawer,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/NavigationDrawer',
});

export const Default = meta.story({
  args: {
    temporary: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Navigation Drawer')).toBeVisible());
    // Close by clicking the activator (toggles the drawer)
    await userEvent.click(activator);
    await waitFor(() => expect(body.queryByText('Navigation Drawer')).toBeNull());
  },
});

export const Right = meta.story({
  args: {
    position: 'right',
    temporary: true,
  },
});

export const Persistent = meta.story({
  args: {},
});

export default meta;
