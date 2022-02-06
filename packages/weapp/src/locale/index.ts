import { createI18n } from 'vue-i18n'
import base from './base.json'
import subProfile from './subProfDict.json'

const messages = {
  en: {
    message: {
      hello: 'hello world',
    },
  },
  zh: {
    ...base,
    ...subProfile,
  },
}

// 2. Create i18n instance with options
export const i18n = createI18n({
  locale: 'zh', // set locale
  fallbackLocale: 'zh', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})
