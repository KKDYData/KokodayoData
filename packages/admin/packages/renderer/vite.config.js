import { chrome } from '../../electron-vendors.config.js'
import { join } from 'path'
import externalPackages from '../../external-packages.config.js'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '/@/': join(__dirname, 'src') + '/',
      qrcode: 'qrcode/build/qrcode.js',
    },
  },
  plugins: [
    vue(),
    WindiCSS({
      scan: {
        exclude: ['element-plus'],
      },
    }),
  ],
  base: '',
  build: {
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: externalPackages,
    },
    emptyOutDir: true,
  },
})
