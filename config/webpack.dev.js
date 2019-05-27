const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
    host: '0.0.0.0',
    allowedHosts: [
      '192.168.31.179'
    ]
  }
});