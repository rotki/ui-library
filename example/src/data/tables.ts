import { objectOmit } from '@vueuse/shared';

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

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

export interface NormalizedUser extends Omit<UserProfile, 'address' | 'company'> {
  'address.street': string;
  'address.suite': string;
  'address.city': string;
  'address.zipcode': string;
  'address.geo.lat': string;
  'address.geo.lng': string;
  'company.name': string;
  'company.catchPhrase': string;
  'company.bs': string;
}

// Helper function to normalize user data
export function normalize(user: UserProfile): NormalizedUser {
  const { address, company } = user;
  return {
    ...objectOmit(user, ['address', 'company']),
    'address.street': address.street,
    'address.suite': address.suite,
    'address.city': address.city,
    'address.zipcode': address.zipcode,
    'address.geo.lat': address.geo.lat,
    'address.geo.lng': address.geo.lng,
    'company.name': company.name,
    'company.catchPhrase': company.catchPhrase,
    'company.bs': company.bs,
  };
}
