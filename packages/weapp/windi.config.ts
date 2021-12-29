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
    colors: {
      ...colors,
      dark: {
        /**
         * !设计稿常用黑色
         * ? 另一种是50
         */
        40: '#707070',
        ...(colors.dark as any),
      },
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      //! 改5px
      DEFAULT: '5px',
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
      xl: ['0 20px 13px rgba(0, 0, 0, 0.03)', '0 8px 5px rgba(0, 0, 0, 0.08)'],
      '2xl': '0 25px 25px rgba(0, 0, 0, 0.15)',
      none: '0 0 #0000',
    },
    width: {
      //!尽量不要用 直接 w-222px
      auto: 'auto',
      '1_2': '50%',
      '1_3': '33.333333%',
      '2_3': '66.666667%',
      '1_4': '25%',
      '2_4': '50%',
      '3_4': '75%',
      '1_5': '20%',
      '2_5': '40%',
      '3_5': '60%',
      '4_5': '80%',
      '1_6': '16.666667%',
      '2_6': '33.333333%',
      '3_6': '50%',
      '4_6': '66.666667%',
      '5_6': '83.333333%',
      '1_12': '8.333333%',
      '2_12': '16.666667%',
      '3_12': '25%',
      '4_12': '33.333333%',
      '5_12': '41.666667%',
      '6_12': '50%',
      '7_12': '58.333333%',
      '8_12': '66.666667%',
      '9_12': '75%',
      '10_12': '83.333333%',
      '11_12': '91.666667%',
    },
  },
  darkMode: 'class',
})
