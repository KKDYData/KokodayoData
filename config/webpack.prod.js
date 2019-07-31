const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new OptimizeCssAssetsPlugin({}),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
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
          test: /[\\/]node_modules[\\/](vue|vue-router|vue-meta|vuex)[\\/]/,
          name: 'vendor_vue',
          chunks: 'all'
        },
        // vendors: {
        //   test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
        //   name: 'vendor_element',
        //   chunks: 'async'
        // },
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