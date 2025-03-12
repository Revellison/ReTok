import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Слушаем все сетевые интерфейсы
    port: 5173, // Стандартный порт Vite
  }
})
