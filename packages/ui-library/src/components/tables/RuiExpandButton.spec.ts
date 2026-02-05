import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiExpandButton>,
) {
  return mount(RuiExpandButton, options);
}

describe('components/tables/RuiExpandButton.vue', () => {
  it('should render with default props', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
    });

    expect(wrapper.find('button').exists()).toBeTruthy();
    const buttonClasses = wrapper.find('button').classes();
    expect(buttonClasses.some(c => c.includes('_tr__expander_button'))).toBeTruthy();
  });

  it('should apply open class when expanded is true', () => {
    const wrapper = createWrapper({
      props: {
        expanded: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.classes().some(c => c.includes('_tr__expander_button_open'))).toBeTruthy();
  });

  it('should not apply open class when expanded is false', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
    });

    const button = wrapper.find('button');
    expect(button.classes().some(c => c.includes('_tr__expander_button_open'))).toBeFalsy();
  });

  it('should emit click event when clicked', async () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should render default icon', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
    });

    const icon = wrapper.find('[class*=_tr__expander_button_icon]');
    expect(icon.exists()).toBeTruthy();
  });

  it('should render custom icon when provided', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
        icon: 'lu-plus',
      },
    });

    expect(wrapper.find('button').exists()).toBeTruthy();
  });

  it('should render slot content when provided', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
      slots: {
        default: '<span data-cy="custom-icon">Custom</span>',
      },
    });

    expect(wrapper.find('[data-cy=custom-icon]').exists()).toBeTruthy();
    expect(wrapper.find('[data-cy=custom-icon]').text()).toBe('Custom');
  });

  it('should pass through additional attributes', () => {
    const wrapper = createWrapper({
      props: {
        expanded: false,
      },
      attrs: {
        'data-testid': 'expand-btn',
      },
    });

    expect(wrapper.find('button').attributes('data-testid')).toBe('expand-btn');
  });
});
