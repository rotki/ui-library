const SESSION_VERIFIED_PREFIX = 'rui-logo-verified';

function verifiedKey(logo: string): string {
  return `${SESSION_VERIFIED_PREFIX}:${logo}`;
}

/**
 * Returns the URL a logo last decoded from in this browser session, so a page
 * load that resolves the same URL can show it without waiting for the decode.
 */
export function getVerifiedLogoUrl(logo: string): string | undefined {
  try {
    return sessionStorage.getItem(verifiedKey(logo)) ?? undefined;
  }
  catch {
    return undefined;
  }
}

/**
 * Stores a logo URL after its image decoded successfully.
 */
export function setVerifiedLogoUrl(logo: string, url: string): void {
  try {
    sessionStorage.setItem(verifiedKey(logo), url);
  }
  catch {
    // sessionStorage may be full or unavailable
  }
}

/**
 * Forgets a logo URL whose image failed to load, so it is not trusted on the next load.
 */
export function removeVerifiedLogoUrl(logo: string): void {
  try {
    sessionStorage.removeItem(verifiedKey(logo));
  }
  catch {
    // sessionStorage may be unavailable
  }
}

/**
 * Removes every stored logo URL. Exposed for testing only.
 */
export function clearVerifiedLogoUrls(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(SESSION_VERIFIED_PREFIX))
        keys.push(key);
    }
    keys.forEach(key => sessionStorage.removeItem(key));
  }
  catch {
    // sessionStorage may be unavailable
  }
}
