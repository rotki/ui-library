import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import { expectNotToHaveClass, expectToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options: ComponentMountingOptions<typeof RuiCard>,
): VueWrapper<InstanceType<typeof RuiCard>> {
  return mount(RuiCard, { ...options, global: { stubs: { 'rui-button': RuiButton } } });
}

describe('components/cards/RuiCard.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiCard>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
    expectToHaveClass(wrapper.element, /_card_/);
    expectToHaveClass(wrapper.element, /_outlined_/);
    expectToHaveClass(wrapper.element, /shadow-0/);
    expectNotToHaveClass(wrapper.element, /_dense_/);
    expectNotToHaveClass(wrapper.element, /_divide_/);

    expect(wrapper.find('div[class*=_image_').exists()).toBeFalsy();
    expect(wrapper.find('h5[class*=_prepend_').exists()).toBeFalsy();
    expect(wrapper.find('h5[class*=_header_').exists()).toBeFalsy();
    expect(wrapper.find('p[class*=_subheader_').exists()).toBeFalsy();
    expect(wrapper.find('div[class*=_content_').exists()).toBeFalsy();
    expect(wrapper.find('div[class*=_footer_').exists()).toBeFalsy();
  });

  it('should render default slot content', () => {
    wrapper = createWrapper({
      slots: {
        default: '<p>Card content</p>',
      },
    });

    expect(wrapper.find('div[class*=_content_]').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_content_] p').text()).toBe('Card content');
  });

  it('should render header and subheader slots', () => {
    wrapper = createWrapper({
      slots: {
        header: 'Card Title',
        subheader: 'Card Subtitle',
      },
    });

    expect(wrapper.find('h5[class*=_header_]').exists()).toBeTruthy();
    expect(wrapper.find('p[class*=_subheader_]').exists()).toBeTruthy();
  });

  it('should render image slot', () => {
    wrapper = createWrapper({
      slots: {
        image: '<img src="test.png" alt="test" />',
      },
    });

    expect(wrapper.find('div[class*=_image_]').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_image_] img').exists()).toBeTruthy();
  });

  it('should render prepend slot', () => {
    wrapper = createWrapper({
      slots: {
        header: 'Title',
        prepend: '<span>Icon</span>',
      },
    });

    expect(wrapper.find('div[class*=_prepend_]').exists()).toBeTruthy();
  });

  it('should render footer slot', () => {
    wrapper = createWrapper({
      slots: {
        footer: '<button>Action</button>',
      },
    });

    expect(wrapper.find('div[class*=_footer_]').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_footer_] button').text()).toBe('Action');
  });

  it('should apply variant classes', async () => {
    wrapper = createWrapper({
      props: {
        variant: 'outlined',
      },
    });

    expectToHaveClass(wrapper.element, /_outlined_/);

    await wrapper.setProps({ variant: 'flat' });
    expectNotToHaveClass(wrapper.element, /_outlined_/);
  });

  it('should apply rounded classes', async () => {
    wrapper = createWrapper({
      props: {
        rounded: 'md',
      },
    });

    expectToHaveClass(wrapper.element, /_rounded__md_/);

    await wrapper.setProps({ rounded: 'sm' });
    expectToHaveClass(wrapper.element, /_rounded__sm_/);
    expectNotToHaveClass(wrapper.element, /_rounded__md_/);

    await wrapper.setProps({ rounded: 'lg' });
    expectToHaveClass(wrapper.element, /_rounded__lg_/);
  });

  it('should apply dense class', async () => {
    wrapper = createWrapper({
      props: {
        dense: false,
      },
    });

    expectNotToHaveClass(wrapper.element, /_dense_/);

    await wrapper.setProps({ dense: true });
    expectToHaveClass(wrapper.element, /_dense_/);
  });

  it('should apply divide class', async () => {
    wrapper = createWrapper({
      props: {
        divide: false,
      },
    });

    expectNotToHaveClass(wrapper.element, /_divide_/);

    await wrapper.setProps({ divide: true });
    expectToHaveClass(wrapper.element, /_divide_/);
  });

  it('should react to props changes', async () => {
    wrapper = createWrapper({
      props: {
        dense: false,
        divide: false,
        elevation: 0,
        variant: 'outlined',
      },
      slots: {
        default: { template: `<p>Lorem ipsum dolor sit amet</p>` },
        footer: ['Action 1', 'Action 2'].map((action, i) => ({
          template: `<rui-button :key="${i}">${action}</rui-button>`,
        })),
        header: () => 'Card header',
        image: { template: `<img src="https://placehold.co/960x320" alt />` },
        prepend: () => 'OP',
        subheader: () => 'Card subheader',
      },
    });

    expect(wrapper.find('div[class*=_image_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_prepend_').exists()).toBeTruthy();
    expect(wrapper.find('h5[class*=_header_').exists()).toBeTruthy();
    expect(wrapper.find('p[class*=_subheader_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_content_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_footer_').exists()).toBeTruthy();

    await wrapper.setProps({
      dense: true,
      divide: true,
      elevation: 2,
      variant: 'flat',
    });

    expectNotToHaveClass(wrapper.element, /_outlined_/);
    expectNotToHaveClass(wrapper.element, /shadow-0/);
    expectToHaveClass(wrapper.element, /_card_/);
    expectToHaveClass(wrapper.element, /shadow-2/);
    expectToHaveClass(wrapper.element, /_dense_/);
    expectToHaveClass(wrapper.element, /_divide_/);
  });
});
