import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Card from '@/components/cards/Card.vue';
import Button from '@/components/buttons/button/Button.vue';

const createWrapper = (options: ComponentMountingOptions<typeof Card>) =>
  mount(Card, { ...options, global: { stubs: { 'rui-button': Button } } });

describe('Card', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.classes()).toMatch(/_card_/);
    expect(wrapper.classes()).toMatch(/_outlined_/);
    expect(wrapper.classes()).toMatch('shadow-0');
    expect(wrapper.classes()).not.toMatch(/_dense_/);
    expect(wrapper.classes()).not.toMatch(/_divide_/);

    expect(wrapper.find('div[class*=_image_').exists()).toBeFalsy();
    expect(wrapper.find('h5[class*=_prepend_').exists()).toBeFalsy();
    expect(wrapper.find('h5[class*=_header_').exists()).toBeFalsy();
    expect(wrapper.find('p[class*=_subheader_').exists()).toBeFalsy();
    expect(wrapper.find('div[class*=_content_').exists()).toBeFalsy();
    expect(wrapper.find('div[class*=_footer_').exists()).toBeFalsy();
  });

  it('reacts to props changes', async () => {
    const wrapper = createWrapper({
      props: {
        dense: false,
        divide: false,
        elevation: 0,
        variant: 'outlined',
      },
      slots: {
        header: ({ text = 'Card header' }: { text?: string }) => text,
        image: { template: `<img src="https://placehold.co/960x320" alt />` },
        prepend: ({ text = 'OP' }: { text?: string }) => text,
        subheader: ({ text = 'Card subheader' }: { text?: string }) => text,
        default: { template: `<p>Lorem ipsum dolor sit amet</p>` },
        footer: ['Action 1', 'Action 2'].map((action, i) => ({
          template: `<rui-button :key="${i}">${action}</rui-button>`,
        })),
      },
    });

    expect(wrapper.find('div[class*=_image_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_prepend_').exists()).toBeTruthy();
    expect(wrapper.find('h6[class*=_header_').exists()).toBeTruthy();
    expect(wrapper.find('p[class*=_subheader_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_content_').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=_footer_').exists()).toBeTruthy();

    await wrapper.setProps({
      dense: true,
      divide: true,
      elevation: 2,
      variant: 'flat',
    });

    expect(wrapper.classes()).not.toMatch(/_outlined_/);
    expect(wrapper.classes()).not.toMatch('shadow-0');
    expect(wrapper.classes()).toMatch(/_card_/);
    expect(wrapper.classes()).toMatch('shadow-2');
    expect(wrapper.classes()).toMatch(/_dense_/);
    expect(wrapper.classes()).toMatch(/_divide_/);
  });
});
