export const FooterStepperVariant = {
  numeric: 'numeric',
  bullet: 'bullet',
  progress: 'progress',
  pill: 'pill',
} as const;

export type FooterStepperVariant = (typeof FooterStepperVariant)[keyof typeof FooterStepperVariant];
