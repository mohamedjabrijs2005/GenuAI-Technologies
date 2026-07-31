import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // TensorFlow — very large, isolate it
          if (id.includes('@tensorflow')) return 'vendor-tf';
          // PDF / QR
          if (id.includes('pdfjs-dist') || id.includes('qrcode') || id.includes('react-qr-code')) return 'vendor-pdf-qr';
          // Charts & markdown
          if (id.includes('recharts') || id.includes('react-markdown')) return 'vendor-ui';
          // Socket.IO
          if (id.includes('socket.io-client')) return 'vendor-socket';
          // React core
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          // All remaining node_modules → vendor chunk
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
