export interface SelectOption {
  id: number;
  label: string;
}

export function createOptions(): SelectOption[] {
  return [
    { id: 1, label: 'Germany' },
    { id: 2, label: 'Nigeria' },
    { id: 3, label: 'Greece' },
    { id: 4, label: 'Indonesia' },
    { id: 5, label: 'Spain' },
    { id: 6, label: 'India' },
    { id: 7, label: 'France' },
    { id: 8, label: 'Option with very long name to test and see truncate behaviour' },
    ...[...new Array(100).keys()].map(index => ({
      id: index + 9,
      label: (index + 9).toString(),
    })),
  ];
}
