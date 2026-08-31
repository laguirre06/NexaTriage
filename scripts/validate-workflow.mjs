import fs from 'node:fs';
const file = process.argv[2] || 'workflows/nexatriage-ai-ticket-triage.json';
const workflow = JSON.parse(fs.readFileSync(file,'utf8'));
const names = new Set();
for (const node of workflow.nodes) {
  if (names.has(node.name)) throw new Error(`Node duplicado: ${node.name}`);
  names.add(node.name);
}
for (const [source, groups] of Object.entries(workflow.connections)) {
  if (!names.has(source)) throw new Error(`Origem inexistente: ${source}`);
  for (const outputs of Object.values(groups)) for (const output of outputs) for (const edge of output || []) {
    if (!names.has(edge.node)) throw new Error(`Destino inexistente: ${edge.node}`);
  }
}
const raw = JSON.stringify(workflow);
const forbidden = ['sabbrinaa@gmail.com','1vdW8dGHbHKFbxV751EZbUwiZK4x6BMMRsONgdLFw0tk','6a7ca02b9f2522efcde2a7b3'];
for (const value of forbidden) if (raw.includes(value)) throw new Error(`Valor pessoal fixo encontrado: ${value}`);
console.log(`OK: ${workflow.nodes.length} nodes, ${Object.keys(workflow.connections).length} origens, sem IDs pessoais conhecidos.`);
