import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


export default defineConfig({
  plugins: [react()],
  build: {
    // Cấu hình build
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting tùy chỉnh
          vendor: ['react', 'react-dom'],
        }
      }
    },
    // Tối ưu bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    }
  },
  // Cấu hình dev server
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },

  // Cấu hình alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@App': path.resolve(__dirname, './src'),
    },
  },
})

