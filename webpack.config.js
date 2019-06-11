// rollup.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'elm-console-debug.js',
    libraryTarget: 'umd',
    library: 'ElmConsoleDebug'
  },
  module: {
    rules: [
      { test: /\.pegjs$/, use: [ { loader: 'pegjs-loader' } ]},
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
   optimization: {
     minimizer: [new TerserPlugin()],
  }
};
