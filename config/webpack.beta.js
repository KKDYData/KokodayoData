const merge = require('webpack-merge');
const prod = require('./webpack.prod');
const webpack = require('webpack');
const path = require('path');
const CleanWebPackPlugin = require('clean-webpack-plugin');

module.exports = merge(prod, {
  mode: 'production',
  output: {
    path: path.resolve('build/test/home')
  },
  plugins: [
    new CleanWebPackPlugin(['build/test/home'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    })
  ]
});
