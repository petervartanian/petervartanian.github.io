const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/js/personal.js'),'utf8');
const code=source.slice(source.indexOf('  function draw()'),source.indexOf("  document.addEventListener('visibilitychange'"));
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const geometry=[...html.matchAll(/class="mobile-piece"[^>]*data-home="([^"]+)"[^>]*data-mount="([^"]+)"[^>]*data-attachment="([^"]+)"/g)].map(m=>({home:m[1].split(',').map(Number),mount:m[2].split(',').map(Number),attachment:m[3].split(',').map(Number)}));
assert.equal(geometry.length,15,'Use the actual fifteen pieces for suspension checks');
function setup(reduced=false,actual=false){
 const c=vm.createContext({Math});
 vm.runInContext(`
 let shed=false,portrait=null,dragging=null,frame=null,previousTime=0,activeDuration=0,lastInteraction=null,clock=0,reveals=0;
 const listeners={},classes=new Set(),transforms=[];
 const geometry=${JSON.stringify(geometry)};
 const pieces=(${actual}?geometry:Array.from({length:3},(_,i)=>({home:[i*40,50],mount:[i*40,0],attachment:[0,0]}))).map(p=>({...p,x:0,y:0,vx:0,vy:0,wire:{setAttribute(){}},element:{dataset:{name:'piece'},setAttribute(k,v){if(k==='transform') transforms.push(v);},addEventListener(){}}}));
 const mobile={addEventListener:(k,f)=>listeners[k]=f,setPointerCapture(){},setAttribute(){throw Error('Frame must not move');}};
 const document={hidden:false,body:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}}};
 const window={getSelection:()=>({removeAllRanges(){}})},performance={now:()=>clock};
 const reducedMotion={matches:${reduced}};
 function requestAnimationFrame(){return 1;} function dropPortrait(){reveals++;portrait={};shed=true;}
 ${code}
 function send(type,x=0){listeners[type]({type,button:0,pointerId:1,clientX:x,clientY:0,preventDefault(){}});}
 function tap(){send('pointerdown');send('pointerup');}
 `,c);return c;
}
function run(mode,reduced=false){
 const c=setup(reduced);let early=0,late=0;
 for(let t=0;t<=5400;t+=20){
  vm.runInContext(`clock=${t}`,c);
  if(mode==='click' && t%400===0) vm.runInContext('tap()',c);
  if(mode==='drag'){
   if(t===0) vm.runInContext("send('pointerdown')",c);
   if(t%400===0)vm.runInContext(`send('pointermove',${t%800===0?40:-40})`,c);
  }
  if(!reduced)vm.runInContext(`if(!shed)settle(${t})`,c);
  const magnitude=vm.runInContext('Math.max(...pieces.map(p=>Math.abs(p.x)))',c);
  if(t<1000)early=Math.max(early,magnitude);
  if(t>3500&&t<4800)late=Math.max(late,magnitude);
  if(t<5000)assert.equal(vm.runInContext('reveals',c),0,'No early reveal');
 }
 assert.equal(vm.runInContext('reveals',c),1,'Five seconds of activity releases once');
 if(!reduced)assert(late>early*2,'Motion builds progressively');
 return vm.runInContext('JSON.stringify(pieces.map(p=>[p.x,p.y]))',c);
}
assert.equal(run('click'),run('drag'),'Clicks and shaking produce the identical leaf motion');
run('click',true);
const paused=setup();
vm.runInContext('tap();clock=400;tap();clock=2000;tap();',paused);
assert.equal(vm.runInContext('activeDuration',paused),0,'Pauses reset buildup');
vm.runInContext("clock=8000;send('pointerdown');clock=14000;send('pointerup');",paused);
assert.equal(vm.runInContext('reveals',paused),0,'Holding still does not count as shaking');
assert(!source.includes("assembly.setAttribute('transform'"),'Frame is never transformed');
console.log('Passed: fixed frame, identical click/drag leaf motion, progressive five-second buildup, pause reset, reduced motion, and no reveal from holding still.');
const settling=setup();
for(let t=0;t<=2400;t+=20)vm.runInContext(`clock=${t};if(clock%400===0)tap();settle(clock);`,settling);
const motion=[];
for(let t=2420;t<=6400;t+=20){
 vm.runInContext(`clock=${t};settle(clock);`,settling);
 if(t>=3000&&t<=3500)motion.push(vm.runInContext('Math.max(...pieces.map(p=>Math.abs(p.x)))',settling));
}
assert(Math.max(...motion)>2,'Pieces continue a visible settling swing after interaction stops');
assert(vm.runInContext('Math.max(...pieces.map(p=>Math.abs(p.x)))',settling)<.1,'The swing settles instead of crawling indefinitely');
console.log('Passed: motion settles smoothly and comes to rest.');
const strings=setup(false,true);
vm.runInContext('settle(0)',strings);
assert(vm.runInContext('pieces.every(p=>Math.hypot(p.x,p.y)<1e-8)',strings),'Starting animation must not move any resting piece, including short strings');
for(let t=0;t<=4000;t+=20){
 vm.runInContext(`clock=${t};if(clock%400===0)tap();settle(clock);`,strings);
 const errors=vm.runInContext(`pieces.map(p=>{const a=(p.angle||0)*Math.PI/180;const x=p.home[0]+p.x+p.attachment[0]*Math.cos(a)-p.attachment[1]*Math.sin(a)-p.mount[0];const y=p.home[1]+p.y+p.attachment[0]*Math.sin(a)+p.attachment[1]*Math.cos(a)-p.mount[1];const original=Math.hypot(p.home[0]+p.attachment[0]-p.mount[0],p.home[1]+p.attachment[1]-p.mount[1]);return Math.abs(Math.hypot(x,y)-original);})`,strings);
 assert(errors.every(e=>e<1e-6),'Suspension lengths remain fixed during motion');
}
console.log('Passed: no first-frame jump; all fifteen real suspension lengths stay fixed.');
const response=setup();
vm.runInContext('tap()',response);
let turned=false,maxTravel=0;
for(let t=0;t<=500;t+=20){
 vm.runInContext(`clock=${t};settle(clock);`,response);
 maxTravel=Math.max(maxTravel,vm.runInContext('Math.abs(pieces[1].x)',response));
 if(t>100&&vm.runInContext('pieces[1].omega<0',response))turned=true;
}
assert(maxTravel>3&&turned,'One tap produces a visible swing and turnaround within half a second');
console.log('Passed: immediate response with a brisk, continuous swing.');
