const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    content: './lib/content/content.ts',
    background: './lib/background/background.ts',
    popup: './lib/popup/popup.tsx',
    preferences: './lib/preferences/preferences.tsx',
    report: './lib/report/report.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin(), // doesn't work well with HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'lib/popup/popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'preferences.html',
      template: 'lib/preferences/preferences.html',
      chunks: ['preferences']
    }),
    new HtmlWebpackPlugin({
      filename: 'report.html',
      template: 'lib/report/report.html',
      chunks: ['report']
    }),
    new CopyWebpackPlugin({
      patterns: [
      { from: './lib/manifest.json', to: './manifest.json' },
      // { from: './lib/background/background.js', to: './background.js' }
    ]})
  ],
  devtool: "", // fastest! doc: https://webpack.js.org/configuration/devtool/
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname , './dist'),
  },
};
