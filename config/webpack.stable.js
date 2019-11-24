const merge = require('webpack-merge');
const prod = require('./webpack.prod');
const webpack = require('webpack');
const path = require('path');
const CleanWebPackPlugin = require('clean-webpack-plugin');

module.exports = merge(prod, {
  output: {
    path: path.resolve('build/home/')
  },
  plugins: [
    new CleanWebPackPlugin(['build/home/'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('beta')
    })
  ]
});
