const kindLabels = { skill: "Skill", plugin: "Plugin", "mcp-connector": "MCP connector" };
const els = {
  search: document.getElementById("search"),
  kind: document.getElementById("kind"),
  source: document.getElementById("source"),
  status: document.getElementById("status"),
  count: document.getElementById("count"),
  list: document.getElementById("list"),
};
let items = [];

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text; // textContent keeps item text from being run as code
  return e;
}

function formatDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// Install steps for a real skill. The download link is built from the page's own address,
// so it works on the live site and on localhost.
function installBox(item) {
  const name = item.path.split("/").pop();
  const url = new URL(`${item.path}/SKILL.md`, location.href).href;
  const commands = {
    "Windows (PowerShell)": `$dir = "$HOME\\.claude\\skills\\${name}"; New-Item -ItemType Directory -Force $dir | Out-Null; Invoke-WebRequest "${url}" -OutFile "$dir\\SKILL.md"`,
    "Mac or Linux": `mkdir -p ~/.claude/skills/${name} && curl -fsSL "${url}" -o ~/.claude/skills/${name}/SKILL.md`,
  };
  const box = el("details", "get");
  box.append(el("summary", "", "Get this skill"));
  const steps = el("ol", "steps");
  const first = el("li", "", "Copy the command for your computer and run it in a terminal. It saves the skill in your personal skills folder.");
  steps.append(first);
  box.append(steps);
  for (const [label, cmd] of Object.entries(commands)) {
    const head = el("div", "cmdhead");
    const copy = el("button", "copy", "Copy");
    copy.type = "button";
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(cmd).then(
        () => { copy.textContent = "Copied"; setTimeout(() => (copy.textContent = "Copy"), 1500); },
        () => { copy.textContent = "Select and copy by hand"; }
      );
    });
    head.append(el("strong", "", label), copy);
    first.append(head, el("pre", "", cmd));
  }
  steps.append(el("li", "", "Start a new Claude Code session so it picks up the skill."));
  steps.append(el("li", "", `Use it by typing /${name}, or just ask for what it does. Claude will find it.`));
  const link = el("a", "", "Or download SKILL.md by hand");
  link.href = url;
  box.append(el("p", "meta", "Manual install: save the file as " + `.claude/skills/${name}/SKILL.md` + " in your home folder."), link);
  return box;
}

function card(item) {
  const c = el("article", "card");
  c.append(el("h2", "", item.name));
  const tags = el("div", "tags");
  tags.append(el("span", "tag", kindLabels[item.kind] || item.kind));
  tags.append(el("span", `tag ${item.source}`, item.source[0].toUpperCase() + item.source.slice(1)));
  tags.append(el("span", `tag status-${item.status}`, item.status[0].toUpperCase() + item.status.slice(1)));
  const chips = el("div", "tags");
  item.tags.forEach((t) => chips.append(el("span", "chip", t)));
  c.append(tags, el("p", "", item.description), chips,
    el("div", "meta", `${item.owner} · v${item.version} · Updated ${formatDate(item.updated)}`));
  if (item.status === "real") c.append(installBox(item));
  return c;
}

function render() {
  const q = els.search.value.trim().toLowerCase();
  const shown = items.filter((i) =>
    (!els.kind.value || i.kind === els.kind.value) &&
    (!els.source.value || i.source === els.source.value) &&
    (!els.status.value || i.status === els.status.value) &&
    (!q || [i.name, i.description, i.owner, ...i.tags].some((t) => t.toLowerCase().includes(q)))
  );
  els.count.textContent = `${shown.length} of ${items.length} items`;
  els.list.replaceChildren(...(shown.length ? shown.map(card) : [el("p", "empty", "No items match your search.")]));
}

fetch("catalog.json")
  .then((r) => r.json())
  .then((data) => { items = data; render(); })
  .catch(() => { els.count.textContent = "Could not load the catalog."; });

["input", "change"].forEach((ev) => [els.search, els.kind, els.source, els.status].forEach((e) => e.addEventListener(ev, render)));
