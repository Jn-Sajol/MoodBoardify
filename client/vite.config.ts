import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  proxy: {
    '/api': 'http://localhost:5000', // Adjust based on your backend port
  },
})