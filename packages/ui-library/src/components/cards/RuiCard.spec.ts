import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';

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
    expect(wrapper.classes()).toContain('border');
    expect(wrapper.classes()).toContain('shadow-0');

    expect(wrapper.find('[data-id=card-image]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=prepend]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=header]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=subheader]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=card-content]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=card-footer]').exists()).toBeFalsy();
  });

  it('should render default slot content', () => {
    wrapper = createWrapper({
      slots: {
        default: '<p>Card content</p>',
      },
    });

    expect(wrapper.find('[data-id=card-content]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=card-content] p').text()).toBe('Card content');
  });

  it('should render header and subheader slots', () => {
    wrapper = createWrapper({
      slots: {
        header: 'Card Title',
        subheader: 'Card Subtitle',
      },
    });

    expect(wrapper.find('[data-id=header]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=header]').text()).toBe('Card Title');
    expect(wrapper.find('[data-id=subheader]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=subheader]').text()).toBe('Card Subtitle');
  });

  it('should render image slot', () => {
    wrapper = createWrapper({
      slots: {
        image: '<img src="test.png" alt="test" />',
      },
    });

    expect(wrapper.find('[data-id=card-image]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=card-image] img').exists()).toBeTruthy();
  });

  it('should render prepend slot', () => {
    wrapper = createWrapper({
      slots: {
        header: 'Title',
        prepend: '<span>Icon</span>',
      },
    });

    expect(wrapper.find('[data-id=prepend]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=prepend]').text()).toBe('Icon');
  });

  it('should render footer slot', () => {
    wrapper = createWrapper({
      slots: {
        footer: '<button>Action</button>',
      },
    });

    expect(wrapper.find('[data-id=card-footer]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=card-footer] button').text()).toBe('Action');
  });

  it('should apply variant classes', async () => {
    wrapper = createWrapper({
      props: {
        variant: 'outlined',
      },
    });

    expect(wrapper.classes()).toContain('border');

    await wrapper.setProps({ variant: 'flat' });
    expect(wrapper.classes()).not.toContain('border');
  });

  it('should apply rounded classes', async () => {
    wrapper = createWrapper({
      props: {
        rounded: 'md',
      },
    });

    expect(wrapper.classes()).toContain('rounded-[.5rem]');

    await wrapper.setProps({ rounded: 'sm' });
    expect(wrapper.classes()).toContain('rounded-[.25rem]');
    expect(wrapper.classes()).not.toContain('rounded-[.5rem]');

    await wrapper.setProps({ rounded: 'lg' });
    expect(wrapper.classes()).toContain('rounded-[1rem]');
  });

  it('should apply dense class', async () => {
    wrapper = createWrapper({
      props: {
        dense: false,
      },
      slots: {
        default: 'content',
      },
    });

    expect(wrapper.find('[data-id=card-content]').classes()).toContain('p-4');

    await wrapper.setProps({ dense: true });
    expect(wrapper.find('[data-id=card-content]').classes()).toContain('p-3');
  });

  it('should apply divide class', async () => {
    wrapper = createWrapper({
      props: {
        divide: false,
      },
    });

    expect(wrapper.classes()).not.toContain('divide-y');

    await wrapper.setProps({ divide: true });
    expect(wrapper.classes()).toContain('divide-y');
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

    expect(wrapper.find('[data-id=card-image]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=prepend]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=header]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=subheader]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=card-content]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=card-footer]').exists()).toBeTruthy();

    await wrapper.setProps({
      dense: true,
      divide: true,
      elevation: 2,
      variant: 'flat',
    });

    expect(wrapper.classes()).not.toContain('border');
    expect(wrapper.classes()).not.toContain('shadow-0');
    expect(wrapper.classes()).toContain('shadow-2');
    expect(wrapper.classes()).toContain('divide-y');
  });
});
