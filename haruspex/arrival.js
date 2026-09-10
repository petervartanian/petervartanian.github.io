/* A solid marbled ball pops, on a click, into its pieces and the actual event points. */
(() => {
  'use strict';
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>{const t=clamp(v);return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  const hash=n=>{n=Math.imul(n^(n>>>16),0x21f0aaad);n=Math.imul(n^(n>>>15),0x735a2d97);return((n^(n>>>15))>>>0)/4294967296;};
  let colors=[];
  function atmosphere(ctx,width,height,palette,strength=1){
    for(let i=0;i<palette.length;i++){
      const r=Math.max(width*.22,170);ctx.save();ctx.translate(width*(.06+i*.175),height*(.59+Math.sin(i*1.3)*.07));ctx.scale(2.1,.43);
      const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`${palette[i]}12`);g.addColorStop(.37,`${palette[i]}06`);g.addColorStop(1,`${palette[i]}00`);
      ctx.globalAlpha=strength;ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
    }
  }
  function sizeCanvas(canvas){const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);return{ctx,width:rect.width,height:rect.height};}
  function init({events,palette,colorOf}){
    colors=palette;const canvas=document.getElementById('intro-field');
    function paint(){const{ctx,width,height}=sizeCanvas(canvas);atmosphere(ctx,width,height,colors,.8);for(let i=0;i<3600;i++){ctx.fillStyle=`rgba(185,213,227,${.03+hash(i*3+3)*.18})`;ctx.fillRect(hash(i*3+1)*width,hash(i*3+2)*height,.65,.65);}events.forEach((event,i)=>{ctx.globalAlpha=.14;ctx.fillStyle=colorOf(event);ctx.fillRect(hash(i*5+9)*width,height*(.6+hash(i*5+10)*.22),1,1);});ctx.globalAlpha=1;}
    paint();new ResizeObserver(paint).observe(canvas);
  }
  function mountGateway({scene,getPoints,paintPoint,isReading}){
    // A solid, marbled, slightly uneven ball of the six workstream colours, lit from the upper left and turning slowly.
    // Only a click pops it: the surface breaks into its pieces at once, the pieces dissolve where they stand, and the true events fly to their places.
    const host=document.getElementById('incident-gateway'),canvas=document.getElementById('gateway-surface'),button=document.getElementById('sphere-enter');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),inertStates=new Map();
    const TAU=Math.PI*2,TILT=.46,SPIN_MS=48000,POP_MS=1200,DUST=6500,MARBLE=520,RIM=96;
    const easeOut=t=>{const v=clamp(t);return 1-Math.pow(1-v,3);};
    let size,center,radius,glow,grain,backdrop,endpoints=[],dust=[],marble=[],dustColors=[],solidBase=null,solidShade=null,marbleLayer=null,marbleCtx=null,ratio=1,warmIndex=0,pieceLayers=[];
    const warmCanvas=document.createElement('canvas');warmCanvas.width=warmCanvas.height=40;const warmCtx=warmCanvas.getContext('2d');
    let dirty=true,popped=false,popping=null,hover=false,frame=null,sizeKey='',locked=false,rotationAt=performance.now();
    const dustSprites=new Map(),marbleSprites=new Map();
    function bounds(){const top=scene.parentElement.getBoundingClientRect().top+scrollY,h=scene.getBoundingClientRect().height;return{top,h};}
    function lock(value){if(value===locked)return;locked=value;if(value){for(const child of scene.children){if(child===host)continue;inertStates.set(child,child.inert);child.inert=true;}}else{for(const[child,v]of inertStates)child.inert=v;inertStates.clear();}}
    function bump(u){return 1+.07*Math.sin(4.3*u[0]+1.7*u[2])*Math.cos(3.1*u[1]-.6*u[0])+.05*Math.sin(6.2*u[1]+2.4*u[2]);}
    function unit(i,n){const k=i+.5,phi=Math.acos(1-2*k/n),theta=Math.PI*(1+Math.sqrt(5))*k;return[Math.cos(theta)*Math.sin(phi),Math.sin(theta)*Math.sin(phi),Math.cos(phi)];}
    function sphereUnit(seed){const z=1-2*hash(seed),a=hash(seed+1)*TAU,r=Math.sqrt(Math.max(0,1-z*z));return[r*Math.cos(a),r*Math.sin(a),z];}
    function dustSprite(color,geometry){const key=color*4+geometry;let sprite=dustSprites.get(key);if(sprite)return sprite;const R=3,pad=2,S=(R+pad)*4;sprite=document.createElement('canvas');sprite.width=sprite.height=S;const c=sprite.getContext('2d');c.scale(2,2);c.translate(R+pad,R+pad);c.fillStyle=dustColors[color];c.beginPath();if(geometry===0)c.arc(0,0,R,0,TAU);else if(geometry===1){c.moveTo(0,-R*1.15);c.lineTo(R*1.15,0);c.lineTo(0,R*1.15);c.lineTo(-R*1.15,0);c.closePath();}else if(geometry===2){c.moveTo(0,-R*1.2);c.lineTo(R*1.1,R*.8);c.lineTo(-R*1.1,R*.8);c.closePath();}else{for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2,rr=i%2?R*.55:R*1.3;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}c.fill();dustSprites.set(key,sprite);return sprite;}
    function marbleSprite(color){let sprite=marbleSprites.get(color);if(sprite)return sprite;const S=96;sprite=document.createElement('canvas');sprite.width=sprite.height=S;const c=sprite.getContext('2d'),g=c.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);g.addColorStop(0,dustColors[color]+'ff');g.addColorStop(.45,dustColors[color]+'66');g.addColorStop(1,dustColors[color]+'00');c.fillStyle=g;c.fillRect(0,0,S,S);marbleSprites.set(color,sprite);return sprite;}
    function prepare(){
      size=sizeCanvas(canvas);const source=getPoints();backdrop=source.backdrop;center={x:size.width/2,y:size.height/2};radius=Math.min(330,size.width*.36,size.height*.4);
      dustColors=colors.slice();dustSprites.clear();marbleSprites.clear();
      glow=document.createElement('canvas');glow.width=size.width;glow.height=size.height;const gc=glow.getContext('2d');
      const halo=gc.createRadialGradient(center.x,center.y,radius*.6,center.x,center.y,radius*1.6);halo.addColorStop(0,'#7cdbcf1c');halo.addColorStop(.5,'#c28abb10');halo.addColorStop(1,'#0b0f1000');gc.fillStyle=halo;gc.fillRect(0,0,size.width,size.height);
      const g=document.createElement('canvas');g.width=g.height=128;const gx=g.getContext('2d'),img=gx.createImageData(128,128);for(let i=0;i<img.data.length;i+=4){const v=180+Math.floor(hash(i*3+17)*75);img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=Math.floor(hash(i*3+19)*70);}gx.putImageData(img,0,0);grain=size.ctx.createPattern(g,'repeat');
      const n=Math.max(1,source.length),order=source.map((_,i)=>i).sort((a,b)=>hash(a*17+3)-hash(b*17+3)),slot=new Array(n);order.forEach((index,k)=>{slot[index]=k;});
      endpoints=source.map((p,i)=>{const u=unit(slot[i],n);return{...p,unit:u,shell:bump(u)*(.99+hash(i*11+5)*.02),delay:hash(i+399)*.1,bend:(hash(i*13+7)-.5)*radius*.28,origin:null};});
      dust=Array.from({length:DUST},(_,i)=>{const u=sphereUnit(i*7+31),surface=hash(i*7+37)<.68;return{unit:u,shell:bump(u)*(surface?.93+.07*hash(i*7+33):Math.cbrt(hash(i*7+33))*.9),r:2.3+hash(i*7+34)*2.1,color:Math.floor(hash(i*7+35)*(dustColors.length-.001)),geometry:i%4,delay:hash(i*7+36)*.2,origin:null};});
      marble=Array.from({length:MARBLE},(_,i)=>({unit:sphereUnit(i*5+9001),color:Math.floor(hash(i*5+9003)*(dustColors.length-.001)),r:radius*(.08+.13*hash(i*5+9004)),alpha:.13+.11*hash(i*5+9005)}));
      ratio=canvas.width/size.width;const lx=center.x-radius*.38,ly=center.y-radius*.42;
      const layer=()=>{const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const x=c.getContext('2d');x.scale(ratio,ratio);return[c,x];};
      let x;[solidBase,x]=layer();const base=x.createRadialGradient(lx,ly,radius*.04,center.x,center.y,radius*1.06);base.addColorStop(0,'#46688a');base.addColorStop(.5,'#1e3242');base.addColorStop(1,'#0a1118');x.fillStyle=base;x.fillRect(0,0,size.width,size.height);x.globalAlpha=.32;x.fillStyle=x.createPattern(g,'repeat');x.fillRect(0,0,size.width,size.height);
      [solidShade,x]=layer();const shade=x.createRadialGradient(lx,ly,radius*.2,center.x,center.y,radius*1.02);shade.addColorStop(0,'#05090e00');shade.addColorStop(.6,'#05090e40');shade.addColorStop(1,'#05090ecc');x.fillStyle=shade;x.fillRect(0,0,size.width,size.height);const spec=x.createRadialGradient(lx+radius*.06,ly+radius*.04,0,lx+radius*.06,ly+radius*.04,radius*.55);spec.addColorStop(0,'rgba(255,255,255,.14)');spec.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=spec;x.fillRect(0,0,size.width,size.height);
      for(let c=0;c<dustColors.length;c++)for(let k=0;k<4;k++)dustSprite(c,k);
      const bs=radius*2.3,ms=Math.max(64,Math.ceil(bs*ratio/3));marbleLayer=document.createElement('canvas');marbleLayer.width=marbleLayer.height=ms;marbleCtx=marbleLayer.getContext('2d');marbleCtx.scale(ms/bs,ms/bs);
      warmIndex=0;
      button.style.width=button.style.height=`${radius*2.15}px`;
      Object.assign(canvas.dataset,{motion:'solid-globe',eventCount:String(source.length),particleCount:String(DUST),surfaceRadius:String(radius)});dirty=false;
    }
    function rotate(u,angle){const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(TILT),st=Math.sin(TILT);const x1=u[0]*ca+u[2]*sa,z1=-u[0]*sa+u[2]*ca,y2=u[1]*ct-z1*st,z2=u[1]*st+z1*ct;return[x1,y2,z2];}
    function unrotate(v,angle){const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(TILT),st=Math.sin(TILT);const y=v[1]*ct+v[2]*st,z1=-v[1]*st+v[2]*ct;return[v[0]*ca-z1*sa,y,v[0]*sa+z1*ca];}
    function project(u,shell,angle){const[x1,y2,z2]=rotate(u,angle);const R=radius*shell,f=radius*2.7,s=f/(f+z2*R);return{x:center.x+x1*R*s,y:center.y+y2*R*s,s,depth:(1-z2)/2,light:Math.max(0,-(x1*.45+y2*.55+z2*.7))};}
    function silhouette(angle){const path=new Path2D();for(let k=0;k<RIM;k++){const a=k/RIM*TAU,u=unrotate([Math.cos(a),Math.sin(a),0],angle),r=radius*bump(u)*.985,x=center.x+Math.cos(a)*r,y=center.y+Math.sin(a)*r;if(k)path.lineTo(x,y);else path.moveTo(x,y);}path.closePath();return path;}
    function paintSolid(angle,alpha=1){
      const{ctx,width,height}=size,lift=hover?1.15:1,bx=center.x-radius*1.15,by=center.y-radius*1.15,bs=radius*2.3;
      const gx=Math.max(0,center.x-radius*1.7),gy=Math.max(0,center.y-radius*1.7),gw=Math.min(width,center.x+radius*1.7)-gx,gh=Math.min(height,center.y+radius*1.7)-gy;
      ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(glow,gx*ratio,gy*ratio,gw*ratio,gh*ratio,gx,gy,gw,gh);
      const path=silhouette(angle);ctx.clip(path);
      ctx.drawImage(solidBase,bx*ratio,by*ratio,bs*ratio,bs*ratio,bx,by,bs,bs);
      marbleCtx.clearRect(0,0,bs,bs);
      for(const m of marble){const p=project(m.unit,1,angle);if(p.depth<.48)continue;const w=m.r*2*p.s*(1+.4*(p.depth-.5));marbleCtx.globalAlpha=m.alpha*lift*(.45+.55*p.light);marbleCtx.drawImage(marbleSprite(m.color),p.x-bx-w/2,p.y-by-w/2,w,w);}
      ctx.drawImage(marbleLayer,bx,by,bs,bs);
      ctx.drawImage(solidShade,bx*ratio,by*ratio,bs*ratio,bs*ratio,bx,by,bs,bs);
      if(hover){ctx.globalAlpha=alpha*.08;ctx.fillStyle='#dfeaf0';ctx.fillRect(bx,by,bs,bs);}
      ctx.restore();
      ctx.save();ctx.globalAlpha=alpha*.35;ctx.strokeStyle='#dfeaf0';ctx.lineWidth=.6;ctx.stroke(path);ctx.restore();
    }
    function paintGlobe(now){const{ctx,width,height}=size;ctx.clearRect(0,0,width,height);paintSolid(reduced.matches?.7:((now-rotationAt)/SPIN_MS)*TAU);canvas.dataset.progress='0';}
    function paintPop(progress){
      const{ctx,width,height}=size;ctx.clearRect(0,0,width,height);
      const reveal=ease((progress-.45)/.55);if(backdrop&&reveal>.002){ctx.globalAlpha=reveal;ctx.drawImage(backdrop,0,0,width,height);ctx.globalAlpha=1;}
      const shatter=clamp(progress/.1);
      if(shatter<1)paintSolid(popping.angle,1-shatter);
      const box=pieceLayers.box;pieceLayers.forEach((L,k)=>{const gone=easeOut((progress-.06-(k+.5)/30)/.6);if(gone>=1)return;ctx.globalAlpha=shatter*(1-gone);ctx.drawImage(L.c,box.bx,box.by,box.bs,box.bs);});
      ctx.globalAlpha=1;
      for(const g of endpoints){const t=easeOut((progress-g.delay)/(1-g.delay)),o=g.origin,bend=Math.sin(t*Math.PI)*g.bend,x=mix(o.x,g.x,t)+bend,y=mix(o.y,g.y,t)-bend*.42;paintPoint(ctx,{...g,radius:mix(o.r,g.radius,t)},x,y,Math.max(shatter,t)*(.85+.15*t));}
      canvas.dataset.progress=progress.toFixed(3);
    }
    function buildPieceLayers(){
      const bx=center.x-radius*1.2,by=center.y-radius*1.2,bs=radius*2.4,px=Math.ceil(bs*ratio);
      pieceLayers=Array.from({length:6},()=>{const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d');x.scale(ratio,ratio);x.translate(-bx,-by);return{c,x};});
      for(const d of dust){const o=d.origin,L=pieceLayers[Math.min(5,Math.floor(d.delay*30))],w=d.r*o.s*10/3;L.x.globalAlpha=o.a;L.x.drawImage(dustSprite(d.color,d.geometry),o.x-w/2,o.y-w/2,w,w);}
      pieceLayers.box={bx,by,bs};
    }
    function settle(){popped=true;popping=null;host.hidden=true;scene.dataset.gateway='events';scene.style.setProperty('--gateway-reveal','1');lock(false);stop();}
    function pop({instant=false}={}){
      if(popped||popping)return;
      if(dirty)prepare();
      if(instant||reduced.matches){settle();return;}
      const angle=((performance.now()-rotationAt)/SPIN_MS)*TAU;
      for(const g of endpoints){const p=project(g.unit,g.shell,angle);g.origin={x:p.x,y:p.y,r:Math.max(1.5,g.radius*(.7+.6*p.depth)*p.s)};}
      for(const d of dust){const p=project(d.unit,d.shell,angle);d.origin={x:p.x,y:p.y,s:p.s,a:Math.min(1,(.1+.9*Math.pow(p.light,.85))*(.55+.45*p.depth))};}
      buildPieceLayers();
      button.disabled=true;scene.dataset.gateway='disintegrating';popping={start:performance.now(),angle};start();
    }
    function tick(now){
      frame=null;if(popped)return;
      const rect=canvas.getBoundingClientRect(),key=`${Math.round(rect.width)}x${Math.round(rect.height)}`;
      if(key!==sizeKey){sizeKey=key;dirty=true;}
      if(dirty){const wasPopping=popping;prepare();if(wasPopping){settle();return;}}
      if(popping){const p=Math.min(1,(now-popping.start)/POP_MS);scene.style.setProperty('--gateway-reveal',String(ease((p-.4)/.6)));paintPop(p);if(p>=1){settle();return;}}
      else{if(warmIndex<endpoints.length){const stop=Math.min(endpoints.length,warmIndex+40);for(;warmIndex<stop;warmIndex++){const g=endpoints[warmIndex];for(let r=1.5;r<=9;r+=.5)paintPoint(warmCtx,{...g,radius:r},20,20,1);}warmCtx.clearRect(0,0,40,40);}
        if(rect.bottom>0&&rect.top<innerHeight)paintGlobe(now);}
      frame=requestAnimationFrame(tick);
    }
    function start(){if(frame===null&&!popped)frame=requestAnimationFrame(tick);}
    function stop(){if(frame!==null){cancelAnimationFrame(frame);frame=null;}}
    function reform(){popped=false;popping=null;dirty=true;host.hidden=false;button.disabled=false;scene.dataset.gateway='sphere';scene.style.setProperty('--gateway-reveal','0');lock(true);rotationAt=performance.now();start();}
    function sync(){
      if(popped)return;
      if(isReading()){pop({instant:true});return;}
      host.hidden=false;
      if(!popping){scene.dataset.gateway='sphere';scene.style.setProperty('--gateway-reveal','0');lock(true);}
      start();
    }
    function enter({behavior='smooth'}={}){window.scrollTo({top:bounds().top,behavior:reduced.matches?'instant':behavior});if(!popped)pop({instant:isReading()});}
    function show({behavior='smooth'}={}){reform();window.scrollTo({top:bounds().top,behavior:reduced.matches?'instant':behavior});}
    button.addEventListener('click',()=>pop());
    button.addEventListener('pointerenter',()=>{hover=true;});button.addEventListener('pointerleave',()=>{hover=false;});
    reduced.addEventListener('change',()=>{dirty=true;});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
    sync();return{sync,enter,show,invalidate(){dirty=true;if(!popped)start();}};
  }
  window.HaruspexArrival={init,atmosphere,mountGateway};
})();
