const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),


  ],
  // module: {
  //   rules: [
  //     {
  //       test: /\.styl|stylus|css$/,
  //       use: [
  //         'css-loader', 'stylus-loader'],
  //     },
  //   ]
  // },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api': 'http://127.0.0.1:8444',
    },
    host: '0.0.0.0',
    allowedHosts: [
      '192.168.31.179'
    ],
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/, to: context => {
            return '';
          }
        },
        //详情页面
        {
          from: /^\/details\/(?!char).*$/, to: context => {
            return '/' + context.parsedUrl.path.slice(9);
          }
        },
        {
          from: /^\/details\/(char)?/, to: context => {
            return '/index.html';
          }
        },
        {
          from: /^\/(computer|enemydata)$/, to: context => {
            return '/index.html';
          }
        },

        {
          from: /^\/.*$/, to: context => {
            return '/' + context.parsedUrl.path;
          }
        },
        {
          from: /./, to: context => {
            return '/views/error.pug';
          }
        }]
    },
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
});