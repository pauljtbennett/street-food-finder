var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  entry: [
    './app/index.js',
    './styles/main.scss'
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader?includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib"))
      }
    ]
  },
  output: {
    filename: "index_bundle.js",
    path: __dirname + '/dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin("style.css"),
    new CopyWebpackPlugin([
      {
        from: 'img',
        to: 'img'
      }
    ]),
  ]
};