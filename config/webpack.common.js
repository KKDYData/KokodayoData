const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack')
const { time } = require('./time')

const swPlugins = [
  new WorkboxPlugin.InjectManifest({
    swSrc: './src/sw.js',
    swDest: 'sw.js',
    importWorkboxFrom: 'local'
  })
]


module.exports = {
  entry: './src/main.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test!',
      template: 'src/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(time),
    }),
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        plugins: [
          ['mozjpeg', { quality: 40 }],
          ['pngquant', { quality: [0.6, 0.8] }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    ...swPlugins
  ],
  output: {
    path: path.resolve('build/dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/',

  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]',
            },
          }
        ]
      },
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        },
        include: [
          path.resolve(__dirname, '../src'),
          /kkdy-somemap/
        ]
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
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.styl', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    }
  },
  externals: {
    spritejs: 'spritejs',
    echarts: 'echarts',
  },
}
