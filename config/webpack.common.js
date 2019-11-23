const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const swPlugins = [
  new WorkboxPlugin.InjectManifest({
    swSrc: './src/sw.js',
    swDest: 'sw.js',
    importWorkboxFrom: 'local'
  })
];

module.exports = {
  entry: './src/main.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test!',
      template: 'src/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[hash].css',
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(new Date()),
    }),
    ...swPlugins
  ],
  output: {
    path: path.resolve('dist')
  },
  optimization: {

  },
  module: {
    rules: [
      {
        test: /\.(styl|stylus|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true
            },
          },
          'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|woff2?|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }

      },
    ]
  },
  resolve: {
    extensions: ['.js', '.styl', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  externals: {
    spritejs: 'spritejs',
    echarts: 'echarts'
  }
};
