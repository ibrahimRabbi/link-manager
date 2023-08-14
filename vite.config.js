import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1500,
      commonjsOptions: {
        include: [/node_modules/],
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
    define: {},
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
  };

  if (mode === 'development') {
    config.define.global = {};
  }

  return config;
});
