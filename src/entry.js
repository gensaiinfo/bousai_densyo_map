'use strict'

import "leaflet_css";
import "leaflet_marker";
import "leaflet_marker_2x";
import "leaflet_marker_shadow";
import "./index.scss";

import L from 'leaflet';
import * as d3 from 'd3'
import * as topojson from 'topojson'
const map = L.map('map');

L.tileLayer('http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: "©<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors | 「国土交通省国土政策局「国土数値情報（行政区域データ）」をもとに加工」"
})
.addTo(map);
map.setView([35.3622222, 138.7313889], 5);

const saigai_densyo = './saigai_densyo.json'
const japanTopojson = './japan.topojson'
const japanPrefsTopojson = './japan_prefs.topojson'
const defaultOption = {
  radius: 8,
  weight: 1,
  opacity: 1
}

d3.json(saigai_densyo, function(densyo){
  // console.log(densyo) TODO あとで削除

  /**
   * 表示フィルタ。伝承のある自治体のみ表示する
   * @param  [GeoJSON] feature GeoJSONオブジェクト
   * @param  [ILayer] layer  レイヤーオブジェクト
   * @return [Boolean] 伝承がある場合true。それ以外 false
   */
  function filter(feature, layer){
    var code6 = feature.properties.code6;
    return densyo[code6] != undefined;
  }

  d3.json(japanPrefsTopojson, function(prefs){
    prefs = topojson.feature(prefs, prefs.objects.japan)
    function style(feature){
      var opt = Object.create(defaultOption)
      opt.className= "geo-feature prefs"
      return opt;
    }
    function onEachFeature(feature, layer){
      var prop = feature.properties;
      if (prop && prop.name) {
          layer.bindPopup("["+prop.code6+"] "+prop.pref);
      }
      layer.id = prop.code
    }
    var prefsLayer = L.geoJson(prefs, {style:style, onEachFeature:onEachFeature, filter: filter}).addTo(map);
  });

  d3.json(japanTopojson,function(japan){
    japan = topojson.feature(japan, japan.objects.japan)
    function style(feature){
      var opt = Object.create(defaultOption)
      opt.className= "geo-feature towns"
      return opt
    }
    function onEachFeature(feature, layer) {
      var prop = feature.properties;
      if (prop && prop.name) {
          layer.bindPopup("["+prop.code6+"] "+prop.pref+" "+prop.name);
      }
      layer.id = prop.code
    }
    // leafletを使ってgeojsonレイヤーを表示する
    var myLayer = L.geoJson(japan, {style:style, onEachFeature:onEachFeature, filter: filter}).addTo(map);
  });
});
