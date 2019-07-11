const merge = require('webpack-merge');
const common = require('./webpack.common');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new WebpackPwaManifest({
      name: 'Arknights Data @Beta',
      short_name: 'AnD@Beta',
      description: '一个平平无奇的明日方舟资料站',
      background_color: '#525252',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      start_url: '.',
      navigationPreload: true,
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          ios: true
        },
        {
          src: path.resolve('src/assets/icon_big.png'),
          size: '1024x1024', // you can also use the specifications pattern
          ios: true

        }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/^icon.*?\.png$/],
      runtimeCaching: [
        {
          urlPattern: /api\/arknights/,
          handler: 'NetworkFirst'
        },
        {
          urlPattern: /\.ico$/,
          handler: 'CacheFirst'
        },
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp('https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        test: /\.m?js$/,
        cache: true,
        parallel: true,
      }),
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  }
});