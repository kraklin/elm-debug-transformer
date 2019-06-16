// rollup.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'elm-console-debug.js',
    libraryTarget: 'umd',
    library: 'ElmConsoleDebug'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  }, 
  optimization: {
     minimizer: [new TerserPlugin()],
  }
};
