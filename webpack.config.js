const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 8080,
  },
  entry: {
    index: './index.ts',
    //index_worker: './index_worker.ts',
  },

  devtool: 'inline-source-map',
  mode: 'development',
  // devtool: 'inline-source-map',
  // mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/bundle'),
    publicPath: '/bundle', 
  },
  // devServer: {
  //   stats: "errors-only",
  //   overlay: true,
  //   host: process.env.HOST, // Defaults to `localhost`
  //   port: process.env.PORT, // Defaults to 8080
  //   // open: true, // Open the page in browser
  //
  // }
};
