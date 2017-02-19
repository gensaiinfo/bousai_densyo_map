'use strict'

const CACHE = 'CACHE-V1'
const MAP_CACHE = 'MAP_CACHE'
const TIMEOUT=400;

const PRECACHE_URLS = [
  "/bousai_densyo_map/",
  "/bousai_densyo_map/styles/bundle.css",
  "/bousai_densyo_map/bundle.js",
  "/bousai_densyo_map/jsons/saigai_densyo.json",
  "/bousai_densyo_map/fonts/fontawesome-webfont.woff2",
  "/bousai_densyo_map/jsons/japan_prefs.topojson",
  "/bousai_densyo_map/jsons/japan.topojson",
]

self.addEventListener('install', (event)=>{
  console.info("Installing Service Worker")
  event.waitUntil(
    caches.delete(MAP_CACHE).then(()=>{
      return precache()
    })
  )
})

self.addEventListener('fetch', (event)=>{
  // ネットワークから取得を試み、なければキャッシュを使う
  if(/bousai_densyo_map/.test(event.request.url)){
    event.respondWith(fromNetwork(event.request, TIMEOUT).catch(
      ()=>fromCache(CACHE, event.request)
    ))
  } else if(/tiles/.test(event.request.url)) {
    event.respondWith(fromCache(MAP_CACHE, event.request).catch(
      ()=>fetchNetThenCache(event.request)
    ))
  }
})

/**
 * サイトコンテンツをプリキャッシュする。
 * @return [Promise]
 */
function precache(){
  return caches.open(CACHE).then((cache)=>{
    return cache.addAll(PRECACHE_URLS);
  })
}

/**
 * ネットワークからコンテンツを取得する
 * @param  [Request] request コンテンツのリクエスト
 * @param  [Int] timeout ネットワークタイムアウト
 * @return [Promise] 取得したコンテンツを渡されたPromise
 */
function fromNetwork(request, timeout) {
  return new Promise( (resolve, reject)=> {
    let timeoutId = setTimeout(reject, timeout);
    fetch(request).then( (response)=> {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
}

/**
 * キャッシュからコンテンツを取得する
 * @param  [Request] request キャッシュから取得するリクエスト
 * @return [Response]  キャッシュから取得したレスポンスオブジェクト
 */
function fromCache(cacheName, request) {
  return caches.open(cacheName).then((cache)=>{
    return cache.match(request).then( (matching)=> {
      return matching || Promise.reject('no-match');
    });
  });
}

/**
 * ネットワークから取得してキャッシュする。
 * タイルマップ用に使うので、タイムアウトは設定していない。
 * @param  [Request] request リクエスト
 * @return [Promise]
 */
function fetchNetThenCache(request){
  return new Promise((resolve, reject)=>{
    caches.open(MAP_CACHE).then((cache)=>{
      fetch(request,{mode: 'no-cors'}).then((response)=>{
        cache.put(request, response.clone())
        resolve(response);
      }, reject);
    })
  })
}
