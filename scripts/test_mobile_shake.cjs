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
