const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash].css',
    }),
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
  module: {
    rules: [
      {
        test: /\.(styl|stylus|css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader', 'stylus-loader'],
      },
    ]
  },
  output: {
    filename: 'assets/js/[name].[contenthash].js',
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js',
    }
  },
  externals: {
    spritejs: 'spritejs',
    echarts: 'echarts'
  }
});
