// Replay smooth hand movements, including the slowdown at each reversal.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/personal.js'), 'utf8');
const detector = source.slice(source.indexOf('  function trackShake('), source.indexOf("  window.addEventListener('resize', positionPortrait)"));
function replay(amplitude, period, hz, seconds = 3, vertical = false) {
  const context = vm.createContext({ Math });
  vm.runInContext('let portrait=null,shakeMotion=null,reveals=0;function dropPortrait(){portrait={};reveals++;}' + detector + 'shakeMotion=newMotion(0,0,0);', context);
  for (let t = 1000/hz; t <= seconds*1000; t += 1000/hz) {
    const position = amplitude*Math.sin(2*Math.PI*t/period);
    vm.runInContext(`trackShake(${vertical?0:position},${vertical?position:0},${t})`, context);
  }
  return vm.runInContext('reveals', context);
}
for (const hz of [30, 60, 120]) {
  assert.equal(replay(70, 360, hz), 1, `Smooth vigorous shake at ${hz} Hz`);
  assert.equal(replay(55, 340, hz, 3, true), 1, `Vertical shake at ${hz} Hz`);
  assert.equal(replay(70, 4000, hz, 12), 0, `Slow motion at ${hz} Hz`);
  assert.equal(replay(5, 100, hz), 0, `Small jitter at ${hz} Hz`);
  assert.equal(replay(0, 100, hz), 0, `Stationary taps at ${hz} Hz`);
}
console.log('Passed: natural horizontal/vertical shaking reveals once; slow movements, jitter, and taps do not (30/60/120 Hz).');

// Exercise the actual root-SVG pointer handlers, starting between the hanging pieces.
const pointerCode=source.slice(source.indexOf('  function beginShake('),source.indexOf('  function stir()'));
const pointerContext=vm.createContext({Math});
vm.runInContext(`
let portrait=null,shakeMotion=null,reveals=0,dragging=null,shed=false,clock=0,prevented=0,captured=null,cleared=0;
const tree={x:0,y:0,vx:0,vy:0},listeners={},classes=new Set();
const mobile={addEventListener:(type,handler)=>listeners[type]=handler,setPointerCapture:id=>captured=id};
const document={body:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}}};
const window={getSelection:()=>({removeAllRanges:()=>cleared++})};
const performance={now:()=>clock};
const point=e=>({x:e.clientX,y:e.clientY});
const clamp=v=>Math.max(-48,Math.min(48,v));
function draw(){} function animate(){} function stir(){}
function dropPortrait(){portrait={};reveals++;}
${detector}
${pointerCode}
function send(type,x,y,time){clock=time;listeners[type]({type,button:0,pointerId:7,clientX:x,clientY:y,preventDefault:()=>prevented++});}
send('pointerdown',0,0,0);
`,pointerContext);
for(let t=16;t<=1600;t+=16) vm.runInContext(`send('pointermove',${70*Math.sin(2*Math.PI*t/360)},0,${t});`,pointerContext);
vm.runInContext("send('pointerup',0,0,1616)",pointerContext);
assert.equal(vm.runInContext('reveals',pointerContext),1,'Root-SVG dragging reveals the portrait');
assert.equal(vm.runInContext('captured',pointerContext),7,'SVG keeps the pointer captured');
assert.equal(vm.runInContext('cleared',pointerContext),1,'Dragging clears text selection');
assert.equal(vm.runInContext("classes.has('shaking-mobile')",pointerContext),false,'Selection lock is released');
assert(fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').includes('class="mobile-hit-area"'),'The SVG includes an area for dragging between pieces');
console.log('Passed: whole-mobile pointer capture, portrait reveal, and selection cleanup.');
