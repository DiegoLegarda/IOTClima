import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Cambia este puerto si es necesario
    host: '0.0.0.0', // Para permitir el acceso externo
  },
})
