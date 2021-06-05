const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('beta'),
      // 'import.meta.env.VITE_API_URL': JSON.stringify('/api'),
    }),
  ],
  devtool: 'inline-source-map',
  // @ts-ignore
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      'https://test.api.kokodayo.fun': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
      },
    },
    port: 8899,
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: (context) => {
            return ''
          },
        },
        {
          from: /^\/details\/(?!(char|token)).*$/,
          to: (context) => {
            return '/' + context.parsedUrl.path.slice(9)
          },
        },
        {
          from: /^\/enemydata\/(?!main_|sub_|hard|camp|wk_|pro|rune|a00|(act\d{1, 2}d)).*$/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/enemydata\/(main|hard|camp)?/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/details\/(char|token)?/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/(computer|enemydata|customtheme|items|test|skins|info|building)$/,
          to: (context) => {
            return '/index.html'
          },
        },

        {
          from: /^\/.*$/,
          to: (context) => {
            return '/' + context.parsedUrl.path
          },
        },
        {
          from: /./,
          to: (context) => {
            return '/views/error.pug'
          },
        },
      ],
    },
  },
  module: {
    rules: [
      {
        test: /\.(styl|stylus|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: ['src/styles/fn.styl'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
})
