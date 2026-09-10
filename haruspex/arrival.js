/* One incident opens through rounded cell divisions into its plotted events. */
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
    let size,tree,backdrop,dirty=true,last=-1,locked=false,maxDepth=1;
    function bounds(){const top=scene.parentElement.getBoundingClientRect().top+scrollY,h=scene.getBoundingClientRect().height;return{top,start:top+h*.12,end:top+h*1.15};}
    function lock(value){if(value===locked)return;locked=value;if(value){for(const child of scene.children){if(child===host)continue;inertStates.set(child,child.inert);child.inert=true;}}else{for(const[child,v]of inertStates)child.inert=v;inertStates.clear();}}
    function prepare(){
      size=sizeCanvas(canvas);const endpoints=getPoints();backdrop=endpoints.backdrop;
      const radius=Math.min(390,size.width*.42,size.height*.43),center={x:size.width/2,y:size.height/2};
      maxDepth=Math.max(1,Math.ceil(Math.log2(Math.max(1,endpoints.length))));
      function node(items,depth,virtual,r){
        const mean=items.length?{x:items.reduce((s,p)=>s+p.x,0)/items.length,y:items.reduce((s,p)=>s+p.y,0)/items.length}:center;
        const t=Math.pow(depth/maxDepth,1.35),position={x:mix(virtual.x,mean.x,t),y:mix(virtual.y,mean.y,t)};
        if(items.length<=1)return{...position,r:depth===0?r:items[0]?.radius||1.5,depth,point:items[0]};
        const horizontal=depth%2===0,sorted=[...items].sort((a,b)=>horizontal?a.x-b.x:a.y-b.y),half=Math.ceil(sorted.length/2);
        const children=[sorted.slice(0,half),sorted.slice(half)].filter(x=>x.length).map((group,i)=>node(group,depth+1,{x:virtual.x+Math.cos(depth*2.399+.3+hash(items.length+depth*19)*.6)*(i?1:-1)*r*.62,y:virtual.y+Math.sin(depth*2.399+.3+hash(items.length+depth*19)*.6)*(i?1:-1)*r*.62},r*.64));
        return{...position,r,depth,children};
      }
      tree=node(endpoints,0,center,radius);button.style.width=button.style.height=`${radius*2.05}px`;canvas.dataset.motion='cell-division';canvas.dataset.surfaceText='';canvas.dataset.eventCount=String(endpoints.length);canvas.dataset.surfaceRadius=String(radius);dirty=false;
    }
    function paintSurface(ctx,x,y,r,alpha=1){
      if(r<=0||alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();ctx.fillStyle=colors[0];ctx.fillRect(x-r,y-r,r*2,r*2);for(let i=1;i<colors.length;i++){const angle=i/colors.length*Math.PI*2-.7,cx=x+Math.cos(angle)*r*.64,cy=y+Math.sin(angle)*r*.64,g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.42);g.addColorStop(0,colors[i]);g.addColorStop(1,colors[i]+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      const shade=ctx.createRadialGradient(x-r*.28,y-r*.35,0,x+r*.12,y+r*.25,r*1.3);shade.addColorStop(0,'#effaff25');shade.addColorStop(.5,'#09121c08');shade.addColorStop(1,'#06101bbb');ctx.fillStyle=shade;ctx.fill();ctx.restore();
    }
    let cellTexture=null;
    function surface(ctx,x,y,r,alpha=1){
      if(r<=0||alpha<=0)return;
      if(!cellTexture){cellTexture=document.createElement('canvas');cellTexture.width=cellTexture.height=768;paintSurface(cellTexture.getContext('2d'),384,384,383);}
      ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(cellTexture,x-r,y-r,r*2,r*2);ctx.restore();
    }
    function paint(progress){
      const{ctx,width,height}=size;ctx.clearRect(0,0,width,height);
      if(backdrop){ctx.globalAlpha=ease((progress-.6)/.4);ctx.drawImage(backdrop,0,0,width,height);ctx.globalAlpha=1;}
      let cells=0;
      function draw(n){
        const t=ease(progress*(maxDepth+1)-n.depth);
        if(!n.children){
          const finish=ease((progress-.84)/.16),single=n.depth===0,px=single&&n.point?mix(n.x,n.point.x,ease(progress)):n.x,py=single&&n.point?mix(n.y,n.point.y,ease(progress)):n.y,pr=single?mix(n.r,n.point?.radius||0,ease(progress)):mix(Math.max(n.r,3),n.r,finish);surface(ctx,px,py,pr,1-finish);if(n.point)paintPoint(ctx,n.point,px,py,finish);cells++;return;
        }
        if(t>=1){n.children.forEach(draw);return;}
        if(t<=0){surface(ctx,n.x,n.y,n.r);cells++;return;}
        const daughters=n.children.map(c=>({x:mix(n.x,c.x,t),y:mix(n.y,c.y,t),r:mix(n.r,c.r,t)}));
        if(daughters.length===2){
          const[a,b]=daughters,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,neck=Math.min(a.r,b.r)*Math.pow(1-t,1.4)*.55;
          if(d>1&&neck>.5){ctx.fillStyle=colors[n.depth%colors.length];ctx.beginPath();ctx.moveTo(a.x+nx*neck,a.y+ny*neck);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2,b.x+nx*neck,b.y+ny*neck);ctx.lineTo(b.x-nx*neck,b.y-ny*neck);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2,a.x-nx*neck,a.y-ny*neck);ctx.closePath();ctx.fill();}
        }
        daughters.forEach(c=>surface(ctx,c.x,c.y,c.r));cells+=daughters.length;
      }
      draw(tree);canvas.dataset.cells=String(cells);canvas.dataset.progress=progress.toFixed(3);
    }
    function sync(){
      const b=bounds(),raw=clamp((scrollY-b.start)/(b.end-b.start));const progress=isReading()?1:reduced.matches?(raw<.5?0:1):raw;
      if(!dirty&&progress===last)return;last=progress;
      if(progress>=1){host.hidden=true;scene.dataset.gateway='events';scene.style.setProperty('--gateway-reveal','1');lock(false);dirty=true;return;}
      host.hidden=false;if(dirty)prepare();lock(true);scene.dataset.gateway=progress?'disintegrating':'sphere';scene.style.setProperty('--gateway-reveal',String(ease((progress-.7)/.3)));button.disabled=progress>.2;paint(progress);
    }
    function enter({behavior='smooth'}={}){window.scrollTo({top:bounds().end+1,behavior:reduced.matches?'instant':behavior});sync();}
    function show({behavior='smooth'}={}){dirty=true;window.scrollTo({top:bounds().top,behavior:reduced.matches?'instant':behavior});sync();}
    button.addEventListener('click',()=>enter());reduced.addEventListener('change',()=>{dirty=true;sync();});sync();return{sync,enter,show,invalidate(){dirty=true;sync();}};
  }
  window.HaruspexArrival={init,atmosphere,mountGateway};
})();
