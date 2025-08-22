import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';

function createWrapper(options: ComponentMountingOptions<typeof RuiCard>) {
  return mount(RuiCard, { ...options, global: { stubs: { 'rui-button': RuiButton } } });
}

describe('card', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_card_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching('shadow-0')]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_dense_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_divide_/)]),
    );

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
        default: { template: `<p>Lorem ipsum dolor sit amet</p>` },
        footer: ['Action 1', 'Action 2'].map((action, i) => ({
          template: `<rui-button :key="${i}">${action}</rui-button>`,
        })),
        header: ({ text = 'Card header' }: { text?: string }) => text,
        image: { template: `<img src="https://placehold.co/960x320" alt />` },
        prepend: ({ text = 'OP' }: { text?: string }) => text,
        subheader: ({ text = 'Card subheader' }: { text?: string }) => text,
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

    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching('shadow-0')]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_card_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching('shadow-2')]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_dense_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_divide_/)]),
    );
  });
});
