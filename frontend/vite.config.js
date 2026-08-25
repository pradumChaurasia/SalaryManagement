import { defineConfig } from 'vite'

// Proxy to backend API during development. Adjust target if your API uses a different port.
export default defineConfig({
  server: {
    proxy: {
      '/employees': 'http://localhost:3000',
      '/compensations': 'http://localhost:3000',
      '/insights': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  }
})
