import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RuiColorPicker from '@/components/color-picker/RuiColorPicker.vue';
import { roundTwoDecimal } from '@/components/color-picker/utils';

window.HTMLDivElement.prototype.getBoundingClientRect = () => ({
  bottom: 0,
  height: 200,
  left: 0,
  right: 0,
  toJSON: vi.fn(),
  top: 0,
  width: 300,
  x: 0,
  y: 0,
});

function createWrapper(options?: ComponentMountingOptions<typeof RuiColorPicker>) {
  return mount(RuiColorPicker, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('colorPicker', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.rui-color-board').exists()).toBeTruthy();
    expect(wrapper.find('.rui-color-display').exists()).toBeTruthy();
    expect(wrapper.find('.rui-color-hue').exists()).toBeTruthy();
    expect(wrapper.find('.rui-color-input').exists()).toBeTruthy();
  });

  it('ui reflects the initial value', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 'ff0000',
      },
    });
    await nextTick();

    // UI reflected
    expect(wrapper.find('.rui-color-board').attributes('style')).toBe('background-color: rgb(255, 0, 0);');
    expect(wrapper.find('.rui-color-board div[class*=_cursor_]').attributes('style')).toBe('top: 0%; left: 100%;');

    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(255, 0, 0);');

    expect(wrapper.find('.rui-color-hue div[class*=_cursor_]').attributes('style')).toBe('left: calc(0% + 8px);');

    // Hex input value reflected
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('ff0000');

    // Change input type to RGB
    await wrapper.find('button').trigger('click');

    // RGB input value reflected
    expect((wrapper.findAll('input').at(0)!.element as HTMLInputElement).value).toBe('255');
    expect((wrapper.findAll('input').at(1)!.element as HTMLInputElement).value).toBe('0');
    expect((wrapper.findAll('input').at(2)!.element as HTMLInputElement).value).toBe('0');

    await wrapper.setProps({
      modelValue: '80FFFF',
    });
    await nextTick();

    // UI reflected
    expect(wrapper.find('.rui-color-board').attributes('style')).toBe('background-color: rgb(0, 255, 255);');
    expect(wrapper.find('.rui-color-board div[class*=_cursor_]').attributes('style')).toBe('top: 0%; left: 50%;');

    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(128, 255, 255);');

    // middle position, then substract by (half thumb size / element width defined on the useElementBounding);
    const percentagePosition = roundTwoDecimal(50 - ((16 / 2) / 300 * 100));
    expect(wrapper.find('.rui-color-hue div[class*=_cursor_]').attributes('style')).toBe(`left: calc(${percentagePosition}% + 8px);`);

    // RGB input value reflected
    expect((wrapper.findAll('input').at(0)!.element as HTMLInputElement).value).toBe('128');
    expect((wrapper.findAll('input').at(1)!.element as HTMLInputElement).value).toBe('255');
    expect((wrapper.findAll('input').at(2)!.element as HTMLInputElement).value).toBe('255');

    // Change input type to hex
    await wrapper.find('button').trigger('click');

    // Hex input value reflected
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('80ffff');
  });

  it ('type on the input', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Type on the hex input
    await wrapper.find('input').setValue('ff0000');
    await wrapper.find('input').trigger('blur');
    await vi.delay();

    // UI reflected
    expect(wrapper.find('.rui-color-board').attributes('style')).toBe('background-color: rgb(255, 0, 0);');
    expect(wrapper.find('.rui-color-board div[class*=_cursor_]').attributes('style')).toBe('top: 0%; left: 100%;');

    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(255, 0, 0);');

    expect(wrapper.find('.rui-color-hue div[class*=_cursor_]').attributes('style')).toBe('left: calc(0% + 8px);');

    expect(wrapper.emitted('update:model-value')!.at(-1)![0]).toBe('ff0000');

    // Change input type to RGB
    await wrapper.find('button').trigger('click');

    // RGB input value reflected
    expect((wrapper.findAll('input').at(0)!.element as HTMLInputElement).value).toBe('255');
    expect((wrapper.findAll('input').at(1)!.element as HTMLInputElement).value).toBe('0');
    expect((wrapper.findAll('input').at(2)!.element as HTMLInputElement).value).toBe('0');

    // Type on the RGB input
    await wrapper.findAll('input').at(0)!.setValue('128');
    await wrapper.findAll('input').at(0)!.trigger('blur');
    await vi.delay();
    await wrapper.findAll('input').at(1)!.setValue('255');
    await wrapper.findAll('input').at(1)!.trigger('blur');
    await vi.delay();
    await wrapper.findAll('input').at(2)!.setValue('255');
    await wrapper.findAll('input').at(2)!.trigger('blur');
    await vi.delay();

    // UI reflected
    expect(wrapper.find('.rui-color-board').attributes('style')).toBe('background-color: rgb(0, 255, 255);');
    expect(wrapper.find('.rui-color-board div[class*=_cursor_]').attributes('style')).toBe('top: 0%; left: 50%;');

    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(128, 255, 255);');

    // middle position, then substract by (half thumb size / element width defined on the useElementBounding);
    const percentagePosition = roundTwoDecimal(50 - ((16 / 2) / 300 * 100));
    expect(wrapper.find('.rui-color-hue div[class*=_cursor_]').attributes('style')).toBe(`left: calc(${percentagePosition}% + 8px);`);

    // Change input type to hex
    await wrapper.find('button').trigger('click');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('80ffff');

    expect(wrapper.emitted('update:model-value')!.at(-1)![0]).toBe('80ffff');
  });

  it('click on the UI selector', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Drag hue to the end (color red)
    await wrapper.find('.rui-color-hue > div').trigger('click', { clientX: 1000, clientY: 0 });
    await nextTick();

    // Selected color: hsv(360, 100, 100) => rgb(255, 0, 0);
    expect(wrapper.find('.rui-color-board').attributes('style')).toBe('background-color: rgb(255, 0, 0);');
    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(255, 0, 0);');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('ff0000');

    // end position, then substract by (thumb size / element width defined on the useElementBounding);
    const percentagePosition = roundTwoDecimal(100 - (16 / 300 * 100));
    expect(wrapper.find('.rui-color-hue div[class*=_cursor_]').attributes('style')).toBe(`left: calc(${percentagePosition}% + 8px);`);

    expect(wrapper.emitted('update:model-value')!.at(-1)![0]).toBe('ff0000');

    // Drag board to the middle
    await wrapper.find('.rui-color-board').trigger('click', { clientX: 150, clientY: 100 });
    await nextTick();

    // Selected color: hsv(360, 50, 50) => rgb(128, 64, 64);
    expect(wrapper.find('.rui-color-display').attributes('style')).toBe('background: rgb(128, 64, 64);');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('804040');
    expect(wrapper.find('.rui-color-board div[class*=_cursor_]').attributes('style')).toBe('top: 50%; left: 50%;');

    expect(wrapper.emitted('update:model-value')!.at(-1)![0]).toBe('804040');
  });
});
