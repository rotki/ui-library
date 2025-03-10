import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiNavigationDrawer, { type NavigationDrawerProps } from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';

const render: StoryFn<NavigationDrawerProps> = args => ({
  components: { RuiButton, RuiNavigationDrawer },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
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
});

const meta: Meta<NavigationDrawerProps> = {
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
};

type Story = StoryObj<NavigationDrawerProps>;

export const Default: Story = {
  args: {
    temporary: true,
  },
};

export const Right: Story = {
  args: {
    position: 'right',
    temporary: true,
  },
};

export const Persistent: Story = {
  args: {},
};

export default meta;
