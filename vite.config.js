import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Define manual chunks for vendor libraries
        manualChunks: {
          // 'vendor' chunk will include the specified libraries
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
