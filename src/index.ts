/* eslint-disable max-lines,import/max-dependencies */
import { type App } from 'vue';
import { createHead } from '@vueuse/head';
import { default as RuiAlert } from '@/components/alerts/Alert.vue';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import { default as RuiButtonGroup } from '@/components/buttons/button-group/ButtonGroup.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
import { default as RuiCheckbox } from '@/components/forms/checkbox/Checkbox.vue';
import { default as RuiStepper } from '@/components/steppers/Stepper.vue';
import { default as RuiTextField } from '@/components/forms/text-field/TextField.vue';
import { default as RuiFooterStepper } from '@/components/steppers/FooterStepper.vue';
import { default as RuiProgress } from '@/components/progress/Progress.vue';
import { default as RuiRadioGroup } from '@/components/forms/radio-button/radio-group/RadioGroup.vue';
import { default as RuiRadio } from '@/components/forms/radio-button/radio/Radio.vue';
import { default as RuiRevealableTextField } from '@/components/forms/revealable-text-field/RevealableTextField.vue';
import { default as RuiLogo } from '@/components/logos/Logo.vue';
import { useRotkiTheme } from '@/composables/theme';
import { StepperState } from '@/types/stepper';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.scss';

import '@fontsource/roboto';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

export * from '@/all-icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export {
  RuiAlert,
  RuiButton,
  RuiButtonGroup,
  RuiCheckbox,
  RuiFooterStepper,
  RuiIcon,
  RuiLogo,
  RuiProgress,
  RuiRadio,
  RuiRadioGroup,
  RuiRevealableTextField,
  RuiStepper,
  RuiTextField,
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
