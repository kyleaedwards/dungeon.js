const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'js/script.js': path.resolve(__dirname, 'client/index.js')
  },
  output: {
    filename: '[name]',
    path: path.join(__dirname, 'public/'),
  },
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })
      },
      { test: /\.tmpl$/, loader: 'raw-loader'}
    ]
  },
  plugins: [
    // OccurenceOrderPlugin is needed for webpack 1.x only
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin({
      filename: 'css/style.css',
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ]
};
