/* A globe of the event marks pops, on a click, into the actual event points. */
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
    // A globe made of the event marks themselves, with a dust of the four legend geometries between them, turning slowly; a click (or scrolling on past it) pops it into the swarm.
    const host=document.getElementById('incident-gateway'),canvas=document.getElementById('gateway-surface'),button=document.getElementById('sphere-enter');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),inertStates=new Map();
    const TAU=Math.PI*2,TILT=.46,SPIN_MS=52000,POP_MS=1500,DUST=1800;
    let size,center,radius,hull,backdrop,endpoints=[],dust=[],dustColors=[];
    let dirty=true,popped=false,popping=null,hover=false,frame=null,sizeKey='',locked=false,rotationAt=performance.now();
    const dustSprites=new Map();
    function dustSprite(color,geometry){const key=color*4+geometry;let sprite=dustSprites.get(key);if(sprite)return sprite;const R=3,pad=2,S=(R+pad)*4;sprite=document.createElement('canvas');sprite.width=sprite.height=S;const c=sprite.getContext('2d');c.scale(2,2);c.translate(R+pad,R+pad);c.fillStyle=dustColors[color];c.beginPath();if(geometry===0)c.arc(0,0,R,0,TAU);else if(geometry===1){c.moveTo(0,-R*1.15);c.lineTo(R*1.15,0);c.lineTo(0,R*1.15);c.lineTo(-R*1.15,0);c.closePath();}else if(geometry===2){c.moveTo(0,-R*1.2);c.lineTo(R*1.1,R*.8);c.lineTo(-R*1.1,R*.8);c.closePath();}else{for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2,rr=i%2?R*.55:R*1.3;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}c.fill();dustSprites.set(key,sprite);return sprite;}
    function bounds(){const top=scene.parentElement.getBoundingClientRect().top+scrollY,h=scene.getBoundingClientRect().height;return{top,h};}
    function lock(value){if(value===locked)return;locked=value;if(value){for(const child of scene.children){if(child===host)continue;inertStates.set(child,child.inert);child.inert=true;}}else{for(const[child,v]of inertStates)child.inert=v;inertStates.clear();}}
    function unit(i,n){const k=i+.5,phi=Math.acos(1-2*k/n),theta=Math.PI*(1+Math.sqrt(5))*k;return[Math.cos(theta)*Math.sin(phi),Math.sin(theta)*Math.sin(phi),Math.cos(phi)];}
    function prepare(){
      size=sizeCanvas(canvas);const source=getPoints();backdrop=source.backdrop;center={x:size.width/2,y:size.height/2};radius=Math.min(330,size.width*.36,size.height*.4);
      dustColors=Array.from({length:48},(_,i)=>{const t=i/47*(colors.length-1),a=colors[Math.floor(t)],b=colors[Math.min(colors.length-1,Math.floor(t)+1)],f=t%1;return '#'+[1,3,5].map(k=>Math.round(mix(parseInt(a.slice(k,k+2),16),parseInt(b.slice(k,k+2),16),f)).toString(16).padStart(2,'0')).join('');});
      hull=document.createElement('canvas');hull.width=size.width;hull.height=size.height;const hc=hull.getContext('2d');
      const glow=hc.createRadialGradient(center.x,center.y,radius*.2,center.x,center.y,radius*1.4);glow.addColorStop(0,'#7cdbcf16');glow.addColorStop(.55,'#c28abb0d');glow.addColorStop(1,'#0b0f1000');hc.fillStyle=glow;hc.fillRect(0,0,size.width,size.height);
      const shade=hc.createRadialGradient(center.x-radius*.3,center.y-radius*.35,radius*.1,center.x,center.y,radius);shade.addColorStop(0,'#1a2b3a70');shade.addColorStop(.7,'#0d1a2458');shade.addColorStop(1,'#0b0f1000');hc.fillStyle=shade;hc.beginPath();hc.arc(center.x,center.y,radius,0,TAU);hc.fill();
      const n=Math.max(1,source.length),order=source.map((_,i)=>i).sort((a,b)=>hash(a*17+3)-hash(b*17+3)),slot=new Array(n);order.forEach((index,k)=>{slot[index]=k;});
      endpoints=source.map((p,i)=>({...p,unit:unit(slot[i],n),shell:.97+hash(i*11+5)*.06,delay:hash(i+399)*.22,bend:(hash(i*13+7)-.5)*radius*.55,origin:null}));
      dustSprites.clear();
      dust=Array.from({length:DUST},(_,i)=>{const z=1-2*hash(i*7+31),a=hash(i*7+32)*TAU,r=Math.sqrt(Math.max(0,1-z*z));return{unit:[r*Math.cos(a),r*Math.sin(a),z],shell:.86+hash(i*7+33)*.2,r:.8+hash(i*7+34)*1.4,color:Math.floor(hash(i*7+35)*47.999),geometry:i%4,speed:hash(i*7+36),origin:null};});
      button.style.width=button.style.height=`${radius*2.15}px`;
      Object.assign(canvas.dataset,{motion:'glyph-globe',eventCount:String(source.length),particleCount:String(DUST),surfaceRadius:String(radius)});dirty=false;
    }
    function project(u,shell,angle){
      const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(TILT),st=Math.sin(TILT);
      const x1=u[0]*ca+u[2]*sa,z1=-u[0]*sa+u[2]*ca,y2=u[1]*ct-z1*st,z2=u[1]*st+z1*ct;
      const R=radius*shell,f=radius*2.7,s=f/(f+z2*R);
      return{x:center.x+x1*R*s,y:center.y+y2*R*s,s,depth:(1-z2)/2};
    }
    function paintGlobe(now){
      const{ctx,width,height}=size;ctx.clearRect(0,0,width,height);
      const angle=reduced.matches?.7:((now-rotationAt)/SPIN_MS)*TAU,lift=hover?1.12:1;
      ctx.globalAlpha=hover?1:.8;ctx.drawImage(hull,0,0,width,height);ctx.globalAlpha=1;
      const items=[];
      for(const d of dust){const p=project(d.unit,d.shell,angle);items.push({z:p.depth,d,p});}
      for(const g of endpoints){const p=project(g.unit,g.shell,angle);items.push({z:p.depth,g,p});}
      items.sort((a,b)=>a.z-b.z);
      for(const it of items){
        if(it.d){ctx.globalAlpha=Math.min(1,(.14+.56*it.z)*lift);const w=it.d.r*it.p.s*10/3;ctx.drawImage(dustSprite(it.d.color,it.d.geometry),it.p.x-w/2,it.p.y-w/2,w,w);}
        else{const r=Math.max(1.5,it.g.radius*(.5+.6*it.z)*it.p.s*lift);paintPoint(ctx,{...it.g,radius:r},it.p.x,it.p.y,Math.min(1,(.3+.7*it.z)*lift));}
      }
      ctx.globalAlpha=1;canvas.dataset.progress='0';
    }
    function paintPop(progress){
      const{ctx,width,height}=size;ctx.clearRect(0,0,width,height);
      if(backdrop){ctx.globalAlpha=ease((progress-.6)/.4);ctx.drawImage(backdrop,0,0,width,height);ctx.globalAlpha=1;}
      ctx.globalAlpha=(1-ease(progress/.45))*.8;ctx.drawImage(hull,0,0,width,height);
      const burst=ease(progress/.6),fade=1-ease((progress-.1)/.55);
      for(const d of dust){const o=d.origin,dx=o.x-center.x,dy=o.y-center.y,len=Math.hypot(dx,dy)||1,dist=(.6+d.speed)*radius*1.8*burst,x=o.x+dx/len*dist,y=o.y+dy/len*dist;ctx.globalAlpha=.6*fade;const w=d.r*(1-burst*.4)*10/3;ctx.drawImage(dustSprite(d.color,d.geometry),x-w/2,y-w/2,w,w);}
      ctx.globalAlpha=1;
      for(const g of endpoints){const t=ease((progress-g.delay)/(1-g.delay)),o=g.origin,bend=Math.sin(t*Math.PI)*g.bend,x=mix(o.x,g.x,t)+bend,y=mix(o.y,g.y,t)-bend*.42;paintPoint(ctx,{...g,radius:mix(o.r,g.radius,t)},x,y,.85+.15*t);}
      canvas.dataset.progress=progress.toFixed(3);
    }
    function settle(){popped=true;popping=null;host.hidden=true;scene.dataset.gateway='events';scene.style.setProperty('--gateway-reveal','1');lock(false);stop();}
    function pop({instant=false}={}){
      if(popped||popping)return;
      if(dirty)prepare();
      if(instant||reduced.matches){settle();return;}
      const angle=((performance.now()-rotationAt)/SPIN_MS)*TAU;
      for(const g of endpoints){const p=project(g.unit,g.shell,angle);g.origin={x:p.x,y:p.y,r:Math.max(1.5,g.radius*(.5+.6*p.depth)*p.s)};}
      for(const d of dust){const p=project(d.unit,d.shell,angle);d.origin={x:p.x,y:p.y};}
      button.disabled=true;scene.dataset.gateway='disintegrating';popping={start:performance.now()};start();
    }
    function tick(now){
      frame=null;if(popped)return;
      const rect=canvas.getBoundingClientRect(),key=`${Math.round(rect.width)}x${Math.round(rect.height)}`;
      if(key!==sizeKey){sizeKey=key;dirty=true;}
      if(dirty){const wasPopping=popping;prepare();if(wasPopping){settle();return;}}
      if(popping){const p=Math.min(1,(now-popping.start)/POP_MS);scene.style.setProperty('--gateway-reveal',String(ease((p-.6)/.4)));paintPop(p);if(p>=1){settle();return;}}
      else if(rect.bottom>0&&rect.top<innerHeight)paintGlobe(now);
      frame=requestAnimationFrame(tick);
    }
    function start(){if(frame===null&&!popped)frame=requestAnimationFrame(tick);}
    function stop(){if(frame!==null){cancelAnimationFrame(frame);frame=null;}}
    function reform(){popped=false;popping=null;dirty=true;host.hidden=false;button.disabled=false;scene.dataset.gateway='sphere';scene.style.setProperty('--gateway-reveal','0');lock(true);rotationAt=performance.now();start();}
    function sync(){
      if(popped)return;
      if(isReading()){pop({instant:true});return;}
      host.hidden=false;
      if(!popping){scene.dataset.gateway='sphere';scene.style.setProperty('--gateway-reveal','0');lock(true);const b=bounds();if(scrollY>b.top+b.h*.3)pop();}
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
