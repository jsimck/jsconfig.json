module.exports = {
  entry: './index',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      }
    ]
  },
  resolve: {
    alias: {
      myApp: './src'
    }
  }
};
