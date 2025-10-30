import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: loadEnv(mode, __dirname).VITE_APP_PATHNAME,
    plugins: [
      vue(),
      VitePWA({
        injectRegister: null,
        registerType: 'autoUpdate',
        srcDir: 'src',
        filename: 'sw.ts',
        strategies: 'injectManifest',
        manifest: {
          name: 'Notice Book',
          short_name: 'NBook',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'notice-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'notice-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'notice-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        // devOptions: {
        //   enabled: true,
        //   type: 'module',
        //   navigateFallback: 'index.html'
        // }
      }),
    ],
  }
})
