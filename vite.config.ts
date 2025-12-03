import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/secretsanta/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173'),
    allowedHosts: [
      'goldfish-app-69vxw.ondigitalocean.app',
      'localhost',
      '.ondigitalocean.app', // Allow all DigitalOcean app subdomains
    ],
  },
}) 