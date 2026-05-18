import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiFileUpload from '@/components/forms/file-upload/RuiFileUpload.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiFileUpload>) {
  return {
    components: { RuiFileUpload },
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
    template: `<RuiFileUpload v-model="modelValue" v-bind="args" />`,
  };
}

const meta = preview.meta({
  args: {
    accept: '*',
    errorMessages: [],
    modelValue: undefined,
  },
  argTypes: {
    accept: { control: 'text' },
    clickToUploadText: { control: 'text' },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    loading: { control: 'boolean', table: { category: 'State' } },
    maxSize: { control: 'number' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    multiple: { control: 'boolean' },
    noDrop: { control: 'boolean' },
    replaceText: { control: 'text' },
    uploaded: { control: 'boolean', table: { category: 'State' } },
    uploadText: { control: 'text' },
  },
  component: RuiFileUpload,
  parameters: {
    docs: {
      controls: { exclude: ['preview', 'icon', 'description'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/FileUpload',
});

export const Default = meta.story({
  args: {
    accept: '.csv',
    hint: 'Only .csv files are accepted',
  },
});

export const Multiple = meta.story({
  args: {
    accept: '*',
    multiple: true,
    hint: 'Drop one or more files',
  },
});

export const ImageOnly = meta.story({
  args: {
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    hint: 'Up to 5 MB, jpg/png/webp',
  },
});

export const NoDrop = meta.story({
  args: {
    accept: 'image/*',
    noDrop: true,
    hint: 'Click only — drag and drop disabled',
  },
});

export const Loading = meta.story({
  args: {
    loading: true,
  },
});

export const Progress = meta.story({
  args: {
    loading: true,
    progress: 42,
  },
});

export const Uploaded = meta.story({
  args: {
    uploaded: true,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const WithErrorMessages = meta.story({
  args: {
    errorMessages: ['Something went wrong'],
  },
});

export default meta;
