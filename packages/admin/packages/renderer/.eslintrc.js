module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: false
  },
  parser: 'vue-eslint-parser',
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'vue/max-attributes-per-line': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/html-indent': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-unused-labels': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'vue/singleline-html-element-content-newline': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ]
  },
  ignorePatterns: ['script']
}
