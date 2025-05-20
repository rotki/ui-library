import type { DataTableOptions, DataTableSortColumn } from '@rotki/ui-library/components';
import type { ExtendedUser } from '../data/tables';

/**
 * Simulates fetching data from an API with optional filtering, sorting, and pagination
 */
export async function fakeFetch(
  options?: DataTableOptions<ExtendedUser>,
  search?: string,
  api?: boolean,
  data: ExtendedUser[] = [],
): Promise<{
    data: ExtendedUser[];
    total: number;
  }> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  let result = [...data];

  if (api) {
    const query = search?.toLocaleLowerCase();
    const sortBy = options?.sort;
    const sortOptions: Intl.CollatorOptions = {
      numeric: true,
      ignorePunctuation: true,
    };
    const paginated = options?.pagination;

    const sort = (by: DataTableSortColumn<ExtendedUser>) => {
      result.sort((a, b) => {
        if (!by.column)
          return 0;

        if (by.direction === 'desc') {
          return `${b[by.column]}`.localeCompare(
            `${a[by.column]}`,
            undefined,
            sortOptions,
          );
        }

        return `${a[by.column]}`.localeCompare(
          `${b[by.column]}`,
          undefined,
          sortOptions,
        );
      });
    };

    // search
    if (query) {
      result = result.filter(row =>
        (Object.keys(row) as (keyof ExtendedUser)[]).some(key =>
          `${row[key]}`.toLocaleLowerCase().includes(query),
        ),
      );
    }

    // sort
    if (sortBy) {
      if (!Array.isArray(sortBy))
        sort(sortBy);
      else
        sortBy.forEach(sort);
    }

    // paginate
    if (paginated) {
      const start = (paginated.page - 1) * paginated.limit;
      const end = start + paginated.limit;
      result = result.slice(start, end);
    }
  }

  return {
    data: result,
    total: search ? result.length : data.length,
  };
}

/**
 * Checks if a row is expanded
 */
export function isExpanded(row: ExtendedUser, expanded?: ExtendedUser[]): boolean {
  return expanded?.some((item: ExtendedUser) => item.id === row.id) ?? false;
}

/**
 * Toggles the expanded state of a row
 */
export function toggleRow(row: ExtendedUser, expanded?: ExtendedUser[]) {
  if (isExpanded(row, expanded))
    expanded?.splice(expanded.indexOf(row), 1);
  else
    expanded?.push(row);
}

/**
 * Removes a row from the table
 */
export function removeRow<T extends { id: number }>(
  table: { rows: T[] },
  row: T,
) {
  table.rows = table.rows.filter(tRow => tRow.id !== row.id);
}
