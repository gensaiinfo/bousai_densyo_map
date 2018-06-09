import './app'; // Application main script
import './worker'; // Service Worker registraion

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('worker.js', { scope: '/bousai_densyo_map/' })
    .then((registraion) => { registraion.update(); });
}
