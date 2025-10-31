import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Accordion from '@/components/accordions/accordion/RuiAccordion.vue';
import Accordions from '@/components/accordions/accordions/RuiAccordions.vue';
import { assert } from '@/utils/assert';

function createWrapper(options?: ComponentMountingOptions<typeof Accordions>) {
  return mount(Accordions, {
    ...options,
    global: {
      stubs: {
        Accordion,
      },
    },
    slots: {
      default: [
        { template: `
          <Accordion>
            <template #header>Accordion 1 Header</template>
            Accordion 1 Content
          </Accordion>
        ` },
        { template: `
          <Accordion>
            <template #header>Accordion 2 Header</template>
            Accordion 2 Content
          </Accordion>
        ` },
      ],
    },
  });
}

describe('accordions/Accordions', () => {
  it('renders properly', () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
  });

  it('works with multiple=`false`', async () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
    expect(get(modelValue)).toBe(undefined);

    // Click first accordion
    const firstAccordionHeader = wrapper.findAll('.accordion__header')[0];
    assert(firstAccordionHeader);
    await firstAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(0);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');

    // Click second accordion
    const secondAccordionHeader = wrapper.findAll('.accordion__header')[1];
    assert(secondAccordionHeader);
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(1);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 2 Content');

    // Click second accordion, it should be closed now
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(-1);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
  });

  it('works with multiple=`true`', async () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'multiple': true,
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('.accordion');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('.accordion__content')).toHaveLength(0);
    expect(get(modelValue)).toBe(undefined);

    // Click first accordion
    const firstAccordionHeader = wrapper.findAll('.accordion__header')[0];
    assert(firstAccordionHeader);
    await firstAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');

    // Click second accordion, both should be opened
    const secondAccordionHeader = wrapper.findAll('.accordion__header')[1];
    assert(secondAccordionHeader);
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0, 1]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(2);

    // Click second accordion, only close this accordion
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0]);

    expect(wrapper.findAll('.accordion__content')).toHaveLength(1);
    expect(wrapper.find('.accordion__content').text()).contains('Accordion 1 Content');
  });
});
