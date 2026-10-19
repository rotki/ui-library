import type { ComputedRef, MaybeRefOrGetter } from 'vue';

export type ValidationState = 'error' | 'success' | undefined;

/**
 * How a control handles the line under it for its hint, error or success message.
 *
 * - `reserve`: the line is always there, so a message never moves what is below (the default).
 * - `auto`: no space while there is nothing to show; the line appears with a hint, error or
 *   success message and pushes what is below down.
 * - `hidden`: no line and no message text. An error still marks the control invalid.
 */
export type FormDetails = 'reserve' | 'auto' | 'hidden';

/**
 * The details mode a control uses: `hidden` while the deprecated `hideDetails` is set,
 * otherwise its `details` prop, otherwise `reserve`.
 */
export function useFormDetails(
  details: MaybeRefOrGetter<FormDetails | undefined>,
  hideDetails: MaybeRefOrGetter<boolean>,
): ComputedRef<FormDetails> {
  return computed<FormDetails>(() => (toValue(hideDetails) ? 'hidden' : toValue(details) ?? 'reserve'));
}

export interface FormTextDetailReturn {
  formattedErrorMessages: ComputedRef<string[]>;
  formattedSuccessMessages: ComputedRef<string[]>;
  hasError: ComputedRef<boolean>;
  hasMessages: ComputedRef<boolean>;
  hasSuccess: ComputedRef<boolean>;
  validation: ComputedRef<ValidationState>;
}

export function useFormTextDetail(
  errorMessages: MaybeRefOrGetter<string | string[]>,
  successMessages: MaybeRefOrGetter<string | string[]>,
): FormTextDetailReturn {
  const formattedErrorMessages = computed<string[]>(() => {
    let errorMessagesVal = toValue(errorMessages);
    if (typeof errorMessagesVal === 'string')
      errorMessagesVal = [errorMessagesVal];

    return errorMessagesVal.filter(item => !!item);
  });

  const formattedSuccessMessages = computed<string[]>(() => {
    let successMessagesVal = toValue(successMessages);
    if (typeof successMessagesVal === 'string')
      successMessagesVal = [successMessagesVal];

    return successMessagesVal.filter(item => !!item);
  });

  const hasError = computed<boolean>(() => get(formattedErrorMessages).length > 0);
  const hasSuccess = computed<boolean>(() => get(formattedSuccessMessages).length > 0);
  const hasMessages = computed<boolean>(() => get(hasError) || get(hasSuccess));

  const validation = computed<ValidationState>(() => {
    if (get(hasError))
      return 'error';
    if (get(hasSuccess))
      return 'success';
    return undefined;
  });

  return {
    formattedErrorMessages,
    formattedSuccessMessages,
    hasError,
    hasMessages,
    hasSuccess,
    validation,
  };
}
