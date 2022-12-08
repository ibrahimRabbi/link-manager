import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: true },

  plugins: [react(), mkcert()],
  includeAssets: ['favicon.svg', 'favicon.ico', 'assets/*'],
  resolve: {
    alias: {
      '~@ibm': path.resolve(__dirname, 'node_modules/@ibm'),
    }
  },
});
