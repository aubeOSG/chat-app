/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssConfig = require('./.postcssrc.json');

const postcssPlugins = postcssConfig.plugins;
const cssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
};
const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    modules: {
      namedExport: true,
      localIdentName: '[local]',
    },
  },
};
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    implementation: require('postcss'),
    postcssOptions: {
      modules: true,
      plugins: postcssPlugins,
    },
  },
};
const sassLoader = {
  loader: 'sass-loader',
  options: {
    implementation: require('sass'),
    sassOptions: {
      includePaths: [
        './',
        '../../../node_modules/',
        '../../node_modules',
        '../node_modules',
        './node_modules/',
      ],
    },
  },
};
const fileLoader = {
  loader: 'file-loader',
  options: {
    name: '[name].[ext]',
  },
};
const tsLoader = {
  loader: 'ts-loader',
  options: {
    configFile: '../tsconfig.json',
  },
};

module.exports = {
  mode: 'production',
  target: 'web',
  devtool: 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [cssExtractLoader, cssLoader, postcssLoader, sassLoader],
      },
      {
        test: /\.tsx?$/,
        use: [tsLoader],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.scss'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
