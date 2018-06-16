import './app'; // Application main script

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/bousai_densyo_map/' });
  });
}
