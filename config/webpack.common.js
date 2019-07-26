const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');


const swPlugins = process.env.NODE_ENV === 'development' ? [] :
  [
    new WebpackPwaManifest({
      name: 'Arknights Data @Beta',
      short_name: 'AnD@Beta',
      description: '一个平平无奇的明日方舟资料站',
      background_color: '#525252',
      theme_color: '#525252',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      start_url: '.',
      navigationPreload: true,
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128], // multiple sizes
          ios: true
        },
        // {
        //   src: path.resolve('src/assets/icon_big.png'),
        //   size: '1024x1024', // you can also use the specifications pattern
        //   ios: true
        // }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/^icon.*?\.png$/],
      runtimeCaching: [
        {
          urlPattern: /api\/arknights/,
          handler: 'NetworkFirst'
        },
        {
          urlPattern: /\.ico$/,
          handler: 'CacheFirst'
        },
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp('https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    })
  ];

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
      // chunkFilename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[hash].css',
    }),
    ...swPlugins
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