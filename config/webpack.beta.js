const merge = require('webpack-merge')
const prod = require('./webpack.prod')
const webpack = require('webpack')
const path = require('path')
const CleanWebPackPlugin = require('clean-webpack-plugin')

const publicPath = '/'

module.exports = merge(prod, {
  output: {
    path: path.resolve('build/test/'),
    publicPath,
  },
  plugins: [
    new CleanWebPackPlugin(['build/test/'], {
      root: path.resolve(__dirname, '..'),
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('beta'),
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
    }),
  ],
})
