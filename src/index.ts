import { type App } from 'vue';
import { createHead } from '@vueuse/head';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
import { default as RuiCheckbox } from '@/components/forms/checkbox/Checkbox.vue';
import { default as RuiStepper } from '@/components/steppers/Stepper.vue';
import { default as RuiTextField } from '@/components/forms/text-field/TextField.vue';
import { default as RuiFooterStepper } from '@/components/steppers/FooterStepper.vue';
import { default as RuiProgress } from '@/components/progress/Progress.vue';
import { default as RuiRadioGroup } from '@/components/forms/radio-button/radio-group/RadioGroup.vue';
import { default as RuiRadio } from '@/components/forms/radio-button/radio/Radio.vue';
import { default as RuiRevealableTextField } from '@/components/forms/revealable-text-field/RevealableTextField.vue';
import { useRotkiTheme } from '@/composables/theme';
import { StepperState } from '@/types/stepper';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.scss';

export * from '@/all-icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export {
  RuiButton,
  RuiIcon,
  RuiCheckbox,
  RuiStepper,
  RuiTextField,
  RuiRadioGroup,
  RuiRadio,
  RuiFooterStepper,
  RuiProgress,
  RuiRevealableTextField,
  useRotkiTheme,
};

export { StepperState };

export const RuiPlugin = {
  install: (app: App, options?: InitThemeOptions) => {
    app.use(createHead());
    const { registerIcons } = useIcons();
    registerIcons(options?.icons || []);
    useRotkiTheme().init({ ...options });
  },
};
