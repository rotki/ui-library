import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiAlert from '@/components/alerts/RuiAlert.vue';
import { expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(options?: ComponentMountingOptions<typeof RuiAlert>): VueWrapper<InstanceType<typeof RuiAlert>> {
  return mount(RuiAlert, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/alerts/RuiAlert.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiAlert>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const title = 'Text Field Label';
    wrapper = createWrapper({
      props: {
        title,
      },
    });
    expect(wrapper.text()).toContain(title);
  });

  it('should pass type props', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_primary_/);

    await wrapper.setProps({ type: 'error' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_error_/);

    await wrapper.setProps({ type: 'warning' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_warning_/);

    await wrapper.setProps({ type: 'info' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_info_/);

    await wrapper.setProps({ type: 'success' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_success_/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_default_/);

    await wrapper.setProps({ variant: 'filled' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_filled_/);

    await wrapper.setProps({ variant: 'outlined' });
    expectWrapperToHaveClass(wrapper, 'div[class*=alert]', /_outlined_/);
  });

  it('should pass correct icon', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('rui-icon-stub').exists()).toBeFalsy();

    await wrapper.setProps({ type: 'error' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-circle-alert',
    );

    await wrapper.setProps({ type: 'warning' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe('lu-triangle-alert');

    await wrapper.setProps({ type: 'info' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-info',
    );

    await wrapper.setProps({ type: 'success' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-circle-check',
    );

    await wrapper.setProps({ icon: 'line-fill' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe('line-fill');
  });

  it('should pass action text and the callback', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[class*=action]').exists()).toBeFalsy();

    await wrapper.setProps({ actionText: 'Action' });
    expect(wrapper.find('[class*=action]').exists()).toBeTruthy();
    await wrapper.find('[class*=action]').trigger('click');

    expect(wrapper.emitted('action')).toBeTruthy();
  });

  it('should pass the close button callback', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[class*=close]').exists()).toBeFalsy();

    await wrapper.setProps({ closeable: true });
    expect(wrapper.find('[class*=close]').exists()).toBeTruthy();
    await wrapper.find('[class*=close]').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
