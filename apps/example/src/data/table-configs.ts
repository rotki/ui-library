import type { DataTableColumn } from '@rotki/ui-library/components';
import type { BaseUser, ExtendedUser } from './tables';

export const columns: DataTableColumn<BaseUser>[] = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'name',
  label: 'Full name',
  sortable: true,
}, {
  key: 'username',
  label: 'Username',
  sortable: true,
}, {
  key: 'email',
  label: 'Email address',
  sortable: true,
}, {
  key: 'address.street',
  label: 'Street',
  sortable: true,
}, {
  key: 'address.city',
  label: 'City',
  sortable: true,
}, {
  key: 'website',
  label: 'Website',
}, {
  key: 'company.name',
  label: 'Company',
}, {
  key: 'phone',
  label: 'Phone',
  align: 'end',
}, {
  key: 'action',
}];

export const fixedColumns: DataTableColumn<BaseUser>[] = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'name',
  label: 'Full name',
  sortable: true,
}, {
  key: 'username',
  label: 'Username',
}, {
  key: 'email',
  label: 'Email address',
}, {
  key: 'address.street',
  label: 'Street',
}, {
  key: 'address.city',
  label: 'City',
}, {
  key: 'website',
  label: 'Website',
}, {
  key: 'action',
}];

const userNames: string[] = ['Alice Martin', 'Bob Chen', 'Carol Davis', 'Dave Wilson', 'Eve Torres'];
const usernames: string[] = ['amartin', 'bchen', 'amartin', 'dwilson', 'amartin'];
const streets: string[] = ['Maple Avenue', 'Oak Boulevard', 'Pine Street', 'Cedar Lane', 'Elm Drive'];
const cities: string[] = ['Springfield', 'Riverside', 'Lakewood', 'Fairview', 'Georgetown'];
const websites: string[] = ['alice.dev', 'bobchen.io', 'carol.codes', 'dave.net', 'eve.tech'];

export const fixedRows: ExtendedUser[] = Array.from({ length: 13 }, (_, i): ExtendedUser => {
  const name = userNames[i % userNames.length]!;
  const username = usernames[i % usernames.length]!;
  return {
    'id': i + 1,
    'name': name,
    'username': username,
    'email': `${name.split(' ')[0]!.toLowerCase()}.${i + 1}@example.com`,
    'website': websites[i % websites.length]!,
    'address.street': streets[i % streets.length]!,
    'address.city': cities[i % cities.length]!,
  };
});
