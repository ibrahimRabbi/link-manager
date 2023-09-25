import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 8000, 
  pageLoadTimeout:10000,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});