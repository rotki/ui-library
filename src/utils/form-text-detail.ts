import { type MaybeRef } from '@vueuse/shared';
import { logicOr } from '@vueuse/math';

export const useFormTextDetail = (
  errorMessages: MaybeRef<string | string[]>,
  successMessages: MaybeRef<string | string[]>,
) => {
  const formattedErrorMessages = computed(() => {
    let errorMessagesVal = get(errorMessages);
    if (typeof errorMessagesVal === 'string') {
      errorMessagesVal = [errorMessagesVal];
    }
    return errorMessagesVal.filter((item) => !!item);
  });

  const formattedSuccessMessages = computed(() => {
    let successMessagesVal = get(successMessages);
    if (typeof successMessagesVal === 'string') {
      successMessagesVal = [successMessagesVal];
    }
    return successMessagesVal.filter((item) => !!item);
  });

  const hasError = computed(() => get(formattedErrorMessages).length > 0);

  const hasSuccess = computed(() => get(formattedSuccessMessages).length > 0);
  const hasMessages = logicOr(hasError, hasSuccess);

  return {
    formattedErrorMessages,
    formattedSuccessMessages,
    hasError,
    hasSuccess,
    hasMessages,
  };
};
