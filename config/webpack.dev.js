const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

// new CleanWebPackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      VERSION: JSON.stringify(new Date()),
    })

  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    public: 'http://localhost:8080',
    proxy: {
      '/api': 'http://127.0.0.1:8444',
    },
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/, to: context => {
            return '';
          }
        },
        {
          from: /^\/details\/(?!(char|token)).*$/, to: context => {
            return '/' + context.parsedUrl.path.slice(9);
          }
        },
        {
          from: /^\/enemydata\/(?!main_|sub_|hard|camp|wk_|pro|level|a00|(act\dd)).*$/, to: context => {
            return '/' + context.parsedUrl.path.slice(11);
          }
        },
        {
          from: /^\/enemydata\/(main|hard|camp)?/, to: context => {
            return '/index.html';
          }
        },
        {
          from: /^\/details\/(char|token)?/, to: context => {
            return '/index.html';
          }
        },
        {
          from: /^\/(computer|enemydata|customtheme|items|test|skins)$/, to: context => {
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
