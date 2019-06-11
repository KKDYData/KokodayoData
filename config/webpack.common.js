const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
  mode: 'development',
  entry: './src/main.js',
  plugins: [
    new CleanWebPackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
    new HtmlWebpackPlugin({
      title: 'test!',
      template: 'src/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin()

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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(styl|stylus)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'stylus-loader'
        }],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 将 JS 字符串生成为 style 节点
          'css-loader', // 将 CSS 转化成 CommonJS 模块
          'sass-loader' // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]

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
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'

    },
    extensions: ['.js', '.styl', '.vue']
  },
};