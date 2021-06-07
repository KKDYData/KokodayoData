import { defineConfig } from 'windicss-webpack-plugin'
import colors from 'windicss/colors'
import {} from 'windicss/defaultTheme'

export default defineConfig({
  preflight: false,
  shortcuts: {
    card: 'rounded-sm overflow-hidden',
  },

  theme: {
    colors,
    boxShadow: {
      base: '1px 1px 1px #4a4a4a',
      medium: '2px 2px 4px #4a4a4a',
    },
    dropShadow: {
      base: '1px 1px 2px #4a4a4a',
      medium: '2px 2px 2px #4a4a4a',
    },
    width: {
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
