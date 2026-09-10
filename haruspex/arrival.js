/* A continuous surface tessellates into moving fragments. Its introductory positions are illustrative. */
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
  let colors = [];
  function atmosphere(ctx, width, height, palette, strength = 1) {
    ctx.save();
    // Broad, irregular dust clouds give depth; they do not trace a literal galaxy.
    for (let i = 0; i < palette.length; i++) {
      const radius = Math.max(width * .22, 170);
      ctx.save(); ctx.translate(width * (.06 + i * .175), height * (.59 + Math.sin(i * 1.3) * .07)); ctx.scale(2.1, .43);
      const mist = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      mist.addColorStop(0, `${palette[i]}12`); mist.addColorStop(.37, `${palette[i]}06`); mist.addColorStop(1, `${palette[i]}00`);
      ctx.globalAlpha = strength; ctx.fillStyle = mist; ctx.fillRect(-radius, -radius, radius * 2, radius * 2); ctx.restore();
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
  function target(i, width, height) {
    const x = hash(i * 7 + 85);
    return {x:width * (.025 + x * .95), y:height * (.76 - .1 * Math.sin(x * 3.7) + (hash(i * 7 + 86) - .5) * .3)};
  }
  function inscribeSurface(brush, radius) {
    const pitch = .16;
    const project = (longitude, latitude) => ({
      x: radius * Math.cos(latitude) * Math.sin(longitude),
      y: radius * (Math.sin(latitude) * Math.cos(pitch) - Math.cos(latitude) * Math.cos(longitude) * Math.sin(pitch)),
    });
    const lines = [
      {text:'OpenAI–Hugging Face',fontSize:radius*.175,latitude:.055},
      {text:'incident',fontSize:radius*.19,latitude:.31},
    ];
    for (const line of lines) {
      const ink = document.createElement('canvas');
      const pen = ink.getContext('2d');
      const font = `600 ${line.fontSize}px Georgia, serif`;
      pen.font = font;
      ink.width = Math.ceil(pen.measureText(line.text).width + line.fontSize*.2);
      ink.height = Math.ceil(line.fontSize*1.55);
      pen.font = font;pen.textAlign='center';pen.textBaseline='middle';
      // Light at the upper edge reads as an incision in the colored material.
      pen.fillStyle='#effaff42';pen.fillText(line.text,ink.width/2,ink.height/2-1);
      pen.fillStyle='#071220f0';pen.fillText(line.text,ink.width/2,ink.height/2);
      const arc = Math.min(2.16, ink.width/radius);
      const longitudePerPixel = arc/ink.width;
      const latitudePerPixel = 1/radius;
      for (let column=0;column<ink.width;column++) {
        const longitude=(column+.5-ink.width/2)*longitudePerPixel;
        const p=project(longitude,line.latitude);
        const horizontal=project(longitude+longitudePerPixel,line.latitude);
        const vertical=project(longitude,line.latitude+latitudePerPixel);
        brush.save();
        brush.transform(horizontal.x-p.x,horizontal.y-p.y,vertical.x-p.x,vertical.y-p.y,p.x,p.y);
        brush.drawImage(ink,column,0,1,ink.height,-.5,-ink.height/2,1.05,ink.height);
        brush.restore();
      }
    }
  }
  function surfaceRadius(width, height) {
    return Math.min(390, width*.43, height*.41);
  }
  function mesh(radius, palette) {
    const extent = Math.ceil(radius * 1.16), ratio = 2;
    const texture = document.createElement('canvas'); texture.width = texture.height = extent * 2 * ratio;
    const brush = texture.getContext('2d'); brush.scale(ratio, ratio); brush.translate(extent, extent);
    const spectrum = brush.createConicGradient(-Math.PI * .72, 0, 0);
    [...palette, palette[0]].forEach((color, i) => spectrum.addColorStop(i / palette.length, color));
    brush.fillStyle = spectrum; brush.fillRect(-extent, -extent, extent * 2, extent * 2);
    inscribeSurface(brush,radius);
    const shade = brush.createRadialGradient(-radius * .3, -radius * .38, 0, radius * .16, radius * .3, radius * 1.25);
    shade.addColorStop(0, '#f1faff24'); shade.addColorStop(.37, '#0b172b00'); shade.addColorStop(.76, '#0b142540'); shade.addColorStop(1, '#061020ba');
    brush.fillStyle = shade; brush.fillRect(-extent, -extent, extent * 2, extent * 2);
    // Fine mineral-like grain, not a glossy coating.
    for (let i = 0; i < 9000; i++) {
      const x = (hash(i * 3 + 12) - .5) * radius * 2.2, y = (hash(i * 3 + 13) - .5) * radius * 2.2;
      brush.fillStyle = i % 3 ? '#07152815' : '#ecffff24'; brush.fillRect(x, y, .6, .6);
    }
    const sectors = 32, rings = 14;
    const vertex = (ring, sector) => {
      if (!ring) return {x:0,y:0};
      const index = ((sector % sectors) + sectors) % sectors;
      const angle = index * TAU / sectors + Math.sin(ring * .45) * .07;
      const organic = 1 + .04 * Math.sin(angle * 3 + .4) + .025 * Math.cos(angle * 5);
      const jitter = ring === rings ? 0 : (hash(ring * 93 + index) - .5) * .032;
      const r = radius * (ring / rings + jitter) * organic;
      return {x:Math.cos(angle) * r, y:Math.sin(angle) * r * .96};
    };
    const triangles = [];
    for (let ring = 1; ring <= rings; ring++) for (let sector = 0; sector < sectors; sector++) {
      const a = vertex(ring - 1, sector), b = vertex(ring, sector), c = vertex(ring, sector + 1), d = vertex(ring - 1, sector + 1);
      triangles.push([a,b,c]); if (ring > 1) triangles.push([a,c,d]);
    }
    return triangles.map((vertices, i) => {
      const x = vertices.reduce((sum,p)=>sum+p.x,0)/3, y = vertices.reduce((sum,p)=>sum+p.y,0)/3;
      const x0 = Math.floor(Math.min(...vertices.map(p=>p.x))) - 1, y0 = Math.floor(Math.min(...vertices.map(p=>p.y))) - 1;
      const w = Math.ceil(Math.max(...vertices.map(p=>p.x))) - x0 + 2, h = Math.ceil(Math.max(...vertices.map(p=>p.y))) - y0 + 2;
      const tile = document.createElement('canvas'); tile.width = w * ratio; tile.height = h * ratio;
      const ctx = tile.getContext('2d'); ctx.scale(ratio, ratio); ctx.translate(-x0,-y0); ctx.beginPath();
      // Half-pixel overlap prevents hairline seams in the unbroken surface.
      vertices.forEach((p,j)=>{ const dx=p.x-x,dy=p.y-y,l=Math.hypot(dx,dy)||1; const px=p.x+dx/l*.48,py=p.y+dy/l*.48; if(j)ctx.lineTo(px,py);else ctx.moveTo(px,py); });
      ctx.closePath(); ctx.clip();
      ctx.drawImage(texture,(x0+extent)*ratio,(y0+extent)*ratio,w*ratio,h*ratio,x0,y0,w,h);
      return {tile,x,y,w,h,ox:x0-x,oy:y0-y,turn:(hash(i*9+8)-.5)*3.8,bend:(hash(i*9+9)-.5),delay:clamp((x/radius+1)*.065+hash(i*9+10)*.15)};
    });
  }
  function paintFragments(screen, fragments, center, elapsed, {hold, duration, endpoints, finalAlpha = .34, paintPoint, backdrop}) {
    const {ctx,width,height} = screen;
    ctx.clearRect(0,0,width,height);
    const progress = clamp((elapsed-hold)/duration);
    if(backdrop){ctx.save();ctx.globalAlpha=ease((progress-.22)/.74);ctx.drawImage(backdrop,0,0,width,height);ctx.restore();}
    let moved = 0; const positions = [];
    fragments.forEach((p,i)=>{
      const local = clamp((progress-p.delay)/(1-p.delay));
      const t = ease(local), end = endpoints[i % endpoints.length];
      const arc = Math.sin(Math.PI*t);
      const x = center.x+p.x+(end.x-center.x-p.x)*t + arc*p.bend*width*.18;
      const y = center.y+p.y+(end.y-center.y-p.y)*t - arc*(.06+Math.abs(p.bend)*.22)*height;
      const endSize = end.radius ? Math.max(.07, Math.min(.34,end.radius*1.55/Math.sqrt(p.w*p.h))) : .075;
      const scale = 1+(endSize-1)*ease(local*.98);
      // Fragments keep their substance: only the last handoff matches the quiet field.
      const handoff=ease((local-.72)/.28);
      ctx.globalAlpha = 1-(1-finalAlpha)*ease((local-.82)/.18);
      if(paintPoint)ctx.globalAlpha*=1-handoff;
      ctx.save(); ctx.translate(x,y);ctx.rotate(p.turn*arc + p.turn*.2*t);ctx.scale(scale,scale);
      ctx.drawImage(p.tile,p.ox,p.oy,p.w,p.h);ctx.restore();
      if(i<endpoints.length){
        positions.push({...end,x,y,radius:end.radius||1.5,alpha:1,vx:0,vy:0});
        if(paintPoint&&handoff>0)paintPoint(ctx,end,x,y,handoff);
      }
      if(local>0)moved++;
    });
    ctx.globalAlpha=1;
    return {progress,moved,positions};
  }
  function animateFracture(canvas, options) {
    const screen = sizeCanvas(canvas);
    const fragments = mesh(options.radius, colors);
    const start = performance.now(); let raf = null, done = false;
    canvas.dataset.fragmentCount=String(fragments.length);canvas.dataset.motion='surface';canvas.dataset.surfaceText='OpenAI–Hugging Face incident';canvas.dataset.surfaceRadius=String(options.radius);
    const finish = () => { if(done)return;done=true;cancelAnimationFrame(raf);options.finish?.(); };
    const tick = now => {
      if(done)return;
      const elapsed=now-start;
      const status=paintFragments(screen,fragments,options.center,elapsed,options);
      canvas.dataset.motion=status.moved?'disintegrating':'surface';
      canvas.dataset.detachedFragments=String(status.moved);
      canvas.haruspexPoints=status.positions;
      options.frame?.(status.progress, elapsed);
      if(elapsed<options.hold+options.duration)raf=requestAnimationFrame(tick);else finish();
    };
    raf=requestAnimationFrame(tick);return finish;
  }
  function init({events,palette,colorOf}) {
    colors=palette;
    const canvas=document.getElementById('intro-field');
    let introSize;
    function paintIntro() {
      introSize=sizeCanvas(canvas);const {ctx,width,height}=introSize;
      atmosphere(ctx,width,height,palette,.8);
      for(let i=0;i<3600;i++) {
        const x=hash(i*3+1)*width,y=hash(i*3+2)*height;
        ctx.fillStyle=`rgba(185,213,227,${.03+hash(i*3+3)*.18})`;ctx.fillRect(x,y,.65,.65);
      }
      events.forEach((event,i)=>{const p=target(i,width,height);ctx.globalAlpha=.13+hash(i+98)*.18;ctx.fillStyle=colorOf(event);ctx.fillRect(p.x,p.y,.8+hash(i+46),.8+hash(i+46));});
      ctx.globalAlpha=1;
    }
    paintIntro();new ResizeObserver(paintIntro).observe(canvas);
  }
  function mountGateway({scene,getPoints,paintPoint,isReading}) {
    const element=document.getElementById('incident-gateway');
    const canvas=document.getElementById('gateway-surface');
    const button=document.getElementById('sphere-enter');
    const observatory=scene.parentElement;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const originalInert=new Map();
    let screen,fragments,endpoints,backdrop,center,radius;
    let sizeKey='',dirty=true,lastProgress=-1,locked=false;
    function range(){
      const top=observatory.getBoundingClientRect().top+scrollY;
      const height=scene.getBoundingClientRect().height;
      return {top,start:top+height*.12,end:top+height*1.07};
    }
    function lock(value){
      if(value===locked)return;
      locked=value;
      if(value){
        for(const child of scene.children){if(child===element)continue;originalInert.set(child,child.inert);child.inert=true;}
      }else{for(const [child,inert] of originalInert)child.inert=inert;originalInert.clear();}
    }
    function prepare(){
      const rect=scene.getBoundingClientRect();
      const key=`${rect.width},${rect.height}`;
      if(key!==sizeKey){
        sizeKey=key;screen=sizeCanvas(canvas);radius=surfaceRadius(rect.width,rect.height);
        center={x:rect.width/2,y:rect.height/2};fragments=mesh(radius,colors);
        button.style.width=button.style.height=`${radius*2.07}px`;
        canvas.dataset.surfaceRadius=String(radius);canvas.dataset.fragmentCount=String(fragments.length);
        canvas.dataset.surfaceText='OpenAI–Hugging Face incident';
      }
      endpoints=getPoints();backdrop=endpoints.backdrop;
      if(!endpoints.length)endpoints=[{x:center.x,y:center.y,radius:1}];
      dirty=false;
    }
    function sync(){
      const bounds=range();
      const raw=clamp((scrollY-bounds.start)/(bounds.end-bounds.start));
      const progress=isReading()?1:reduced.matches?(raw<.55?0:1):raw;
      if(!dirty&&progress===lastProgress)return;
      lastProgress=progress;
      if(progress>=1){
        element.hidden=true;scene.dataset.gateway='events';scene.style.setProperty('--gateway-reveal','1');lock(false);dirty=true;
        return;
      }
      element.hidden=false;
      if(dirty)prepare();
      lock(true);
      scene.dataset.gateway=progress>0?'disintegrating':'sphere';
      scene.style.setProperty('--gateway-reveal',String(ease((progress-.47)/.5)));
      button.disabled=progress>.23;
      const status=paintFragments(screen,fragments,center,progress,{hold:0,duration:1,endpoints,backdrop,finalAlpha:1,paintPoint:(ctx,point,x,y,alpha)=>{if(point.event)paintPoint(ctx,point,x,y,alpha);}});
      canvas.dataset.detachedFragments=String(status.moved);
      canvas.dataset.progress=String(Math.round(progress*1000)/1000);
    }
    function enter({behavior='smooth'}={}){
      window.scrollTo({top:range().end+1,behavior:reduced.matches?'instant':behavior});
      sync();
    }
    function show({behavior='smooth'}={}){
      dirty=true;window.scrollTo({top:range().top,behavior:reduced.matches?'instant':behavior});sync();
    }
    button.addEventListener('click',()=>enter());
    reduced.addEventListener('change',()=>{dirty=true;sync();});
    sync();
    return {sync,enter,show,invalidate:()=>{dirty=true;sync();}};
  }

  function bloom(parent,center,{points,onFinish,paintPoint}) {
    const canvas=document.createElement('canvas');canvas.className='field-origin';canvas.setAttribute('aria-hidden','true');parent.append(canvas);
    const rect=parent.getBoundingClientRect();const reduced=matchMedia('(prefers-reduced-motion: reduce)');let cancel=()=>{},cleaned=false;
    function cleanup(){if(cleaned)return;cleaned=true;cancel();canvas.remove();reduced.removeEventListener('change',cleanup);onFinish?.();}
    canvas.haruspexCancel=cleanup;
    cancel=animateFracture(canvas,{radius:Math.min(350,rect.width*.43,rect.height*.39),center,hold:180,duration:1550,endpoints:points,finalAlpha:.85,paintPoint,finish:cleanup});
    reduced.addEventListener('change',cleanup);return canvas;
  }
  window.HaruspexArrival={init,atmosphere,bloom,mountGateway};
})();
