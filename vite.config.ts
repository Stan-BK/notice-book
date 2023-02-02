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
        registerType: 'autoUpdate',
        srcDir: 'src',
        filename: 'sw.ts',
        strategies: 'injectManifest',
        manifest: {
          name: 'Notice Book',
          short_name: 'Notice Book',
          theme_color: '#ffffff'
        },
      // devOptions: {
      //   enabled: true,
      //   type: 'module',
      //   navigateFallback: 'index.html'
      // }
      })
    ],
  }
})