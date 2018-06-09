/* eslint no-restricted-globals: 1 */

const CACHE = 'CACHE-V1';
const TIMEOUT = 400;

const PRECACHE_URLS = [
  '/bousai_densyo_map/',
  '/bousai_densyo_map/styles/bundle.css',
  '/bousai_densyo_map/bundle.js',
  '/bousai_densyo_map/jsons/saigai_densyo.json',
  '/bousai_densyo_map/fonts/fontawesome-webfont.woff2',
  '/bousai_densyo_map/jsons/japan_prefs.topojson',
  '/bousai_densyo_map/jsons/japan.topojson',
];

/**
 * サイトコンテンツをプリキャッシュする。
 * @return [Promise]
 */
function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(PRECACHE_URLS));
}

/**
 * ネットワークからコンテンツを取得する
 * @param  [Request] request コンテンツのリクエスト
 * @param  [Int] timeout ネットワークタイムアウト
 * @return [Promise] 取得したコンテンツを渡されたPromise
 */
function fromNetwork(request, timeout) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
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
  return caches.open(cacheName).then(cache => (
    cache.match(request).then(matching => (
      matching || Promise.reject(new Error('no-match'))))));
}

self.addEventListener('install', (event) => {
  // console.info('Installing Service Worker');
  event.waitUntil(precache());
});

self.addEventListener('fetch', (event) => {
  // ネットワークから取得を試み、なければキャッシュを使う
  if (/bousai_densyo_map/.test(event.request.url)) {
    event.respondWith(fromNetwork(event.request, TIMEOUT)
      .catch(() => fromCache(CACHE, event.request)));
  }
});
