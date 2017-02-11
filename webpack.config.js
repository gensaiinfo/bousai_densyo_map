const webpack =  require('webpack') ;
module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: "./entry.js"
  },
  output: {
    path: __dirname + "/docs",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["es2015"] }
      },
      {test: /\.html$/, loader: "file-loader?name=[path][name].[ext]" },
      {test: /\.css$/, loader: ["style-loader","css-loader"]},
      {test: /\.scss$/, loader: ["style-loader","css-loader","sass-loader"]},
      {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"},
      {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]"},
      {test: /\.(json|topojson)?$/, loader: "file-loader?name=jsons/[name].[ext]"}
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
      saigai_densyo: __dirname + "/data/saigai_densyo.json"
    }
  },
  devtool: "source-map",
  plugins:[
    new webpack.optimize.UglifyJsPlugin()  // minify
  ],
  devServer: {
    contentBase: __dirname + "/docs",
    compress: true,
    host: '0.0.0.0',
    port: 9000
  }
}
