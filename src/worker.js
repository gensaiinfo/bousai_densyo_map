'use strict'

const CACHE_URLS = [
  "/bousai_densyo_map/styles/bundle.css",
  "/bousai_densyo_map/bundle.js",
  "/bousai_densyo_map/jsons/saigai_densyo.json",
  "/bousai_densyo_map/fonts/fontawesome-webfont.woff2",
  "/bousai_densyo_map/jsons/japan_prefs.topojson",
  "/bousai_densyo_map/jsons/japan.topojson",
]

self.addEventListener('install', (event)=>{
  console.info(event)
  event.waitUntil(
    caches.open('CACHE-V1').then((cache)=>{
      cache.addAll(CACHE_URLS);
    })
  )
})


self.addEventListener('fetch', (event)=>{
  const url = event.request.url
  if(/localhost/.test(url)){
    console.info(url)
  }
})
