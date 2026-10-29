<script lang="ts" setup>
import RuiAlert from '@/components/alerts/RuiAlert.vue';
import { errorStyles } from './table-error-state-styles';

export interface TableErrorStateProps {
  /** Heading for the failure, such as which read it was. */
  title?: string;
  /** What went wrong, in the words the caller got back. */
  message?: string;
  /**
   * Label for the retry control. The library ships no translations, so a
   * caller that wants the control has to name it; leaving this empty renders
   * the reason on its own.
   */
  actionText?: string;
}

defineOptions({
  name: 'RuiTableErrorState',
});

const { title = '', message = '', actionText = '' } = defineProps<TableErrorStateProps>();

const emit = defineEmits<{
  action: [];
}>();

defineSlots<{
  default?: () => any;
}>();

const ui = errorStyles();
</script>

<template>
  <div
    :class="ui.root()"
    data-id="table-error"
  >
    <RuiAlert
      :action-text="actionText"
      :class="ui.alert()"
      :title="title"
      type="error"
      @action="emit('action')"
    >
      <slot>
        {{ message }}
      </slot>
    </RuiAlert>
  </div>
</template>
