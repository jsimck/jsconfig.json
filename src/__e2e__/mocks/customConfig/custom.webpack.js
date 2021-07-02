module.exports = {
  entry: './index',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      myApp: './src'
    },
    extensions: ['', '.js', '.jsx']
  }
};
