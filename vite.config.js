import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/SuGPT/",
  define: {
    'process.env.REACT_APP_API_KEY': JSON.stringify(import.meta.env.VITE_SOME_KEY),
  },
});
