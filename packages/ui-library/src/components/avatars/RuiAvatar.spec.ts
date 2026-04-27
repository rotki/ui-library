import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiAvatar from '@/components/avatars/RuiAvatar.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiAvatar>,
): VueWrapper<InstanceType<typeof RuiAvatar>> {
  return mount(RuiAvatar, options);
}

describe('components/avatars/RuiAvatar.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiAvatar>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders <img> when src is provided', () => {
    wrapper = createWrapper({
      props: { src: 'https://example.com/a.png', alt: 'Ada' },
    });

    const img = wrapper.find('img[data-id="avatar-image"]');
    expect(img.exists()).toBeTruthy();
    expect(img.attributes('src')).toBe('https://example.com/a.png');
    expect(img.attributes('alt')).toBe('Ada');
    expect(img.attributes('loading')).toBe('lazy');
  });

  it('emits load when image loads', async () => {
    wrapper = createWrapper({ props: { src: 'https://example.com/a.png' } });
    await wrapper.find('img').trigger('load');
    expect(wrapper.emitted('load')).toBeTruthy();
  });

  it('falls back to initials on image error', async () => {
    wrapper = createWrapper({
      props: { src: 'https://example.com/a.png', text: 'Ada Lovelace' },
    });
    await wrapper.find('img').trigger('error');

    expect(wrapper.emitted('error')).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeFalsy();
    const initials = wrapper.find('[data-id="avatar-initials"]');
    expect(initials.exists()).toBeTruthy();
    expect(initials.text()).toBe('AL');
  });

  it('resets error state when src changes', async () => {
    wrapper = createWrapper({
      props: { src: 'https://example.com/a.png', text: 'Ada' },
    });
    await wrapper.find('img').trigger('error');
    expect(wrapper.find('img').exists()).toBeFalsy();

    await wrapper.setProps({ src: 'https://example.com/b.png' });
    expect(wrapper.find('img').exists()).toBeTruthy();
  });

  it('derives initials from alt when text missing', () => {
    wrapper = createWrapper({ props: { alt: 'Grace Hopper' } });
    expect(wrapper.find('[data-id="avatar-initials"]').text()).toBe('GH');
  });

  it('handles single-word name initials', () => {
    wrapper = createWrapper({ props: { text: 'kelsos' } });
    expect(wrapper.find('[data-id="avatar-initials"]').text()).toBe('K');
  });

  it('trims initials to max 2 characters', () => {
    wrapper = createWrapper({ props: { text: 'Ada Lovelace Turing' } });
    expect(wrapper.find('[data-id="avatar-initials"]').text()).toBe('AL');
  });

  it('uses default slot over initials/icon', () => {
    wrapper = createWrapper({
      props: { text: 'AL', icon: 'lu-user' },
      slots: { default: '<span data-test="custom">custom</span>' },
    });
    expect(wrapper.find('[data-test="custom"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="avatar-initials"]').exists()).toBeFalsy();
  });

  it('renders icon when no image or slot', () => {
    wrapper = createWrapper({ props: { alt: '', icon: 'lu-user' } });
    expect(wrapper.find('[data-id="avatar-icon"]').exists()).toBeTruthy();
  });

  it('icon wins over initials when both provided', () => {
    wrapper = createWrapper({ props: { text: 'Ada', icon: 'lu-user' } });
    expect(wrapper.find('[data-id="avatar-icon"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="avatar-initials"]').exists()).toBeFalsy();
  });

  it('applies variant classes', async () => {
    wrapper = createWrapper({ props: { variant: 'circular', text: 'A' } });
    expect(wrapper.find('[data-id="avatar-root"]').classes()).toContain('rounded-full');

    await wrapper.setProps({ variant: 'rounded' });
    expect(wrapper.find('[data-id="avatar-root"]').classes()).toContain('rounded-md');

    await wrapper.setProps({ variant: 'square' });
    expect(wrapper.find('[data-id="avatar-root"]').classes()).toContain('rounded-none');
  });

  it('applies color classes', async () => {
    wrapper = createWrapper({ props: { text: 'A', color: 'primary' } });
    expect(wrapper.find('[data-id="avatar-root"]').classes()).toContain('bg-rui-primary');

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('[data-id="avatar-root"]').classes()).toContain('bg-rui-success');
  });

  it('applies token size as inline dimensions', () => {
    wrapper = createWrapper({ props: { text: 'A', size: 'lg' } });
    const style = wrapper.find('[data-id="avatar-root"]').attributes('style') ?? '';
    expect(style).toContain('width: 40px');
    expect(style).toContain('height: 40px');
  });

  it('applies numeric size as inline dimensions', () => {
    wrapper = createWrapper({ props: { text: 'A', size: 56 } });
    const style = wrapper.find('[data-id="avatar-root"]').attributes('style') ?? '';
    expect(style).toContain('width: 56px');
    expect(style).toContain('height: 56px');
  });

  it('sets role=img with aria-label on fallback', () => {
    wrapper = createWrapper({ props: { text: 'Ada', alt: 'Ada' } });
    const root = wrapper.find('[data-id="avatar-root"]');
    expect(root.attributes('role')).toBe('img');
    expect(root.attributes('aria-label')).toBe('Ada');
  });

  it('treats empty alt as decorative', () => {
    wrapper = createWrapper({ props: { icon: 'lu-user', alt: '' } });
    const root = wrapper.find('[data-id="avatar-root"]');
    expect(root.attributes('aria-label')).toBeUndefined();
  });

  it('omits role=img when showing an image', () => {
    wrapper = createWrapper({ props: { src: 'https://example.com/a.png', alt: 'Ada' } });
    expect(wrapper.find('[data-id="avatar-root"]').attributes('role')).toBeUndefined();
  });

  it('marks fallback aria-hidden', async () => {
    wrapper = createWrapper({ props: { src: 'https://example.com/a.png', text: 'Ada' } });
    await wrapper.find('img').trigger('error');
    const fallback = wrapper.find('[data-id="avatar-fallback"]');
    expect(fallback.attributes('aria-hidden')).toBe('true');
  });

  it('renders placeholder when nothing is resolvable', () => {
    wrapper = createWrapper({ props: { alt: '' } });
    expect(wrapper.find('[data-id="avatar-initials"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id="avatar-icon"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id="avatar-fallback"]').exists()).toBeTruthy();
  });
});
