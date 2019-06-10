// rollup.config.js
const path = require('path');

module.exports = {
  mode: 'none',
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
  }
};
