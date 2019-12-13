const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'ts'),
  entry: './index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
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
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/bundle'),
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
