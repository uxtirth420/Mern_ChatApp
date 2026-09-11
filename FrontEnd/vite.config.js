import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('@chakra-ui')) return 'chakra-vendor';
          if (id.includes('react-router') || id.includes('react-dom')) return 'router-vendor';
          if (id.includes('axios')) return 'axios-vendor';
          if (id.includes('socket.io-client')) return 'socket-vendor';
          if (id.includes('react-icons') || id.includes('@mui') || id.includes('framer-motion')) return 'ui-vendor';
          if (id.includes('lodash') || id.includes('scheduler')) return 'misc-vendor';

          return 'vendor';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/health': 'http://127.0.0.1:5000'
    }
  }
})
