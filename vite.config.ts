import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-core';
            }
            return 'vendor-utils';
          }
          if (id.includes('src/components/features/admin/charts')) {
            return 'dashboard-charts';
          }
          if (id.includes('src/components/features/admin') || id.includes('src/components/layout/Sidebar') || id.includes('src/components/layout/AdminLayout') || id.includes('src/components/layout/Navbar')) {
            return 'admin-panel';
          }
        }
      }
    }
  }
})
