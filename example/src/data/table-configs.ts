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

export const fixedRows: ExtendedUser[] = [{
  'id': 5,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
}, {
  'id': 501,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
}, {
  'id': 5012,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
}, {
  'id': 5013,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
}, {
  'id': 10,
  'name': 'Clementina DuBuque',
  'username': 'Moriah.Stanton',
  'email': 'Rey.Padberg@karina.biz',
  'website': 'ambrose.net',
  'address.street': 'Kattie Turnpike',
  'address.city': 'Lebsackbury',
}, {
  'id': 3,
  'name': 'Clementine Bauch',
  'username': 'Kamren',
  'email': 'Nathan@yesenia.net',
  'website': 'ramiro.info',
  'address.street': 'Douglas Extension',
  'address.city': 'McKenziehaven',
}, {
  'id': 2,
  'name': 'Ervin Howell',
  'username': 'Antonette',
  'email': 'Shanna@melissa.tv',
  'website': 'anastasia.net',
  'address.street': 'Victor Plains',
  'address.city': 'Wisokyburgh',
}, {
  'id': 203,
  'name': 'Ervin Howell',
  'username': 'Antonette',
  'email': 'Shanna@melissa.tv',
  'website': 'anastasia.net',
  'address.street': 'Victor Plains',
  'address.city': 'Wisokyburgh',
}, {
  'id': 19,
  'name': 'Glenna Reichert',
  'username': 'Kamren',
  'email': 'Chaim_McDermott@dana.io',
  'website': 'conrad.com',
  'address.street': 'Dayna Park',
  'address.city': 'Bartholomebury',
}, {
  'id': 15,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
}, {
  'id': 110,
  'name': 'Clementina DuBuque',
  'username': 'Moriah.Stanton',
  'email': 'Rey.Padberg@karina.biz',
  'website': 'ambrose.net',
  'address.street': 'Kattie Turnpike',
  'address.city': 'Lebsackbury',
}, {
  'id': 13,
  'name': 'Clementine Bauch',
  'username': 'Kamren',
  'email': 'Nathan@yesenia.net',
  'website': 'ramiro.info',
  'address.street': 'Douglas Extension',
  'address.city': 'McKenziehaven',
}, {
  'id': 12,
  'name': 'Ervin Howell',
  'username': 'Antonette',
  'email': 'Shanna@melissa.tv',
  'website': 'anastasia.net',
  'address.street': 'Victor Plains',
  'address.city': 'Wisokyburgh',
}];

export const sampleData: ExtendedUser[] = [{
  'id': 1,
  'name': 'Chelsey Dietrich',
  'username': 'Kamren',
  'email': 'Lucio_Hettinger@annie.ca',
  'phone': '(254)954-1289',
  'website': 'demarco.info',
  'address.street': 'Skiles Walks',
  'address.city': 'Roscoeview',
  'company.name': 'Keebler LLC',
}];
