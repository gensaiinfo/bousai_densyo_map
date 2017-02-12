'use strict'

import "font_awesome_css"
import "leaflet_css";
import "japan_topojson"
import "japan_prefs_topojson"
import "saigai_densyo"
import "./index.scss";
import "./index.html"
import "./manifest.json"
import "./worker.js"

import "chrome192"
import "chrome384"
import "apple_icon"
import "favicon16"
import "favicon32"
import "favicon"
import "browserconfig"
import "safari_pinned"
import "mstile"

import L from 'leaflet';
import * as d3 from 'd3'
import * as topojson from 'topojson'
const homePosition = {center:[35.3622222, 134.7313889],zoom:5,minZoom:5, maxZoom:9}
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
      if(!isMobile()){ layer.bindTooltip(name); }
      layer.bindPopup(name);
      layer.on('click', (e)=>{
        map.fitBounds(e.target.getBounds());
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

      if(isMobile()){
        document.querySelector('#info').style.display='flex';
      }
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
homeCtl.onAdd = (map)=> {
  const div = L.DomUtil.create('div', ' home leaflet-control leaflet-bar')
  const a = L.DomUtil.create('a')
  a.addEventListener('click', ()=> map.setView(homePosition.center, homePosition.zoom))
  a.href = '#'
  a.title = 'Move to Home position'
  a.innerHTML = '<i class="fa fa-home" aria-hidden="true"></i>'
  div.appendChild(a)
  return div;
}
homeCtl.addTo(map);

/**
 * 現在地の GPS座標に移動する
 */
function geolocation(){
  if( navigator.geolocation ) {
  	// 現在位置を取得できる場合の処理
  	navigator.geolocation.getCurrentPosition(
      (loc)=>{
        const center = [loc.coords.latitude, loc.coords.longitude]
        map.setView(center, homePosition.maxZoom)
      },
      (error)=> alert("位置情報の取得に失敗しました")) ;
  } else {
  	// 現在位置を取得できない場合
  	alert( "あなたの端末では、現在位置を取得できません。" ) ;
  }
}

// Current Position Controll
const geoposiCtl = L.control({position: 'topleft'});
geoposiCtl.onAdd = (map)=> {
  const div = L.DomUtil.create('div', ' home leaflet-control leaflet-bar')
  const a = L.DomUtil.create('a')
  a.addEventListener('click', geolocation)
  a.href = '#'
  a.title = 'Move to your current position'
  a.innerHTML = '<i class="fa fa-location-arrow" aria-hidden="true"></i>'
  div.appendChild(a)
  return div;
}
geoposiCtl.addTo(map);

// Utility
/**
 * モバイルかどうかを判定する
 * @return {Boolean} [description]
 */
function isMobile(){
  const switchWidth = 960;
  return document.documentElement.clientWidth < switchWidth
}

document.querySelector('#close-btn').addEventListener('click',()=>{
  document.querySelector('#info').style.display='none';
})

// Service Worker registraion
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('worker.js', { scope: '.' }).then(function(registraion) {
    registraion.update();
  });
}
