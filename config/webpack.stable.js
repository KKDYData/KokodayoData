const merge = require('webpack-merge');
const prod = require('./webpack.prod');
const webpack = require('webpack');
const path = require('path');
const CleanWebPackPlugin = require('clean-webpack-plugin');

const publicPath = 'https://andata.somedata.top/build/stable/';

module.exports = merge(prod, {
  output: {
    path: path.resolve('build/stable/'),
    publicPath
  },
  plugins: [
    new CleanWebPackPlugin(['build/stable/'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('stable'),
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath)

    })
  ]
});
