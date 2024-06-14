export interface SelectOption { id: string; label: string }

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
