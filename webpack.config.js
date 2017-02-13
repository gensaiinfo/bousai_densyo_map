const webpack =  require('webpack') ;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
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
        options: { presets: [["es2015", {"loose": true, "modules": false}]] }
      },
      {test: /\.html$/, loader: "file-loader?name=[path][name].[ext]" },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:[ 'css-loader', 'sass-loader' ]
        })
      },
      {test: /\.(png|jpg)$/, exclude: /icons/, loader: "file-loader?name=images/[name].[ext]&publicPath=../"},
      {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]&publicPath=../"},
      {test: /\.(json|topojson)?$/, exclude: /manifest.json/, loader: "file-loader?name=jsons/[name].[ext]"},
      {test: /manifest.json/, loader: "file-loader?name=[name].[ext]"},
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
      japan_topojson: __dirname + "/data/japan.topojson",
      japan_prefs_topojson: __dirname + "/data/japan_prefs.topojson",
      saigai_densyo: __dirname + "/data/saigai_densyo.json",
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
    new ExtractTextPlugin({ filename: 'styles/[name].css', disable: false, allChunks: true}),
    new webpack.optimize.UglifyJsPlugin()  // minify
  ],
  devServer: {
    contentBase: __dirname + "/docs",
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    publicPath: "/bousai_densyo_map/"
  }
}
