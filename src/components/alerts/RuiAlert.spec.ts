import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiAlert from '@/components/alerts/RuiAlert.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiAlert>) {
  return mount(RuiAlert, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('forms/Alert', () => {
  it('renders properly', () => {
    const title = 'Text Field Label';
    const wrapper = createWrapper({
      props: {
        title,
      },
    });
    expect(wrapper.text()).toContain(title);
  });

  it('passes type props', async () => {
    const wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ type: 'error' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ type: 'warning' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_warning_/)]),
    );

    await wrapper.setProps({ type: 'info' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_info_/)]),
    );

    await wrapper.setProps({ type: 'success' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_default_/)]),
    );

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('div[class*=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
  });

  it('passes correct icon', async () => {
    const wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('rui-icon-stub').exists()).toBeFalsy();

    await wrapper.setProps({ type: 'error' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'error-warning-line',
    );

    await wrapper.setProps({ type: 'warning' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe('alert-line');

    await wrapper.setProps({ type: 'info' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'information-line',
    );

    await wrapper.setProps({ type: 'success' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'checkbox-circle-line',
    );

    await wrapper.setProps({ icon: 'line-fill' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe('line-fill');
  });

  it('passes action text and the callback', async () => {
    const wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[class*=action]').exists()).toBeFalsy();

    await wrapper.setProps({ actionText: 'Action' });
    expect(wrapper.find('[class*=action]').exists()).toBeTruthy();
    await wrapper.find('[class*=action]').trigger('click');

    expect(wrapper.emitted('action')).toBeTruthy();
  });

  it('passes the close button callback', async () => {
    const wrapper = createWrapper({ props: { title: 'Title' } });
    expect(wrapper.find('[class*=close]').exists()).toBeFalsy();

    await wrapper.setProps({ closeable: true });
    expect(wrapper.find('[class*=close]').exists()).toBeTruthy();
    await wrapper.find('[class*=close]').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
