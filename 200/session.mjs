// Update older encrypted catalogues without repackaging unrelated private research.
for (const link of document.querySelectorAll('.experiment-list a[href="/x-oscope/"]')) {
  link.href = '/correlator/';
  link.style.setProperty('--accent', '#634178');
  link.querySelector('h2').textContent = 'AI Risk Correlator';
  link.querySelector('p').textContent = 'What do AI incidents tell us about existential risk?';
  const mark = link.querySelector('.experiment-mark');
  mark.textContent = 'AI';
  mark.classList.add('experiment-monogram');
}

function ask(action) {
  return new Promise(resolve => {
    const worker = navigator.serviceWorker.controller;
    if (!worker) { resolve({ unlocked: false }); return; }
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); resolve({ unlocked: false }); }, 10000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    worker.postMessage({ action }, [channel.port2]);
  });
}

async function checkSession() {
  const status = await ask('status');
  if (!status.unlocked) location.replace('/200/?next=' + encodeURIComponent(location.pathname + location.search + location.hash));
}

for (const button of document.querySelectorAll('[data-lock]')) {
  button.addEventListener('click', async () => {
    button.disabled = true;
    await ask('lock');
    location.replace('/200/');
  });
}
window.addEventListener('pageshow', event => { if (event.persisted) checkSession(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkSession(); });
setInterval(checkSession, 60000);
