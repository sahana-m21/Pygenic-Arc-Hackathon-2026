// PYGENIC ARC 2.0
// ADVANCED CLOUD SECURITY SCENARIO LAB
// Synthetic Data Only

(function () {

const scenarios = [

    {
        name: "Online Shopping Cloud Security",
        description: "Customer order database exposed through excessive cloud permissions.",

        nodes: {
            api: {label:"Public Shopping API",type:"entry"},
            app: {label:"Shopping Application",type:"service"},
            role: {label:"Overprivileged IAM Role",type:"weak"},
            partner: {label:"Public Partner API",type:"entry"},
            report: {label:"Reporting Role",type:"weak"},
            db: {label:"Customer Orders Database",type:"critical",impact:10}
        },

        edges: [
            {from:"api",to:"app"},
            {from:"app",to:"role"},
            {from:"partner",to:"role"},
            {from:"role",to:"db",fix:"S1",risk:9,
             issue:"Excessive database permission"},
            {from:"partner",to:"report"},
            {from:"report",to:"db",fix:"S2",risk:7,
             issue:"Unnecessary reporting permission"}
        ],

        fixes: [
            {id:"S1",text:"Restrict Shopping IAM Role database access"},
            {id:"S2",text:"Remove unnecessary Reporting Role permission"}
        ]
    },

    {
        name: "Hospital Cloud Security",
        description: "Patient records exposed through public storage and cloud permissions.",

        nodes: {
            internet: {label:"Internet",type:"entry"},
            storage: {label:"Public Cloud Storage",type:"weak"},
            portal: {label:"Hospital Portal",type:"entry"},
            role: {label:"Medical Upload Role",type:"weak"},
            records: {label:"Patient Records",type:"critical",impact:10}
        },

        edges: [
            {from:"internet",to:"storage",fix:"H1",risk:10,
             issue:"Public storage misconfiguration"},
            {from:"storage",to:"records"},
            {from:"portal",to:"role"},
            {from:"role",to:"records",fix:"H2",risk:8,
             issue:"Excessive medical-record access"}
        ],

        fixes: [
            {id:"H1",text:"Disable public access to patient storage"},
            {id:"H2",text:"Restrict Medical Upload Role permissions"}
        ]
    },

    {
        name: "College Cloud Security",
        description: "Student marks exposed through incorrect cloud permissions.",

        nodes: {
            api: {label:"Public Student API",type:"entry"},
            app: {label:"Student Portal",type:"service"},
            role: {label:"Excessive IAM Role",type:"weak"},
            staff: {label:"Public Staff Endpoint",type:"entry"},
            export: {label:"Export Role",type:"weak"},
            db: {label:"Student Marks Database",type:"critical",impact:9}
        },

        edges: [
            {from:"api",to:"app"},
            {from:"app",to:"role"},
            {from:"role",to:"db",fix:"C1",risk:9,
             issue:"Unnecessary marks database permission"},
            {from:"staff",to:"export"},
            {from:"export",to:"db",fix:"C2",risk:8,
             issue:"Excessive export permission"}
        ],

        fixes: [
            {id:"C1",text:"Restrict Student Portal IAM permissions"},
            {id:"C2",text:"Remove unnecessary marks export access"}
        ]
    },

    {
        name: "Banking Cloud Security",
        description: "Transaction database exposed through powerful cloud roles.",

        nodes: {
            api: {label:"Public Banking API",type:"entry"},
            gateway: {label:"API Gateway",type:"service"},
            admin: {label:"Broad IAM Role",type:"weak"},
            monitor: {label:"Public Monitoring Endpoint",type:"entry"},
            export: {label:"Export Role",type:"weak"},
            db: {label:"Transaction Database",type:"critical",impact:10}
        },

        edges: [
            {from:"api",to:"gateway"},
            {from:"gateway",to:"admin"},
            {from:"admin",to:"db",fix:"B1",risk:10,
             issue:"Overprivileged cloud role"},
            {from:"monitor",to:"export"},
            {from:"export",to:"db",fix:"B2",risk:9,
             issue:"Excessive transaction export access"}
        ],

        fixes: [
            {id:"B1",text:"Apply least-privilege IAM permissions"},
            {id:"B2",text:"Remove unnecessary transaction export access"}
        ]
    }

];

let currentScenario = 0;
let applied = new Set();

// CREATE NEW SECTION

const container = document.querySelector(".container");

if (!container) {
    console.error("Website container not found");
    return;
}

const section = document.createElement("section");

section.className = "card";

section.innerHTML = `
    <h2>Advanced Cloud Security Scenario Lab</h2>

    <p>
        Analyze different synthetic cloud security problems.
    </p>

    <select id="scenarioSelect"
        style="padding:12px;width:100%;max-width:500px;
        border-radius:8px;margin:10px 0;font-size:16px;">
    </select>

    <br>

    <button id="scenarioAnalyze">Analyze Scenario</button>

    <button id="scenarioRecommend">Recommend Best Fixes</button>

    <button id="scenarioApply">Apply Simulated Fixes</button>

    <button id="scenarioReset">Reset Scenario</button>

    <div style="margin:15px 0;padding:12px;border:1px solid #36536b;border-radius:8px">
        <label for="scenarioJsonInput"><b>Optional: Load organizer-provided synthetic cloud JSON</b></label><br>
        <input type="file" accept=".json,application/json" id="scenarioJsonInput" style="margin-top:9px;max-width:100%">
        <div id="scenarioImportStatus" role="status" style="margin-top:8px;font-size:13px">
            Use the included organizer-sample.json file to test custom graph analysis.
        </div>
    </div>

    <div id="scenarioResults"></div>
`;

container.appendChild(section);

const select = document.getElementById("scenarioSelect");

scenarios.forEach((scenario, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = scenario.name;
    select.appendChild(option);
});

// FIND ATTACK PATHS USING DFS

function findPaths(fixes = applied) {

    const scenario = scenarios[currentScenario];
    const paths = [];

    function dfs(current, visited, path, edges) {

        if (paths.length >= 50) return;

        if (scenario.nodes[current].type === "critical") {
            paths.push({
                nodes: [...path],
                edges: [...edges]
            });
            return;
        }

        for (const edge of scenario.edges) {

            if (edge.from !== current) continue;

            if (edge.fix && fixes.has(edge.fix)) continue;

            if (visited.has(edge.to)) continue;

            visited.add(edge.to);
            path.push(edge.to);
            edges.push(edge);

            dfs(edge.to, visited, path, edges);

            edges.pop();
            path.pop();
            visited.delete(edge.to);
        }
    }

    for (const id of Object.keys(scenario.nodes)) {

        if (scenario.nodes[id].type === "entry") {
            dfs(id, new Set([id]), [id], []);
        }
    }

    return paths;
}

// BLAST RADIUS USING BFS

function blastRadius() {

    const scenario = scenarios[currentScenario];
    const visited = new Set();
    const queue = [];

    for (const id of Object.keys(scenario.nodes)) {
        if (scenario.nodes[id].type === "entry") {
            visited.add(id);
            queue.push(id);
        }
    }

    while (queue.length > 0) {

        const current = queue.shift();

        for (const edge of scenario.edges) {

            if (edge.from !== current) continue;

            if (edge.fix && applied.has(edge.fix)) continue;

            if (!visited.has(edge.to)) {
                visited.add(edge.to);
                queue.push(edge.to);
            }
        }
    }

    return [...visited].filter(id =>
        scenario.nodes[id].type !== "entry"
    ).length;
}

// DYNAMIC RISK SCORE

function calculateRisk(path) {

    const scenario = scenarios[currentScenario];

    const last = path.nodes[path.nodes.length - 1];

    const impact = scenario.nodes[last].impact || 5;

    const weakness = Math.max(
        0,
        ...path.edges.map(edge => edge.risk || 0)
    );

    return Math.min(
        100,
        10 + impact * 4 + weakness * 4 + path.nodes.length * 2
    );
}

// FIND BEST REMEDIATION SET

function bestFixes() {
    // Exact optimization for small synthetic scenarios: choose the fewest
    // additional permission changes that block EVERY critical-asset path.
    const scenario = scenarios[currentScenario];
    const available = scenario.fixes.filter(f => !applied.has(f.id));
    let best = null;
    for (let mask = 0; mask < (1 << available.length); mask++) {
        const choices = available.filter((f, i) => (mask & (1 << i)) !== 0);
        if (best && choices.length >= best.length) continue;
        const candidate = new Set([...applied, ...choices.map(f => f.id)]);
        if (findPaths(candidate).length === 0) best = choices.map(f => f.id);
    }
    return best || [];
}

// DISPLAY RESULTS

function escapeScenario(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function render() {

    const scenario = scenarios[currentScenario];

    const paths = findPaths();

    let html = `
        <div class="stat" style="margin-top:20px;">
            <h3>${escapeScenario(scenario.name)}</h3>
            <p>${escapeScenario(scenario.description)}</p>

            <h3>Active Attack Paths: ${paths.length}</h3>

            <p>Reachable Cloud Resources: ${blastRadius()}</p>
        </div>
    `;

    if (paths.length === 0) {

        html += `
            <div class="success">
                No critical attack paths remain in this simulation.
            </div>
        `;

    } else {

        html += `
            <div class="warning">
                Potential security risks detected!
            </div>
        `;
    }

    paths.sort((a, b) => calculateRisk(b) - calculateRisk(a));
    paths.forEach((path, index) => {

        const score = calculateRisk(path);

        const level = score >= 80
            ? "HIGH"
            : score >= 60 ? "MEDIUM" : "LOW";

        const names = path.nodes.map(id =>
            scenario.nodes[id].label
        );

        const issues = path.edges
            .filter(edge => edge.issue)
            .map(edge => edge.issue);

        const graphNodes = path.nodes.map((id, i) => {
            const node = scenario.nodes[id];
            const edge = `<div class="node ${node.type}">${escapeScenario(node.label)}<br><small>${escapeScenario(node.type)}</small></div>`;
            return (i ? '<span class="arrow">➜</span>' : '') + edge;
        }).join("");
        html += `
            <div class="path">
                <h3>Attack Path ${index + 1} · ${level} Priority</h3>
                <div class="graph" aria-label="Potential cloud attack path">${graphNodes}</div>
                <p><b>Route:</b> ${names.map(escapeScenario).join(" → ")}</p>
                <p><b>Calculated Demo Risk:</b> ${score}/100 — ${level}</p>
                <p><b>Detected Weakness:</b> ${issues.map(escapeScenario).join(", ") || "See highlighted permission roles"}</p>
            </div>
        `;
    });

    html += `
        <h3>Recommended Remediation</h3>
    `;

    scenario.fixes.forEach(fix => {

        if (applied.has(fix.id)) {

            html += `
                <div class="success">
                    ${escapeScenario(fix.text)} — Applied
                </div>
            `;

        } else {

            html += `
                <div class="fix">
                    <label>
                        <input
                            type="checkbox"
                            class="scenarioFix"
                            value="${fix.id}">
                        ${escapeScenario(fix.text)}
                    </label>
                </div>
            `;
        }
    });

    html += `
        <p>
            <small>
                All scenarios use fictional cloud configuration data.
                No real systems are accessed.
            </small>
        </p>
    `;

    document.getElementById("scenarioResults").innerHTML = html;
}

// VALIDATED IMPORT — no real cloud connection or credentials.
// Supported JSON shape: name, description, nodes, edges, fixes.
function validateScenario(raw) {
    if (!raw || typeof raw !== 'object') throw Error('Expected a JSON object.');
    if (typeof raw.name !== 'string' || raw.name.length > 100 || !raw.name.trim()) throw Error('A short scenario name is required.');
    if (typeof raw.description !== 'string' || raw.description.length > 300) throw Error('A description string is required.');
    if (!raw.nodes || typeof raw.nodes !== 'object' || Array.isArray(raw.nodes)) throw Error('nodes must be an object.');
    const ids = Object.keys(raw.nodes);
    if (!ids.length || ids.length > 35) throw Error('Use 1–35 cloud nodes.');
    if (!ids.some(id => raw.nodes[id]?.type === 'entry') || !ids.some(id => raw.nodes[id]?.type === 'critical')) throw Error('An entry node and a critical asset are both required.');
    const allowedTypes = new Set(['entry', 'service', 'weak', 'critical']);
    for (const id of ids) {
        const item = raw.nodes[id];
        if (!item || typeof item.label !== 'string' || item.label.length > 100 || !allowedTypes.has(item.type)) throw Error('Invalid cloud node: ' + id);
        if (item.impact != null && (!Number.isFinite(item.impact) || item.impact < 0 || item.impact > 10)) throw Error('Impact must be between 0 and 10.');
    }
    if (!Array.isArray(raw.fixes) || raw.fixes.length > 8) throw Error('fixes must be an array of at most 8 fixes.');
    const fixIDs = new Set();
    for (const fix of raw.fixes) {
        if (!fix || typeof fix.id !== 'string' || !fix.id || fix.id.length > 60 || typeof fix.text !== 'string' || fix.text.length > 200 || fixIDs.has(fix.id)) throw Error('Invalid or duplicate fix.');
        fixIDs.add(fix.id);
    }
    if (!Array.isArray(raw.edges) || raw.edges.length > 90) throw Error('edges must be an array of at most 90 links.');
    for (const edge of raw.edges) {
        if (!edge || !ids.includes(edge.from) || !ids.includes(edge.to)) throw Error('Each edge must link existing nodes.');
        if (edge.fix != null && !fixIDs.has(edge.fix)) throw Error('Edge refers to an unknown remediation ID.');
        if (edge.risk != null && (!Number.isFinite(edge.risk) || edge.risk < 0 || edge.risk > 10)) throw Error('Risk must be between 0 and 10.');
        if (edge.issue != null && (typeof edge.issue !== 'string' || edge.issue.length > 200)) throw Error('Invalid issue description.');
    }
    return raw;
}

document.getElementById('scenarioJsonInput').addEventListener('change', async function () {
    if (!this.files?.length) return;
    const status = document.getElementById('scenarioImportStatus');
    try {
        if (this.files[0].size > 100000) throw Error('File too large. Use a small synthetic configuration.');
        const parsed = validateScenario(JSON.parse(await this.files[0].text()));
        // Replace a previous custom dataset rather than accumulating copies.
        const old = scenarios.findIndex(s => s.custom);
        if (old !== -1) { scenarios.splice(old, 1); select.options[old].remove(); }
        scenarios.push({...parsed, custom: true});
        const option = document.createElement('option');
        option.textContent = parsed.name + ' (custom JSON)';
        option.value = String(scenarios.length - 1);
        select.appendChild(option);
        currentScenario = scenarios.length - 1;
        select.value = String(currentScenario);
        applied.clear();
        status.textContent = 'Validated synthetic configuration loaded. Run analysis or simulate fixes below.';
        render();
    } catch (error) {
        status.textContent = 'Import failed: ' + error.message;
    }
});

// BUTTONS

select.addEventListener("change", function () {

    currentScenario = Number(this.value);
    applied.clear();
    render();

});

document.getElementById("scenarioAnalyze")
    .addEventListener("click", render);

document.getElementById("scenarioRecommend")
    .addEventListener("click", function () {

        const recommended = bestFixes();

        document.querySelectorAll(".scenarioFix")
            .forEach(box => {
                box.checked = recommended.includes(box.value);
            });

    });

document.getElementById("scenarioApply")
    .addEventListener("click", function () {

        const selected = document.querySelectorAll(
            ".scenarioFix:checked"
        );

        if (selected.length === 0) {
            alert("Please select a security fix.");
            return;
        }

        selected.forEach(box => {
            applied.add(box.value);
        });

        render();

    });

document.getElementById("scenarioReset")
    .addEventListener("click", function () {

        applied.clear();
        render();

    });

// INITIALIZE

render();

})();