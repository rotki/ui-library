import type { ComputedRef, MaybeRefOrGetter } from 'vue';

export interface FormTextDetailReturn {
  formattedErrorMessages: ComputedRef<string[]>;
  formattedSuccessMessages: ComputedRef<string[]>;
  hasError: ComputedRef<boolean>;
  hasMessages: ComputedRef<boolean>;
  hasSuccess: ComputedRef<boolean>;
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

  return {
    formattedErrorMessages,
    formattedSuccessMessages,
    hasError,
    hasMessages,
    hasSuccess,
  };
}
