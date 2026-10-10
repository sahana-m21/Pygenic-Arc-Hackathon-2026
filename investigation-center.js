/* PYGENIC ARC integrated CY-01 investigation center. Browser functionality
   is complete offline; optional AI backend is detected on localhost. */
(()=>{
 'use strict';
 const init=()=>{
  const E=window.PygenicEngine,S=window.PygenicSamples;
  if(!E||!S||document.getElementById('arc5investigator'))return;
  const main=document.querySelector('.container'),nav=document.getElementById('arc4nav');
  if(!main||!nav)return;
  const clean=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const css=document.createElement('style');css.textContent=`
  #arc5investigator{position:relative;z-index:5;max-width:1420px;margin:20px auto 40px;padding:22px;color:#dbeefb}
  #arc5investigator[hidden]{display:none!important}
  #arc5investigator h1{font-size:clamp(25px,3vw,37px);color:#9ceeff;margin:4px 0 7px}
  #arc5investigator h2{font-size:19px;color:#7ae5ef;margin:8px 0 12px}
  .arc5-sub{color:#9cbed3;font-size:13px;max-width:980px;line-height:1.65}
  .arc5-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:20px 0}
  .arc5-toolbar select,.arc5-toolbar input{padding:11px;border:1px solid #346680;border-radius:8px;background:#102d46;color:#fff;max-width:100%}
  #arc5investigator button{color:#e2faff;background:#135477;border:1px solid #3f8aa5;border-radius:8px;padding:10px 13px;font-size:13px;cursor:pointer;margin:0}
  #arc5investigator button:hover{background:#176b91}
  .arc5-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
  .arc5-panel{background:#10243c;border:1px solid #295471;border-radius:14px;padding:18px;min-width:0}
  .arc5-panel.wide{grid-column:1/-1}
  .arc5-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:15px 0}
  .arc5-kpis>div{background:#0b1b31;border:1px solid #315471;padding:14px;border-radius:11px}
  .arc5-kpis strong{color:#7ce5f2;font-size:27px;display:block}
  .arc5-kpis span{font-size:11px;color:#a6c6d8}
  .arc5-finding{padding:10px 12px;margin:7px 0;border-left:3px solid #f1a25d;background:#0d1c2d;border-radius:5px}
  .arc5-finding small{display:block;color:#adc6d9;line-height:1.7}
  .arc5-path{overflow:auto;border:1px solid #324d69;background:#071b2c;padding:12px;margin:10px 0;border-radius:8px}
  .arc5-nodes{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:7px}
  .arc5-node{border:1px solid #3284aa;padding:8px 10px;background:#143a56;border-radius:7px;font-size:12px}
  .arc5-arrow{color:#55c5e8;font-size:17px}
  .arc5-note{font-size:12px;color:#d3dfed;line-height:1.65}
  .arc5-warning{color:#ffd9ab}
  .arc5-green{color:#77eac5}
  .arc5-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:9px}
  .arc5-table th,.arc5-table td{text-align:left;padding:9px 8px;border-bottom:1px solid #28455f;vertical-align:top}
  .arc5-actions{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0}
  .arc5-actions label{display:flex;gap:7px;align-items:center;min-width:220px;max-width:100%;flex:1;background:#0b1e32;border:1px solid #2b536e;padding:11px;border-radius:9px;font-size:12px}
  #arc5-log{background:#081827;border-radius:8px;padding:14px;color:#bae5ee;white-space:pre-wrap;line-height:1.65;min-height:60px;font-size:13px}
  #arc5-answer{border-left:3px solid #52d4e9;padding:12px;margin-top:10px;background:#0e2c40;white-space:pre-wrap;line-height:1.5}
  @media(max-width:820px){.arc5-panels{grid-template-columns:1fr}.arc5-panel.wide{grid-column:auto}.arc5-kpis{grid-template-columns:repeat(2,1fr)}}
  `;document.head.appendChild(css);
  let scenario='Company',model=E.validate(S.Company),applied=new Set(),recommended=[];
  const root=document.createElement('section');root.id='arc5investigator';root.hidden=true;
  root.innerHTML=`<div class="arc4-eyebrow">CY-01 · SYNTHETIC CONFIGURATION INVESTIGATION</div>
   <h1>Security Investigation Center</h1>
   <p class="arc5-sub">New: combined employee-to-cloud access graphs, configuration weaknesses, specific blast-radius resources, exact minimum-fix selection on small models, and before/after comparison. The rotating globe and original scenarios remain unchanged. All incidents are fictional.</p>
   <div class="arc5-toolbar">
     <label for="arc5-select">Demo environment</label>
     <select id="arc5-select">${Object.keys(S).map(k=>`<option value="${k}">${k==='Company'?'SecureTech Company':k}</option>`).join('')}</select>
     <button type="button" id="arc5-run">▶ Analyze Configuration</button>
     <button type="button" id="arc5-best">★ Choose Minimum Fixes</button>
     <button type="button" id="arc5-apply">✓ Simulate Selected Fixes</button>
     <button type="button" id="arc5-reset">↺ Reset</button>
     <label style="font-size:12px">Import synthetic JSON <input type="file" id="arc5-upload" accept=".json,application/json"></label>
   </div>
   <p class="arc5-note" id="arc5-message" role="status">Select a scenario or upload a fictional configuration to begin.</p>
   <div class="arc5-kpis" id="arc5-kpis" aria-live="polite"></div>
   <div class="arc5-panels">
     <div class="arc5-panel"><h2>Detected Configuration & Access Weaknesses</h2><div id="arc5-findings"></div></div>
     <div class="arc5-panel"><h2>Precise Blast Radius</h2><div id="arc5-blast"></div></div>
     <div class="arc5-panel wide"><h2>Critical Attack-Path Graph</h2><div id="arc5-paths"></div></div>
     <div class="arc5-panel wide"><h2>Remediation Optimization & What-If Testing</h2><p class="arc5-sub">Tick fixes; see a calculated preview before choosing whether to apply them. Simulations do not touch real permissions.</p><div class="arc5-actions" id="arc5-fixes"></div><div id="arc5-comparison"></div></div>
     <div class="arc5-panel wide"><h2>Autonomous Investigation Workflow</h2><p class="arc5-sub">The local workflow uses deterministic graph tools. When the optional server-side AI model is connected, the model selects approved investigation tools and explains their results in your language.</p><div class="arc5-actions"><button type="button" id="arc5-investigate">⚡ Run Investigation</button><button type="button" id="arc5-report">⬇ Download Investigation Report</button><button type="button" id="arc5-voice">🔊 Ask Voice Guide</button></div><div id="arc5-log" role="status">Ready.</div><div id="arc5-answer" hidden></div></div>
   </div>
   <p class="arc5-note">Lab disclaimer: employee access routes assume an exposed or compromised credential; they are NOT allegations of employee wrongdoing. Scores estimate reachability in synthetic data only. Never upload real credentials or sensitive records.</p>`;
  const report=document.getElementById('arc4reports');(report||main).after(root);
  const $=id=>root.querySelector('#'+id);
  const navBtn=document.createElement('button');navBtn.type='button';navBtn.textContent='Investigator';navBtn.dataset.view='investigator';nav.appendChild(navBtn);
  function close(){root.hidden=true;navBtn.removeAttribute('aria-current')}
  // The original navigation remains the source of truth for its pages.
  document.addEventListener('click',event=>{
   if(event.target.closest('#arc4nav button:not([data-view="investigator"]),#arc4logo,#arc4home button'))close();
  },true);
  navBtn.addEventListener('click',()=>{
   const dash=nav.querySelector('[data-view="dashboard"]');if(dash)dash.click();
   document.getElementById('arc4home')?.setAttribute('hidden','');
   document.getElementById('arc4heading')?.setAttribute('hidden','');
   main.hidden=true;
   if(report)report.hidden=true;
   root.hidden=false;navBtn.setAttribute('aria-current','page');
   nav.querySelectorAll('button').forEach(b=>{if(b!==navBtn)b.removeAttribute('aria-current')});
   window.scrollTo({top:0,behavior:'auto'});render();
  });
  // Original showPage changes main.style.display, not necessarily main.hidden;
  // removing the hidden attribute when returning allows the old screens to work.
  document.addEventListener('click',ev=>{if(ev.target.closest('#arc4nav button:not([data-view="investigator"]),#arc4logo,#arc4home button'))main.hidden=false;},false);
  function analyze(){return E.analyze(model,[...applied])}
  function pathHtml(p,i){return `<div class="arc5-path"><strong>Path ${i+1} · ${p.severity} · ${p.score}/100 (illustrative)</strong> ${p.credentialAssumption?'<span class="arc5-warning">— assumed credential compromise</span>':''}<div class="arc5-nodes">${p.names.map((v,k)=>`${k?'<span class="arc5-arrow">➜</span>':''}<span class="arc5-node">${clean(v)}</span>`).join('')}</div></div>`}
  function render(){
   const a=analyze(),optim=E.optimize(model,[...applied]);
   $('arc5-kpis').innerHTML=`<div><strong>${a.findings.length}</strong><span>ACTIVE WEAKNESSES</span></div><div><strong>${a.pathCount}</strong><span>MODELED CRITICAL PATHS</span></div><div><strong>${a.blastCount}</strong><span>REACHABLE RESOURCES</span></div><div><strong>${a.criticalAssets.length}</strong><span>REACHABLE CRITICAL ASSETS</span></div>`;
   $('arc5-findings').innerHTML=a.findings.length?a.findings.map(f=>`<div class="arc5-finding"><b>${clean(f.severity)}: ${clean(f.label)}</b><small>Resource: ${clean(f.resource)} · Fix: ${clean(f.recommendation)}</small></div>`).join(''):'<div class="arc5-green">No issues match supported audit rules.</div>';
   $('arc5-blast').innerHTML=a.blast.length?`<p class="arc5-sub">${a.blastCount} specific reachable resources:</p><table class="arc5-table"><thead><tr><th>Resource</th><th>Type</th><th>Critical?</th></tr></thead><tbody>${a.blast.map(r=>`<tr><td>${clean(r.name)}</td><td>${clean(r.kind)}</td><td>${r.critical?'<b class="arc5-warning">YES</b>':'No'}</td></tr>`).join('')}</tbody></table>`:'<p class="arc5-green">No non-entry nodes reachable under the current modeled rules.</p>';
   $('arc5-paths').innerHTML=`<p class="arc5-sub">Entry points: ${clean(a.entries.join(', '))}. ${a.pathLimitReached?'Maximum path display count reached.':''}</p>${a.paths.length?a.paths.map(pathHtml).join(''):'<p class="arc5-green">No critical path remains in this synthetic graph. This is not a guarantee of safety.</p>'}`;
   const ids=new Set(a.allFixes.map(f=>f.id));recommended=recommended.filter(id=>ids.has(id)&&!applied.has(id));
   $('arc5-fixes').innerHTML=a.findings.map(f=>`<label><input type="checkbox" class="arc5-fix" value="${clean(f.id)}" ${recommended.includes(f.id)?'checked':''}><span>${clean(f.recommendation)} ${f.breaksPath?'(graph break)':'(defense in depth)'}</span></label>`).join('')||'<span class="arc5-green">No remaining modeled weaknesses to fix.</span>';
   compare();
  }
  function selected(){return [...root.querySelectorAll('.arc5-fix:checked')].map(x=>x.value)}
  function compare(){const selectedFixes=selected(),before=analyze(),preview=E.analyze(model,[...applied,...selectedFixes]);
   $('arc5-comparison').innerHTML=`<table class="arc5-table"><thead><tr><th>Measure</th><th>Before</th><th>After selected fixes</th></tr></thead><tbody><tr><td>Critical attack paths</td><td>${before.pathCount}</td><td>${preview.pathCount}</td></tr><tr><td>Reachable resources</td><td>${before.blastCount}</td><td>${preview.blastCount}</td></tr><tr><td>Critical assets reachable</td><td>${before.criticalAssets.length}</td><td>${preview.criticalAssets.length}</td></tr><tr><td>Active weaknesses</td><td>${before.findings.length}</td><td>${preview.findings.length}</td></tr></tbody></table><p class="arc5-note">Blocked paths: <strong>${before.pathCount-preview.pathCount}</strong>. For this model, the optimizer recommends ${E.optimize(model,[...applied]).fixes.length} fix(es).</p>`;
  }
  function status(t){$('arc5-message').textContent=t}
  $('arc5-select').addEventListener('change',e=>{scenario=e.target.value;model=E.validate(S[scenario]);applied.clear();recommended=[];status('Loaded '+scenario+' example. Changes are simulated.');render()});
  $('arc5-run').addEventListener('click',()=>{render();status('Graph, findings and blast radius recalculated from current synthetic configuration.')});
  $('arc5-best').addEventListener('click',()=>{const result=E.optimize(model,[...applied]);recommended=result.fixes;render();status(result.summary+' Predicted paths blocked: '+result.blocked+'.');});
  $('arc5-apply').addEventListener('click',()=>{const choices=selected();if(!choices.length){status('Tick a fix or use Choose Minimum Fixes first.');return;}const before=analyze();choices.forEach(x=>applied.add(x));recommended=[];const after=analyze();render();status(`Applied ${choices.length} fictional fix(es). Critical paths: ${before.pathCount} → ${after.pathCount}.`)});
  $('arc5-reset').addEventListener('click',()=>{applied.clear();recommended=[];render();status('Restored original synthetic configuration.')});
  $('arc5-fixes').addEventListener('change',compare);
  $('arc5-upload').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>100000)throw Error('Maximum file size: 100 KB.');const m=E.validate(JSON.parse(await file.text()));model=m;scenario='Custom';$('arc5-select').selectedIndex=-1;applied.clear();recommended=[];render();status('Custom synthetic JSON validated and loaded. No real cloud access.');}catch(err){status('File not accepted: '+err.message);}finally{e.target.value='';}});
  function reportText(){const res=E.investigate(model,[...applied]);return `PYGENIC ARC — CY-01 INTEGRATED SECURITY INVESTIGATION\n\nScenario: ${model.company}\nThis is synthetic reachability analysis, not a real scan.\nEmployee paths assume compromised credentials.\n\nWEAKNESSES (${res.before.findings.length}):\n${res.before.findings.map(f=>`${f.severity} ${f.label} | ${f.recommendation}`).join('\n')}\n\nATTACK PATHS (${res.before.pathCount}):\n${res.before.paths.map(p=>`${p.severity} ${p.score}/100 ${p.names.join(' -> ')}`).join('\n')}\n\nBLAST RADIUS (${res.before.blastCount}):\n${res.before.blast.map(r=>`${r.name} ${r.critical?'[CRITICAL]':''}`).join('\n')}\n\nRECOMMENDED FIXES (${res.recommendation.fixes.length}):\n${res.recommendation.fixes.join('\n')}\n\nBEFORE / AFTER\nPaths: ${res.before.pathCount} -> ${res.after.pathCount}\nReachable resources: ${res.before.blastCount} -> ${res.after.blastCount}\nOptimizer: ${res.recommendation.summary}\n\nNo real systems accessed, scanned, or changed.`}
  $('arc5-report').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pygenic-arc-investigation.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500)});
  async function run(){const view=$('arc5-log'),answer=$('arc5-answer');view.textContent='Running permitted graph-analysis tools…';answer.hidden=true;
   const results=E.investigate(model,[...applied]);view.textContent=results.steps.map((s,i)=>`${i+1}. ✓ ${s}`).join('\n')+`\n\nPaths: ${results.before.pathCount} → ${results.after.pathCount}\nBlast radius: ${results.before.blastCount} → ${results.after.blastCount}\nMinimum fixes: ${results.recommendation.fixes.join(', ')||'none'}`;
   let label='LOCAL DETERMINISTIC WORKFLOW · no real AI model';let text=`${model.company}: ${results.before.pathCount} critical routes and ${results.before.blastCount} reachable resources were identified. ${results.recommendation.fixes.length} modeled changes could reduce the routes to ${results.after.pathCount}. This does not prove a real exploit.`;
   if(location.protocol!=='file:')try{const r=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,fixes:[...applied],question:'Investigate the vulnerabilities, explain the most effective fixes and the before/after impact in simple terms.',language:document.getElementById('pvoice-lang')?.value||'en'}),signal:AbortSignal.timeout(45000)});if(r.ok){const d=await r.json();text=d.answer;label=d.mode==='model-agent'?'REAL MODEL-COORDINATED INVESTIGATION':'DETERMINISTIC BACKEND · AI NOT CONNECTED';}}catch{}
   answer.hidden=false;answer.textContent=label+'\n\n'+text;
  }
  $('arc5-investigate').addEventListener('click',run);
  $('arc5-voice').addEventListener('click',()=>document.getElementById('pvoice-launch')?.click());
  window.PygenicInvestigator={getContext:()=>({scenario,model,fixes:[...applied],report:analyze()})};
  render();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
