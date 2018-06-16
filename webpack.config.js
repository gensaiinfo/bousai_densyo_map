const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: `${__dirname}/src`,
  entry: {
    bundle: './entry.js',
  },
  output: {
    path: `${__dirname}/docs`,
    filename: '[name].js',
  },
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|worker.js)/,
        loader: 'babel-loader',
      },
      { test: /\.html$/, loader: 'file-loader?name=[path][name].[ext]' },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      { test: /\.(png|jpg)$/, exclude: /icons/, loader: 'file-loader?name=images/[name].[ext]&publicPath=../' },
      { test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]&publicPath=../' },
      { test: /.*worker.js/, loader: 'file-loader?name=[name].[ext]' },
      { test: /icons\/.+.(png|svg|xml|ico)/, loader: 'file-loader?name=icons/[name].[ext]' },
    ],
  },
  resolve: {
    extensions: ['.html', '.js', '.json', '.scss', '.css'],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css',
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'data/japan.topojson', to: 'jsons/', context: '../' },
      { from: 'data/japan_prefs.topojson', to: 'jsons/', context: '../' },
      { from: 'data/saigai_densyo.json', to: 'jsons/', context: '../' },
      { from: 'icons/*.png', to: './', context: '../' },
      { from: 'icons/*.ico', to: './', context: '../' },
      { from: 'icons/*.xml', to: './', context: '../' },
      { from: 'icons/*.svg', to: './', context: '../' },
    ]),
  ],
  serve: {
    content: `${__dirname}/docs`,
    compress: true,
    host: 'localhost',
    port: 9000,
    dev: { publicPath: '/bousai_densyo_map/' },
    open: {
      path: '/bousai_densyo_map/',
    },
    hot: {
      host: 'localhost',
      port: 9010,
    },
  },
};
