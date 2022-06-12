import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  preflight: false,
  shortcuts: {
    card: 'rounded-sm overflow-hidden',
  },
  /**
   * !小程序不知道反斜杠，这些都用不了
   */
  exclude: [/\./, /\[|\]/],
  theme: {
    extend: {
      colors: {
        dark: {
          /**
           * !设计稿常用黑色
           * ? 另一种是50
           */
          40: '#707070',
        },
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        //! 改5px
        DEFAULT: '10rpx',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
        large: '12px',
      },
      boxShadow: {
        /**
         * ? 设计稿的两种样式
         */
        base: '2px 2px 4px rgb(214, 214, 214)',
        medium: '2px 2px 4px rgb(128, 128, 128)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
      dropShadow: {
        /**
         * ? 设计稿的两种样式
         */
        base: '2px 2px 4px rgba(0, 0, 0, 0.16)',
        medium: '2px 2px 4px rgb(128, 128, 128)',
        DEFAULT: [
          '0 1px 2px rgba(0, 0, 0, 0.1)',
          '0 1px 1px rgba(0, 0, 0, 0.06)',
        ],
        sm: '0 1px 1px rgba(0,0,0,0.05)',
        md: ['0 4px 3px rgba(0, 0, 0, 0.07)', '0 2px 2px rgba(0, 0, 0, 0.06)'],
        lg: ['0 10px 8px rgba(0, 0, 0, 0.04)', '0 4px 3px rgba(0, 0, 0, 0.1)'],
        xl: [
          '0 20px 13px rgba(0, 0, 0, 0.03)',
          '0 8px 5px rgba(0, 0, 0, 0.08)',
        ],
        '2xl': '0 25px 25px rgba(0, 0, 0, 0.15)',
        none: '0 0 #0000',
      },
    },
  },
  darkMode: 'class',
})
