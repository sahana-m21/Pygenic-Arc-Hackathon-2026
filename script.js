// PYGENIC ARC - CLOUD SECURITY ANALYZER

// Default synthetic data.
// This allows the website to work offline.

const defaultData = {
    company: "SecureTech Solutions",

    projects: ["A", "B", "C", "D"],

    employees: [
        {name:"Darshan",project:"A",access:["A","B"]},
        {name:"Priya",project:"B",access:["B"]},
        {name:"Rahul",project:"C",access:["C","D"]},
        {name:"Sneha",project:"A",access:["A"]},
        {name:"Kiran",project:"D",access:["D"]},
        {name:"Ananya",project:"B",access:["B"]},
        {name:"Rohan",project:"C",access:["C"]},
        {name:"Meghana",project:"D",access:["D","B"]},
        {name:"Varun",project:"A",access:["A"]},
        {name:"Kavya",project:"B",access:["B"]}
    ],

    nodes: {
        publicAPI: {label:"Public API",type:"entry"},
        webApp: {label:"Web Application",type:"service"},
        serviceRole: {label:"Excessive IAM Role",type:"weak"},
        backupAPI: {label:"Public Backup Endpoint",type:"entry"},
        backupRole: {label:"Broad Backup Role",type:"weak"},
        database: {label:"Customer Database",type:"critical"}
    },

    edges: [
        {from:"publicAPI",to:"webApp"},
        {from:"webApp",to:"serviceRole"},
        {from:"serviceRole",to:"database",fix:"C1"},
        {from:"backupAPI",to:"backupRole"},
        {from:"backupRole",to:"database",fix:"C2"}
    ]
};

let data = JSON.parse(JSON.stringify(defaultData));

let appliedFixes = new Set();


// SAFELY DISPLAY TEXT

function safe(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// FIND EXCESS EMPLOYEE PERMISSIONS

function findPermissionProblems() {

    let problems = [];

    data.employees.forEach(employee => {

        employee.access.forEach(project => {

            let id = employee.name + "_" + project;

            if (
                project !== employee.project &&
                !appliedFixes.has(id)
            ) {

                problems.push({
                    employee: employee.name,
                    assigned: employee.project,
                    extra: project,
                    id: id
                });

            }

        });

    });

    return problems;
}


// FIND CLOUD ATTACK PATHS USING DFS

function findAttackPaths() {

    let paths = [];

    function dfs(current, visited, path) {

        if (paths.length >= 50) return;

        if (data.nodes[current].type === "critical") {
            paths.push([...path]);
            return;
        }

        data.edges.forEach(edge => {

            if (edge.from !== current) return;

            if (edge.fix && appliedFixes.has(edge.fix)) {
                return;
            }

            if (visited.has(edge.to)) return;

            visited.add(edge.to);
            path.push(edge.to);

            dfs(edge.to, visited, path);

            path.pop();
            visited.delete(edge.to);

        });

    }

    Object.keys(data.nodes).forEach(node => {

        if (data.nodes[node].type === "entry") {
            dfs(node, new Set([node]), [node]);
        }

    });

    return paths;
}


// BLAST RADIUS ANALYSIS

function calculateBlastRadius() {

    let visited = new Set();
    let queue = [];

    Object.keys(data.nodes).forEach(node => {

        if (data.nodes[node].type === "entry") {
            visited.add(node);
            queue.push(node);
        }

    });

    while (queue.length > 0) {

        let current = queue.shift();

        data.edges.forEach(edge => {

            if (edge.from !== current) return;

            if (edge.fix && appliedFixes.has(edge.fix)) {
                return;
            }

            if (!visited.has(edge.to)) {
                visited.add(edge.to);
                queue.push(edge.to);
            }

        });

    }

    return [...visited].filter(
        node => data.nodes[node].type !== "entry"
    ).length;
}


// DISPLAY EMPLOYEES

function displayEmployees() {

    let html = "";

    data.employees.forEach(employee => {

        let actualAccess = employee.access.filter(project => {
            return !appliedFixes.has(employee.name + "_" + project);
        });

        let extra = actualAccess.filter(
            project => project !== employee.project
        );

        let status = extra.length > 0
            ? "<span class='bad'>Extra Access</span>"
            : "<span class='good'>Authorized</span>";

        html += `
            <tr>
                <td>${safe(employee.name)}</td>
                <td>Project ${safe(employee.project)}</td>
                <td>${actualAccess.map(p => "Project " + safe(p)).join(", ")}</td>
                <td>${status}</td>
            </tr>
        `;

    });

    document.getElementById("employeeTable").innerHTML = html;
}


// DISPLAY PERMISSION PROBLEMS

function displayPermissionResults(problems) {

    let html = "";

    if (problems.length === 0) {

        html = `
            <div class="success">
                No excessive employee permissions detected.
            </div>
        `;

    } else {

        problems.forEach(problem => {

            html += `
                <div class="warning">
                    <h3>Excess Permission Detected</h3>

                    <p>Employee: ${safe(problem.employee)}</p>

                    <p>Assigned: Project ${safe(problem.assigned)}</p>

                    <p>Extra Access: Project ${safe(problem.extra)}</p>

                    <p>Recommendation: Remove unnecessary access.</p>
                </div>
            `;

        });

    }

    document.getElementById("permissionResults").innerHTML = html;
}


// DISPLAY ATTACK GRAPH

function displayAttackGraph(paths) {

    let html = "";

    if (paths.length === 0) {

        html = `
            <div class="success">
                No path reaches the critical database
                in the current synthetic model.
            </div>
        `;

    } else {

        paths.forEach((path, index) => {

            html += `<h3>Attack Path ${index + 1}</h3>`;
            html += `<div class="graph">`;

            path.forEach((node, i) => {

                let item = data.nodes[node];

                html += `
                    <div class="node ${item.type}">
                        ${safe(item.label)}
                        <br>
                        <small>${safe(item.type)}</small>
                    </div>
                `;

                if (i < path.length - 1) {
                    html += `<span class="arrow">➜</span>`;
                }

            });

            html += `</div>`;

        });

    }

    document.getElementById("attackGraph").innerHTML = html;
}


// DISPLAY SECURITY RISK

function displayRisk(paths, problems) {

    let html = "";

    if (paths.length > 0) {

        html += `
            <div class="warning">
                <h3>HIGH RISK</h3>

                <p>
                    ${paths.length} potential cloud attack path(s)
                    reach the critical customer database.
                </p>
            </div>
        `;

        paths.forEach((path, index) => {

            let names = path.map(
                node => safe(data.nodes[node].label)
            );

            let score = path.includes("serviceRole") ? 90 : 85;

            html += `
                <div class="path">
                    <h3>Path ${index + 1}</h3>

                    <p>${names.join(" → ")}</p>

                    <p>Demo Risk Score: ${score}/100</p>
                </div>
            `;

        });

    } else {

        html = `
            <div class="success">
                <h3>Critical Attack Paths Blocked</h3>

                <p>
                    No active attack path to the customer
                    database remains in this model.
                </p>
            </div>
        `;

    }

    html += `
        <p>Employee Permission Issues: ${problems.length}</p>

        <p>Reachable Cloud Resources: ${calculateBlastRadius()}</p>

        <small>
            Risk scores are simplified demonstration values.
        </small>
    `;

    document.getElementById("riskResults").innerHTML = html;
}


// DISPLAY FIXES

function displayFixes(problems) {

    let html = "";

    problems.forEach(problem => {

        html += `
            <div class="fix">
                <label>
                    <input type="checkbox"
                           class="fixCheckbox"
                           value="${safe(problem.id)}">

                    Remove ${safe(problem.employee)}'s
                    extra access to Project ${safe(problem.extra)}
                </label>
            </div>
        `;

    });

    [
        {
            id: "C1",
            text: "Restrict excessive IAM role access to Customer DB"
        },
        {
            id: "C2",
            text: "Remove broad Backup Role database permission"
        }
    ].forEach(fix => {

        if (!appliedFixes.has(fix.id)) {

            html += `
                <div class="fix">
                    <label>
                        <input type="checkbox"
                               class="fixCheckbox"
                               value="${fix.id}">
                        ${fix.text}
                    </label>
                </div>
            `;

        }

    });

    document.getElementById("fixList").innerHTML = html;
}


// MAIN ANALYSIS

function analyzeSecurity() {

    let problems = findPermissionProblems();

    let paths = findAttackPaths();

    displayEmployees();

    displayPermissionResults(problems);

    displayAttackGraph(paths);

    displayRisk(paths, problems);

    displayFixes(problems);

    document.getElementById("permissionCount").textContent =
        problems.length;

    document.getElementById("pathCount").textContent =
        paths.length;

    document.getElementById("blastCount").textContent =
        calculateBlastRadius();

}


// SELECT ALL RECOMMENDED FIXES

function selectAllFixes() {

    document.querySelectorAll(".fixCheckbox").forEach(box => {
        box.checked = true;
    });

}


// APPLY SIMULATED FIXES

function applyFixes() {

    let selected = document.querySelectorAll(
        ".fixCheckbox:checked"
    );

    if (selected.length === 0) {
        alert("Please select a security fix.");
        return;
    }

    let count = selected.length;

    selected.forEach(box => {
        appliedFixes.add(box.value);
    });

    analyzeSecurity();

    document.getElementById("remediationResults").innerHTML = `
        <div class="success">

            <h3>Remediation Simulation Completed</h3>

            <p>Applied Fixes: ${count}</p>

            <p>
                Remaining Employee Permission Issues:
                ${findPermissionProblems().length}
            </p>

            <p>
                Remaining Critical Attack Paths:
                ${findAttackPaths().length}
            </p>

        </div>
    `;

}


// RESET DEMONSTRATION

function resetDemo() {

    appliedFixes.clear();

    analyzeSecurity();

    document.getElementById("remediationResults").innerHTML =
        "Original vulnerable scenario restored.";

}


// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {

    analyzeSecurity();

    // Allow optional JSON upload without needing a server.

    const dashboard = document.querySelector(".container .card");

    if (dashboard) {

        const label = document.createElement("p");
        label.textContent = "Optional: Load synthetic company JSON data";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json,application/json";

        input.addEventListener("change", async () => {

            if (!input.files.length) return;

            try {

                const text = await input.files[0].text();
                const uploaded = JSON.parse(text);

                if (
                    !Array.isArray(uploaded.employees) ||
                    !uploaded.nodes ||
                    !Array.isArray(uploaded.edges) ||
                    !Array.isArray(uploaded.projects)
                ) {
                    throw new Error("Invalid configuration structure");
                }

                // Check graph references and employee data.

                for (const employee of uploaded.employees) {
                    if (
                        typeof employee.name !== "string" ||
                        typeof employee.project !== "string" ||
                        !Array.isArray(employee.access)
                    ) {
                        throw new Error("Invalid employee details");
                    }
                }

                for (const edge of uploaded.edges) {
                    if (
                        !uploaded.nodes[edge.from] ||
                        !uploaded.nodes[edge.to]
                    ) {
                        throw new Error("Invalid graph connection");
                    }
                }

                data = uploaded;
                appliedFixes.clear();

                analyzeSecurity();

                document.getElementById("remediationResults")
                    .textContent = "New synthetic data loaded.";

            } catch (error) {

                alert("Could not load JSON: " + error.message);

            }

        });

        dashboard.appendChild(label);
        dashboard.appendChild(input);

    }

});