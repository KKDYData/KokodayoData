const merge = require('webpack-merge');
const prod = require('./webpack.prod');
const webpack = require('webpack');
const path = require('path');
const CleanWebPackPlugin = require('clean-webpack-plugin');

module.exports = merge(prod, {
  mode: 'production',
  output: {
    path: path.resolve('buid/test/home')
  },
  plugins: [
    new CleanWebPackPlugin(['buid/test/home'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    })
  ]
});
