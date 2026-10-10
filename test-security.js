'use strict';
const assert=require('node:assert/strict');
const engine=require('./security-core.js');
const samples=require('./security-samples.js');
for(const [name,model]of Object.entries(samples)){
 const first=engine.analyze(model);const fixes=engine.optimize(model);const last=engine.analyze(model,fixes.fixes);
 assert(first.pathCount>=2,`Expected multiple attack paths for ${name}`);
 assert(first.findings.length>0,`Expected findings for ${name}`);
 assert.equal(last.pathCount,0,`Optimized fixes should block all critical paths in ${name}`);
 assert(last.blastCount<=first.blastCount,`Blast radius increased after fixes for ${name}`);
 assert(last.findings.length<first.findings.length,`Findings did not decrease for ${name}`);
 // Each documented extra-permission revocation must remove that entry route.
 const employeeFix=first.allFixes.find(f=>f.id==='employee:Darshan:B');
 assert(employeeFix,`Expected employee permission finding for ${name}`);
 const afterEmployee=engine.analyze(model,[employeeFix.id]);
 assert(afterEmployee.pathCount<first.pathCount,`Revocation did not remove an employee path for ${name}`);
 console.log('PASS',name, 'paths',first.pathCount,'->',last.pathCount,'blast radius',first.blastCount,'->',last.blastCount);
}
let invalid={...samples.Company,connections:[{from:'missing',to:'customers'}]};
assert.throws(()=>engine.validate(invalid),/Connection/);
console.log('PASS invalid input rejected');
