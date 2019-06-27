const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),


  ],
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
            console.log('1:');
            console.log(context.parsedUrl.pathname);
            return '';
          }
        },
        //详情页面
        {
          from: /^\/details\/(?!char).*$/, to: context => {
            console.log('2:');
            // console.log(context.parsedUrl);
            console.log(context.parsedUrl.pathname.slice(9));
            return '/' + context.parsedUrl.pathname.slice(9);
          }
        },
        {
          from: /^\/details\/(char)?/, to: context => {
            console.log('2.1:');
            console.log(context.parsedUrl.pathname);
            return '/index.html';
          }
        },
        {
          from: /^\/computer$/, to: context => {
            console.log('2.1:');
            console.log(context.parsedUrl.pathname);
            return '/index.html';
          }
        },

        {
          from: /^\/.*$/, to: context => {
            console.log('/:');
            console.log(context.parsedUrl.pathname);
            return '/' + context.parsedUrl.pathname;
          }
        },
        {
          from: /./, to: context => {
            console.log('404: ' + context.parsedUrl.pathname);
            return '/views/error.pug';
          }
        }]
    },
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
  }
});