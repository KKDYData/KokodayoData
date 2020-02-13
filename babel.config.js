module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          esmodules: true
        },
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ],
    ['@vue/babel-preset-jsx']
  ]
  const plugins = [
    [
      '@babel/plugin-proposal-class-properties',
    ],
    [
      '@babel/plugin-syntax-dynamic-import'
    ],
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': '~theme'
      }
    ]
  ]

  return {
    presets,
    plugins
  }
}
