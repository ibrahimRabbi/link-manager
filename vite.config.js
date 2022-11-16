import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  includeAssets: ['favicon.svg', 'favicon.ico', 'assets/*'],
  resolve: {
    alias: {
      '~@ibm': path.resolve(__dirname, 'node_modules/@ibm'),
    }
  },
});
