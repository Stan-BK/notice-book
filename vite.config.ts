import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
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
})