import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiStepper from '@/components/steppers/RuiStepper.vue';
import {
  StepperOrientation,
  StepperState,
  type StepperStep,
} from '@/types/stepper';

function createWrapper(options: ComponentMountingOptions<typeof RuiStepper>) {
  return mount(RuiStepper, options);
}

describe('components/Stepper', () => {
  const steps: StepperStep[] = [
    { description: 'lorem ipsum', state: StepperState.done, title: 'Step' },
    { description: 'lorem ipsum', state: StepperState.active, title: 'Step' },
    { description: 'lorem ipsum', state: StepperState.inactive, title: 'Step' },
  ];

  it('renders properly', () => {
    const wrapper = createWrapper({ props: { steps } });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_stepper_/)]),
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: { steps },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_horizontal_/)]),
    );
    await wrapper.setProps({ orientation: StepperOrientation.vertical });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_vertical_/)]),
    );
    await wrapper.setProps({ iconTop: true });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_icon-top_/)]),
    );
  });
});
