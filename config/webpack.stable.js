const merge = require('webpack-merge')
const prod = require('./webpack.prod')
const webpack = require('webpack')
const path = require('path')
const CleanWebPackPlugin = require('clean-webpack-plugin')

const publicPath = '/'

module.exports = merge(prod, {
  output: {
    path: path.resolve('build/prod/'),
    publicPath,
  },
  plugins: [
    new CleanWebPackPlugin(['build/prod/'], {
      root: path.resolve(__dirname, '..'),
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('stable'),
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
      'import.meta.env.VITE_API_URL': JSON.stringify(
        'https://test.api.kokodayo.fun'
      ),
    }),
  ],
})
