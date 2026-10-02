import { afterEach, describe, expect, it } from 'vitest';
import { clearVerifiedLogoUrls, getVerifiedLogoUrl, removeVerifiedLogoUrl, setVerifiedLogoUrl } from './verified-logo';

describe('verified-logo', () => {
  afterEach(() => {
    clearVerifiedLogoUrls();
  });

  it('should store and retrieve verified logo URLs', () => {
    setVerifiedLogoUrl('website', 'https://example.com/logo.svg');

    expect(getVerifiedLogoUrl('website')).toBe('https://example.com/logo.svg');
  });

  it('should return undefined for unverified logo URLs', () => {
    expect(getVerifiedLogoUrl('website')).toBeUndefined();
  });

  it('should keep each logo name separate', () => {
    setVerifiedLogoUrl('website', 'https://example.com/website.svg');
    setVerifiedLogoUrl('app', 'https://example.com/app.svg');

    expect(getVerifiedLogoUrl('website')).toBe('https://example.com/website.svg');
    expect(getVerifiedLogoUrl('app')).toBe('https://example.com/app.svg');
  });

  it('should forget a removed logo URL', () => {
    setVerifiedLogoUrl('website', 'https://example.com/logo.svg');
    removeVerifiedLogoUrl('website');

    expect(getVerifiedLogoUrl('website')).toBeUndefined();
  });

  it('should clear every verified logo URL', () => {
    setVerifiedLogoUrl('website', 'https://example.com/website.svg');
    setVerifiedLogoUrl('app', 'https://example.com/app.svg');

    clearVerifiedLogoUrls();

    expect(getVerifiedLogoUrl('website')).toBeUndefined();
    expect(getVerifiedLogoUrl('app')).toBeUndefined();
  });
});
