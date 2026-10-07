const kindLabels = { skill: "Skill", plugin: "Plugin", "mcp-connector": "MCP connector" };
const els = {
  search: document.getElementById("search"),
  kind: document.getElementById("kind"),
  source: document.getElementById("source"),
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

function card(item) {
  const c = el("article", "card");
  c.append(el("h2", "", item.name));
  const tags = el("div", "tags");
  tags.append(el("span", "tag", kindLabels[item.kind] || item.kind));
  tags.append(el("span", `tag ${item.source}`, item.source[0].toUpperCase() + item.source.slice(1)));
  c.append(tags, el("p", "", item.description), el("div", "meta", `${item.owner} · v${item.version}`));
  return c;
}

function render() {
  const q = els.search.value.trim().toLowerCase();
  const shown = items.filter((i) =>
    (!els.kind.value || i.kind === els.kind.value) &&
    (!els.source.value || i.source === els.source.value) &&
    (!q || [i.name, i.description, i.owner].some((t) => t.toLowerCase().includes(q)))
  );
  els.count.textContent = `${shown.length} of ${items.length} items`;
  els.list.replaceChildren(...(shown.length ? shown.map(card) : [el("p", "empty", "No items match your search.")]));
}

fetch("catalog.json")
  .then((r) => r.json())
  .then((data) => { items = data; render(); })
  .catch(() => { els.count.textContent = "Could not load the catalog."; });

["input", "change"].forEach((ev) => [els.search, els.kind, els.source].forEach((e) => e.addEventListener(ev, render)));
