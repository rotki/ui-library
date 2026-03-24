import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSkeletonLoader from '@/components/loaders/RuiSkeletonLoader.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiSkeletonLoader>,
): VueWrapper<InstanceType<typeof RuiSkeletonLoader>> {
  return mount(RuiSkeletonLoader, options);
}

describe('components/loaders/RuiSkeletonLoader.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiSkeletonLoader>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper();
    expect(wrapper.find('div[role=alert]').classes()).toContain('animate-pulse');
  });

  it('should render text type by default', () => {
    wrapper = createWrapper();
    expect(wrapper.find('div[role=alert]').classes()).toContain('h-4');
  });

  it('should render heading type', () => {
    wrapper = createWrapper({
      props: { type: 'heading' },
    });
    expect(wrapper.find('div[role=alert]').classes()).toContain('h-6');
  });

  it('should render button type', () => {
    wrapper = createWrapper({
      props: { type: 'button' },
    });
    expect(wrapper.find('div[role=alert]').classes()).toContain('h-[2.25rem]');
  });

  it('should render icon type', () => {
    wrapper = createWrapper({
      props: { type: 'icon' },
    });
    expect(wrapper.find('div[role=alert]').classes()).toContain('w-6');
    expect(wrapper.find('div[role=alert]').classes()).toContain('rounded-full');
  });

  it('should render avatar type', () => {
    wrapper = createWrapper({
      props: { type: 'avatar' },
    });
    expect(wrapper.find('div[role=alert]').classes()).toContain('w-10');
    expect(wrapper.find('div[role=alert]').classes()).toContain('rounded-full');
  });

  it('should render thumbnail type', () => {
    wrapper = createWrapper({
      props: { type: 'thumbnail' },
    });
    expect(wrapper.find('div[role=alert]').classes()).toContain('w-14');
  });

  it('should render paragraph type with multiple text lines', () => {
    wrapper = createWrapper({
      props: {
        type: 'paragraph',
      },
    });

    // Paragraph wraps multiple skeleton_text elements in a div
    const textElements = wrapper.findAll('div[role=alert]');
    expect(textElements).toHaveLength(3);
  });

  it('should render article type with heading and text lines', () => {
    wrapper = createWrapper({
      props: {
        type: 'article',
      },
    });

    // Article has a heading + 3 text lines = 4 skeleton bases
    const elements = wrapper.findAll('div[role=alert]');
    expect(elements).toHaveLength(4);
  });

  it('should apply rounded classes', async () => {
    wrapper = createWrapper({
      props: {
        rounded: 'full',
      },
    });

    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');

    await wrapper.setProps({ rounded: 'sm' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-sm');

    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        rounded: 'full',
        type: 'text',
      },
    });
    expect(wrapper.get('div[role=alert]').classes()).toContain('h-4');
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');

    await wrapper.setProps({ type: 'paragraph' });
    expect(wrapper.findAll('div[role=alert]')).toHaveLength(3);

    await wrapper.setProps({ type: 'heading' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('h-6');

    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });
});
