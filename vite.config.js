import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDevelopment = mode === 'development'

  return {
    server: {
      host: true,
      port: 5175,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5175,
      },
      proxy: {
        '/api': {
          target: 'https://petconnect-backend-production.up.railway.app',
          changeOrigin: true,
          secure: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        // El usuario decide cuándo actualizar la app; se mostrará un banner opcional.
        registerType: 'prompt',
        includeAssets: [
          // Archivos que se copiarán sin procesar a la carpeta de salida
          'favicon.svg',
          'robots.txt',
          'offline.html',
          'src/assets/images/LogoPetConnect.png'
        ],
        devOptions: {
          enabled: isDevelopment,
        },
        workbox: {
          // Precargar todos los recursos generados y estáticos
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
          navigateFallback: '/offline.html',
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 24 * 60 * 60,
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
                  maxAgeSeconds: 7 * 24 * 60 * 60,
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
                  maxAgeSeconds: 30 * 24 * 60 * 60,
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
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'src/assets/images/LogoPetConnect.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'src/assets/images/LogoPetConnect.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
          ],
        },
      }),
    ],
    build: {
      outDir: 'dist',
      sourcemap: isDevelopment,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            utils: ['axios', 'lodash'],
          },
        },
      },
    },
    preview: {
      port: 5175,
      strictPort: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})