import type { ComputedRef, MaybeRef, Ref } from 'vue';
import { logicOr } from '@vueuse/math';

export interface FormTextDetailReturn {
  formattedErrorMessages: ComputedRef<string[]>;
  formattedSuccessMessages: ComputedRef<string[]>;
  hasError: ComputedRef<boolean>;
  hasMessages: Ref<boolean>;
  hasSuccess: ComputedRef<boolean>;
}

export function useFormTextDetail(
  errorMessages: MaybeRef<string | string[]>,
  successMessages: MaybeRef<string | string[]>,
): FormTextDetailReturn {
  const formattedErrorMessages = computed<string[]>(() => {
    let errorMessagesVal = get(errorMessages);
    if (typeof errorMessagesVal === 'string')
      errorMessagesVal = [errorMessagesVal];

    return errorMessagesVal.filter(item => !!item);
  });

  const formattedSuccessMessages = computed<string[]>(() => {
    let successMessagesVal = get(successMessages);
    if (typeof successMessagesVal === 'string')
      successMessagesVal = [successMessagesVal];

    return successMessagesVal.filter(item => !!item);
  });

  const hasError = computed<boolean>(() => get(formattedErrorMessages).length > 0);

  const hasSuccess = computed<boolean>(() => get(formattedSuccessMessages).length > 0);
  const hasMessages = logicOr(hasError, hasSuccess);

  return {
    formattedErrorMessages,
    formattedSuccessMessages,
    hasError,
    hasMessages,
    hasSuccess,
  };
}
