import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiFooterStepper from '@/components/steppers/RuiFooterStepper.vue';

function createWrapper(options: ComponentMountingOptions<typeof RuiFooterStepper>) {
  return mount(RuiFooterStepper, options);
}

describe('footerStepper', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_footer-stepper_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_numeric_/)]),
    );
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
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_progress_/)]),
    );

    const next = wrapper.find('button ~ button span[class*=_label] span');
    expect(next.exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'pill' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_pill_/)]),
    );
  });
});
