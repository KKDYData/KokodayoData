import path from 'path'
import vue from '@vitejs/plugin-vue'
import { UserConfig } from 'vite'

const config: UserConfig = {
  alias: [
    {
      // 这个Alias 是给文档用的，如果内部用了，开发环境会异常
      find: /^core/,
      replacement: path.resolve('./src/'),
    },
  ],
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'ramda',
        'mitt',
        'vf-modal',
        'lodash',
        'quill',
        'quill-delta-to-html',
        'vue-i18n',
        '@vueuse/core',
        'async-validator',
        'axios',
      ],
    },
    sourcemap: true,
  },
}

export default config
