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
  const assembly=mobile.querySelector('.mobile-assembly');
  const tree={x:0,y:0,vx:0,vy:0};
  let dragging = null;
  let frame = null;
  let previousTime = 0;
  let nudges = 0;
  const clamp = value => Math.max(-48, Math.min(48, value));
  mobile.setAttribute('role','group');
  let portrait = null;
  let shakeMotion = null;
  let shed = false, leafFall = null;
  function shedLeaves() {
    if (shed) return;
    shed = true;
    dragging = null;
    document.body.classList.remove('shaking-mobile');
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
  function positionPortrait() {
    if (!portrait) return;
    const box = mobile.getBoundingClientRect(), size = portrait.offsetWidth;
    portrait.style.left = `${Math.max(16, Math.min(innerWidth-size-16, box.left+box.width/2-size/2))}px`;
    portrait.style.top = `${Math.max(16, Math.min(innerHeight-size-24, box.top+box.height*.7-size/2))}px`;
  }
  function dropPortrait(keyboard=false) {
    if (!portrait) {
      portrait = document.createElement('div');
      portrait.className = 'fallen-portrait';
      portrait.tabIndex = -1;
      portrait.hidden = true;
      const photo = new Image(480, 480);
      photo.alt = 'Peter H. Vartanian';
      photo.draggable = false;
      photo.src = '/assets/img/peter-portrait.webp';
      portrait.append(photo);
      portrait.addEventListener('contextmenu', event => event.preventDefault());
      document.body.append(portrait);
    }
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
  function trackShake(x, y, time, keyboard=false) {
    if (portrait || !shakeMotion) return;
    const m=shakeMotion, dt=Math.max(1,time-m.time);
    const speed=Math.min(3,Math.hypot(x-m.x,y-m.y)/dt);
    m.energy=Math.max(0,m.energy-dt*.08);
    if (!m.axis && Math.hypot(x-m.startX,y-m.startY)>=8) {
      m.axis=Math.abs(x-m.startX)>=Math.abs(y-m.startY)?'x':'y';
      m.origin=m.axis==='x'?m.startX:m.startY;
      m.extreme=m.origin;
    }
    if (m.axis) {
      const value=m.axis==='x'?x:y;
      if (!m.direction) m.direction=value>=m.origin?1:-1;
      m.peak=Math.max(m.peak,speed);
      if ((value-m.extreme)*m.direction>=0) m.extreme=value;
      else if ((m.extreme-value)*m.direction>=10) {
        const excursion=Math.abs(m.extreme-m.origin);
        // Judge the whole swing, including its peak speed. Real hands slow down at a turn.
        if (excursion>=28 && m.peak>=.5) m.energy+=Math.min(110,excursion*m.peak);
        m.origin=m.extreme;m.extreme=value;m.direction*=-1;m.peak=speed;
      }
    }
    m.x=x;m.y=y;m.time=time;
    if(m.energy>=150) dropPortrait(keyboard);
  }
  const newMotion=(x,y,time)=>({x,y,time,startX:x,startY:y,axis:null,direction:0,origin:0,extreme:0,peak:0,energy:0});
  window.addEventListener('resize', positionPortrait);


  function draw() {
    if (shed) return;
    assembly.setAttribute('transform', `translate(266 10) rotate(${tree.x*.16}) scale(1 ${1+tree.y*.0007}) translate(-266 -10)`);
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
    if (!dragging && !reducedMotion.matches) {
      tree.vx=(tree.vx-tree.x*.035*step)*Math.pow(.86,step);
      tree.vy=(tree.vy-tree.y*.035*step)*Math.pow(.86,step);
      tree.x+=tree.vx*step;tree.y+=tree.vy*step;
      energy+=Math.abs(tree.x)+Math.abs(tree.y)+Math.abs(tree.vx)+Math.abs(tree.vy);
    }
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
    piece.element.setAttribute('aria-label',`${piece.element.dataset.name}. Drag or use arrow keys; Shift with arrows shakes it; Escape resets it.`);
    piece.element.addEventListener('keydown',event => {
      if (shed) return;
      const directions={ArrowLeft:[-14,0],ArrowRight:[14,0],ArrowUp:[0,-14],ArrowDown:[0,14]};
      if (event.key==='Escape') { piece.x=0;piece.y=0;piece.vx=0;piece.vy=0;draw();return; }
      if (event.key==='Enter' || event.key===' ') {
        event.preventDefault();piece.x=clamp(piece.x+12);piece.y=clamp(piece.y-8);
        draw();if(!reducedMotion.matches) animate();return;
      }
      if (!directions[event.key]) return;
      event.preventDefault();
      const now=performance.now();
      if(!shakeMotion || now-shakeMotion.time>350) shakeMotion=newMotion(0,0,now-30);
      const strength=event.shiftKey?3:1;
      trackShake(shakeMotion.x+directions[event.key][0]*strength,shakeMotion.y+directions[event.key][1]*strength,now,true);
      piece.x=clamp(piece.x+directions[event.key][0]);piece.y=clamp(piece.y+directions[event.key][1]);
      draw();if(!reducedMotion.matches) animate();
    });
  });
  // Capture the whole mobile, including branches and the spaces between pieces.
  function beginShake(event) {
    if(shed || event.button!==0 || dragging) return;
    event.preventDefault();
    document.body.classList.add('shaking-mobile');
    window.getSelection()?.removeAllRanges();
    shakeMotion=newMotion(event.clientX,event.clientY,performance.now());
    const p=point(event);
    dragging={id:event.pointerId,start:p,startX:tree.x,startY:tree.y,moved:false};
    mobile.setPointerCapture(event.pointerId);
  }
  function moveShake(event) {
    if(!dragging || dragging.id!==event.pointerId) return;
    event.preventDefault();
    const p=point(event);
    if(Math.hypot(p.x-dragging.start.x,p.y-dragging.start.y)>4) dragging.moved=true;
    const x=clamp(dragging.startX+p.x-dragging.start.x),y=clamp(dragging.startY+p.y-dragging.start.y);
    trackShake(event.clientX,event.clientY,performance.now());
    if(shed) return;
    tree.vx=(x-tree.x)*.25;tree.vy=(y-tree.y)*.25;tree.x=x;tree.y=y;
    draw();
  }
  function releaseShake(event) {
    if(!dragging || dragging.id!==event.pointerId) return;
    const tap=!dragging.moved && event.type==='pointerup';
    dragging=null;
    document.body.classList.remove('shaking-mobile');
    if(tap) stir(); else animate();
  }
  mobile.addEventListener('pointerdown',beginShake);
  mobile.addEventListener('pointermove',moveShake);
  for(const name of ['pointerup','pointercancel','lostpointercapture']) mobile.addEventListener(name,releaseShake);
  function stir() {
    nudges++;
    pieces.forEach((p,i) => {
      if(reducedMotion.matches) {p.x=Math.sin(i*1.7+nudges)*13;p.y=Math.cos(i*1.3+nudges)*9;}
      else {p.vx+=Math.sin(i*1.7+nudges)*4;p.vy+=Math.cos(i*1.3+nudges)*2.5;}
    });
    draw();if(!reducedMotion.matches) animate();
  }
  document.addEventListener('visibilitychange',() => {
    if(document.hidden) {if(frame) cancelAnimationFrame(frame);frame=null;previousTime=0;dragging=null;document.body.classList.remove('shaking-mobile');}
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
      positionPortrait();
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
      const baseline=rect(anchor.querySelector('.name-baseline'));
      const sx=(name.left+name.right)/2,sy=baseline.top-parseFloat(getComputedStyle(anchor).fontSize)*.06;
      const left=Math.min(...paragraphs.map(p=>p.left))-13;
      const right=Math.max(...paragraphs.map(p=>p.right))+13;
      const tip=mobile.createSVGPoint();tip.x=266;tip.y=12;
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
          // One cubic across the gap avoids a zero-length tangent at its midpoint.
          route.push(`C${side} ${gapY} ${nextSide} ${gapY} ${nextSide} ${next.top+7}`);
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
