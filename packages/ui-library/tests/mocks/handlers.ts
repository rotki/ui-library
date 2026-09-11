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

  // Logo images: an empty 200 stands in for the image itself, which no test reads
  http.get('https://raw.githubusercontent.com/rotki/data/:branch/assets/icons/:filename', () =>
    new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    })),
];
