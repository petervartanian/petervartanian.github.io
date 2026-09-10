/* The incident as one form, then its constituent events. Positions here are illustrative. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const hash = value => {
    let n = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
    n = Math.imul(n ^ (n >>> 15), 0x735a2d97);
    return ((n ^ (n >>> 15)) >>> 0) / 4294967296;
  };
  function atmosphere(ctx, width, height, palette, strength = 1) {
    ctx.save();
    for (let i = 0; i < palette.length; i += 1) {
      const x = width * (.08 + i * .17);
      const y = height * (.61 + Math.sin(i * .9) * .06);
      ctx.save(); ctx.translate(x, y); ctx.scale(2.1, .48);
      const radius = Math.max(width * .23, 190);
      const mist = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      mist.addColorStop(0, `${palette[i]}19`);
      mist.addColorStop(.35, `${palette[i]}0B`);
      mist.addColorStop(1, `${palette[i]}00`);
      ctx.globalAlpha = strength; ctx.fillStyle = mist;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2); ctx.restore();
    }
    // Long, quiet strands give the field depth without boxing it into a galaxy.
    for (let strand = 0; strand < 12; strand += 1) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      palette.forEach((color, i) => gradient.addColorStop(i / (palette.length - 1), `${color}${strand % 3 ? '0B' : '18'}`));
      ctx.strokeStyle = gradient; ctx.lineWidth = strand % 3 ? .45 : .65; ctx.globalAlpha = strength;
      ctx.beginPath();
      for (let step = 0; step <= 90; step += 1) {
        const x = width * step / 90;
        const y = height * (.64 + Math.sin(step / 90 * 4 - .6) * .042) + (strand - 6) * 3.1;
        if (!step) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function sizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
    const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return {ctx, width:rect.width, height:rect.height};
  }
  function lightSprite(color) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const light = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
    light.addColorStop(0, '#F5FFFF'); light.addColorStop(.05, color);
    light.addColorStop(.12, `${color}AE`); light.addColorStop(.3, `${color}36`); light.addColorStop(1, `${color}00`);
    ctx.fillStyle = light; ctx.fillRect(0, 0, 48, 48); return canvas;
  }
  function init({events, palette, colorOf}) {
    document.documentElement.style.setProperty('--incident-spectrum', `conic-gradient(from -40deg, ${[...palette, palette[0]].join(', ')})`);
    const canvas = document.getElementById('intro-field');
    const sprites = new Map(palette.map(color => [color, lightSprite(color)]));
    let introSize;
    const particles = events.map((event, i) => ({
      color:colorOf(event), angle:hash(i * 7 + 83) * TAU, depth:Math.sqrt(hash(i * 7 + 84)),
      x:hash(i * 7 + 85), jitter:hash(i * 7 + 86) - .5,
      size:1.8 + hash(i * 7 + 87) * 3.2, bend:hash(i * 7 + 88) - .5,
    }));
    function target(p, width, height) {
      return {x:width * (-.06 + p.x * 1.12), y:height * (.76 - .1 * Math.sin(p.x * 3.7) + p.jitter * .31)};
    }
    function paintIntro() {
      introSize = sizeCanvas(canvas);
      const {ctx, width, height} = introSize;
      atmosphere(ctx, width, height, palette, .7);
      for (let i = 0; i < 2300; i += 1) {
        ctx.fillStyle = `rgba(185,213,227,${.025 + hash(i * 3 + 3) * .14})`;
        ctx.fillRect(hash(i * 3 + 1) * width, hash(i * 3 + 2) * height, .7, .7);
      }
      for (const p of particles) {
        const end = target(p, width, height);
        const size = p.size * 3;
        ctx.globalAlpha = .09 + p.depth * .22;
        ctx.drawImage(sprites.get(p.color), end.x - size / 2, end.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }
    paintIntro();
    const resize = new ResizeObserver(paintIntro); resize.observe(canvas);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || location.hash || scrollY > 40) return;
    const veil = document.createElement('div');
    veil.className = 'incident-arrival'; veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = '<canvas class="arrival-particles"></canvas><div class="incident-form"><i></i></div>';
    document.body.append(veil);
    const layer = veil.querySelector('canvas');
    const form = veil.querySelector('.incident-form');
    const screen = sizeCanvas(layer);
    const center = {x:screen.width / 2, y:screen.height / 2};
    const radius = Math.min(100, screen.width * .2);
    let frameId = null, finished = false;
    const started = performance.now();
    const cancelEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    function finish() {
      if (finished) return;
      finished = true; cancelAnimationFrame(frameId); veil.remove();
      cancelEvents.forEach(name => window.removeEventListener(name, finish, true));
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onReduced);
      window.removeEventListener('resize', finish);
      document.documentElement.dataset.arrival = 'complete';
    }
    function onVisibility() { if (document.hidden) finish(); }
    function onReduced() { if (reduced.matches) finish(); }
    cancelEvents.forEach(name => window.addEventListener(name, finish, {capture:true,passive:true}));
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onReduced);
    window.addEventListener('resize', finish, {once:true});
    document.documentElement.dataset.arrival = 'forming';
    function frame(now) {
      if (finished) return;
      const elapsed = now - started;
      const spread = ease((elapsed - 690) / 1500);
      const fade = ease((elapsed - 1200) / 1050);
      document.documentElement.dataset.arrival = spread > 0 ? 'resolving' : 'forming';
      veil.style.backgroundColor = `rgba(6,11,18,${1 - fade})`;
      form.style.opacity = String(1 - ease((elapsed - 660) / 710));
      form.style.transform = `translate(-50%,-50%) rotate(${elapsed * .004}deg) scale(${1 + spread * .3})`;
      screen.ctx.clearRect(0, 0, screen.width, screen.height);
      if (spread > 0) {
        for (const p of particles) {
          const uneven = 1 + .09 * Math.sin(p.angle * 3) + .055 * Math.cos(p.angle * 5);
          const start = {x:center.x + Math.cos(p.angle) * p.depth * radius * uneven, y:center.y + Math.sin(p.angle) * p.depth * radius * .95 * uneven};
          const end = target(p, introSize.width, introSize.height);
          const curl = Math.sin(Math.PI * spread) * p.bend;
          const x = start.x + (end.x - start.x) * spread + curl * screen.width * .16;
          const y = start.y + (end.y - start.y) * spread - curl * screen.height * .25;
          const size = p.size * (1.2 + spread * 1.8);
          screen.ctx.globalAlpha = (.55 + p.depth * .4) * (1 - fade * .75);
          screen.ctx.drawImage(sprites.get(p.color), x - size / 2, y - size / 2, size, size);
        }
      }
      screen.ctx.globalAlpha = 1;
      if (elapsed < 2300) frameId = requestAnimationFrame(frame); else finish();
    }
    frameId = requestAnimationFrame(frame);
  }
  function bloom(parent, center) {
    const form = document.createElement('div'); form.className = 'incident-form field-origin';
    form.setAttribute('aria-hidden','true'); form.innerHTML = '<i></i>';
    form.style.left = `${center.x}px`; form.style.top = `${center.y}px`; parent.append(form);
    const fade = form.animate([{opacity:.9,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:'translate(-50%,-50%) scale(1.5)'}],{duration:750,easing:'cubic-bezier(.2,.65,.25,1)'});
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const cleanup = () => { form.remove(); reduced.removeEventListener('change', cleanup); };
    fade.finished.then(cleanup).catch(cleanup); reduced.addEventListener('change',cleanup);
  }
  window.HaruspexArrival = {init, atmosphere, bloom};
})();
