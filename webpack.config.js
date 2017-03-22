const path = require('path');
const webpack = require('webpack');

module.exports = {
  watch: true,
  entry: [
    'webpack-hot-middleware/client?http://localhost:5000',
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'client/index.js')
  ],
  output: {
    filename: 'script.js',
    path: path.join(__dirname, 'public/js/'),
    publicPath: '/js/'
  },
  module: {
    loaders: [
      { test: /\.s?css$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.tmpl$/, loader: 'raw-loader'}
    ]
  },
  plugins: [
    // OccurenceOrderPlugin is needed for webpack 1.x only
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
