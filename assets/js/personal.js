'use strict';
// Keep artwork decorative without disabling ordinary link and text menus.
for (const eventName of ['contextmenu', 'dragstart']) {
  document.addEventListener(eventName, event => {
    if (event.target instanceof Element && event.target.closest('img, picture, svg, canvas')) {
      event.preventDefault();
    }
  });
}
// Native links handle navigation and the always-visible notes.

// Filter only experience rows; the download always retains the complete CV.
const primaryOnly = document.querySelector('#primary-only');
if (primaryOnly) {
  const rows = [...document.querySelectorAll('.experience-table tr')];
  let primary = false;
  const entries = rows.map(row => {
    if (!row.classList.contains('experience-award-row')) {
      primary = Boolean(row.querySelector('.primary-contribution'));
    }
    return { row, primary };
  });
  primaryOnly.checked = false;
  primaryOnly.closest('.experience-filter').hidden = false;
  primaryOnly.addEventListener('change', () => {
    for (const entry of entries) entry.row.hidden = primaryOnly.checked && !entry.primary;
  });
}

// The mobile rests until someone moves it; springs let it settle again.
const mobile = document.querySelector('.mobile-svg');
if (mobile) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pieces = [...mobile.querySelectorAll('.mobile-piece')].map(element => ({
    element, home:element.dataset.home.split(',').map(Number),
    mount:element.dataset.mount.split(',').map(Number),
    attachment:element.dataset.attachment.split(',').map(Number),
    wire:mobile.querySelector(`[data-wire="${element.dataset.piece}"]`),
    x:0, y:0, vx:0, vy:0
  }));
  let dragging = null;
  let frame = null;
  let previousTime = 0;
  let nudges = 0;
  const clamp = value => Math.max(-48, Math.min(48, value));
  mobile.setAttribute('role','group');
  let shake = 0, lastShake = 0, portraitCooldown = 0, portrait = null, returnFocus = null;
  let shed = false, leafFall = null;
  function shedLeaves() {
    if (shed) return;
    shed = true;
    dragging = null;
    if (frame) cancelAnimationFrame(frame);
    frame = null;
    previousTime = 0;
    if (!reducedMotion.matches) {
      const ns = 'http://www.w3.org/2000/svg';
      const layer = document.createElementNS(ns, 'svg');
      layer.setAttribute('class', 'falling-pieces');
      layer.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
      layer.setAttribute('aria-hidden', 'true');
      document.body.append(layer);
      leafFall = layer;
      const falls = pieces.map((piece, i) => {
        const matrix = piece.element.getScreenCTM();
        const bounds = piece.element.getBoundingClientRect();
        const wrapper = document.createElementNS(ns, 'g');
        const copy = piece.element.cloneNode(true);
        copy.removeAttribute('class');
        copy.removeAttribute('tabindex');
        copy.removeAttribute('role');
        copy.removeAttribute('aria-label');
        copy.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
        wrapper.append(copy);
        layer.append(wrapper);
        wrapper.style.transformOrigin = `${bounds.x+bounds.width/2}px ${bounds.y+bounds.height/2}px`;
        const drift = (i%2 ? 1 : -1)*(30+(i*23)%105);
        const distance = Math.max(100, innerHeight-bounds.top+90);
        const spin = (i%2 ? 1 : -1)*(55+(i*37)%150);
        return wrapper.animate([
          {transform:'translate(0, 0) rotate(0deg)',opacity:1,offset:0},
          {transform:`translate(${drift*.18}px, -10px) rotate(${spin*.12}deg)`,opacity:1,offset:.2},
          {transform:`translate(${drift*.65}px, ${distance*.48}px) rotate(${spin*.65}deg)`,opacity:1,offset:.68},
          {transform:`translate(${drift}px, ${distance}px) rotate(${spin}deg)`,opacity:0,offset:1}
        ], {duration:950+(i*73)%400,delay:(i*19)%115,easing:'ease-in',fill:'forwards'}).finished.catch(() => {});
      });
      Promise.all(falls).then(() => {layer.remove();if(leafFall===layer) leafFall=null;});
    }
    mobile.classList.add('mobile-shed');
    pieces.forEach(piece => {
      piece.element.setAttribute('tabindex', '-1');
      piece.element.setAttribute('aria-hidden', 'true');
    });
  }
  function restoreLeaves() {
    if (leafFall) {
      leafFall.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      leafFall.remove();
      leafFall = null;
    }
    shed = false;
    mobile.classList.remove('mobile-shed');
    pieces.forEach(piece => {
      piece.x=0;piece.y=0;piece.vx=0;piece.vy=0;
      piece.element.setAttribute('tabindex', '0');
      piece.element.removeAttribute('aria-hidden');
    });
    draw();
  }

  function putPortraitAway() {
    if (!portrait || portrait.hidden) return;
    const restoreFocus = document.activeElement === portrait;
    portrait.getAnimations().forEach(animation => animation.cancel());
    portrait.hidden = true;
    restoreLeaves();
    shake = 0;
    portraitCooldown = performance.now() + 2500;
    if (restoreFocus) returnFocus?.focus({preventScroll:true});
  }
  function dropPortrait(keyboard) {
    if (!portrait) {
      portrait = document.createElement('button');
      portrait.className = 'fallen-portrait';
      portrait.type = 'button';
      portrait.hidden = true;
      portrait.setAttribute('aria-label', 'Put the portrait away');
      const photo = new Image(480, 480);
      photo.alt = 'Peter H. Vartanian';
      photo.draggable = false;
      photo.src = '/assets/img/peter-portrait.webp';
      portrait.append(photo);
      portrait.addEventListener('click', putPortraitAway);
      portrait.addEventListener('contextmenu', event => event.preventDefault());
      document.body.append(portrait);
    }
    returnFocus = document.activeElement;
    portrait.style.visibility = 'hidden';
    portrait.hidden = false;
    const box = mobile.getBoundingClientRect();
    const size = portrait.offsetWidth;
    const left = Math.max(16, Math.min(innerWidth-size-16, box.left+box.width/2-size/2));
    const top = Math.max(16, Math.min(innerHeight-size-24, box.top+box.height*.7-size/2));
    portrait.style.left = `${left}px`;
    portrait.style.top = `${top}px`;
    const startX = box.left+box.width*.55-left-size/2;
    const startY = Math.min(-35, box.top+box.height*.28-top);
    portrait.querySelector('img').decode().catch(() => {}).then(() => {
      if (portrait.hidden) return;
      portrait.style.visibility = '';
      shedLeaves();
      if (!reducedMotion.matches) portrait.animate([
        {transform:`translate(${startX}px, ${startY}px) rotate(-24deg) scale(.7)`,opacity:0,offset:0},
        {opacity:1,offset:.15},
        {transform:'translate(0, 9px) rotate(11deg) scale(1)',offset:.76},
        {transform:'translate(0, -5px) rotate(1deg)',offset:.9},
        {transform:'translate(0, 0) rotate(7deg)',offset:1}
      ], {duration:720,easing:'cubic-bezier(.4,0,.7,1)'});
      if (keyboard) portrait.focus({preventScroll:true});
    });
  }
  function shakeLoose(amount, keyboard=false) {
    const now = performance.now();
    if (now < portraitCooldown || (portrait && !portrait.hidden)) return;
    shake = Math.max(0, shake-(now-lastShake)*.05) + amount;
    lastShake = now;
    if (shake >= 180) {shake=0;dropPortrait(keyboard);}
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') putPortraitAway();
  });
  window.addEventListener('resize', putPortraitAway);


  function draw() {
    if (shed) return;
    pieces.forEach(p => {
      const x=p.home[0]+p.x, y=p.home[1]+p.y, angle=p.x*.16;
      const radians=angle*Math.PI/180, [ax,ay]=p.attachment;
      p.element.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
      p.wire.setAttribute('d', `M${p.mount[0]} ${p.mount[1]}L${x+ax*Math.cos(radians)-ay*Math.sin(radians)} ${y+ax*Math.sin(radians)+ay*Math.cos(radians)}`);
    });
  }
  function settle(time) {
    const step = previousTime ? Math.min((time-previousTime)/16.67,2) : 1;
    previousTime = time;
    let energy = 0;
    pieces.forEach(p => {
      if (dragging?.piece === p) return;
      if (reducedMotion.matches) { p.vx=0; p.vy=0; return; }
      p.vx = (p.vx-p.x*.025*step)*Math.pow(.92,step);
      p.vy = (p.vy-p.y*.032*step)*Math.pow(.92,step);
      p.x += p.vx*step;
      p.y += p.vy*step;
      energy += Math.abs(p.x)+Math.abs(p.y)+Math.abs(p.vx)+Math.abs(p.vy);
    });
    draw();
    if (energy > .15) frame=requestAnimationFrame(settle);
    else { frame=null; previousTime=0; }
  }
  function animate() {
    if (shed) return;
    if (!frame && !document.hidden) { previousTime=0; frame=requestAnimationFrame(settle); }
  }
  function point(event) {
    const p = mobile.createSVGPoint(); p.x=event.clientX; p.y=event.clientY;
    return p.matrixTransform(mobile.getScreenCTM().inverse());
  }
  pieces.forEach((piece,i) => {
    piece.element.setAttribute('tabindex','0');
    piece.element.setAttribute('role','button');
    piece.element.setAttribute('aria-label',`${piece.element.dataset.name}. Drag or use arrow keys; Escape resets it.`);
    piece.element.addEventListener('keydown',event => {
      if (shed) return;
      const directions={ArrowLeft:[-14,0],ArrowRight:[14,0],ArrowUp:[0,-14],ArrowDown:[0,14]};
      if (event.key==='Escape') { piece.x=0;piece.y=0;piece.vx=0;piece.vy=0;draw();return; }
      if (event.key==='Enter' || event.key===' ') {
        event.preventDefault();shakeLoose(55,true);piece.x=clamp(piece.x+12);piece.y=clamp(piece.y-8);
        draw();if(!reducedMotion.matches) animate();return;
      }
      if (!directions[event.key]) return;
      event.preventDefault();
      shakeLoose(36,true);
      piece.x=clamp(piece.x+directions[event.key][0]);piece.y=clamp(piece.y+directions[event.key][1]);
      draw();if(!reducedMotion.matches) animate();
    });
    piece.element.addEventListener('pointerdown',event => {
      if(shed || event.button!==0 || dragging) return;
      const p=point(event);
      dragging={piece,id:event.pointerId,dx:p.x-piece.home[0]-piece.x,dy:p.y-piece.home[1]-piece.y,start:p,moved:false};
      piece.element.setPointerCapture(event.pointerId);
    });
    piece.element.addEventListener('pointermove',event => {
      if(dragging?.piece!==piece || dragging.id!==event.pointerId) return;
      const p=point(event);
      if(Math.hypot(p.x-dragging.start.x,p.y-dragging.start.y)>4) dragging.moved=true;
      const x=clamp(p.x-piece.home[0]-dragging.dx),y=clamp(p.y-piece.home[1]-dragging.dy);
      shakeLoose(Math.min(80,Math.hypot(x-piece.x,y-piece.y)));
      if (shed) return;
      piece.vx=(x-piece.x)*.4;piece.vy=(y-piece.y)*.4;piece.x=x;piece.y=y;
      draw();
    });
    function release(event) {
      if(dragging?.piece!==piece || dragging.id!==event.pointerId) return;
      const tap=!dragging.moved && event.type==='pointerup';
      dragging=null;
      if(tap) stir();
      else animate();
    }
    for(const name of ['pointerup','pointercancel','lostpointercapture']) piece.element.addEventListener(name,release);
  });
  function stir() {
    shakeLoose(55);
    nudges++;
    pieces.forEach((p,i) => {
      if(reducedMotion.matches) {p.x=Math.sin(i*1.7+nudges)*13;p.y=Math.cos(i*1.3+nudges)*9;}
      else {p.vx+=Math.sin(i*1.7+nudges)*4;p.vy+=Math.cos(i*1.3+nudges)*2.5;}
    });
    draw();if(!reducedMotion.matches) animate();
  }
  document.addEventListener('visibilitychange',() => {
    if(document.hidden) {if(frame) cancelAnimationFrame(frame);frame=null;previousTime=0;dragging=null;}
    else if(!reducedMotion.matches) animate();
  });
  draw();

  // Route the suspension thread through whitespace using the rendered text bounds.
  const page=document.querySelector('body[data-page=home] .page');
  const anchor=document.querySelector('.name-anchor');
  if(page && anchor) {
    const ns='http://www.w3.org/2000/svg';
    const thread=document.createElementNS(ns,'svg');
    const path=document.createElementNS(ns,'path');
    thread.setAttribute('class','name-thread');
    thread.setAttribute('aria-hidden','true');
    thread.setAttribute('focusable','false');
    thread.append(path);
    page.append(thread);
    function routeThread() {
      const origin=page.getBoundingClientRect();
      const rect=element=>{
        const b=element.getBoundingClientRect();
        return {left:b.left-origin.left,right:b.right-origin.left,top:b.top-origin.top,bottom:b.bottom-origin.top};
      };
      const name=rect(anchor);
      const nav=[...page.querySelectorAll('header nav a')].map(rect);
      const paragraphs=[...page.querySelectorAll('.introduction > p')].map(rect);
      if(nav.length<3 || paragraphs.length<2 || !mobile.getScreenCTM()) return;
      const first=paragraphs[0];
      const gapX=(nav[1].right+nav[2].left)/2;
      const navTop=Math.min(...nav.map(b=>b.top)),navBottom=Math.max(...nav.map(b=>b.bottom));
      const sx=name.right-2,sy=name.bottom-parseFloat(getComputedStyle(anchor).fontSize)*.46;
      const left=Math.min(...paragraphs.map(p=>p.left))-13;
      const right=Math.max(...paragraphs.map(p=>p.right))+13;
      const tip=mobile.createSVGPoint();tip.x=266;tip.y=10;
      const end=tip.matrixTransform(mobile.getScreenCTM());
      const ex=end.x-origin.left,ey=end.y-origin.top;
      thread.setAttribute('viewBox',`0 0 ${origin.width} ${origin.height}`);
      const route=[
        `M${sx} ${sy}`,
        `C${sx+14} ${sy+15} ${gapX-7} ${navTop-15} ${gapX} ${navTop-3}`,
        `S${gapX+7} ${navBottom-6} ${gapX} ${navBottom+5}`,
        `C${gapX-15} ${navBottom+22} ${left} ${first.top-25} ${left} ${first.top+7}`
      ];
      paragraphs.forEach((paragraph,i)=>{
        const side=i%2===0?left:right;
        const bend=i%2===0?-5:5;
        route.push(`C${side+bend} ${paragraph.top+35} ${side-bend} ${paragraph.bottom-12} ${side} ${paragraph.bottom+3}`);
        if(i<paragraphs.length-1){
          const next=paragraphs[i+1],nextSide=i%2===0?right:left;
          const gapY=(paragraph.bottom+next.top)/2;
          route.push(`C${side} ${gapY} ${origin.width*.5} ${gapY} ${origin.width*.5} ${gapY}`,
            `S${nextSide} ${gapY} ${nextSide} ${next.top+7}`);
        } else {
          route.push(`C${side} ${ey-12} ${ex} ${ey-23} ${ex} ${ey}`);
        }
      });
      path.setAttribute('d',route.join(' '));
    }
    routeThread();
    new ResizeObserver(routeThread).observe(page);
    document.fonts.ready.then(routeThread);
    window.addEventListener('resize',routeThread);
  }
}
