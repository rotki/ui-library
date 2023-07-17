import * as fs from 'node:fs';
import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:4173',
    setupNodeEvents: (on): void => {
      on(
        'after:spec',
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests.some((test) =>
              test.attempts.some((attempt) => attempt.state === 'failed'),
            );
            if (!failures) {
              // delete the video if the spec passed and no tests retried

              fs.unlinkSync(results.video);
            }
          }
        },
      );
    },
  },
});
