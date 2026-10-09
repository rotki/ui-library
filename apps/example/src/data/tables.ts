export interface BaseUser {
  'id': number;
  'name': string;
  'username': string;
  'email': string;
  'address.street': string;
  'address.city': string;
}

export interface ExtendedUser extends BaseUser {
  'phone'?: string;
  'website': string;
  'company.name'?: string;
}
