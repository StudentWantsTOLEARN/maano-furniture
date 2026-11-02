import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['MF.png'],
      manifest: {
        name: 'Maano Furniture',
        short_name: 'Maano',
        description: 'Handcrafted Organic Living & Furniture Shop',
        theme_color: '#3D2314',
        background_color: '#F9F6F0',
        display: 'standalone',
        icons: [
          {
            src: '/MF.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/MF.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})