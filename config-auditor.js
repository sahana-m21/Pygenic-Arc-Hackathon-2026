/*
  PYGENIC ARC — CY-01 Automatic Cloud Configuration Auditor (Feature 1)
  Runs exclusively in the browser on synthetic JSON. Never contacts cloud APIs.
  Data format: {company,resources:[{id,name,kind,...}],connections:[{from,to}]}.
  A connection means a POSSIBLE modeled access relationship, not a confirmed exploit.
*/
(() => {
  'use strict';
  const init = () => {
    const host = document.querySelector('.container .card #scenarioResults')?.parentElement;
    if (!host || document.getElementById('arcConfigAuditor')) return;
    const LIMIT = 80000;
    const sample = {
      company: 'MedVista Hospital (synthetic demo)',
      resources: [
        {id:'internet', name:'Internet', kind:'entry'},
        {id:'portal', name:'Public Patient Portal', kind:'service', exposure:'public', requiresAuth:false, auditLogging:true},
        {id:'storage', name:'Patient Report Storage', kind:'storage', publicAccess:true, encryptionAtRest:false, auditLogging:false},
        {id:'role', name:'Medical Upload IAM Role', kind:'iam_role', permissions:['*'], mfaEnabled:false},
        {id:'records', name:'Patient Records Database', kind:'asset', critical:true, impact:10, publicAccess:false, encryptionAtRest:true, auditLogging:true}
      ],
      connections: [
        {from:'internet',to:'storage'},
        {from:'storage',to:'records'},
        {from:'internet',to:'portal'},
        {from:'portal',to:'role'},
        {from:'role',to:'records'}
      ]
    };
    let model = clone(sample), fixes = new Set();
    const escape = (v) => String(v).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function clone(o) {return JSON.parse(JSON.stringify(o));}
    const panel = document.createElement('section');
    panel.id = 'arcConfigAuditor';
    panel.style.cssText = 'background:#091b30;border:1px solid #376584;border-radius:13px;margin-top:23px;padding:22px;color:#d9efff';
    panel.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px">
        <div><div style="font-size:11px;letter-spacing:2px;color:#77d9ec">CY-01 · RULE-BASED CONFIGURATION AUDIT</div>
        <h3 style="color:#83e5f0;font-size:22px;margin:8px 0">Automatic Cloud Misconfiguration Detection</h3></div>
        <span style="background:#173e4c;color:#aff4d3;padding:8px 12px;border-radius:7px;font-size:11px">SYNTHETIC DATA ONLY</span>
      </div>
      <p style="color:#b5cddd">Upload a fictional cloud configuration or use the built-in hospital example. The auditor evaluates actual JSON settings, traces possible access paths, and shows which modeled fixes block them.</p>
      <div style="display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:14px 0">
        <button type="button" id="auditVuln">Load Vulnerable Hospital</button>
        <button type="button" id="auditSafe">Load Secured Hospital</button>
        <label style="border:1px solid #326184;border-radius:8px;padding:10px;display:inline-block;background:#173451;color:#cfeeff;font-size:13px">Upload JSON <input id="auditUpload" type="file" accept=".json,application/json" style="max-width:190px" /></label>
      </div>
      <div id="auditMessage" aria-live="polite" style="font-size:12px;color:#94c5db;margin-bottom:8px"></div>
      <div id="auditOutput" aria-live="polite"></div>
      <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:12px">
        <button type="button" id="auditRecommend">Recommend Path-Breaking Fixes</button>
        <button type="button" id="auditApply">Apply Selected Simulated Fixes</button>
        <button type="button" id="auditReset">Reset Current Scenario</button>
      </div>
      <p style="font-size:12px;color:#8ab3ca">All changes are local simulations. No credentials, scanning, live monitoring, or real cloud connections. Findings indicate possible modeled risks, not proof of compromise.</p>`;
    host.appendChild(panel);
    const el = id => panel.querySelector('#'+id);
    const setMsg = message => {el('auditMessage').textContent = message;};

    function validate(raw) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('The root JSON must be an object.');
      if (typeof raw.company !== 'string' || !raw.company.trim() || raw.company.length > 120) throw Error('A company label (up to 120 characters) is required.');
      if (!Array.isArray(raw.resources) || raw.resources.length < 2 || raw.resources.length > 35) throw Error('resources must contain 2–35 cloud resources.');
      if (!Array.isArray(raw.connections) || raw.connections.length > 100) throw Error('connections must be an array of at most 100 links.');
      const knownKinds = new Set(['entry','service','storage','iam_role','asset','database']);
      const ids = new Set();
      for (const r of raw.resources) {
        if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !/^[a-zA-Z0-9_-]{1,40}$/.test(r.id) || ids.has(r.id) || typeof r.name !== 'string' || !r.name.trim() || r.name.length>100 || !knownKinds.has(r.kind)) throw Error('Each resource needs a unique simple id, name, and valid kind.');
        ids.add(r.id);
        for (const k of ['publicAccess','requiresAuth','encryptionAtRest','auditLogging','critical','mfaEnabled']) if (r[k] != null && typeof r[k] !== 'boolean') throw Error(`${r.id}.${k} must be true or false.`);
        if (r.exposure != null && !['public','private'].includes(r.exposure)) throw Error('exposure must be public or private.');
        if (r.impact != null && (!Number.isInteger(r.impact) || r.impact<1 || r.impact>10)) throw Error('impact must be 1–10.');
        if (r.permissions != null && (!Array.isArray(r.permissions) || r.permissions.length>25 || r.permissions.some(x=>typeof x !== 'string' || x.length>100))) throw Error('permissions must be short strings.');
      }
      if (!raw.resources.some(r=>r.kind==='entry') || !raw.resources.some(r=>r.critical===true)) throw Error('Add at least one entry resource and one critical:true asset.');
      for (const e of raw.connections) if (!e || !ids.has(e.from) || !ids.has(e.to)) throw Error('Every connection must link two valid resource ids.');
      return clone(raw);
    }

    function getFindings() {
      const list = [];
      for (const r of model.resources) {
        const add = (rule, label, severity, fixText, blocksPath) => list.push({id:`${r.id}:${rule}`, resource:r.id, label, severity, fixText, blocksPath});
        if (r.publicAccess === true && ['storage','asset','database'].includes(r.kind)) add('public','Public access enabled',r.critical?'CRITICAL':'HIGH','Disable public access',true);
        if (r.exposure==='public' && r.requiresAuth===false && r.kind==='service') add('noauth','Public service without required authentication','HIGH','Require authentication at public endpoint',true);
        if (r.kind==='iam_role' && Array.isArray(r.permissions) && r.permissions.some(x=>x==='*' || x.endsWith(':*'))) add('wildcard','IAM role grants wildcard permissions','HIGH','Replace wildcard permissions with narrowly scoped permissions',true);
        if (r.encryptionAtRest === false && ['storage','database','asset'].includes(r.kind)) add('unencrypted','Encryption at rest disabled','MEDIUM','Enable encryption at rest',false);
        if (r.auditLogging === false) add('nologs','Audit logging disabled','MEDIUM','Enable audit logging',false);
        if (r.kind==='iam_role' && r.mfaEnabled === false) add('nomfa','MFA disabled for IAM role','MEDIUM','Enable multi-factor authentication',false);
      }
      return list;
    }

    // Each link models a possible access relationship; settings control selected links.
    // Public storage: block Internet -> storage when public access is disabled.
    // No-auth public portal: block Internet -> service when authentication is required.
    // Broad IAM: block IAM -> critical asset when wildcard access is restricted.
    function linkAllowed(e, applied=fixes) {
      // Analyze the uploaded configuration values themselves. A modeled
      // connection is not equivalent to authorization: a public-facing edge
      // needs corresponding exposure/permission conditions.
      const resources = Object.fromEntries(model.resources.map(r=>[r.id,r]));
      const src=resources[e.from], dst=resources[e.to];
      if (src.kind==='entry' && ['storage','asset','database'].includes(dst.kind)) {
        return dst.publicAccess === true && !applied.has(`${dst.id}:public`);
      }
      if (src.kind==='entry' && dst.kind==='service') {
        return dst.exposure === 'public' && dst.requiresAuth === false && !applied.has(`${dst.id}:noauth`);
      }
      if (src.kind==='iam_role' && dst.critical === true) {
        const grants=src.permissions || [];
        const authorized=grants.some(p => p==='*' || p.endsWith(':*') || p===`${dst.id}:read` || p===`${dst.id}:write`);
        return authorized && !(applied.has(`${src.id}:wildcard`) && grants.some(p=>p==='*' || p.endsWith(':*')));
      }
      return true;
    }
    function traverse(applied=fixes) {
      const resById=Object.fromEntries(model.resources.map(r=>[r.id,r]));
      const paths=[], reachable=new Set();
      const follow=(id,visited,route)=>{
        if (paths.length>=100) return;
        if(resById[id].critical===true){paths.push([...route]);return;}
        for (const e of model.connections) {
          if(e.from!==id || !linkAllowed(e, applied) || visited.has(e.to)) continue;
          reachable.add(e.to);visited.add(e.to);route.push(e.to);
          follow(e.to,visited,route);
          route.pop();visited.delete(e.to);
        }
      };
      model.resources.filter(r=>r.kind==='entry').forEach(r=>follow(r.id,new Set([r.id]),[r.id]));
      return {paths, reachable:[...reachable].filter(id=>resById[id].kind!=='entry')};
    }
    const pathScore=(path, allFindings)=> {
      const affected=allFindings.filter(f=>path.includes(f.resource) && f.blocksPath);
      const final=model.resources.find(r=>r.id===path[path.length-1]);
      const impact=final?.impact || 8;
      return Math.min(100,Math.round(impact*6 + Math.min(3,affected.length)*9 + (path.length>2?8:0)));
    };
    function recommend() {
      // Deterministic greedy choice based on measured reduction in modeled paths.
      const candidates=getFindings().filter(f=>f.blocksPath && !fixes.has(f.id));
      const chosen=new Set(fixes), picked=[];
      let remaining=traverse(chosen).paths.length;
      while(remaining && candidates.length){
        let best=null, reduction=0;
        for(const f of candidates){if(chosen.has(f.id))continue;
          const next=traverse(new Set([...chosen,f.id])).paths.length;
          if(remaining-next>reduction){reduction=remaining-next;best=f;}
        }
        if(!best)break;
        chosen.add(best.id);picked.push(best.id);remaining-=reduction;
      }
      return picked;
    }

    function render() {
      const allFindings=getFindings();
      const active=allFindings.filter(f=>!fixes.has(f.id));
      const {paths,reachable}=traverse();
      const map=Object.fromEntries(model.resources.map(r=>[r.id,r]));
      const status=paths.length?'POTENTIAL CRITICAL ROUTES FOUND':'NO CRITICAL ROUTES IN CURRENT MODEL';
      let html=`<div style="background:#102b42;border-radius:9px;padding:14px;margin:12px 0">
        <b>Company:</b> ${escape(model.company)}<br>
        <b>Configuration weaknesses:</b> ${active.length} (${allFindings.length - active.length} simulated fixes applied)<br>
        <b>Potential critical attack paths:</b> ${paths.length}<br>
        <b>Reachable modeled resources:</b> ${reachable.length}<br>
        <span style="color:${paths.length?'#ff9aaa':'#9af0c8'}">${status}</span></div>`;
      html+=`<h4 style="color:#a5ddf0;margin:15px 0 10px">Automatically detected findings</h4>`;
      if(!allFindings.length)html+='<p>No modeled misconfigurations match the supported audit rules.</p>';
      for(const f of allFindings) {
        const done=fixes.has(f.id); const severity=escape(f.severity);
        html+=`<label style="display:block;border:1px solid ${done?'#2f775f':'#64424e'};border-radius:8px;margin:7px 0;padding:12px;background:${done?'#0c302c':'#281d31'}">
          <input class="auditFix" type="checkbox" value="${escape(f.id)}" ${done?'checked disabled':''}>
          <strong>${escape(map[f.resource].name)}</strong> — ${escape(f.label)}
          <span style="color:${done?'#98efcc':'#ffa0ad'};font-weight:bold;font-size:12px">[${done?'SIMULATED FIX APPLIED':severity}]</span><br>
          <small>${escape(f.fixText)} · ${f.blocksPath?'May break an access path':'Defense-in-depth; does not directly break graph paths'}</small>
        </label>`;
      }
      html+=`<h4 style="color:#a5ddf0;margin:15px 0 10px">Attack-path graph (possible access)</h4>`;
      if(paths.length===0)html+='<div class="success">No modeled path currently reaches a critical asset. This is not a security guarantee.</div>';
      for(let i=0;i<paths.length;i++){
        const path=paths[i], score=pathScore(path,active), labels=path.map(id=>escape(map[id].name));
        html+=`<div class="path"><b>Path ${i+1} — ${score>=80?'HIGH':'MEDIUM'} (${score}/100 illustrative)</b><div class="graph">${labels.map((lab,j)=>`${j?'<span class="arrow">➜</span>':''}<span class="node ${map[path[j]].kind==='entry'?'entry':map[path[j]].critical?'critical':'service'}">${lab}</span>`).join('')}</div></div>`;
      }
      el('auditOutput').innerHTML=html;
    }
    el('auditVuln').addEventListener('click',()=>{model=clone(sample);fixes.clear();setMsg('Loaded vulnerable hospital configuration. Results calculated from its JSON settings.');render();});
    el('auditSafe').addEventListener('click',()=>{model=clone(sample);model.resources.forEach(r=>{
      if(r.publicAccess===true)r.publicAccess=false;
      if(r.requiresAuth===false)r.requiresAuth=true;
      if(r.kind==='iam_role')r.permissions=['records:write:uploads'];
      if(r.encryptionAtRest===false)r.encryptionAtRest=true;
      if(r.auditLogging===false)r.auditLogging=true;
      if(r.mfaEnabled===false)r.mfaEnabled=true;
    });
      fixes.clear();setMsg('Loaded secured hospital configuration. The same graph links are evaluated against the safer access settings.');render();});
    el('auditUpload').addEventListener('change',async function(){
      if(!this.files?.length)return;
      try{if(this.files[0].size>LIMIT)throw Error('File too large. Limit: 80 KB.');
        model=validate(JSON.parse(await this.files[0].text()));fixes.clear();setMsg('Synthetic JSON loaded and scanned automatically.');render();
      }catch(e){setMsg('Upload not accepted: '+e.message);}finally{this.value='';}
    });
    el('auditRecommend').addEventListener('click',()=>{
      const picks=new Set(recommend()); panel.querySelectorAll('.auditFix:not(:disabled)').forEach(c=>{c.checked=picks.has(c.value);});
      setMsg(picks.size?`${picks.size} path-breaking fix(es) selected based on modeled route reduction.`:'No additional path-breaking fix identified for the remaining modeled routes.');
    });
    el('auditApply').addEventListener('click',()=>{
      const picked=[...panel.querySelectorAll('.auditFix:checked:not(:disabled)')].map(el=>el.value);
      if(!picked.length){setMsg('Select at least one unapplied fix first.');return;}
      picked.forEach(id=>fixes.add(id));const remaining=traverse().paths.length;
      setMsg(`${picked.length} simulated fix(es) applied. ${remaining} potential critical path(s) remain. No real cloud permissions changed.`);
      render();
    });
    el('auditReset').addEventListener('click',()=>{fixes.clear();setMsg('Simulated changes cleared.');render();});
    setMsg('Built-in vulnerable hospital configuration loaded. Click Load Secured Hospital to compare.');
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
