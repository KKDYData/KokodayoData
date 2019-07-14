const merge = require('webpack-merge');
const common = require('./webpack.common');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),

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