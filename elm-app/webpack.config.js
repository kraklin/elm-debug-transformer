const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: {
          loader: 'elm-webpack-loader',
          options: {debug: true}
        }
      }
    ],
  },
  devServer: {
    contentBase: './public',
  },
  output: {
    filename: 'main.js',
  },
};
