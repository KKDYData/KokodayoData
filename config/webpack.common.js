const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const devMode = process.env.NODE_ENV !== 'production';


module.exports = {
  entry: './src/main.js',
  plugins: [
    new CleanWebPackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
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
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),

  ],
  devServer: {
    contentBase: './dist',
    hot: true
  },
  output: {
    path: path.resolve('dist')
  },
  optimization: {

  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ],
      },
      {
        test: /\.(styl|stylus)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            // you can specify a publicPath here
            // by default it uses publicPath in webpackOptions.output
            // publicPath: '../',
            hmr: process.env.NODE_ENV === 'development',
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

    extensions: ['.js', '.styl', '.vue', '.json']
  },
};