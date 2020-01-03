const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
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
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(new Date()),
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
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.styl', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  externals: {
    spritejs: 'spritejs',
    echarts: 'echarts'
  }
};
