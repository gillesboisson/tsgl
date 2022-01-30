

const path = require('path');
const { merge } = require("webpack-merge");

function serverPartConfig(dirname){
  return {
    devServer: {
      contentBase: path.join(dirname, 'build'),
      compress: false,
      port: 8080,
    },
  }
}


function basePartConfig(dirname){
  return  {
    context: path.resolve(dirname, 'src'),
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
      path: path.resolve(dirname, 'build/'),
      publicPath: '/', 
    },
  };
}

function commonWebpackConfig(dirname,...configs){

  let config = basePartConfig(dirname);
  
  for(let c of configs){
    config = merge(config, c);
  }

  return config;
  
}

module.exports = {
  serverPartConfig,
  basePartConfig,
  commonWebpackConfig
}