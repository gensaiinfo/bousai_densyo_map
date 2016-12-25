const webpack =  require('webpack') ;
module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: "./entry.js"
  },
  output: {
    path: __dirname + "/doc",
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
      {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"}
    ]
  },
  resolve:{
    extensions: ['.html', '.js', '.json', '.scss', '.css'],
    alias: {
      leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
      leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
      leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png",
      leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css"
    }
  },
  devtool: "source-map",
  plugins:[
    new webpack.optimize.UglifyJsPlugin()  // minify
  ],
  devServer: {
    contentBase: __dirname + "/docs",
    compress: true,
    port: 9000
  }
}
