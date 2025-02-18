import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
plugins: [
    react(),
    tailwindcss(),
    VitePWA(
      {
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'], // Archivos a cachear
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst', // Intenta la red primero, luego caché
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 24 * 60 * 60, // Un día
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ['style', 'script', 'worker'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // Una semana
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // Un mes
                },
              },
            },
          ],
        },
        manifest: {
          name: 'PetConnect-PWA',
          short_name: 'PetConnect',
          description: 'Una PWA para conectar mascotas',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }
    ),
  ],
  
})
