import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ניהול מלאי בר',
        short_name: 'מלאי בר',
        description: 'ניהול ספירת מלאי משקאות והזמנות סחורה לבר',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#14110f',
        background_color: '#14110f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Never cache Supabase API/realtime calls — this app must stay live-data.
        navigateFallbackDenylist: [/^\/rest\//, /^\/realtime\//],
      },
    }),
  ],
})
