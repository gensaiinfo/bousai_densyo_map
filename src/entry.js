'use strict'

// static files
import "./manifest.json"
import "chrome192"
import "chrome384"
import "apple_icon"
import "favicon16"
import "favicon32"
import "favicon"
import "browserconfig"
import "safari_pinned"
import "mstile"

// Service Worker registraion
import "./worker.js"
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('worker.js', { scope: '/bousai_densyo_map/' }).then(
    (registraion)=>{
      registraion.update();
    });
}

import './app.js' // Application main script
