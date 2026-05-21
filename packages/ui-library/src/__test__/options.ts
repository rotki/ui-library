export interface SelectOption { id: string; label: string }

export interface GroupedSelectOption { id: string; label: string; category: string; disabled?: boolean }

export const groupedOptions: GroupedSelectOption[] = [
  { category: 'Europe', id: '1', label: 'Germany' },
  { category: 'Europe', id: '2', label: 'France' },
  { category: 'Europe', id: '3', label: 'Spain' },
  { category: 'Asia', id: '4', label: 'India' },
  { category: 'Asia', id: '5', label: 'Indonesia' },
  { category: 'Africa', id: '6', label: 'Nigeria' },
];

export const options: SelectOption[] = [
  { id: '1', label: 'Germany' },
  { id: '2', label: 'Nigeria' },
  { id: '3', label: 'Greece' },
  { id: '4', label: 'Indonesia' },
  { id: '5', label: 'Spain' },
  { id: '6', label: 'India' },
  { id: '7', label: 'France' },
  { id: '8', label: 'England' },
  ...[...new Array(50).keys()].map(index => ({
    id: `${index + 9}`,
    label: `${index + 9}`,
  })),
];
