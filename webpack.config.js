const webpack =  require('webpack') ;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    bundle: "./entry.js"
  },
  output: {
    path: __dirname + "/docs",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|worker.js)/,
        loader: "babel-loader",
      },
      {test: /\.html$/, loader: "file-loader?name=[path][name].[ext]" },
      {
        test: /\.(css|scss)$/,
        use:[ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
      },
      {test: /\.(png|jpg)$/, exclude: /icons/, loader: "file-loader?name=images/[name].[ext]&publicPath=../"},
      {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]&publicPath=../"},
      {test: /.*worker.js/, loader: "file-loader?name=[name].[ext]"},
      {test: /icons\/.+.(png|svg|xml|ico)/, loader: "file-loader?name=icons/[name].[ext]"}
    ]
  },
  resolve:{
    extensions: ['.html', '.js', '.json', '.scss', '.css'],
    alias: {
      leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
      leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
      leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png",
      leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
      font_awesome_css: __dirname + "/node_modules/font-awesome/css/font-awesome.css",
      chrome192: __dirname+"/icons/android-chrome-192x192.png",
      chrome384: __dirname+"/icons/android-chrome-384x384.png",
      apple_icon: __dirname+"/icons/apple-touch-icon.png",
      favicon16: __dirname+"/icons/favicon-16x16.png",
      favicon32: __dirname+"/icons/favicon-32x32.png",
      favicon: __dirname+"/icons/favicon.ico",
      browserconfig: __dirname+"/icons/browserconfig.xml",
      safari_pinned: __dirname+"/icons/safari-pinned-tab.svg",
      mstile: __dirname+"/icons/mstile-150x150.png"
    }
  },
  devtool: "source-map",
  plugins:[
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/[id].css"
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'data/japan.topojson', to: 'jsons/', context: '../'},
      { from: 'data/japan_prefs.topojson', to: 'jsons/', context: '../' },
      { from: 'data/saigai_densyo.json', to: 'jsons/', context: '../' },
    ])
  ],
  devServer: {
    contentBase: __dirname + "/docs",
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    hot:true,
    open: true,
    publicPath: "/bousai_densyo_map/"
  }
}
