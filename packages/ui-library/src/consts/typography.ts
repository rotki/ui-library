/**
 * The type scale, largest first, as the typography docs page lists it: each utility with its size,
 * line height and weight in pixels, and what it is for.
 */
export const typographyClasses = [
  { className: 'text-h1', name: 'H1', spec: '60 / 72 semibold', use: 'Marketing heroes' },
  { className: 'text-h2', name: 'H2', spec: '48 / 56 semibold', use: 'Landing page sections' },
  { className: 'text-h3', name: 'H3', spec: '36 / 44 semibold', use: 'Large numbers, empty states' },
  { className: 'text-h4', name: 'H4', spec: '30 / 38 semibold', use: 'Page titles on wide screens' },
  { className: 'text-h5', name: 'H5', spec: '24 / 32 semibold', use: 'Page titles' },
  { className: 'text-h6', name: 'H6', spec: '20 / 32 semibold', use: 'Card and dialog titles' },
  { className: 'text-subtitle-1', name: 'Subtitle 1', spec: '16 / 28 medium', use: 'Section headings' },
  { className: 'text-subtitle-2', name: 'Subtitle 2', spec: '14 / 20 medium', use: 'Labels, table headers' },
  { className: 'text-body-1', name: 'Body 1', spec: '16 / 24 regular', use: 'Running text' },
  { className: 'text-body-2', name: 'Body 2', spec: '14 / 20 regular', use: 'Controls, tables, dense text' },
  { className: 'text-caption', name: 'Caption', spec: '12 / 20 regular', use: 'Hints, timestamps, help text' },
  { className: 'text-caption-2', name: 'Caption 2', spec: '10 / 16 regular', use: 'Dense tags, axis labels' },
  { className: 'text-overline', name: 'Overline', spec: '12 / 32 medium, tracked', use: 'Eyebrows above a heading' },
] as const;

export type TypographyClass = (typeof typographyClasses)[number];
