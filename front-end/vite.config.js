import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import talwindcss from '@talwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), talwindcss()],
})
