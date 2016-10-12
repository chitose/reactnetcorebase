var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('vendor.css');
var isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
        { test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=.*)?$/, loader: 'url-loader?limit=100000' },
        { test: /\.css/, loader: extractCSS.extract(['css']) }
    ]
  },
  entry: {
    vendor: [
          'es6-promise',
          'flexboxgrid/css/flexboxgrid.css',          
          'react',
          'react-dom',
          'react-router',
          "moment",
          'i18next',
          'react-i18next',
          'validator',
          'material-ui',                    
          'react-motion',
          'react-swipeable-views']
  },
  output: {
    path: path.join(__dirname, 'wwwroot', 'dist'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(isDevelopment ? 'development:' : 'production')
        }
      }),
      extractCSS,
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DllPlugin({
        path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
        name: '[name]_[hash]'
      }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};