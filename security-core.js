/* PYGENIC ARC: synthetic cloud-configuration graph analysis.
   Used by both the browser and Node server. No real cloud API access. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PygenicEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const validKinds=new Set(['entry','service','storage','database','asset','iam_role','project','employee']);
 const MAX_NODES=60,MAX_EDGES=160,MAX_EMPLOYEES=40;
 function fail(s){throw new Error(s)}
 const clone=o=>JSON.parse(JSON.stringify(o));
 function validate(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('Configuration must be a JSON object.');
  if(typeof raw.company!=='string'||!raw.company.trim()||raw.company.length>100)fail('company must be a nonempty label (max 100).');
  if(!Array.isArray(raw.resources)||raw.resources.length<2||raw.resources.length>MAX_NODES)fail('resources must contain 2–60 items.');
  if(!Array.isArray(raw.connections)||raw.connections.length>MAX_EDGES)fail('connections must contain no more than 160 links.');
  if(!Array.isArray(raw.employees||[])||(raw.employees||[]).length>MAX_EMPLOYEES)fail('employees must be an array of at most 40 people.');
  const ids=new Set();
  for(const r of raw.resources){
   if(!r||typeof r!=='object'||typeof r.id!=='string'||!/^[A-Za-z0-9_-]{1,40}$/.test(r.id)||ids.has(r.id)||typeof r.name!=='string'||!r.name.trim()||r.name.length>90||!validKinds.has(r.kind))fail('Invalid, repeated, or unknown resource ID/name/kind.');
   ids.add(r.id);
   for(const key of ['publicAccess','requiresAuth','encryptionAtRest','auditLogging','critical','mfaEnabled'])if(r[key]!==undefined&&typeof r[key]!=='boolean')fail('Invalid boolean setting: '+r.id+'.'+key);
   if(r.exposure!==undefined&&!['public','private'].includes(r.exposure))fail('Invalid exposure for '+r.id);
   if(r.impact!==undefined&&(!Number.isInteger(r.impact)||r.impact<1||r.impact>10))fail('Asset impact must be 1–10.');
   if(r.permissions!==undefined&&(!Array.isArray(r.permissions)||r.permissions.length>30||r.permissions.some(x=>typeof x!=='string'||x.length>80)))fail('Invalid permissions for '+r.id);
  }
  for(const e of raw.connections){
   if(!e||!ids.has(e.from)||!ids.has(e.to))fail('Connection references missing resource.');
   if(e.project!==undefined&&(typeof e.project!=='string'||e.project.length>40))fail('Invalid connection project.');
  }
  const names=new Set();
  for(const emp of raw.employees||[]){
   if(!emp||typeof emp.name!=='string'||!/^[A-Za-z0-9 _-]{1,40}$/.test(emp.name)||names.has(emp.name)||!Array.isArray(emp.assigned)||!Array.isArray(emp.access)||[...emp.assigned,...emp.access].some(p=>typeof p!=='string'||p.length>40))fail('Employee name, assigned and access must be valid.');
   names.add(emp.name);
  }
  if(!raw.resources.some(r=>r.kind==='entry'||r.kind==='employee')||!raw.resources.some(r=>r.critical===true))fail('Model needs an entry or employee and at least one critical asset.');
  return clone(raw);
 }
 function findings(model){const out=[];
  for(const r of model.resources){
   const add=(code,label,severity,recommendation,breaksPath)=>out.push({id:`${r.id}:${code}`,resource:r.id,label,severity,recommendation,breaksPath});
   if(r.publicAccess===true&&['storage','database','asset'].includes(r.kind))add('public','Public access to stored data',r.critical?'CRITICAL':'HIGH','Disable public access',true);
   if(r.kind==='service'&&r.exposure==='public'&&r.requiresAuth===false)add('noauth','Public endpoint without authentication','HIGH','Require authentication',true);
   if(r.kind==='iam_role'&&Array.isArray(r.permissions)&&r.permissions.some(p=>p==='*'||p.endsWith(':*')))add('wildcard','Wildcard IAM permission','HIGH','Apply least-privilege role permissions',true);
   if(['storage','database','asset'].includes(r.kind)&&r.encryptionAtRest===false)add('unencrypted','Encryption at rest disabled','MEDIUM','Enable encryption at rest',false);
   if(r.auditLogging===false)add('nologs','Audit logging disabled','MEDIUM','Enable audit logging',false);
   if(r.kind==='iam_role'&&r.mfaEnabled===false)add('nomfa','MFA missing for role','MEDIUM','Enable MFA',false);
  }
  for(const emp of model.employees||[]){for(const project of emp.access){if(!emp.assigned.includes(project))out.push({id:`employee:${emp.name}:${project}`,resource:`emp_${emp.name.replace(/[^A-Za-z0-9_-]/g,'_')}`,label:`${emp.name} has unnecessary Project ${project} access`,severity:'HIGH',recommendation:`Revoke ${emp.name}'s Project ${project} access`,breaksPath:true});}}
  return out;
 }
 function analyze(input,fixIds=[]){
  const model=validate(input), applied=new Set(fixIds), nodes=Object.fromEntries(model.resources.map(x=>[x.id,x])), employees=Object.fromEntries((model.employees||[]).map(e=>[e.name,e]));
  const allFindings=findings(model), inactive=allFindings.filter(f=>applied.has(f.id));
  function linkAllowed(edge){
   const a=nodes[edge.from],b=nodes[edge.to];
   if(a.kind==='employee'&&b.kind==='project'){
    const emp=employees[a.employeeName||a.name];const proj=edge.project||b.project;
    if(!emp||!emp.access.includes(proj))return false;
    if(applied.has(`employee:${emp.name}:${proj}`)&&!emp.assigned.includes(proj))return false;
   }
   if(a.kind==='entry'&&['storage','asset','database'].includes(b.kind))return b.publicAccess===true&&!applied.has(`${b.id}:public`);
   if(a.kind==='entry'&&b.kind==='service')return b.exposure==='public'&&b.requiresAuth===false&&!applied.has(`${b.id}:noauth`);
   if(a.kind==='iam_role'&&b.critical){
    const perm=a.permissions||[];
    const explicit=perm.some(p=>p===`${b.id}:read`||p===`${b.id}:write`);
    const wildcard=perm.some(p=>p==='*'||p.endsWith(':*'))&&!applied.has(`${a.id}:wildcard`);
    return explicit||wildcard;
   }
   return true;
  }
  const adj={};for(const id of Object.keys(nodes))adj[id]=[];
  for(const edge of model.connections){if(linkAllowed(edge))adj[edge.from].push(edge.to);}
  const entries=model.resources.filter(r=>r.kind==='entry'||r.kind==='employee').map(r=>r.id);
  const reachable=new Set(entries), queue=[...entries];
  while(queue.length){const u=queue.shift();for(const v of adj[u]||[]){if(!reachable.has(v)){reachable.add(v);queue.push(v);}}}
  const paths=[],MAX_PATHS=120;
  function dfs(current,visited,path){
   if(paths.length>=MAX_PATHS)return;
   if(nodes[current].critical){paths.push([...path]);return;}
   for(const next of adj[current]||[]){if(visited.has(next))continue;visited.add(next);path.push(next);dfs(next,visited,path);path.pop();visited.delete(next);}
  }
  for(const id of entries)dfs(id,new Set([id]),[id]);
  function score(path){const critical=nodes[path[path.length-1]];const impact=critical.impact||8;const weak=allFindings.filter(f=>!applied.has(f.id)&&f.breaksPath&&path.includes(f.resource)).length;return Math.min(100,Math.round(impact*6+Math.min(weak,3)*9+Math.min(path.length,7)*2));}
  const scored=paths.map(p=>({ids:p,names:p.map(id=>nodes[id].name),score:score(p),severity:score(p)>=80?'HIGH':score(p)>=60?'MEDIUM':'LOW',credentialAssumption:nodes[p[0]].kind==='employee'})).sort((a,b)=>b.score-a.score);
  const blast=[...reachable].filter(id=>!entries.includes(id)).map(id=>({id,name:nodes[id].name,kind:nodes[id].kind,critical:!!nodes[id].critical}));
  return {company:model.company,resources:model.resources.length,entries:entries.map(id=>nodes[id].name),findings:allFindings.filter(f=>!applied.has(f.id)),resolvedFindings:inactive,paths:scored,pathCount:paths.length,pathLimitReached:paths.length>=MAX_PATHS,blast,blastCount:blast.length,criticalAssets:blast.filter(r=>r.critical),allFixes:allFindings,applied:[...applied]};
 }
 function optimize(model,already=[]){
  const base=analyze(model,already),todo=base.allFixes.filter(f=>f.breaksPath&&!already.includes(f.id));
  let picked=[],exact=true;
  if(todo.length<=12){
   let best=null;
   for(let mask=0;mask<(1<<todo.length);mask++){
    const candidate=todo.filter((_,j)=>mask&(1<<j)).map(x=>x.id);
    if(best&&candidate.length>=best.length)continue;
    if(analyze(model,[...already,...candidate]).pathCount===0)best=candidate;
   }
   if(best)picked=best;
   else exact=false;
  }else exact=false;
  if(!exact){let chosen=[...already],remaining=base.pathCount;
   for(let rounds=0;rounds<todo.length&&remaining>0;rounds++){
    let best=null,max=0;
    for(const f of todo){if(chosen.includes(f.id))continue;const n=analyze(model,[...chosen,f.id]).pathCount;const gain=remaining-n;if(gain>max){max=gain;best=f.id;}}
    if(!best)break;
    chosen.push(best);picked.push(best);remaining=analyze(model,chosen).pathCount;
   }
  }
  const after=analyze(model,[...already,...picked]);
  return {fixes:picked,exact,blocked:base.pathCount-after.pathCount,remaining:after.pathCount,summary:exact?'Minimum-number of path-breaking fixes in this small synthetic graph.':'Heuristic selection; not guaranteed minimum.'};
 }
 function investigate(model,already=[]){const before=analyze(model,already);const recommendation=optimize(model,already);const after=analyze(model,[...already,...recommendation.fixes]);return {before,recommendation,after,steps:['Configuration validated','Permission and misconfiguration checks complete','DFS paths and BFS blast radius calculated','Candidate fixes evaluated by graph recomputation','Before/after comparison prepared']};}
 return {validate,findings,analyze,optimize,investigate};
});
