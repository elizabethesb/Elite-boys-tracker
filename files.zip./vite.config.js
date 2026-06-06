import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Elite Boys Reward Tracker',
        short_name: 'Elite Boys',
        description: 'Points-based reward system for children',
        theme_color: '#0a0a0f',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%2300C9FF" width="192" height="192"/><text x="50%" y="50%" font-size="100" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">EB</text></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect fill="%2300C9FF" width="512" height="512"/><text x="50%" y="50%" font-size="280" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">EB</text></svg>',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 720"><rect fill="%230a0a0f" width="540" height="720"/><text x="50%" y="100" font-size="40" font-weight="bold" text-anchor="middle" fill="%2300C9FF">Elite Boys</text><text x="50%" y="200" font-size="20" text-anchor="middle" fill="%23888">Reward Tracker</text></svg>',
            sizes: '540x720',
            type: 'image/svg+xml',
            form_factor: 'narrow'
          }
        ],
        categories: ['productivity', 'family'],
        orientation: 'portrait-primary',
        shortcuts: [
          {
            name: 'Track Points',
            short_name: 'Track',
            description: 'Quick access to points tracker',
            url: '/',
            icons: [{ src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%2300C9FF"/><text x="50%" y="50%" font-size="50" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">+</text></svg>', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 3600 }
            }
          }
        ]
      }
    })
  ],
  build: { outDir: 'dist', sourcemap: false }
})
