import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { objectOmit } from '@vueuse/shared';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiBadge, { type Props as BadgeProps } from '@/components/overlays/badge/RuiBadge.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';

type Props = BadgeProps & {
  buttonText?: string | null;
};

const render: StoryFn<Props> = args => ({
  components: { RuiBadge, RuiButton, RuiIcon },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    const badgeArgs = computed(() => objectOmit(args, ['buttonText']));

    return { args, badgeArgs, modelValue };
  },
  template: `
    <div class="text-center p-4">
      <RuiBadge v-bind="badgeArgs" v-model="modelValue">
        <template v-if="args.text" #badge>
          {{ args.text }}
        </template>
        <RuiButton @click="modelValue = !modelValue">
          {{ args.buttonText }}
        </RuiButton>
      </RuiBadge>
    </div>`,
});

const meta: Meta<Props> = {
  args: {
    buttonText: 'Badge',
    color: 'primary',
    dot: false,
    icon: null,
    left: false,
    modelValue: true,
    offsetX: 0,
    offsetY: 0,
    rounded: 'full',
    size: 'md',
    text: '1',
  },
  argTypes: {
    color: { control: 'select', options: ['default', ...contextColors] },
    icon: {
      control: 'select',
      options: [null, ...RuiIcons],
    },
    offsetX: {
      control: 'number',
    },
    offsetY: {
      control: 'number',
    },
    placement: { control: 'select', options: ['top', 'center', 'bottom'] },
    rounded: { control: 'select', options: ['full', 'sm', 'md', 'lg'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    text: {
      control: 'text',
    },
  },
  component: RuiBadge,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'badge'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Badge',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Left: Story = {
  args: {
    left: true,
  },
};

export const Center: Story = {
  args: {
    placement: 'center',
  },
};

export const CenterLeft: Story = {
  args: {
    left: true,
    placement: 'center',
  },
};

export const Bottom: Story = {
  args: {
    placement: 'bottom',
  },
};

export const BottomLeft: Story = {
  args: {
    left: true,
    placement: 'bottom',
  },
};

export const Dot: Story = {
  args: { dot: true },
};

export const DotLeft: Story = {
  args: { dot: true, left: true },
};

export const DotCenter: Story = {
  args: {
    dot: true,
    placement: 'center',
  },
};

export const DotCenterLeft: Story = {
  args: {
    dot: true,
    left: true,
    placement: 'center',
  },
};

export const DotBottom: Story = {
  args: {
    dot: true,
    placement: 'bottom',
  },
};

export const DotBottomLeft: Story = {
  args: {
    dot: true,
    left: true,
    placement: 'bottom',
  },
};

export default meta;
