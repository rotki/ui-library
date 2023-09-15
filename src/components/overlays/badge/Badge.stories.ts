import { objectOmit } from '@vueuse/shared';
import Icon from '@/components/icons/Icon.vue';
import Button from '@/components/buttons/button/Button.vue';
import { contextColors } from '@/consts/colors';
import * as Icons from '@/all-icons';
import Badge, { type Props as BadgeProps } from './Badge.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = BadgeProps & {
  buttonText?: string | null;
};

const render: StoryFn<Props> = (args) => ({
  components: { Badge, Icon, Button },
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
      <Badge v-bind="badgeArgs" v-model="modelValue">
        <template v-if="args.text" #badge>
          {{ args.text }}
        </template>
        <Button @click="modelValue = !modelValue">
          {{ args.buttonText }}
        </Button>
      </Badge>
    </div>`,
});

const meta: Meta<Props> = {
  title: 'Components/Overlays/Badge',
  component: Badge,
  tags: ['autodocs'],
  render,
  argTypes: {
    text: {
      control: 'text',
    },
    icon: {
      control: 'select',
      options: [null, ...Object.values(Icons).map(({ name }) => name.slice(3))],
    },
    color: { control: 'select', options: ['default', ...contextColors] },
    rounded: { control: 'select', options: ['full', 'sm', 'md', 'lg'] },
    placement: { control: 'select', options: ['top', 'center', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    offsetX: {
      control: 'number',
    },
    offsetY: {
      control: 'number',
    },
  },
  args: {
    text: '1',
    buttonText: 'Badge',
    color: 'primary',
    rounded: 'full',
    size: 'md',
    modelValue: true,
    icon: null,
    dot: false,
    left: false,
    offsetX: 0,
    offsetY: 0,
  },
  parameters: {
    docs: {
      controls: { exclude: ['default', 'badge'] },
    },
  },
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
