<script lang="ts" setup>
import type { DateTimePickerAction } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import RuiTimezoneSelect from '@/components/date-time-picker/RuiTimezoneSelect.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTimePicker, { type TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';

defineOptions({
  name: 'RuiDateTimePickerMenu',
});

const selectedDate = defineModel<Date | undefined>('selectedDate', { required: true });
const selectedTime = defineModel<Date | undefined>('selectedTime', { required: true });
const selectedHour = defineModel<number | undefined>('selectedHour', { required: true });
const selectedMinute = defineModel<number | undefined>('selectedMinute', { required: true });
const selectedSecond = defineModel<number | undefined>('selectedSecond', { required: true });
const selectedMillisecond = defineModel<number | undefined>('selectedMillisecond', { required: true });
const timeSelection = defineModel<TimePickerSelection>('timeSelection', { required: true });
const selectedTimezone = defineModel<string | undefined>('selectedTimezone', { required: true });
const calendarMenuOpen = defineModel<boolean>('calendarMenuOpen', { required: true });

const { actions = [] } = defineProps<{
  accuracy: TimeAccuracy;
  actions?: DateTimePickerAction[];
  maxDate?: Date | number;
  minDate?: Date | number;
  showTimezone?: boolean;
}>();

const emit = defineEmits<{
  'set-now': [];
  'set-today': [];
  'clear': [];
}>();

defineSlots<{
  default: () => any;
}>();

const { t } = useRuiI8n();

const keys = RUI_I18N_KEYS.dateTimePicker;

interface ActionConfig {
  id: DateTimePickerAction;
  icon: 'lu-clock' | 'lu-calendar-days' | 'lu-x';
  label: string;
  handler: () => void;
}

const actionConfig = computed<ActionConfig[]>(() => {
  const available: Record<DateTimePickerAction, ActionConfig> = {
    clear: {
      handler: () => emit('clear'),
      icon: 'lu-x',
      id: 'clear',
      label: t(keys.clear, 'Clear'),
    },
    now: {
      handler: () => emit('set-now'),
      icon: 'lu-clock',
      id: 'now',
      label: t(keys.now, 'Now'),
    },
    today: {
      handler: () => emit('set-today'),
      icon: 'lu-calendar-days',
      id: 'today',
      label: t(keys.today, 'Today'),
    },
  };

  return actions.map(action => available[action]).filter(Boolean);
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex divide-x divide-rui-grey-200 dark:divide-rui-grey-800">
      <RuiCalendar
        v-model="selectedDate"
        v-model:menu-open="calendarMenuOpen"
        borderless
        :max-date="maxDate"
        :min-date="minDate"
      />
      <RuiTimePicker
        v-model="selectedTime"
        v-model:hour="selectedHour"
        v-model:minute="selectedMinute"
        v-model:second="selectedSecond"
        v-model:millisecond="selectedMillisecond"
        v-model:selection="timeSelection"
        :accuracy="accuracy"
        borderless
      />
      <div v-if="showTimezone || $slots.default">
        <div
          v-if="showTimezone"
          class="p-4 pl-3"
        >
          <RuiTimezoneSelect
            v-model="selectedTimezone"
            data-id="timezone-select"
            hide-details
            class="pt-0 pr-0"
          />
        </div>
        <slot />
      </div>
    </div>
    <div
      v-if="actionConfig.length > 0"
      data-id="actions"
      class="flex justify-end gap-1 px-3 py-2 border-t border-rui-grey-200 dark:border-rui-grey-800"
    >
      <RuiButton
        v-for="action in actionConfig"
        :key="action.id"
        variant="text"
        size="sm"
        color="primary"
        :data-id="`action-${action.id}`"
        @click="action.handler()"
      >
        <template #prepend>
          <RuiIcon
            :name="action.icon"
            size="16"
          />
        </template>
        {{ action.label }}
      </RuiButton>
    </div>
  </div>
</template>
