import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiAlert from '@/components/alerts/RuiAlert.vue';

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
    expect(wrapper.find('[data-type=primary]').exists()).toBeTruthy();

    await wrapper.setProps({ type: 'error' });
    expect(wrapper.find('[data-type=error]').exists()).toBeTruthy();

    await wrapper.setProps({ type: 'warning' });
    expect(wrapper.find('[data-type=warning]').exists()).toBeTruthy();

    await wrapper.setProps({ type: 'info' });
    expect(wrapper.find('[data-type=info]').exists()).toBeTruthy();

    await wrapper.setProps({ type: 'success' });
    expect(wrapper.find('[data-type=success]').exists()).toBeTruthy();
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[data-variant=default]').exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.find('[data-variant=filled]').exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('[data-variant=outlined]').exists()).toBeTruthy();
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
    expect(wrapper.find('[data-id=alert-action]').exists()).toBeFalsy();

    await wrapper.setProps({ actionText: 'Action' });
    expect(wrapper.find('[data-id=alert-action]').exists()).toBeTruthy();
    await wrapper.find('[data-id=alert-action]').trigger('click');

    expect(wrapper.emitted('action')).toBeTruthy();
  });

  it('should pass the close button callback', async () => {
    wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[data-id=alert-close]').exists()).toBeFalsy();

    await wrapper.setProps({ closeable: true });
    expect(wrapper.find('[data-id=alert-close]').exists()).toBeTruthy();
    await wrapper.find('[data-id=alert-close]').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
