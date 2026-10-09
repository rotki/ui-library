import type { ButtonSize, ButtonVariant } from '@/components/buttons/button/button-props';
import type { ContextColorsType } from '@/consts/colors';
import { defineComponent, type InjectionKey, provide } from 'vue';

/**
 * What a RuiButtonGroup shares with the RuiButtons inside it, at any depth, so a button wrapped in a
 * tooltip or a menu activator joins the group like a direct child.
 */
export interface ButtonGroupContext<TValue> {
  variant: () => ButtonVariant;
  size: () => ButtonSize | undefined;
  disabled: () => boolean;
  color: (active: boolean) => ContextColorsType | undefined;
  itemClass: () => string;
  isActive: (value: TValue) => boolean;
  toggle: (value: TValue) => void;
}

/**
 * A button's value type and its group's are separate generics that only the template ties together,
 * so the key carries `any` for the value.
 */
export const ButtonGroupKey: InjectionKey<ButtonGroupContext<any> | undefined> = Symbol('RuiButtonGroup');

/**
 * Ends a surrounding group's reach. Overlays wrap their teleported content in it, so the buttons of a
 * split button's menu stay plain buttons.
 */
export const ButtonGroupBoundary = defineComponent({
  name: 'ButtonGroupBoundary',
  setup(_, { slots }) {
    provide(ButtonGroupKey, undefined);
    return () => slots.default?.();
  },
});
