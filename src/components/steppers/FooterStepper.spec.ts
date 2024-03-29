import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import FooterStepper from '@/components/steppers/FooterStepper.vue';

function createWrapper(options: ComponentMountingOptions<typeof FooterStepper>) {
  return mount(FooterStepper, options);
}

describe('footerStepper', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
      },
    });
    expect(wrapper.classes()).toMatch(/_footer-stepper_/);
    expect(wrapper.classes()).toMatch(/_numeric_/);
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
        variant: 'bullet',
      },
    });

    await wrapper.setProps({ variant: 'progress' });
    expect(wrapper.classes()).toMatch(/_progress_/);

    const next = wrapper.find('button ~ button span[class*=_label] span');
    expect(next.exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'pill' });
    expect(wrapper.classes()).toMatch(/_pill_/);
  });
});
