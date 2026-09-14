import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import './cast-workbench.js';
const data=JSON.parse(readFileSync(new URL('cast-analysis.json',import.meta.url),'utf8'));
const before=JSON.stringify(data);
const collisions=[];
for(const [id] of HaruspexWorkbench.topics){
 const model=HaruspexWorkbench.diagramModel(data,id);
 const pointOnBox=(p,n)=>Math.abs(p[0]-n.x)<=n.w/2+.01&&Math.abs(p[1]-n.y)<=n.h/2+.01&&(Math.abs(Math.abs(p[0]-n.x)-n.w/2)<.01||Math.abs(Math.abs(p[1]-n.y)-n.h/2)<.01);
 for(const e of model.paths){
  assert.notEqual(e.status,'proposed');
  assert(pointOnBox(e.start,model.nodes.find(n=>n.id===e.from)),`${id}/${e.id} source`);
  assert(pointOnBox(e.end,model.nodes.find(n=>n.id===e.to)),`${id}/${e.id} destination`);
  const values=e.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  if(e.d.includes('C')){
   const [x0,y0,x1,y1,x2,y2,x3,y3]=values;
   for(let k=1;k<100;k++){const t=k/100,u=1-t,x=u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3,y=u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3;
    assert(x>=0&&x<=model.width&&y>=0&&y<=model.height,`${id}/${e.id} inside viewport`);
    for(const n of model.nodes.filter(n=>n.id!==e.from&&n.id!==e.to))if(Math.abs(x-n.x)<n.w/2+3&&Math.abs(y-n.y)<n.h/2+3)collisions.push(`${id}/${e.id} hits ${n.id}`);
   }
  }
 }
}
assert.equal(JSON.stringify(data),before,'The view must not change source data');
assert.deepEqual([...new Set(collisions)],[]);
console.log('Ten CAST diagrams: endpoints on boxes, no unrelated-box crossings, no proposed paths presented as historical, source data unchanged.');
