import { http, HttpResponse } from 'msw';

// Mock data for asset mappings
const mockAssetMappings = {
  logo: {
    about: 'about-logo.svg',
    app: 'app-logo.svg',
    drawer: 'drawer-logo.svg',
    emptyScreen: 'empty-screen-logo.svg',
    website: 'website-logo.svg',
  },
};

export const handlers = [
  // Mock GitHub raw content API for asset mappings
  http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () => HttpResponse.json(mockAssetMappings)),

  // Mock GitHub raw content API for logo images
  http.get('https://raw.githubusercontent.com/rotki/data/:branch/assets/icons/:filename', () =>
    // Return a mock response for logo images
    // In real tests, this would return actual image data or a data URL
    new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    })),
];
