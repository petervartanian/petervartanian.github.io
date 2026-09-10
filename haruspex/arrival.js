/* An irregular incident cloud dissolves into the actual event points. */
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
    const host=document.getElementById('incident-gateway'),canvas=document.getElementById('gateway-surface'),button=document.getElementById('sphere-enter');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),inertStates=new Map();
    let hull,dustBuckets=[],dustColors=[],size,particles=[],endpoints=[],backdrop,dirty=true,last=-1,locked=false,center,radius;
    function bounds(){const top=scene.parentElement.getBoundingClientRect().top+scrollY,h=scene.getBoundingClientRect().height;return{top,start:top+h*.08,end:top+h*.95};}
    function lock(value){if(value===locked)return;locked=value;if(value){for(const child of scene.children){if(child===host)continue;inertStates.set(child,child.inert);child.inert=true;}}else{for(const[child,v]of inertStates)child.inert=v;inertStates.clear();}}
    function seed(i){
      const a=hash(i*7+31)*Math.PI*2,depth=Math.sqrt(hash(i*7+32)),edge=1+.11*Math.sin(a*3+.4)+.075*Math.cos(a*5-1);
      return{x:center.x+Math.cos(a)*radius*depth*edge,y:center.y+Math.sin(a)*radius*depth*edge*.86,r:.8+hash(i*7+33)*2,color:Math.floor(clamp((Math.cos(a)*depth+1)/2)* (48-.001)),bend:(hash(i*7+34)-.5)*radius*.65};
    }
    function prepare(){
      size=sizeCanvas(canvas);endpoints=getPoints();backdrop=endpoints.backdrop;center={x:size.width/2,y:size.height/2};radius=Math.min(360,size.width*.39,size.height*.43);
      dustColors=Array.from({length:48},(_,i)=>{const t=i/47*(colors.length-1),a=colors[Math.floor(t)],b=colors[Math.min(colors.length-1,Math.floor(t)+1)],f=t%1;return '#'+[1,3,5].map(k=>Math.round(mix(parseInt(a.slice(k,k+2),16),parseInt(b.slice(k,k+2),16),f)).toString(16).padStart(2,'0')).join('');});
      hull=document.createElement('canvas');hull.width=size.width;hull.height=size.height;const hc=hull.getContext('2d');hc.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,edge=1+.11*Math.sin(a*3+.4)+.075*Math.cos(a*5-1),x=center.x+Math.cos(a)*radius*edge,y=center.y+Math.sin(a)*radius*edge*.86;if(i)hc.lineTo(x,y);else hc.moveTo(x,y);}hc.closePath();hc.clip();const glow=hc.createLinearGradient(center.x-radius,0,center.x+radius,0);colors.forEach((c,i)=>glow.addColorStop(i/(colors.length-1),c+'58'));hc.fillStyle=glow;hc.fillRect(0,0,size.width,size.height);const shade=hc.createRadialGradient(center.x-radius*.25,center.y-radius*.3,0,center.x,center.y,radius);shade.addColorStop(0,'#ffffff08');shade.addColorStop(.6,'#05111a40');shade.addColorStop(1,'#05111af0');hc.fillStyle=shade;hc.fillRect(0,0,size.width,size.height);
      particles=Array.from({length:4800},(_,i)=>{const p=seed(i);const target=endpoints[i%Math.max(1,endpoints.length)];return{...p,tx:target?.x??center.x,ty:target?.y??center.y,delay:hash(i+399)*.2};});
      dustBuckets=Array.from({length:48},()=>[]);for(const particle of particles)dustBuckets[particle.color].push(particle);
      endpoints=endpoints.map((p,i)=>({...p,origin:seed(i+6000)}));
      button.style.width=button.style.height=`${radius*2.15}px`;Object.assign(canvas.dataset,{motion:'particle-dissolution',surfaceText:'',eventCount:String(endpoints.length),particleCount:String(particles.length),surfaceRadius:String(radius)});dirty=false;
    }
    function paint(progress){
      const started=performance.now(),{ctx,width,height}=size;ctx.clearRect(0,0,width,height);
      if(backdrop){ctx.globalAlpha=ease((progress-.65)/.35);ctx.drawImage(backdrop,0,0,width,height);ctx.globalAlpha=1;}
      ctx.globalAlpha=1-ease(progress/.6);ctx.drawImage(hull,0,0,width,height);ctx.globalAlpha=1;
      const dustAlpha=1-ease((progress-.55)/.4);
      for(let color=0;color<dustColors.length;color++){
        ctx.fillStyle=dustColors[color];ctx.globalAlpha=.58*dustAlpha;ctx.beginPath();
        for(const p of dustBuckets[color]){const t=ease((progress-p.delay)/(1-p.delay)),bend=Math.sin(t*Math.PI)*p.bend,x=mix(p.x,p.tx,t)+bend,y=mix(p.y,p.ty,t)-bend*.42,r=p.r*(1-t*.8);ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2);}
        ctx.fill();
      }
      ctx.globalAlpha=1;
      for(const p of endpoints){const t=ease(progress),bend=Math.sin(t*Math.PI)*p.origin.bend,x=mix(p.origin.x,p.x,t)+bend,y=mix(p.origin.y,p.y,t)-bend*.42;paintPoint(ctx,{...p,radius:mix(p.origin.r,p.radius,t)},x,y,.8+.2*t);}
      Object.assign(canvas.dataset,{progress:progress.toFixed(3),paintMs:(performance.now()-started).toFixed(2)});
    }
    function sync(){
      const b=bounds(),raw=clamp((scrollY-b.start)/(b.end-b.start)),progress=isReading()?1:reduced.matches?(raw<.5?0:1):raw;
      if(!dirty&&progress===last)return;last=progress;
      if(progress>=1){if(!host.hidden){host.hidden=true;scene.dataset.gateway='events';scene.style.setProperty('--gateway-reveal','1');lock(false);}return;}
      host.hidden=false;if(dirty)prepare();lock(true);scene.dataset.gateway=progress?'disintegrating':'sphere';scene.style.setProperty('--gateway-reveal',String(ease((progress-.65)/.35)));button.disabled=progress>.2;paint(progress);
    }
    function enter({behavior='smooth'}={}){window.scrollTo({top:bounds().end+1,behavior:reduced.matches?'instant':behavior});sync();}
    function show({behavior='smooth'}={}){dirty=true;window.scrollTo({top:bounds().top,behavior:reduced.matches?'instant':behavior});sync();}
    button.addEventListener('click',()=>enter());reduced.addEventListener('change',()=>{dirty=true;sync();});sync();return{sync,enter,show,invalidate(){dirty=true;sync();}};
  }
  window.HaruspexArrival={init,atmosphere,mountGateway};
})();
