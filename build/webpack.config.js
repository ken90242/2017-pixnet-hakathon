// webpack.config.prod.js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [ './src/index.js' ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css-loader','resolve-url-loader', 'sass-loader' ]
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loaders: [ 'file-loader' ]
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src/'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}