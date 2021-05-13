// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV == 'production'

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader'

const config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.styl', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      process: 'process/browser',
    },
  },
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    port: 8899,
    proxy: {
      '/test-api': {
        target: 'https://test.api.kokodayo.fun',
        changeOrigin: true,
        pathRewrite: { '^/test-api': '' },
      },
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: (context) => {
            return ''
          },
        },
        {
          from: /^\/details\/(?!(char|token)).*$/,
          to: (context) => {
            return '/' + context.parsedUrl.path.slice(9)
          },
        },
        {
          from: /^\/enemydata\/(?!main_|sub_|hard|camp|wk_|pro|rune|a00|(act\d{1, 2}d)).*$/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/enemydata\/(main|hard|camp)?/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/details\/(char|token)?/,
          to: (context) => {
            return '/index.html'
          },
        },
        {
          from: /^\/(computer|enemydata|customtheme|items|test|skins|info|building)$/,
          to: (context) => {
            return '/index.html'
          },
        },

        {
          from: /^\/.*$/,
          to: (context) => {
            return '/' + context.parsedUrl.path
          },
        },
        {
          from: /./,
          to: (context) => {
            return '/views/error.pug'
          },
        },
      ],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': JSON.stringify('beta'),
      'import.meta.env.VITE_API_URL': JSON.stringify('/test-api'),
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(styl|stylus)$/i,
        use: [
          'vue-style-loader',
          stylesHandler,
          'css-loader',
          'stylus-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: ['src/styles/fn.styl'],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['vue-style-loader', stylesHandler, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'

    config.plugins.push(new MiniCssExtractPlugin())
  } else {
    config.mode = 'development'
  }
  return config
}
