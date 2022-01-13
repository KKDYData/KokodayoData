const windicss = require('windicss-webpack-plugin')
const path = require('path')

const config = {
  projectName: 'kkdy-weapp',
  date: '2021-2-3',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  alias: {
    '/@': path.resolve(__dirname, '..', 'src'),
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain, webpack) {
      chain.merge({
        plugin: {
          windicss: {
            plugin: new windicss(),
          },
        },
      })
      chain.module // fixes https://github.com/graphql/graphql-js/issues/1272
        .rule('mjs$')
        .test(/\.mjs$/)
        .include.add(/node_modules/)
        .end()
        .type('javascript/auto')

      chain.module
        .rule('vue')
        .use('vueLoader')
        .tap((options) => {
          options.compilerOptions.isCustomElement = (tag) =>
            ['iconfont'].includes(tag)
          return options
        })
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
