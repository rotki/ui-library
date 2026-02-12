import { setProjectAnnotations } from '@storybook/vue3-vite';
import previewAnnotations from './preview';

// @ts-expect-error definePreview() returns VuePreview which is not compatible with setProjectAnnotations types storybookjs/storybook issues 33057
const annotations = setProjectAnnotations([previewAnnotations]);
await annotations.beforeAll?.();
