// Packs every file in the "catalog" folder into one catalog.json that the web page reads.
// It also checks each file, so a bad item is caught before it is published.
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "catalog");
const required = ["name", "kind", "description", "owner", "version", "source", "tags", "updated", "status"];
const allowed = {
  kind: ["skill", "plugin", "mcp-connector"],
  source: ["official", "community"],
  status: ["real", "sample"],
};

function parse(file) {
  const item = { id: path.basename(file, ".md") };
  for (const line of fs.readFileSync(path.join(dir, file), "utf8").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) item[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return item;
}

function check(item) {
  const problems = [];
  for (const f of required) if (!item[f]) problems.push(`missing "${f}"`);
  for (const f of Object.keys(allowed))
    if (item[f] && !allowed[f].includes(item[f]))
      problems.push(`"${f}" must be one of: ${allowed[f].join(", ")}`);
  if (item.updated) {
    const d = new Date(item.updated + "T00:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.updated) || isNaN(d) || d.toISOString().slice(0, 10) !== item.updated)
      problems.push('"updated" must be a real date written as YYYY-MM-DD');
  }
  if (item.tags && !splitTags(item.tags).length) problems.push('"tags" needs at least one tag');
  if (item.status === "real") {
    if (item.kind !== "skill") problems.push("only skills can be marked real for now");
    if (!item.path) problems.push('real items need a "path" to their skill folder');
    else problems.push(...checkSkill(item));
  } else if (item.path) problems.push('only real items can have a "path"');
  return problems;
}

// A real skill must be a folder under skills/ with a SKILL.md whose name matches the folder.
function checkSkill(item) {
  const skillsDir = path.join(__dirname, "skills");
  const folder = path.resolve(__dirname, item.path);
  if (path.dirname(folder) !== skillsDir) return ['"path" must look like skills/<skill-name>'];
  const file = path.join(folder, "SKILL.md");
  if (!fs.existsSync(file)) return [`${item.path}/SKILL.md does not exist`];
  const head = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!head) return [`${item.path}/SKILL.md must start with a --- header block`];
  const fields = {};
  for (const line of head[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const problems = [];
  if (fields.name !== path.basename(folder)) problems.push(`${item.path}/SKILL.md "name" must be "${path.basename(folder)}"`);
  if (!fields.description) problems.push(`${item.path}/SKILL.md needs a "description"`);
  return problems;
}

function splitTags(text) {
  return text.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
}

function build() {
  const items = [];
  let failed = false;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const item = parse(file);
    const problems = check(item);
    if (problems.length) {
      failed = true;
      console.error(`catalog/${file}: ${problems.join("; ")}`);
    } else items.push({ ...item, tags: splitTags(item.tags) });
  }
  // Newest first; same date falls back to name so the order is always the same.
  items.sort((a, b) => b.updated.localeCompare(a.updated) || a.name.localeCompare(b.name));
  if (failed) throw new Error("Catalog has problems (see above). Nothing was built.");
  fs.writeFileSync(path.join(__dirname, "catalog.json"), JSON.stringify(items, null, 2));
  console.log(`Built catalog.json with ${items.length} items.`);
}

if (require.main === module) {
  try { build(); } catch (e) { console.error(e.message); process.exit(1); }
}
module.exports = { build };
