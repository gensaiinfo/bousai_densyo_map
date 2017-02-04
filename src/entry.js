'use strict'

import "leaflet_css";
import "./index.scss";

import L from 'leaflet';
import * as d3 from 'd3'
import * as topojson from 'topojson'
const map = L.map('map', {center:[35.3622222, 138.7313889],zoom:5,minZoom:5, maxZoom:10});

L.tileLayer('http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: "©<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors | 「国土交通省国土政策局「国土数値情報（行政区域データ）」をもとに加工」"
}).addTo(map);

const saigai_densyo = './saigai_densyo.json'
const japanTopojson = './japan.topojson'
const japanPrefsTopojson = './japan_prefs.topojson'

d3.json(saigai_densyo, function(densyo){
  const nameDisp = document.querySelector('#name') // 自治体名表示エリア
  const dlist = document.querySelector('#densyo>dl') //伝承表示エリア

  /**
   * 右サイドペインに伝承一覧を表示する
   * @param  [String] code6 6桁自治体コード
   * @param  [String] name  自治体名（都道府県名＋市区町村名）
   */
  function disp(code6, name){
    dlist.innerText = '';
    nameDisp.innerText = name;
    const data = densyo[code6]
    data.forEach(function(d){
      const dt = document.createElement('dt');
      const txt = d.old_name ? `[旧 ${d.old_name}] ` :''
      dt.textContent = txt + d.description
      dlist.appendChild(dt)

      const dd = document.createElement('dd');
      const src = (d.source!='')? `<div class="src">(${d.source})</div>`: ''
      dd.innerHTML = d.meaning+ src;
      dlist.appendChild(dd);
    });
  }
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

  /**
   * 各自治体レイヤー毎の処理。ポップアップとクリックイベントをセットする
   * @param  [GeoJSON] feature GeoJSONオブジェクト
   * @param  [ILayer] layer  レイヤーオブジェクト
   */
  function onEachFeature(feature, layer){
    const prop = feature.properties;
    if (prop && prop.name) {
      let name = `[${prop.code6}] ${prop.pref}`
      if(prop.pref != prop.name) name = `${name} ${prop.name}`;
      layer.bindPopup(name);
      layer.on('click', function(){
        disp(prop.code6, name)
      })
    }
    layer.id = prop.code6
  }

  Promise.all([
    // 都道府県の描画
    showMap(japanPrefsTopojson,
      {className: "geo-feature prefs"},
      onEachFeature, filter),
    // 市区町村の描画
    showMap(japanTopojson,
      {className: "geo-feature towns"},
      onEachFeature, filter)
  ]).then((layers)=>{
    for (let layer of layers){ layer.addTo(map) }
  })
});

/**
 * Topojson の地図を描画する
 * @param  [String] jsonFile topojson file url
 * @param  [Object|Function] style style object or function
 * @param  [Function] onEachFeature onEachFeature function
 * @param  [Function] filter filer function
 * @return [Promise] resolve に leaflet layer オブジェクトを渡す
 */
function showMap(jsonFile, style, onEachFeature, filter){
  return new Promise((resolve, reject)=>{
    d3.json(jsonFile, (topo)=>{
      const layer = L.geoJson(
        topojson.feature(topo, topo.objects.japan),
        {style:style, onEachFeature:onEachFeature, filter: filter})
      resolve(layer)
    })
  })
}
