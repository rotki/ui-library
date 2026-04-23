import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiButton>) {
  return {
    components: { RuiButton },
    setup() {
      const clicks = ref(0);
      return { args, clicks };
    },
    template: `
    <RuiButton v-bind="args" @click="clicks++">
      <template #prepend></template>
      {{ args.label }}
      <template #append></template>
    </RuiButton>
    <div class="mt-4 text-rui-text">Clicked: {{ clicks }} times</div>
  `,
  };
}

const meta = preview.meta({
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    elevation: { control: 'number', table: { category: 'Shape' } },
    hideFocusIndicator: { control: 'boolean' },
    icon: { control: 'boolean', table: { category: 'Shape' } },
    label: { control: 'text' },
    loading: { control: 'boolean', table: { category: 'State' } },
    rounded: { control: 'boolean', table: { category: 'Shape' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg', 'xl'] },
    type: { control: 'select', options: ['button', 'submit'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text', 'fab', 'list'],
      table: { category: 'Shape' },
    },
  },
  component: RuiButton,
  parameters: {
    docs: {
      controls: { exclude: ['prepend', 'append', 'default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Button/Button',
});

export const Default = meta.story({
  args: {
    label: 'Default',
  },
});

export const HideFocusIndicator = meta.story({
  args: {
    hideFocusIndicator: true,
    label: 'No focus outline',
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    label: 'Medium',
  },
  async play({ canvas, userEvent }) {
    const button = canvas.getByRole('button');
    await expect(canvas.getByText('Clicked: 0 times')).toBeVisible();
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked: 1 times')).toBeVisible();
  },
});

export const PrimaryText = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    variant: 'text',
  },
});

export const PrimaryRounded = meta.story({
  args: {
    color: 'primary',
    label: 'Medium',
    rounded: true,
  },
});

export const PrimarySmall = meta.story({
  args: {
    color: 'primary',
    label: 'Small',
    size: 'sm',
  },
});

export const PrimaryLarge = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    size: 'lg',
  },
});

export const PrimaryExtraLarge = meta.story({
  args: {
    color: 'primary',
    label: 'Extra Large',
    size: 'xl',
  },
});

export const AutoSizedIcon = meta.story({
  args: {
    color: 'primary',
    label: 'Refresh',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `<RuiIcon>` is used inside a button without an explicit `size` prop, it inherits a size proportional to the button height (sm → 1rem, md → 1.125rem, lg → 1.25rem, xl → 1.375rem). Sizing flows through the `--rui-icon-size` custom property: the button seeds it per size variant, and the icon reads it via `width: var(--rui-icon-size, 1.5rem)`. A consumer passing `size` on `<RuiIcon>` still wins because that path stamps an inline style on the svg itself (see `ConsumerIconSizeOverride`).',
      },
    },
  },
  render: args => ({
    components: { RuiButton, RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-4">
        <RuiButton v-bind="args" size="sm">
          <template #prepend><RuiIcon name="lu-refresh-ccw" /></template>
          Small
        </RuiButton>
        <RuiButton v-bind="args">
          <template #prepend><RuiIcon name="lu-refresh-ccw" /></template>
          Medium
        </RuiButton>
        <RuiButton v-bind="args" size="lg">
          <template #prepend><RuiIcon name="lu-refresh-ccw" /></template>
          Large
        </RuiButton>
        <RuiButton v-bind="args" size="xl">
          <template #prepend><RuiIcon name="lu-refresh-ccw" /></template>
          Extra Large
        </RuiButton>
      </div>
    `,
  }),
});

export const IconOnlySizes = meta.story({
  args: {
    color: 'primary',
    variant: 'text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only buttons (`icon` prop) land at the same height as text buttons of the matching `size` (sm 28px, md 32px, lg 36px, xl 44px) with a ~60–70% icon-to-box ratio.',
      },
    },
  },
  render: args => ({
    components: { RuiButton, RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-4">
        <RuiButton v-bind="args" icon size="sm" aria-label="small">
          <RuiIcon name="lu-settings" />
        </RuiButton>
        <RuiButton v-bind="args" icon aria-label="medium">
          <RuiIcon name="lu-settings" />
        </RuiButton>
        <RuiButton v-bind="args" icon size="lg" aria-label="large">
          <RuiIcon name="lu-settings" />
        </RuiButton>
        <RuiButton v-bind="args" icon size="xl" aria-label="extra large">
          <RuiIcon name="lu-settings" />
        </RuiButton>
      </div>
    `,
  }),
});

export const IconOnlyVsText = meta.story({
  args: {
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only and text buttons at the same `size` render at matching heights, so they line up cleanly when mixed in a toolbar.',
      },
    },
  },
  render: args => ({
    components: { RuiButton, RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <RuiButton v-bind="args" size="sm">Small</RuiButton>
          <RuiButton v-bind="args" variant="text" icon size="sm" aria-label="small icon">
            <RuiIcon name="lu-ellipsis-vertical" />
          </RuiButton>
        </div>
        <div class="flex items-center gap-3">
          <RuiButton v-bind="args">Medium</RuiButton>
          <RuiButton v-bind="args" variant="text" icon aria-label="medium icon">
            <RuiIcon name="lu-ellipsis-vertical" />
          </RuiButton>
        </div>
        <div class="flex items-center gap-3">
          <RuiButton v-bind="args" size="lg">Large</RuiButton>
          <RuiButton v-bind="args" variant="text" icon size="lg" aria-label="large icon">
            <RuiIcon name="lu-ellipsis-vertical" />
          </RuiButton>
        </div>
        <div class="flex items-center gap-3">
          <RuiButton v-bind="args" size="xl">Extra Large</RuiButton>
          <RuiButton v-bind="args" variant="text" icon size="xl" aria-label="xl icon">
            <RuiIcon name="lu-ellipsis-vertical" />
          </RuiButton>
        </div>
      </div>
    `,
  }),
});

export const ConsumerIconSizeOverride = meta.story({
  args: {
    color: 'primary',
    variant: 'text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A `size` prop on `<RuiIcon>` overrides the button-driven glyph size. The icon stamps `style="--rui-icon-size: <n>px"` on its own svg, which beats the value inherited from the button (inline style wins over any inherited custom property, including ones flagged `!important` on an ancestor). This is the case from rotki/ui-library#512 — before the fix, the icon-library\'s `!w-X` descendant rule always won and the `size` prop was a no-op inside any button.',
      },
    },
  },
  render: args => ({
    components: { RuiButton, RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <RuiButton v-bind="args" icon size="sm" aria-label="default sm icon-only">
            <RuiIcon name="lu-copy" />
          </RuiButton>
          <RuiButton v-bind="args" icon size="sm" aria-label="overridden sm icon-only">
            <RuiIcon name="lu-copy" :size="14" />
          </RuiButton>
          <span class="text-rui-text-secondary text-sm">sm icon-only button — default 20px glyph vs. consumer-forced 14px</span>
        </div>
        <div class="flex items-center gap-4">
          <RuiButton v-bind="args" size="lg">
            <template #prepend><RuiIcon name="lu-plus" /></template>
            Default
          </RuiButton>
          <RuiButton v-bind="args" size="lg">
            <template #prepend><RuiIcon name="lu-plus" :size="12" /></template>
            Tiny icon
          </RuiButton>
          <RuiButton v-bind="args" size="lg">
            <template #prepend><RuiIcon name="lu-plus" :size="24" /></template>
            Oversized icon
          </RuiButton>
        </div>
      </div>
    `,
  }),
});

export const ListVariantWithIcons = meta.story({
  args: {
    color: 'primary',
    variant: 'list',
  },
  parameters: {
    docs: {
      description: {
        story:
          'List-variant buttons (used inside menus) keep the same icon-size contract as every other variant: the glyph scales in lockstep with the button `size`, and a consumer-supplied `size` on `<RuiIcon>` still wins. Use this story as the visual baseline for text-baseline alignment against the icon — rows should center cleanly without clipping or drift.',
      },
    },
  },
  render: args => ({
    components: { RuiButton, RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="w-64 border border-rui-grey-200 dark:border-rui-grey-800 rounded-md overflow-hidden divide-y divide-rui-grey-200 dark:divide-rui-grey-800">
        <RuiButton v-bind="args" size="sm">
          <template #prepend><RuiIcon name="lu-settings" /></template>
          Small row
        </RuiButton>
        <RuiButton v-bind="args">
          <template #prepend><RuiIcon name="lu-settings" /></template>
          Medium row
        </RuiButton>
        <RuiButton v-bind="args" size="lg">
          <template #prepend><RuiIcon name="lu-settings" /></template>
          Large row
        </RuiButton>
        <RuiButton v-bind="args" size="xl">
          <template #prepend><RuiIcon name="lu-settings" /></template>
          Extra large row
        </RuiButton>
        <RuiButton v-bind="args">
          <template #prepend><RuiIcon name="lu-settings" :size="12" /></template>
          Medium row with forced 12px icon
        </RuiButton>
      </div>
    `,
  }),
});

export const PrimaryLargeRounded = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    rounded: true,
    size: 'lg',
  },
});

export const PrimaryDisabled = meta.story({
  args: {
    color: 'primary',
    disabled: true,
    label: 'Medium',
  },
});

export const PrimaryOutlined = meta.story({
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
  },
});

export const PrimaryLoading = meta.story({
  args: {
    color: 'primary',
    label: 'Primary Loading',
    loading: true,
  },
});

export const PrimaryOutlinedWithElevation = meta.story({
  args: {
    color: 'primary',
    elevation: 4,
    label: 'Primary Outlined',
    variant: 'outlined',
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    label: 'Secondary Button',
  },
});

export const SecondaryText = meta.story({
  args: {
    color: 'secondary',
    label: 'Secondary Button',
    size: 'lg',
    variant: 'text',
  },
});

export const SecondaryOutlined = meta.story({
  args: {
    color: 'secondary',
    label: 'Outlined Button',
    variant: 'outlined',
  },
});

export const ErrorButton = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
  },
});

export const ErrorButtonText = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
    size: 'lg',
    variant: 'text',
  },
});

export const ErrorOutlined = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
    variant: 'outlined',
  },
});

export const ErrorOutlinedDisabled = meta.story({
  args: {
    color: 'error',
    disabled: true,
    label: 'Error Button',
    variant: 'outlined',
  },
});

export const List = meta.story({
  render() {
    return {
      components: { RuiButton },
      template: `
        <div class="w-64 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
          <RuiButton variant="list">Dashboard</RuiButton>
          <RuiButton variant="list" active>Settings</RuiButton>
          <RuiButton variant="list">Profile</RuiButton>
          <RuiButton variant="list" disabled>Admin</RuiButton>
        </div>`,
    };
  },
});

export const FloatingActionButton = meta.story({
  args: {
    color: 'primary',
    label: 'Floating Action Button',
    variant: 'fab',
  },
});

export default meta;
