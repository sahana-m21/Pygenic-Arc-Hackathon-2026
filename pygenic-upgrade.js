/*
 * PYGENIC ARC — VISUAL UPGRADE FOR THE EXISTING WEBSITE
 * Add after the existing scenarios.js script, immediately before </body>.
 * Does not overwrite any existing dashboard or security analysis functions.
 * Fully offline, animated 3D-projected globe. All alerts are SIMULATED.
 */
(() => {
  'use strict';
  const start = () => {
    if (document.getElementById('arc4bar')) return;
    const main = document.querySelector('.container');
    if (!main) { console.warn('Pygenic Arc upgrade: .container not found.'); return; }
    const originalHeader = document.querySelector('body > header');
    if (originalHeader) originalHeader.hidden = true;
    document.body.classList.add('arc4-active');

    const style = document.createElement('style');
    style.id = 'arc4-style';
    style.textContent = `
      body.arc4-active{background:#040b15;color:#e5f1ff;font-family:Inter,Segoe UI,Arial,sans-serif;min-height:100vh}
      .arc4-active *{box-sizing:border-box}
      .arc4-active [hidden]{display:none!important}
      .arc4-active::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(52,140,198,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(52,140,198,.035) 1px,transparent 1px);background-size:48px 48px}
      #arc4bar{position:sticky;top:0;z-index:100;background:rgba(5,13,26,.96);border-bottom:1px solid #224563;backdrop-filter:blur(15px);display:flex;align-items:center;gap:24px;justify-content:space-between;padding:14px clamp(20px,4vw,62px);box-shadow:0 8px 26px #0006}
      #arc4bar .arc4-brand{background:none;border:0;color:#e6f8ff;font-size:19px;font-weight:850;letter-spacing:2px;box-shadow:none;text-align:left;padding:0;white-space:nowrap;cursor:pointer}
      #arc4bar .arc4-brand em{display:block;font-size:9px;font-weight:600;letter-spacing:2px;color:#5bd7ed;font-style:normal;margin-top:3px}
      #arc4bar .arc4-brand strong{color:#6de1f1}
      #arc4nav{display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center}
      #arc4nav button{font-size:12px;text-transform:uppercase;letter-spacing:.8px;background:transparent;border:1px solid transparent;color:#a9c1d4;padding:11px 13px;border-radius:7px;box-shadow:none;font-weight:650}
      #arc4nav button:hover,#arc4nav button[aria-current='page']{color:#9af3ff;background:rgba(25,132,170,.14);border-color:#217391;box-shadow:none;transform:none}
      .arc4-org{font-size:11px;color:#8baec7;border:1px solid #2b4863;border-radius:100px;padding:9px 13px;white-space:nowrap}
      #arc4home{position:relative;z-index:1;min-height:calc(100vh - 76px);max-width:1640px;margin:auto;padding:clamp(22px,3vw,48px)}
      .arc4-eyebrow{color:#65d4ed;font-size:11px;letter-spacing:3px;font-weight:800;text-transform:uppercase}
      #arc4home h1{font-size:clamp(25px,2.8vw,47px);line-height:1.09;letter-spacing:-1px;margin:9px 0 13px;max-width:590px;color:#f6fbff}
      #arc4home h1 strong{color:#69cfe8}
      .arc4-sub{font-size:14px;color:#9eb4c8;max-width:520px;line-height:1.65}
      .arc4-homegrid{display:grid;grid-template-columns:minmax(235px,.88fr) minmax(370px,1.6fr) minmax(225px,.85fr);gap:16px;margin-top:19px;align-items:stretch}
      .arc4-panel{background:rgba(10,25,44,.85);border:1px solid #244662;border-radius:15px;padding:20px;box-shadow:0 14px 45px #0004}
      .arc4-panel h2{font-size:13px;font-weight:800;color:#70d6e9;letter-spacing:1px;margin:0 0 13px;text-transform:uppercase}
      .arc4-panel p{color:#aac2d4;font-size:13px;line-height:1.6}
      .arc4-select{width:100%;text-align:left;background:#0b1e34;border:1px solid #2f506b;color:#eaf5fe;display:flex;align-items:center;justify-content:space-between;padding:13px 14px;border-radius:10px;cursor:pointer;margin-top:10px;box-shadow:none;transition:background .2s,border-color .2s;min-height:73px}
      .arc4-select:hover{background:#132b46;border-color:#57bbdc;transform:none;box-shadow:0 0 0 1px #356d88}
      .arc4-select b{display:block;font-size:14px;color:#f3f9ff;margin-bottom:4px}
      .arc4-select small{display:block;color:#8faac1;font-size:11px;line-height:1.3;font-weight:400}
      .arc4-select .arc4-chev{font-size:22px;color:#66dced;padding-left:8px}
      .arc4-globepanel{position:relative;background:radial-gradient(ellipse at 50% 49%,rgba(22,100,158,.19),rgba(3,11,23,.12) 57%,transparent 90%);border:1px solid #203b53;border-radius:18px;display:flex;align-items:center;justify-content:center;overflow:hidden;min-height:460px}
      .arc4-globepanel::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 36%,rgba(30,101,150,.06) 37%,transparent 38%);pointer-events:none}
      #arc4globe{display:block;width:100%;height:100%;min-height:460px;max-height:640px;object-fit:contain}
      .arc4-globelabel{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;pointer-events:none}
      .arc4-globelabel strong{display:block;color:#b6eefa;font-size:14px;letter-spacing:2px}
      .arc4-globelabel span{display:block;color:#91acc2;font-size:10px;letter-spacing:1.1px;margin-top:5px}
      .arc4-rightlist{display:grid;gap:11px}
      .arc4-notice{border-left:2px solid #53b9d1;background:#0c2136;padding:12px;border-radius:4px;font-size:12px;color:#bed2e3;line-height:1.55}
      .arc4-notice.alert{border-color:#f47478}.arc4-notice.safe{border-color:#3fc79d}
      .arc4-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-top:16px}
      .arc4-kpi{background:#0b2038;border:1px solid #2b4e67;border-radius:12px;padding:15px 18px;min-height:88px}
      .arc4-kpi strong{font-size:27px;color:#70d8ea;display:block}.arc4-kpi span{font-size:11px;color:#99b3ca}
      .arc4-kpi.danger strong{color:#f2a0a8}
      #arc4home .arc4-footnote{font-size:11px;color:#7897b3;margin:14px 1px}
      body.arc4-active .container{position:relative;z-index:2;max-width:1280px;padding-top:24px}
      body.arc4-active .container>.card,body.arc4-active .container>.stats{animation:arc4-enter .25s ease-out}
      body.arc4-active .container>.card{background:#0c1e33;border-color:#294863;box-shadow:0 12px 26px #0004}
      body.arc4-active .container h2{color:#79dced}
      body.arc4-active button{cursor:pointer}
      #arc4heading{max-width:1280px;margin:24px auto 2px;padding:0 22px;position:relative;z-index:2}
      #arc4heading h1{font-size:28px;margin:10px 0;color:#f0faff}
      #arc4heading p{font-size:13px;color:#8aa9c3}
      .arc4-back{background:none;border:1px solid #315570;color:#9bd9e5;border-radius:7px;padding:9px 12px;font-size:12px;box-shadow:none;margin:0}
      .arc4-back:hover{background:#102940;box-shadow:none;transform:none}
      #arc4reports{max-width:1280px;margin:24px auto;padding:22px;position:relative;z-index:3;background:#0c1e33;border:1px solid #2b4e67;border-radius:14px;color:#dcecf6}
      #arc4reports pre{font-family:inherit;white-space:pre-wrap;color:#c9e0ed;font-size:13px;line-height:1.75}
      .arc4-extra-actions{border-bottom:1px solid #31516b;padding:8px 0 18px;margin-bottom:12px}
      #arc4-advisor{border:1px solid #315b75;padding:19px;border-radius:11px;background:#09243b;margin:15px 0;line-height:1.65}
      #arc4-advisor h3{color:#7be2f0;margin:0 0 8px}
      #arc4-advisor p{font-size:13px;color:#c5d9ea}
      #arc4-advisor button{padding:9px 12px;font-size:12px;margin:2px}
      #arc4advice{min-height:55px}
      @keyframes arc4-enter{from{opacity:.4;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @media (max-width:1150px){.arc4-homegrid{grid-template-columns:minmax(190px,.8fr) minmax(300px,1.4fr)}.arc4-homegrid>.arc4-panel:last-child{grid-column:1/-1}.arc4-rightlist{grid-template-columns:repeat(3,minmax(0,1fr))}#arc4bar{gap:9px}.arc4-org{display:none}}
      @media (max-width:760px){#arc4bar{flex-wrap:wrap;justify-content:center}#arc4bar .arc4-brand{font-size:16px}#arc4nav button{font-size:10px;padding:8px 9px}.arc4-homegrid{grid-template-columns:1fr}.arc4-globepanel,#arc4globe{min-height:340px}.arc4-rightlist{grid-template-columns:1fr}.arc4-kpis{grid-template-columns:repeat(2,1fr)}}
      @media (prefers-reduced-motion:reduce){body.arc4-active .container>.card{animation:none}}
    `;
    document.head.appendChild(style);

    // The original working HTML remains unchanged and is reused as the actual engine.
    const allSections = [...main.children].filter(el => el.classList.contains('card') || el.classList.contains('stats'));
    const byName = (el) => (el.querySelector('h2')?.textContent || '').trim().toLowerCase();
    const pages = [
      {id:'home',title:'Home',desc:'Select a simulated cloud-security environment.'},
      {id:'dashboard',title:'Dashboard',desc:'Existing company dashboard and current security statistics.',match:['company security dashboard'],stats:true},
      {id:'employees',title:'Employees',desc:'Check assigned projects and identify excessive employee access.',match:['employee access management','automatic permission detection']},
      {id:'analysis',title:'Analysis',desc:'Trace routes from exposed services to a critical asset.',match:['cloud attack path visualization','security risk analysis']},
      {id:'remediation',title:'Remediation',desc:'Apply simulated access fixes and see the path reduction.',match:['remediation simulator','remediation results']},
      {id:'scenarios',title:'Scenarios',desc:'Analyze shopping, hospital, college and banking scenarios.',match:['advanced cloud security scenario lab']},
      {id:'reports',title:'Reports',desc:'Export a report containing modeled risks and recommendations.'}
    ];
    const bar = document.createElement('div');
    bar.id = 'arc4bar';
    bar.innerHTML = `<button class="arc4-brand" id="arc4logo">◉ PYGENIC <strong>ARC</strong><em>CLOUD ATTACK PATH ANALYZER</em></button><nav id="arc4nav" aria-label="Pygenic Arc sections"></nav><div class="arc4-org">SecureTech Solutions · SIMULATION</div>`;
    document.body.insertBefore(bar, originalHeader || main);

    const home = document.createElement('section');
    home.id = 'arc4home';
    home.innerHTML = `
      <div class="arc4-eyebrow">CY-01 · INTERACTIVE SECURITY COMMAND CENTER</div>
      <h1>Protect critical cloud data.<br><strong>See every possible path.</strong></h1>
      <p class="arc4-sub">Explore synthetic company environments. Identify excessive access and cloud misconfigurations, then demonstrate how a security fix changes the possible routes to sensitive assets.</p>
      <div class="arc4-homegrid">
        <div class="arc4-panel"><h2>Explore Security Scenarios</h2>
          <button class="arc4-select" data-scenario="Hospital"><span><b>Hospital</b><small>Patient reports & cloud storage</small></span><span class="arc4-chev">›</span></button>
          <button class="arc4-select" data-scenario="College"><span><b>College</b><small>Student records & permissions</small></span><span class="arc4-chev">›</span></button>
          <button class="arc4-select" data-scenario="Banking"><span><b>Banking</b><small>Confidential transactions</small></span><span class="arc4-chev">›</span></button>
          <button class="arc4-select" data-scenario="Shopping"><span><b>Shopping</b><small>Customer orders & cloud roles</small></span><span class="arc4-chev">›</span></button>
        </div>
        <div class="arc4-globepanel" aria-label="Continuously rotating, animated cybersecurity globe"><canvas id="arc4globe"></canvas><div class="arc4-globelabel"><strong>GLOBAL CLOUD DEFENCE</strong><span>ANIMATED 3D-PROJECTED EARTH · SYNTHETIC SIMULATION</span></div></div>
        <div class="arc4-panel"><h2>Security Overview</h2><div class="arc4-rightlist">
          <div class="arc4-notice"><b>Exposed entry points</b><br>Multiple paths may reach important assets.</div>
          <div class="arc4-notice alert"><b>Cloud permission weakness</b><br>Overly broad IAM roles can increase reachability.</div>
          <div class="arc4-notice safe"><b>Remediation simulation</b><br>See whether a selected change blocks a path.</div>
          <div class="arc4-notice"><b>Smart Security Advisor</b><br>Rule-based explanations, not a connected AI model.</div>
        </div><button class="arc4-select" data-view="analysis"><span><b>Explore Attack Paths</b><small>Open the current graph analysis</small></span><span class="arc4-chev">›</span></button></div>
      </div>
      <div class="arc4-kpis">
        <div class="arc4-kpi"><strong id="arc4employees">10</strong><span>EMPLOYEES · SAMPLE</span></div>
        <div class="arc4-kpi danger"><strong id="arc4perms">3</strong><span>EXCESS PERMISSIONS</span></div>
        <div class="arc4-kpi danger"><strong id="arc4paths">2</strong><span>MODELED ATTACK PATHS</span></div>
        <div class="arc4-kpi"><strong id="arc4blast">5</strong><span>REACHABLE RESOURCES</span></div>
      </div>
      <p class="arc4-footnote">Visual effects are illustrative. Figures are read from the existing analyzer. No real-world attacks, live monitoring, or cloud connection.</p>`;
    main.before(home);
    const heading = document.createElement('div');
    heading.id = 'arc4heading'; heading.hidden = true; main.before(heading);
    const reports = document.createElement('section');
    reports.id = 'arc4reports'; reports.hidden = true;
    reports.innerHTML = `<h2>Pygenic Arc · Security Report</h2><p>Synthetic analysis only. No live scans.</p><pre id="arc4reportBody"></pre><button type="button" id="arc4Download">Download Text Report</button>`;
    main.after(reports);
    const nav = document.getElementById('arc4nav');
    pages.forEach(page => {
      const btn = document.createElement('button'); btn.type='button'; btn.textContent=page.title; btn.dataset.view=page.id;
      btn.addEventListener('click', () => showPage(page.id));
      nav.appendChild(btn);
    });
    document.getElementById('arc4logo').addEventListener('click', () => showPage('home'));
    home.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.view)));
    home.querySelectorAll('[data-scenario]').forEach(btn => btn.addEventListener('click', () => {
      showPage('scenarios');
      const sel = document.getElementById('scenarioSelect') || document.getElementById('arcScenario');
      if (sel) {
        const option = [...sel.options].find(o => o.textContent.toLowerCase().includes(btn.dataset.scenario.toLowerCase()));
        if (option) { sel.value = option.value; sel.dispatchEvent(new Event('change', {bubbles:true})); }
      }
    }));

    // Original buttons were located in Dashboard, so include them on the Remediation page too.
    const fixCard = allSections.find(s => byName(s) === 'remediation simulator');
    if (fixCard && !fixCard.querySelector('.arc4-extra-actions')) {
      const actions = document.createElement('div'); actions.className = 'arc4-extra-actions';
      [['Select All Recommended Fixes','selectAllFixes'],['Apply Simulated Fixes','applyFixes'],['Reset Original Demo','resetDemo']].forEach(([label,method]) => {
        const b=document.createElement('button'); b.type='button'; b.textContent=label;
        b.addEventListener('click',()=>{
          if (typeof window[method] === 'function') window[method]();
          else alert('Function ' + method + ' not found in existing index.html.');
          updateStats();
        }); actions.appendChild(b);
      });
      fixCard.insertBefore(actions, fixCard.firstElementChild?.nextSibling || null);
    }
    // Advisor gives honest, local, deterministic advice without promising a remote AI API.
    const riskCard = allSections.find(s => byName(s) === 'security risk analysis');
    if (riskCard && !document.getElementById('arc4-advisor')) {
      const advisor = document.createElement('div'); advisor.id='arc4-advisor';
      advisor.innerHTML = `<h3>Smart Security Advisor</h3><p>Rule-based security explanations generated from the existing model.</p><button type="button" data-advice="why">Why is this risky?</button><button type="button" data-advice="fix">Which fix should we apply?</button><div id="arc4advice" role="status"></div>`;
      riskCard.appendChild(advisor);
      advisor.querySelectorAll('[data-advice]').forEach(b=>b.addEventListener('click',()=>{
        const count=Number(document.getElementById('pathCount')?.textContent || 0);
        document.getElementById('arc4advice').textContent = b.dataset.advice==='why'
          ? (count ? `The current synthetic graph has ${count} active route(s) from exposed cloud entry points to the customer database. Broad IAM permissions can make these routes possible.` : 'The current modeled graph shows no active route to the critical database. This does not prove the real environment is secure.')
          : (count ? 'Open Remediation. First restrict unnecessary database access from the Shared IAM Role, then review the Backup Role route. Apply fixes separately and recheck remaining paths.' : 'The modeled critical paths are blocked. Continue reviewing other resources and employee permissions.');
      }));
    }
    let currentPage = 'home';
    function reportText() {
      const permitted = document.getElementById('permissionCount')?.textContent?.trim() || '?';
      const paths = document.getElementById('pathCount')?.textContent?.trim() || '?';
      const blast = document.getElementById('blastCount')?.textContent?.trim() || '?';
      const permissions = document.getElementById('permissionResults')?.innerText || '';
      const risk = document.getElementById('riskResults')?.innerText || '';
      const scenario = document.getElementById('scenarioResults')?.innerText || '';
      return `PYGENIC ARC — CY-01\nSecureTech Solutions (fictional organization)\n\nExcess permissions: ${permitted}\nModeled attack paths: ${paths}\nReachable cloud resources: ${blast}\n\nEMPLOYEE SECURITY FINDINGS\n${permissions}\n\nCLOUD ATTACK ANALYSIS\n${risk}\n\nADDITIONAL SCENARIO\n${scenario}\n\nReport is based on synthetic data only. No real systems were scanned or changed.`;
    }
    document.getElementById('arc4Download').addEventListener('click', () => {
      const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pygenic-arc-security-report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    function updateStats(){
      const copy = [['arc4perms','permissionCount'],['arc4paths','pathCount'],['arc4blast','blastCount']];
      for(const [to,from] of copy){const el=document.getElementById(from);if(el)document.getElementById(to).textContent=el.textContent.trim();}
    }
    for(const id of ['permissionCount','pathCount','blastCount']){
      const el=document.getElementById(id); if(el) new MutationObserver(updateStats).observe(el,{childList:true,subtree:true,characterData:true});
    }
    function showPage(id){
      currentPage=id;
      const page=pages.find(x=>x.id===id) || pages[0];
      home.hidden=id!=='home';
      main.hidden = id==='home' || id==='reports';
      heading.hidden = id==='home' || id==='reports';
      reports.hidden = id!=='reports';
      allSections.forEach(el=>{
        const visible=!!(page.match?.includes(byName(el)) || (page.stats && el.classList.contains('stats')));
        el.hidden=!visible;
      });
      if(!heading.hidden){
        heading.innerHTML = '';
        const back=document.createElement('button');back.className='arc4-back';back.textContent='← Back to Home';back.addEventListener('click',()=>showPage('home'));
        const title=document.createElement('h1');title.textContent=page.title;
        const desc=document.createElement('p');desc.textContent=page.desc;
        heading.append(back,title,desc);
      }
      if(id==='reports') document.getElementById('arc4reportBody').textContent=reportText();
      nav.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-current',b.dataset.view===id?'page':'false'));
      updateStats();window.scrollTo(0,0);
    }
    updateStats(); showPage('home');
    startGlobe();
  };

  function startGlobe() {
    const canvas=document.getElementById('arc4globe'); if(!canvas) return;
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    // Approximate continents, modeled as geographic shapes rather than a static image.
    const polygons=[
      [[-168,68],[-135,72],[-124,60],[-124,49],[-117,33],[-108,28],[-98,17],[-87,12],[-81,9],[-82,26],[-67,44],[-54,52],[-61,61],[-90,73],[-120,72]],
      [[-83,13],[-71,11],[-60,10],[-51,2],[-35,-8],[-39,-24],[-53,-53],[-67,-56],[-75,-40],[-80,-15]],
      [[-18,35],[12,37],[36,31],[51,12],[43,-10],[34,-35],[19,-35],[10,-18],[-17,7]],
      [[-12,36],[-10,43],[4,51],[18,58],[35,69],[52,68],[61,55],[44,42],[35,31],[17,37],[8,41]],
      [[28,38],[38,56],[75,73],[111,72],[144,60],[159,48],[144,31],[121,19],[117,5],[107,-5],[99,9],[78,7],[69,23],[52,27],[46,37]],
      [[112,-11],[141,-11],[154,-27],[146,-39],[117,-36],[112,-24]],
      [[-54,59],[-40,60],[-38,79],[-50,84],[-63,77]],
      [[43,-13],[50,-16],[49,-25],[44,-25]]
    ];
    const inside=(lon,lat,poly)=>{
      let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
        const [xi,yi]=poly[i],[xj,yj]=poly[j];
        if((yi>lat)!==(yj>lat) && lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)c=!c;
      }return c;
    };
    const land=[];
    for(let lat=-86;lat<=86;lat+=3.4)for(let lon=-180;lon<180;lon+=3.4){
      if(polygons.some(p=>inside(lon,lat,p)))land.push([lon,lat]);
    }
    const rad=Math.PI/180;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
    let frame=0,last=0,angle=0;
    function draw(t){
      if(!canvas.isConnected) return;
      const bounds=canvas.getBoundingClientRect();
      const w=Math.max(260,Math.round(bounds.width)), h=Math.max(340,Math.round(bounds.height));
      const dpr=Math.min(window.devicePixelRatio||1,2);
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const delta=Math.min(t-last,55);last=t;if(!reduced)angle += .00036*(delta||16);
      const x=w*.5,y=h*.475,R=Math.min(w*.41,h*.385);
      const glow=ctx.createRadialGradient(x,y,3,x,y,R*1.6);
      glow.addColorStop(0,'rgba(29,138,206,.16)');glow.addColorStop(.55,'rgba(30,108,172,.10)');glow.addColorStop(1,'rgba(10,38,78,0)');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,R*1.6,0,Math.PI*2);ctx.fill();
      const surface=ctx.createRadialGradient(x-R*.3,y-R*.4,R*.08,x,y,R*1.12);
      surface.addColorStop(0,'#143857');surface.addColorStop(.55,'#092641');surface.addColorStop(1,'#020c1c');
      ctx.fillStyle=surface;ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.fill();
      function proj(lon,lat){
        const a=lon*rad+angle,b=lat*rad;
        const xx=Math.cos(b)*Math.sin(a), yy=-Math.sin(b), zz=Math.cos(b)*Math.cos(a);
        return [x+xx*R,y+yy*R,zz];
      }
      // Visible hemisphere latitude/longitude grid — changes every frame with the rotation.
      ctx.lineWidth=.65;ctx.strokeStyle='rgba(73,168,225,.27)';
      const line=(points)=>{
        ctx.beginPath();let pen=false;
        for(const [lon,lat] of points){const [px,py,z]=proj(lon,lat);if(z>.02){if(!pen)ctx.moveTo(px,py);else ctx.lineTo(px,py);pen=true;}else pen=false;}
        ctx.stroke();
      };
      for(let lat=-80;lat<=80;lat+=20){const p=[];for(let lon=-180;lon<=180;lon+=3)p.push([lon,lat]);line(p);}
      for(let lon=-180;lon<180;lon+=20){const p=[];for(let lat=-88;lat<=88;lat+=3)p.push([lon,lat]);line(p);}
      ctx.fillStyle='rgba(99,206,248,.9)';
      for(const [lon,lat] of land){const [px,py,z]=proj(lon,lat);if(z>.04){ctx.globalAlpha=.3+.55*z;ctx.fillRect(px,py,1.6+z*.7,1.6+z*.7);}}
      ctx.globalAlpha=1;
      // Moving orbital ring and animated signal — illustrative design, not observed attacks.
      const tilt=-.26;
      ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.strokeStyle='rgba(84,202,237,.44)';ctx.lineWidth=1.1;
      ctx.beginPath();ctx.ellipse(0,0,R*1.25,R*.38,0,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='rgba(80,145,218,.22)';ctx.beginPath();ctx.ellipse(0,0,R*1.33,R*.63,.65,0,Math.PI*2);ctx.stroke();
      let particle=angle*1.8;const xp=Math.cos(particle)*R*1.25,yp=Math.sin(particle)*R*.38;
      ctx.shadowBlur=16;ctx.shadowColor='#7feeff';ctx.fillStyle='#b3f5ff';ctx.beginPath();ctx.arc(xp,yp,3.4,0,Math.PI*2);ctx.fill();ctx.restore();
      // Edge lighting
      ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.lineWidth=2.2;ctx.strokeStyle='rgba(87,195,246,.7)';ctx.shadowBlur=15;ctx.shadowColor='#269ace';ctx.stroke();ctx.shadowBlur=0;
      // Base scanner ring rotates in the opposite direction.
      ctx.save();ctx.translate(x,y+R*1.03);ctx.rotate(-angle*.65);ctx.scale(1,.21);
      ctx.strokeStyle='rgba(109,215,237,.43)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R*.84,0,Math.PI*2);ctx.stroke();ctx.restore();
      frame=requestAnimationFrame(draw);
    }
    frame=requestAnimationFrame(draw);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
