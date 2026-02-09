import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSkeletonLoader from '@/components/loaders/RuiSkeletonLoader.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

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
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=alert]', /_rounded_/);
  });

  it('should render text type by default', () => {
    wrapper = createWrapper();
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_text_/);
  });

  it('should render heading type', () => {
    wrapper = createWrapper({
      props: {
        type: 'heading',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_heading_/);
  });

  it('should render button type', () => {
    wrapper = createWrapper({
      props: {
        type: 'button',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_button_/);
  });

  it('should render icon type', () => {
    wrapper = createWrapper({
      props: {
        type: 'icon',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_icon_/);
  });

  it('should render avatar type', () => {
    wrapper = createWrapper({
      props: {
        type: 'avatar',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_avatar_/);
  });

  it('should render thumbnail type', () => {
    wrapper = createWrapper({
      props: {
        type: 'thumbnail',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_thumbnail_/);
  });

  it('should render paragraph type with multiple text lines', () => {
    wrapper = createWrapper({
      props: {
        type: 'paragraph',
      },
    });

    // Paragraph wraps multiple skeleton_text elements in a div
    const textElements = wrapper.findAll('div[role=alert]');
    expect(textElements.length).toBe(3);
  });

  it('should render article type with heading and text lines', () => {
    wrapper = createWrapper({
      props: {
        type: 'article',
      },
    });

    // Article has a heading + 3 text lines = 4 skeleton bases
    const elements = wrapper.findAll('div[role=alert]');
    expect(elements.length).toBe(4);
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
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_text_/);
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');

    await wrapper.setProps({ type: 'paragraph' });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_text_/);

    await wrapper.setProps({ type: 'heading' });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_heading_/);

    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });
});
