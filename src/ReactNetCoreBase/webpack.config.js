/// <binding ProjectOpened='Watch - Development' />
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('site.css', { allChunks: true });
var isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.less'],
    modulesDirectories: [
        'node_modules',
        path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
        { test: /\.ts(x?)$/, include: /ClientApp/, loader: 'babel-loader' },
        { test: /\.ts(x?)$/, include: /ClientApp/, loader: 'ts-loader?silent=true' },
        { test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=.*)?$/, loader: 'url-loader?limit=10000' },
        { test: /\.jpg$/, loader: "file-loader" },
        { test: /(\.less|\.css)$/, loader: ExtractTextPlugin.extract('style', 'css!less') }
    ]
  },
  entry: {
    main: ['babel-polyfill', 'whatwg-fetch', './ClientApp/boot.tsx'],
  },
  output: {
    path: path.join(__dirname, 'wwwroot', 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(isDevelopment ? 'development:' : 'production')
        }
      }),
      extractCSS,
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wwwroot/dist/vendor-manifest.json')
      })
  ].concat(isDevelopment ? [] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ])
};