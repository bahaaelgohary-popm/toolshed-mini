// Tiny local web server for previewing the page. Rebuilds the catalog first.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { build } = require("./build-catalog");

build();

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };
const port = process.env.PORT || 8000;

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(__dirname, url === "/" ? "index.html" : url);
  // Only serve the page files, never the catalog source, scripts or git folder.
  const ok = [".html", ".css", ".json"].includes(path.extname(file)) || file.endsWith("app.js");
  if (!ok || !file.startsWith(__dirname) || file.includes(`${path.sep}.git`) || file.endsWith("package.json")) {
    res.writeHead(404); return res.end("Not found");
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain" });
    res.end(data);
  });
}).listen(port, () => console.log(`Toolshed Mini is running. Open http://localhost:${port}`));
