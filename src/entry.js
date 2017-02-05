'use strict'

import "font_awesome_css"
import "leaflet_css";
import "./index.scss";

import L from 'leaflet';
import * as d3 from 'd3'
import * as topojson from 'topojson'
const homePosition = {center:[35.3622222, 138.7313889],zoom:5,minZoom:5, maxZoom:10}
const map = L.map('map', homePosition);

L.tileLayer('http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: '<i class="fa fa-copyright" aria-hidden="true"></i><a href="http://osm.org/copyright" target="_blank">OpenStreetMap<i class="fa fa-external-link" aria-hidden="true"></i></a> contributors | 国土交通省国土政策局「国土数値情報（行政区域データ）」'
}).addTo(map);

const saigai_densyo = './jsons/saigai_densyo.json'
const japanTopojson = './jsons/japan.topojson'
const japanPrefsTopojson = './jsons/japan_prefs.topojson'

new Promise((resolve, reject)=>{
  d3.json(saigai_densyo, (densyo)=>{
    const disp = dispFunc(densyo)
    resolve({
      filter: filterFunc(densyo),
      onEachFeature: onEachFeatureFunc(disp)
    })
  })
}).then((funcs)=>{
  Promise.all([
    // 都道府県の描画
    showMap(japanPrefsTopojson,
      {className: "geo-feature prefs"},
      funcs.onEachFeature, funcs.filter),
    // 市区町村の描画
    showMap(japanTopojson,
      {className: "geo-feature towns"},
      funcs.onEachFeature, funcs.filter)
  ]).then((layers)=>{
    for (let layer of layers){ layer.addTo(map) }
  })
});

/**
 * filter 関数を返す高階関数
 * @param  [Object] densyo 伝承情報のJsonオブジェクト
 * @return [Function] filter関数
 */
function filterFunc(densyo){
  /**
   * 表示フィルタ。伝承のある自治体のみ表示する
   * @param  [GeoJSON] feature GeoJSONオブジェクト
   * @param  [ILayer] layer  レイヤーオブジェクト
   * @return [Boolean] 伝承がある場合true。それ以外 false
   */
  return (feature, layer)=>{
    var code6 = feature.properties.code6;
    return densyo[code6] != undefined;
  }
}

/**
 * onEachFeature関数を返す高階関数
 * @param  [Funciton] disp 伝承表示エリアを書き換える関数
 * @return [Funciton] onEachFeature関数
 */
function onEachFeatureFunc(disp){
  /**
   * 各自治体レイヤー毎の処理。ポップアップとクリックイベントをセットする
   * @param  [GeoJSON] feature GeoJSONオブジェクト
   * @param  [ILayer] layer  レイヤーオブジェクト
   */
  return (feature, layer)=>{
    const prop = feature.properties;
    if (prop && prop.name) {
      let name = `[${prop.code6}] ${prop.pref}`
      if(prop.pref != prop.name) name = `${name} ${prop.name}`;
      layer.bindPopup(name);
      layer.on('click', ()=>{
        disp(prop.code6, name)
      })
    }
    layer.id = prop.code6
  }
}

/**
 * disp関数を返す高階関数
 * @param  [Object] densyo 伝承情報のJsonオブジェクト
 * @return [Function]  disp関数
 */
function dispFunc(densyo){
  /**
   * 右サイドペインに伝承一覧を表示する
   * @param  [String] code6 6桁自治体コード
   * @param  [String] name  自治体名（都道府県名＋市区町村名）
   */
  return (code6, name)=>{
    const nameDisp = document.querySelector('#name') // 自治体名表示エリア
    const dlist = document.querySelector('#densyo>dl') //伝承表示エリア
    dlist.innerText = '';
    nameDisp.innerText = name;
    const data = densyo[code6]
    for(let d of data) {
      const dt = document.createElement('dt');
      const txt = d.old_name ? `[旧 ${d.old_name}] ` :''
      dt.textContent = txt + d.description
      dlist.appendChild(dt)

      const dd = document.createElement('dd');
      const src = (d.source!='')? `<div class="src">(${d.source})</div>`: ''
      dd.innerHTML = d.meaning+ src;
      dlist.appendChild(dd);
    }
  }
}
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

// HOME Controll
const homeCtl = L.control({position: 'topleft'});
homeCtl.onAdd = function(map) {
  const div = L.DomUtil.create('div', ' home leaflet-control leaflet-bar')
  const a = L.DomUtil.create('a')
  a.addEventListener('click', function(){
    map.setView(homePosition.center, homePosition.zoom)
  })
  a.href = '#'
  a.title = 'Move to Home position'
  a.innerHTML = '<i class="fa fa-home" aria-hidden="true"></i>'
  div.appendChild(a)
  return div;
}
homeCtl.addTo(map);
