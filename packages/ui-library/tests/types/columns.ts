/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never run. A column takes only the
 * properties the table reads, so a misspelt one fails; a header property of the app's own, read
 * through `column-attr`, goes on the app's column type.
 */
import type { DataTableColumn } from '@/components';

interface Row {
  id: number;
  name: string;
}

export const columns: DataTableColumn<Row>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', align: 'end' },
];

export const misspelt: DataTableColumn<Row>[] = [
  // @ts-expect-error `sortabel` is no column property
  { key: 'id', label: 'ID', sortabel: true },
];

export const titled: (DataTableColumn<Row> & { title: string })[] = [
  { key: 'id', title: 'Identifier' },
];

export const asColumns: DataTableColumn<Row>[] = titled;
