<script setup lang="ts">
import { useFormTextDetail } from '@/utils/form-text-detail';

const props = withDefaults(
  defineProps<{
    errorMessages?: string | string[];
    successMessages?: string | string[];
    hint?: string;
  }>(),
  {
    errorMessages: () => [],
    successMessages: () => [],
    hint: '',
  },
);

const { errorMessages, successMessages } = toRefs(props);

const {
  formattedErrorMessages,
  formattedSuccessMessages,
  hasError,
  hasSuccess,
} = useFormTextDetail(errorMessages, successMessages);
</script>

<template>
  <TransitionGroup
    tag="div"
    class="details min-h-[1.5rem]"
    enter-from-class="opacity-0 -translate-y-2 h-0"
    enter-active-class="transform transition"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 -translate-y-2"
    leave-active-class="transform transition"
    leave-to-class="opacity-0 -translate-y-2 h-0"
    appear
  >
    <div
      v-if="hasError"
      key="error"
      class="text-rui-error text-caption"
    >
      {{ formattedErrorMessages[0] }}
    </div>
    <div
      v-else-if="hasSuccess"
      key="success"
      class="text-rui-success text-caption"
    >
      {{ formattedSuccessMessages[0] }}
    </div>
    <div
      v-else-if="hint"
      key="hint"
      class="text-rui-text-secondary text-caption"
    >
      {{ hint }}
    </div>
  </TransitionGroup>
</template>
