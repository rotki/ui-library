import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiFileUpload from '@/components/forms/file-upload/RuiFileUpload.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiFileUpload>) {
  return mount(RuiFileUpload, {
    ...options,
    global: { stubs: ['rui-icon', 'rui-progress'] },
  });
}

function makeFile(name: string, options: { type?: string; size?: number } = {}) {
  const { type = 'text/plain', size = 10 } = options;
  const file = new File(['x'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

function emitChange(wrapper: ReturnType<typeof createWrapper>, files: File[]): Promise<void> {
  const input = wrapper.find<HTMLInputElement>('input[type=file]');
  Object.defineProperty(input.element, 'files', {
    value: files,
    configurable: true,
  });
  return input.trigger('change');
}

describe('components/forms/file-upload/RuiFileUpload.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders the dropzone with default copy and no file', () => {
    wrapper = createWrapper({ props: { modelValue: undefined } });
    expect(wrapper.text()).toContain('Drag and drop or');
    expect(wrapper.text()).toContain('click to upload');
    expect(wrapper.find('[data-id=file-list]').exists()).toBeFalsy();
  });

  it('emits the selected file via v-model', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined } });
    const file = makeFile('a.txt');
    await emitChange(wrapper, [file]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file]);
  });

  it('emits an array when multiple is true', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined, multiple: true } });
    const files = [makeFile('a.txt'), makeFile('b.txt')];
    await emitChange(wrapper, files);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([files]);
  });

  it('rejects multiple files when multiple is false and emits error', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined } });
    await emitChange(wrapper, [makeFile('a.txt'), makeFile('b.txt')]);
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    const firstError = wrapper.emitted('error')?.[0]?.[0];
    expect(firstError).toMatch(/one file/i);
    expect(wrapper.text()).toMatch(/one file/i);
  });

  it('rejects files that do not match accept', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined, accept: '.csv' } });
    await emitChange(wrapper, [makeFile('a.txt', { type: 'text/plain' })]);
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    expect(wrapper.emitted('error')?.[0]?.[0]).toMatch(/\.csv/);
  });

  it('accepts image/* wildcard', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined, accept: 'image/*' } });
    const file = makeFile('a.png', { type: 'image/png' });
    await emitChange(wrapper, [file]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file]);
  });

  it('rejects files exceeding maxSize', async () => {
    wrapper = createWrapper({ props: { modelValue: undefined, maxSize: 5 } });
    await emitChange(wrapper, [makeFile('big.txt', { size: 100 })]);
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    expect(wrapper.emitted('error')?.[0]?.[0]).toMatch(/maximum size/i);
  });

  it('renders external errorMessages without internal validation', () => {
    wrapper = createWrapper({
      props: { modelValue: undefined, errorMessages: ['external problem'] },
    });
    expect(wrapper.find('[data-error]').exists()).toBeTruthy();
    expect(wrapper.text()).toContain('external problem');
  });

  it('shows uploaded state via data attribute', () => {
    wrapper = createWrapper({ props: { modelValue: undefined, uploaded: true } });
    expect(wrapper.find('[data-uploaded]').exists()).toBeTruthy();
  });

  it('shows loading overlay', () => {
    wrapper = createWrapper({ props: { modelValue: undefined, loading: true } });
    expect(wrapper.find('[data-id=loading]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=progress-label]').exists()).toBeFalsy();
  });

  it('shows percentage label when progress is provided', () => {
    wrapper = createWrapper({ props: { modelValue: undefined, loading: true, progress: 42.6 } });
    expect(wrapper.find('[data-id=progress-label]').text()).toBe('43%');
  });

  it('disables the input when disabled', () => {
    wrapper = createWrapper({ props: { modelValue: undefined, disabled: true } });
    expect(wrapper.find('input[type=file]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-disabled]').exists()).toBeTruthy();
  });

  it('removeFile expose clears the v-model', async () => {
    const file = makeFile('a.txt');
    wrapper = createWrapper({ props: { modelValue: file } });
    wrapper.vm.removeFile();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
  });

  it('renders a file list when files are selected', () => {
    const file = makeFile('readme.md', { size: 2048 });
    wrapper = createWrapper({ props: { modelValue: file } });
    expect(wrapper.find('[data-id=file-list]').exists()).toBeTruthy();
    expect(wrapper.text()).toContain('readme.md');
    expect(wrapper.text()).toContain('2.0 KB');
  });

  it('renders the preview slot when provided', () => {
    const file = makeFile('photo.png', { type: 'image/png' });
    wrapper = createWrapper({
      props: { modelValue: file },
      slots: {
        preview: '<div data-id="custom-preview">custom</div>',
      },
    });
    expect(wrapper.find('[data-id=custom-preview]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=file-list]').exists()).toBeFalsy();
  });

  it('removes a single file from a multiple selection', async () => {
    const files = [makeFile('a.txt'), makeFile('b.txt')];
    wrapper = createWrapper({ props: { modelValue: files, multiple: true } });
    const removeButtons = wrapper.findAll('[data-id=remove-file]');
    expect(removeButtons.length).toBeGreaterThan(0);
    await removeButtons[0]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[files[1]]]);
  });
});
