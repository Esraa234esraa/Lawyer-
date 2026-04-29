import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
 resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
},
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          ui: ['@headlessui/react', 'sonner'],
          state: ['zustand'],
          http: ['axios'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})