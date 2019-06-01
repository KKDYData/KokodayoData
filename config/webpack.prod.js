const merge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  // plugins: [
  //   new ExtractTextPlugin('styles.css'),
  //   new OptimizeCssAssetsPlugin({
  //     assetNameRegExp: /\.optimize\.css$/g,
  //     cssProcessor: require('cssnano'),
  //     cssProcessorPluginOptions: {
  //       preset: ['default', { discardComments: { removeAll: true } }],
  //     },
  //     canPrint: true
  //   })
  // ],
  optimization: {
    minimizer: [

      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
  //     }
  //   ]
  // }
});