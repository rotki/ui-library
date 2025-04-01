import { computed } from 'vue';
import { useDatePicker } from '../use/date-picker';
import {
  type DateParts,
  getDatePartsOptions,
  isDateParts,
  type SimpleDateParts,
} from '../utils/date/helpers';
import { arrayHasItems } from '../utils/helpers';

const _amOptions = [
  { label: '12', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
];
const _pmOptions = [
  { label: '12', value: 12 },
  { label: '1', value: 13 },
  { label: '2', value: 14 },
  { label: '3', value: 15 },
  { label: '4', value: 16 },
  { label: '5', value: 17 },
  { label: '6', value: 18 },
  { label: '7', value: 19 },
  { label: '8', value: 20 },
  { label: '9', value: 21 },
  { label: '10', value: 22 },
  { label: '11', value: 23 },
];

export interface TimePickerProps {
  position: number;
}

export function createTimePicker(props: TimePickerProps) {
  const ctx = useDatePicker();
  const {
    dateParts,
    hideTimeHeader,
    is24hr,
    isRange,
    locale,
    rules,
    timeAccuracy,
    updateValue: updateDpValue,
  } = ctx;

  const isStart = computed(() => props.position === 0);
  const parts = computed(
    () => dateParts.value[props.position] || { isValid: false },
  );
  const partsValid = computed(() => isDateParts(parts.value));
  const isValid = computed(() => !!parts.value.isValid);
  const showHeader = computed(() => !hideTimeHeader.value && isValid.value);

  function updateParts(newParts: Partial<DateParts>) {
    newParts = Object.assign(parts.value, newParts);
    let newValue = null;
    if (isRange.value) {
      const start = isStart.value ? newParts : dateParts.value[0];
      const end = isStart.value ? dateParts.value[1] : newParts;
      newValue = { end, start };
    }
    else {
      newValue = newParts;
    }
    updateDpValue(newValue, {
      moveToValue: true,
      patch: 'time',
      targetPriority: isStart.value ? 'start' : 'end',
    });
  }

  const date = computed(() => {
    if (!partsValid.value)
      return null;
    let date = locale.value.toDate(parts.value as Partial<SimpleDateParts>);
    if ((parts.value as DateParts).hours === 24) {
      date = new Date(date.getTime() - 1);
    }
    return date;
  });

  const hours = computed({
    get() {
      return (parts.value as DateParts).hours;
    },
    set(val) {
      updateParts({ hours: val });
    },
  });

  const minutes = computed({
    get() {
      return (parts.value as DateParts).minutes;
    },
    set(val) {
      updateParts({ minutes: val });
    },
  });

  const seconds = computed({
    get() {
      return (parts.value as DateParts).seconds;
    },
    set(val) {
      updateParts({ seconds: val });
    },
  });

  const milliseconds = computed({
    get() {
      return (parts.value as DateParts).milliseconds;
    },
    set(val) {
      updateParts({ milliseconds: val });
    },
  });

  const isAM = computed({
    get() {
      return (parts.value as DateParts).hours < 12;
    },
    set(value) {
      value = String(value).toLowerCase() === 'true';
      let hValue = hours.value;
      if (value && hValue >= 12) {
        hValue -= 12;
      }
      else if (!value && hValue < 12) {
        hValue += 12;
      }
      updateParts({ hours: hValue });
    },
  });

  const options = computed(() =>
    getDatePartsOptions(parts.value as DateParts, rules.value[props.position]),
  );

  const amHourOptions = computed(() => _amOptions.filter(opt =>
    options.value.hours.some(ho => ho.value === opt.value),
  ));

  const pmHourOptions = computed(() => _pmOptions.filter(opt =>
    options.value.hours.some(ho => ho.value === opt.value),
  ));

  const hourOptions = computed(() => {
    if (is24hr.value)
      return options.value.hours;
    if (isAM.value)
      return amHourOptions.value;
    return pmHourOptions.value;
  });

  const isAMOptions = computed(() => {
    const result = [];
    if (arrayHasItems(amHourOptions.value))
      result.push({ label: 'AM', value: true });
    if (arrayHasItems(pmHourOptions.value))
      result.push({ label: 'PM', value: false });
    return result;
  });

  return {
    ...ctx,
    date,
    hourOptions,
    hours,
    is24hr,
    isAM,
    isAMOptions,
    isValid,
    milliseconds,
    minutes,
    options,
    parts,
    seconds,
    showHeader,
    timeAccuracy,
  };
}
