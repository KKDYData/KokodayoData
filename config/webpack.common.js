const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');


const swPlugins = process.env.NODE_ENV === 'development' ? [] :
  [
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
          urlPattern: new RegExp('https://andata.somedata.top/dataX/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'oss-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp('https://unpkg.com/spritejs/dist/spritejs.min.js'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'spritejs',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp('https://penguin-stats.io/PenguinStats/api/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            },
            cacheName: 'penguin-api-cache',
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60,
            },
          }
        }
        //
      ]
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
    extensions: ['.js', '.styl', '.vue', '.json']
  },

};
