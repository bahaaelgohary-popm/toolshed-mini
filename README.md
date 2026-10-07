# Toolshed Mini

A small web page that works as a catalog of AI skills, plugins and MCP connectors. You can search it, filter by kind and source (official or community), and see each item's tags and last-updated date, newest first.

**Live demo:** https://bahaaelgohary-popm.github.io/toolshed-mini/

## Real and sample items
Each item is marked **Real** or **Sample**.
- **Real** items are working Claude Code skills that live in the `skills/` folder. They have a "Get this skill" button with install steps. Right now there are two for product managers: `user-story-checker` and `release-notes-writer`.
- **Sample** items are made-up data. Their names, owners, versions and dates are invented for demonstration and do not describe real products or organizations.

## Built with Claude Code
This project was designed and built with [Claude Code](https://claude.com/claude-code), Anthropic's coding assistant.

## Run it yourself
You need [Node.js](https://nodejs.org). Then, in this folder:

```
npm start
```

Open http://localhost:8000.

## Add an item
Each item is one file in the `catalog/` folder, with these lines: `name`, `kind` (skill, plugin or mcp-connector), `description`, `owner`, `version`, `source` (official or community), `tags` (comma-separated) and `updated` (YYYY-MM-DD) and `status` (real or sample). A real item also needs `path: skills/<skill-name>`. Run `npm run build` to check the items and refresh `catalog.json`.

## License
[MIT](LICENSE)
