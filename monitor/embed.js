(function () {
  'use strict';

  window.addEventListener('message', function (event) {
    var message = event.data;
    if (!message || typeof message !== 'object' || Array.isArray(message)) return;
    if (message.type !== 'risk-pathways:resize' && message.type !== 'risk-pathways:focus') return;
    if (message.type === 'risk-pathways:resize'
      && (!Number.isInteger(message.height) || message.height < 200 || message.height > 20000)) return;

    var frames = document.querySelectorAll('iframe[data-risk-pathways]');
    for (var index = 0; index < frames.length; index += 1) {
      var frame = frames[index];
      if (event.source !== frame.contentWindow) continue;

      var source = frame.getAttribute('src');
      if (!source) continue;
      var url;
      try {
        url = new URL(source, document.baseURI);
      } catch (_) {
        continue;
      }
      if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
      if (event.origin !== url.origin) continue;
      var embedId = url.searchParams.get('embedId');
      if (embedId && message.embedId !== embedId) continue;

      if (message.type === 'risk-pathways:focus') {
        frame.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else {
        frame.style.height = message.height + 'px';
        frame.setAttribute('height', String(message.height));
        frame.setAttribute('data-embed-ready', 'true');
      }
      return;
    }
  });
})();
