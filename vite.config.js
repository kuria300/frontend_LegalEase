import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
     //reverse proxy
      '/api': {
        target: 'https://legaleaseafrica.org/__api__', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
