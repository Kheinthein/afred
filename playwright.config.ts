import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Désactiver le parallélisme pour éviter le rate limiting
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Un seul worker pour éviter les conflits de rate limiting
  timeout: 60 * 1000, // Timeout par test : 60s
  expect: {
    timeout: 10 * 1000, // Timeout pour les assertions : 10s
  },
  // Reporter adapté au CI : HTML + JUnit pour GitHub Actions
  reporter: process.env.CI
    ? [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command:
      process.platform === 'win32'
        ? 'set PLAYWRIGHT_TEST=true && set NEXT_PUBLIC_E2E=true && npm run dev'
        : 'PLAYWRIGHT_TEST=true NEXT_PUBLIC_E2E=true npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Timeout pour démarrer le serveur : 120s
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PLAYWRIGHT_TEST: 'true',
      NEXT_PUBLIC_E2E: 'true',
      // Variables d'environnement pour le serveur Next.js
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
      JWT_SECRET: process.env.JWT_SECRET || 'test-secret-e2e',
      AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      NODE_ENV: 'test',
    },
  },
});
