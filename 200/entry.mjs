import { safeNext } from './vault-core.mjs';

const form = document.getElementById('unlock');
const input = document.getElementById('password');
const submit = form.querySelector('button[type=submit]');
const message = document.getElementById('gate-message');
const next = safeNext(new URL(location.href).searchParams.get('next'), location.origin);
let worker;

function ask(action, extra = {}) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => reject(new Error('This is taking longer than expected. Please try again.')), 30000);
    channel.port1.onmessage = event => { clearTimeout(timeout); channel.port1.close(); resolve(event.data); };
    worker.postMessage({ action, ...extra }, [channel.port2]);
  });
}

async function prepare() {
  if (!window.isSecureContext || !navigator.serviceWorker || !window.crypto?.subtle || !window.DecompressionStream) throw new Error('Please open this page in an up-to-date browser over HTTPS.');
  const registration = await navigator.serviceWorker.register('/200/sw.js', { type: 'module', scope: '/200/', updateViaCache: 'none' });
  await navigator.serviceWorker.ready;
  worker = registration.active;
  if (!navigator.serviceWorker.controller) {
    await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  }
  const state = await ask('status');
  if (state.unlocked) { location.replace(next); return; }
  submit.disabled = false;
  submit.textContent = 'Enter';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!worker || submit.disabled) return;
  submit.disabled = true;
  submit.textContent = 'Opening…';
  message.textContent = '';
  input.removeAttribute('aria-invalid');
  try {
    const response = await ask('unlock', { password: input.value });
    if (!response.ok) {
      input.setAttribute('aria-invalid', 'true');
      message.textContent = response.message;
      input.focus();
      input.select();
    } else {
      input.value = '';
      location.replace(next);
      return;
    }
  } catch (error) { message.textContent = error.message; }
  submit.disabled = false;
  submit.textContent = 'Enter';
});

prepare().catch(error => { message.textContent = error.message; submit.textContent = 'Unavailable'; });
