import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import previewAnnotations from './preview';

// @ts-expect-error definePreview() returns VuePreview which is not compatible with setProjectAnnotations types storybookjs/storybook issues 33057
const annotations = setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);
await annotations.beforeAll?.();
