<script setup lang="ts">
import { type FormDetails, useFormTextDetail } from '@/utils/form-text-detail';

/**
 * The line under a control. It is 20px: 4px of padding on the message above a 16px caption line,
 * so an `auto` line with nothing to show takes no space. The TransitionGroup has no `appear`: a
 * hint present on first render is in place when the field shows, and only a change of message
 * animates. The template keeps no comments, since a root-level one makes the component a fragment
 * in development and drops the class a parent passes.
 */
const {
  errorMessages = [],
  successMessages = [],
  hint = '',
  details = 'reserve',
} = defineProps<{
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hint?: string;
  /** `reserve` keeps the line while empty; `auto` takes no space until there is a message. */
  details?: Exclude<FormDetails, 'hidden'>;
}>();

defineSlots<{
  /** Rich hint content, shown in place of the `hint` text while there is no error or success message. */
  hint?: () => any;
}>();

const { formattedErrorMessages, formattedSuccessMessages, hasError, hasSuccess } =
  useFormTextDetail(
    () => errorMessages,
    () => successMessages,
  );
</script>

<template>
  <TransitionGroup
    tag="div"
    class="details"
    :class="{ 'min-h-5': details === 'reserve' }"
    :data-details="details"
    enter-from-class="opacity-0 -translate-y-2 h-0"
    enter-active-class="transform transition"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 -translate-y-2"
    leave-active-class="transform transition"
    leave-to-class="opacity-0 -translate-y-2 h-0"
  >
    <div
      v-if="hasError"
      key="error"
      class="pt-1 text-xs/4 text-rui-error dark:text-rui-error-lighter"
    >
      {{ formattedErrorMessages[0] }}
    </div>
    <div
      v-else-if="hasSuccess"
      key="success"
      class="pt-1 text-xs/4 text-rui-success"
    >
      {{ formattedSuccessMessages[0] }}
    </div>
    <div
      v-else-if="$slots.hint || hint"
      key="hint"
      class="pt-1 text-xs/4 text-rui-text-secondary"
    >
      <slot name="hint">
        {{ hint }}
      </slot>
    </div>
  </TransitionGroup>
</template>
