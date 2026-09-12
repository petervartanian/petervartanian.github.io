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

// The frame stays fixed; interaction excites only its suspended pieces.
const mobile = document.querySelector('.mobile-svg');
if (mobile) {
  const stage=mobile.closest('.sculpture');
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
  let activeDuration = 0, lastInteraction = null;
  mobile.setAttribute('role','group');
  let portrait = null;
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
      const stageBounds=stage.getBoundingClientRect();
      const leftPad=Math.min(48,Math.max(0,stageBounds.left));
      const rightPad=Math.min(48,Math.max(0,document.documentElement.clientWidth-stageBounds.right));
      const width=stageBounds.width+leftPad+rightPad;
      const dropEdge=Math.max(stageBounds.height+14,document.documentElement.scrollHeight-stageBounds.top-window.scrollY);
      // Pass through the floor and out of the page without creating extra scrolling.
      layer.setAttribute('viewBox', `${-leftPad} 0 ${width} ${dropEdge}`);
      Object.assign(layer.style,{inset:'0 auto auto',left:`${-leftPad}px`,width:`${width}px`,height:`${dropEdge}px`,overflow:'hidden'});
      layer.setAttribute('aria-hidden', 'true');
      stage.append(layer);
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
        copy.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e-stageBounds.left} ${matrix.f-stageBounds.top})`);
        wrapper.append(copy);
        layer.append(wrapper);
        const centerY=bounds.top-stageBounds.top+bounds.height/2;
        wrapper.style.transformOrigin = `${bounds.left-stageBounds.left+bounds.width/2}px ${centerY}px`;
        const drift = (i%2 ? 1 : -1)*(8+(i*7)%22);
        const spin = (i%2 ? 1 : -1)*(12+(i*11)%35);
        const radius=Math.hypot(bounds.width,bounds.height)/2;
        const distance=Math.max(0,dropEdge-centerY+radius+20);
        const duration=Math.max(540,Math.sqrt(2*distance/750)*1000);
        return wrapper.animate([
          {transform:'translate(0, 0) rotate(0deg)'},
          {transform:`translate(${drift}px, ${distance}px) rotate(${spin}deg)`}
        ], {duration,delay:(i%5)*22,easing:'cubic-bezier(.333,0,.667,.333)',fill:'both'}).finished
          .catch(() => {})
          .then(() => wrapper.remove());
      });
      Promise.all(falls).then(() => {layer.remove();if(leafFall===layer)leafFall=null;});
    }
    mobile.classList.add('mobile-shed');
    pieces.forEach(piece => {
      piece.element.setAttribute('tabindex', '-1');
      piece.element.setAttribute('aria-hidden', 'true');
    });
  }
  function positionPortrait() {
    if (!portrait) return;
    const size=portrait.offsetWidth,angle=7*Math.PI/180;
    const bounds=stage.getBoundingClientRect(),matrix=mobile.getScreenCTM();
    const project=(x,y)=>{
      const point=mobile.createSVGPoint();point.x=x;point.y=y;
      const screen=point.matrixTransform(matrix);
      return [screen.x-bounds.left,screen.y-bounds.top+.6];
    };
    // Match the two curves of the top arch, leaving its suspension line visible.
    const [left,controlLeft,center,controlRight,right]=[[117,114],[191,48],[266,68],[352,48],[421,118]].map(([x,y])=>project(x,y));
    const bottom=bounds.height+24,farRight=bounds.width+24;
    const opening=`M-24 ${left[1]} L${left} Q${controlLeft} ${center} Q${controlRight} ${right} L${farRight} ${right[1]} V${bottom} H-24 Z`;
    portrait.parentElement.style.clipPath=`path("${opening}")`;
    portrait.parentElement.style.setProperty('--portrait-arch',`${Math.min(left[1],controlLeft[1],center[1],controlRight[1],right[1])}px`);
    // The lowest corner of the tilted square rests exactly on the floor.
    portrait.style.left=`${(stage.clientWidth-size)/2}px`;
    portrait.style.top=`${stage.getBoundingClientRect().height+14-size*(1+Math.cos(angle)+Math.sin(angle))/2}px`;
  }
  function dropPortrait(keyboard=false) {
    if (portrait) return;
    portrait=document.createElement('div');
    portrait.className='fallen-portrait';
    portrait.tabIndex=-1;
    portrait.style.visibility='hidden';
    const photo=new Image(480,480);
    photo.alt='Peter H. Vartanian';photo.draggable=false;
    photo.src='/assets/img/peter-portrait.webp';
    portrait.append(photo);
    portrait.addEventListener('contextmenu',event=>event.preventDefault());
    const reveal=document.createElement('div');
    reveal.className='portrait-reveal';
    reveal.append(portrait);stage.append(reveal);
    photo.decode().catch(()=>{}).then(()=>{
      positionPortrait();
      const arch=parseFloat(portrait.parentElement.style.getPropertyValue('--portrait-arch'));
      const initialAngle=5*Math.PI/180;
      const lowerCorner=portrait.offsetTop+portrait.offsetHeight*(1+Math.cos(initialAngle)+Math.sin(initialAngle))/2;
      const distance=Math.max(35,lowerCorner-arch+2);
      portrait.style.visibility='';
      shedLeaves();
      if(!reducedMotion.matches) portrait.animate([
        {transform:`translateY(${-distance}px) rotate(-5deg)`},
        {transform:'translateY(0) rotate(7deg)'}
      ],{duration:720,delay:60,easing:'cubic-bezier(.333,0,.667,.333)',fill:'backwards'});
      if(keyboard) portrait.focus({preventScroll:true});
    });
  }
  window.addEventListener('resize', positionPortrait);


  function draw() {
    if (shed) return;
    pieces.forEach(p => {
      const x=p.home[0]+p.x, y=p.home[1]+p.y, angle=p.angle || 0;
      const radians=angle*Math.PI/180, [ax,ay]=p.attachment;
      p.element.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
      p.wire.setAttribute('d', `M${p.mount[0]} ${p.mount[1]}L${x+ax*Math.cos(radians)-ay*Math.sin(radians)} ${y+ax*Math.sin(radians)+ay*Math.cos(radians)}`);
    });
  }
  function settle(time) {
    const step = previousTime ? Math.min((time-previousTime)/16.67,2) : 1;
    previousTime = time;
    let energy = 0;
    const active=lastInteraction!==null && time-lastInteraction<320;
    const dt=step/60;
    const strength=8+20*Math.pow(Math.min(1,activeDuration/5000),1.45);
    pieces.forEach((p,i) => {
      if(reducedMotion.matches) return;
      p.theta=p.theta || 0;p.omega=p.omega || 0;p.drive=p.drive || 0;
      p.drive+=((active?strength:0)-p.drive)*(1-Math.exp(-dt/.06));
      p.phase=(p.phase || 0)+dt*10.4;
      const [ax,ay]=p.attachment;
      const dx=p.home[0]+ax-p.mount[0],dy=p.home[1]+ay-p.mount[1];
      // Never lengthen short strings: doing so teleports pieces on the first frame.
      const length=Math.hypot(dx,dy),rest=Math.atan2(dx,dy);
      const frequency=9.5-Math.min(length,140)/140;
      const acceleration=-frequency*frequency*Math.sin(p.theta)-4*p.omega+p.drive*Math.sin(p.phase+i*.72);
      p.omega+=acceleration*dt;
      p.theta+=p.omega*dt;
      const sin=Math.sin(p.theta),cos=Math.cos(p.theta);
      p.x=p.mount[0]+length*Math.sin(rest+p.theta)-(ax*cos-ay*sin)-p.home[0];
      p.y=p.mount[1]+length*Math.cos(rest+p.theta)-(ax*sin+ay*cos)-p.home[1];
      p.angle=p.theta*180/Math.PI;
      energy+=Math.abs(p.theta)+Math.abs(p.omega)+p.drive;
    });
    draw();
    if (energy > .003 || active) frame=requestAnimationFrame(settle);
    else { frame=null; previousTime=0; }
  }
  function animate() {
    if (shed) return;
    if (!frame && !document.hidden) { previousTime=0; frame=requestAnimationFrame(settle); }
  }
  pieces.forEach(piece => {
    piece.element.setAttribute('tabindex','0');
    piece.element.setAttribute('role','button');
    piece.element.setAttribute('aria-label',`${piece.element.dataset.name}. Click or tap to shake; Enter, Space or arrow keys also shake it.`);
    piece.element.addEventListener('keydown',event => {
      if (shed) return;
      if (['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
        event.preventDefault();stir(true);
      }
    });
  });
  // Capture the whole mobile, including branches and the spaces between pieces.
  function beginShake(event) {
    if(shed || event.button!==0 || dragging) return;
    event.preventDefault();
    document.body.classList.add('shaking-mobile');
    window.getSelection()?.removeAllRanges();
    dragging={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
    mobile.setPointerCapture(event.pointerId);
  }
  function moveShake(event) {
    if(!dragging || dragging.id!==event.pointerId) return;
    event.preventDefault();
    if(Math.hypot(event.clientX-dragging.x,event.clientY-dragging.y)<6) return;
    dragging.moved=true;
    dragging.x=event.clientX;dragging.y=event.clientY;
    stir();
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
  function stir(keyboard=false) {
    if(shed || portrait) return;
    const now=performance.now();
    const gap=lastInteraction===null?Infinity:now-lastInteraction;
    activeDuration=gap<=850?activeDuration+gap:0;
    lastInteraction=now;
    if(!reducedMotion.matches) animate();
    if(activeDuration>=5000) dropPortrait(keyboard);
  }
  document.addEventListener('visibilitychange',() => {
    if(document.hidden) {if(frame) cancelAnimationFrame(frame);frame=null;previousTime=0;dragging=null;activeDuration=0;lastInteraction=null;document.body.classList.remove('shaking-mobile');}
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
    const taper=document.createElementNS(ns,'path');
    taper.setAttribute('class','thread-taper');
    const defs=document.createElementNS(ns,'defs');
    const gradient=document.createElementNS(ns,'linearGradient');
    gradient.id='thread-taper-color';
    gradient.setAttribute('gradientUnits','userSpaceOnUse');
    for(const [offset,color] of [['0%','var(--ink)'],['100%','currentColor']]) {
      const stop=document.createElementNS(ns,'stop');
      stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);
      gradient.append(stop);
    }
    defs.append(gradient);
    thread.append(defs,path,taper);
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
      // Follow the actual curve while narrowing smoothly out of the period.
      const length=parseFloat(getComputedStyle(anchor).fontSize)*.42;
      const edges=[[],[]];
      for(let i=0;i<=24;i++) {
        const u=i/24,d=u*length,p=path.getPointAtLength(d);
        const before=path.getPointAtLength(Math.max(0,d-.1));
        const after=path.getPointAtLength(d+.1);
        const dx=after.x-before.x,dy=after.y-before.y,n=Math.hypot(dx,dy)||1;
        const half=.425+1.35*Math.pow(1-u,3);
        edges[0].push(`${p.x-dy/n*half},${p.y+dx/n*half}`);
        edges[1].push(`${p.x+dy/n*half},${p.y-dx/n*half}`);
      }
      taper.setAttribute('d',`M${edges[0].join(' L')} L${edges[1].reverse().join(' L')} Z`);
      const tail=path.getPointAtLength(length);
      gradient.setAttribute('x1',sx);gradient.setAttribute('y1',sy);
      gradient.setAttribute('x2',tail.x);gradient.setAttribute('y2',tail.y);
    }
    routeThread();
    new ResizeObserver(routeThread).observe(page);
    document.fonts.ready.then(routeThread);
    window.addEventListener('resize',routeThread);
  }
}
