---
title: sctl Browser Privacy Policy
sidebar_label: sctl Browser Privacy Policy
---

sctl Browser is a browser extension developed by scriptcat.org ("we"). It connects your browser to [sctl](https://github.com/scriptscat/sctl), ScriptCat's local control tool that you run on your own computer. This policy covers the sctl Browser extension only; for the ScriptCat extension see the [ScriptCat Privacy Policy](/docs/use/policy/privacy/).

If you have any questions, contact us at [yz@ggnb.top](mailto:yz@ggnb.top) or through [GitHub Issues](https://github.com/scriptscat/sctl/issues).

## Our commitment

**sctl Browser sends no data to us or to any third-party server.** The extension has no analytics, telemetry or ads. Data only travels between your browser and the sctl daemon you run yourself.

## 1. Data the extension handles

The extension reads or changes data only when you, or a local tool you have connected to sctl, run an sctl command:

- Titles and URLs of tabs, windows and tab groups
- Bookmarks, reading list, browsing history, recently closed tabs and downloads
- Cookies of the sites you name
- The list of installed extensions
- Page content and page activity: page automation (snapshots, screenshots, clicks, form filling, running JavaScript) and debugging (console messages, network requests with their headers and bodies)

## 2. Where data goes

- The extension only connects to the sctl daemon address you configure in its popup (default `127.0.0.1:8643`, your own computer), and only after you pair it with a one-time code. The connection is mutually authenticated.
- The daemon hands results to the sctl command line or MCP client that made the request, all running on your own computer.
- If you connect sctl to an MCP client that uses a cloud AI model, whatever that client reads is handled under your agreement with its provider, which is outside this policy. Only connect tools you trust.

## 3. Local storage

The extension keeps its pairing credential, instance name, daemon address, and short-lived state such as pending approval requests in the browser's extension storage. This data stays on your device and is removed when you uninstall the extension. The sctl daemon writes logs and a security audit trail to its data directory on your computer.

## 4. Your control

- Deleting bookmarks and uninstalling extensions wait for your approval in the extension's own approval window.
- While a page is being automated or debugged, the browser shows its standard "debugging this browser" bar, which you can cancel at any time.
- You can disconnect from the extension popup or uninstall the extension at any time.

## 5. What we do not do

- We do not sell or transfer user data.
- We do not use user data for purposes unrelated to the features above.
- We do not use user data to determine creditworthiness or for lending.

## 6. Changes

Updates to this policy are published on this page with a new date below.

---

Last updated: 2026-10-23
