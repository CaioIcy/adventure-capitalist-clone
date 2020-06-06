const webpack = require('webpack');
const path = require('path');
const pathDist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/app.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: pathDist,
  },
  devServer: {
    contentBase: pathDist,
    compress: true,
  },
};
