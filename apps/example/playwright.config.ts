import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

const useDev = !!process.env.DEV;
const baseURL = useDev ? 'http://localhost:5173' : 'http://localhost:4173';

// Use system Chromium if PLAYWRIGHT_CHROMIUM_PATH is set (e.g., on Arch Linux)
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    viewport: { width: 1280, height: 720 },
    ...(chromiumPath && {
      launchOptions: {
        executablePath: chromiumPath,
        args: ['--headless=new'],
      },
    }),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: useDev ? 'pnpm run dev' : 'pnpm run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
