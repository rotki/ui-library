import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:4173',
  },
});
