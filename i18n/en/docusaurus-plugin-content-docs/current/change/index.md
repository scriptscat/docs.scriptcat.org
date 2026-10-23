---
title: Changelog
---

import GithubStar from '@site/src/components/GithubStar';

<GithubStar variant="bar" scene="changelog" />

For Beta version changelog, please see [Beta Changelog](./beta-changelog.md)

⚠️ Please note that if you are using Windows 8/7/XP, or your browser kernel version is lower than 120, you need to manually install the [legacy version of ScriptCat](https://github.com/scriptscat/scriptcat/releases). v0.16.x is the last version that supports Manifest V2. Installation steps can be found at: [Install Extension by Loading Unpacked](/use/use.md#load-unpacked-extension-installation).

<a name="1.5.0"></a>

## 1.5.0 (2026-10-23)

v1.5 is a major release. The whole interface has been rebuilt and optimized for mobile. The new External Access feature lets you manage your scripts from the command line and from AI clients through [sctl](https://github.com/scriptscat/sctl). The release also adds a script recycle bin, network rule management (DNR) and redesigned install and update pages, officially supports Firefox MV3, and fixes a large number of GM API, cloud sync and stability issues. See [v1.5 — New Interface & External Access](./v1.5.md) for a feature tour. The ScriptCat AI Agent is still available only in Beta builds and is not yet enabled in the stable release.

### 🔌 External Access: connect the command line and AI clients with sctl

[sctl](https://github.com/scriptscat/sctl) is ScriptCat's companion local bridge, a single cross-platform executable. Once you pair it with a one-time code under **Tools → External Access** in ScriptCat, the `sctl` command in your terminal and [MCP](https://modelcontextprotocol.io/)-capable AI clients such as Claude Code can manage your scripts ([#1573](https://github.com/scriptscat/scriptcat/pull/1573)) (by @cyfung1031):

- List scripts, read and search source by line ranges, install, edit by content anchors, enable, disable and delete.
- Reading source and every write require approval on a confirmation page in the browser by default — Reject, Allow, or Allow for this session — and each category can be switched to allow without asking in the permission policy. External programs cannot approve their own requests, and every operation is recorded in an audit log you can open from the External Access card.
- Communication stays on this machine by default (port 8643), the extension and sctl authenticate each other, and no Native Messaging host is needed.
- With sctl's own **sctl Browser** extension you can also control tabs, manage bookmarks, history and other browser data, automate and debug pages, or hand a CDP endpoint to Playwright / Puppeteer — all from the command line.

```bash
# macOS / Linux (Windows PowerShell: irm https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.ps1 | iex)
curl -fsSL https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.sh | sh
sctl serve      # start the local daemon and keep it running
sctl connect    # in another terminal; enter the printed code under Tools → External Access in ScriptCat
```

See [External Access](/docs/use/external-access/) for the full setup, MCP client configuration and security notes.

### 🚀 Major New Features

- 💄 All-new interface: fully rebuilt with consistent light and dark themes; the script list offers table and card views with advanced filters by status, type, tag and source; layouts are optimized for mobile browsers ([#1514](https://github.com/scriptscat/scriptcat/pull/1514)) (by @CodFrm)
- ✨ Script recycle bin: deleted scripts go to the recycle bin first, where they can be restored (with their original data and permissions), deleted permanently, or cleaned up automatically when they expire; retention defaults to 30 days and can be changed or set to never ([#1585](https://github.com/scriptscat/scriptcat/pull/1585), [#1622](https://github.com/scriptscat/scriptcat/pull/1622)) (by @CodFrm)
- ✨ Network rule management (DNR): under **Tools → Network rules**, remove response headers such as CSP / X-Frame-Options, rewrite request and response headers, block or redirect requests per domain, with scenario templates, drag-to-reorder, bulk actions, quota hints and match testing ([#1598](https://github.com/scriptscat/scriptcat/pull/1598), [#1733](https://github.com/scriptscat/scriptcat/pull/1733)) (by @cyfung1031)
- ✨ Official Firefox MV3 support, with improved sandbox / offscreen communication ([#1561](https://github.com/scriptscat/scriptcat/pull/1561)) (by @cyfung1031)
- ✨ The install page flags directives, values and GM capabilities that are written but have no effect in ScriptCat, and marks ScriptCat-only capabilities [#1713](https://github.com/scriptscat/scriptcat/issues/1713) ([#1742](https://github.com/scriptscat/scriptcat/pull/1742)) (by @CodFrm)
- ✨ Script updates show permissions as a diff against the installed version with unchanged items collapsed, and the permanent security warning banner is gone [#1716](https://github.com/scriptscat/scriptcat/issues/1716) ([#1732](https://github.com/scriptscat/scriptcat/pull/1732)) (by @CodFrm)
- ✨ View script code full-screen on the install page ([#1743](https://github.com/scriptscat/scriptcat/pull/1743)) (by @cyfung1031)
- ✨ New-script templates can be customized separately for normal / background / scheduled scripts under **Settings → Development Tools → Script Templates**, with variables such as `{{name}}`, `{{match}}` and `{{date:YYYY-MM-DD}}` [#1722](https://github.com/scriptscat/scriptcat/issues/1722) ([#1731](https://github.com/scriptscat/scriptcat/pull/1731)) (by @CodFrm)
- ✨ Site-scope quick actions in the popup, always visible and reversible; "Exclude on X" removes the site from `@match` first instead of hard-coding an `@exclude` [#1590](https://github.com/scriptscat/scriptcat/issues/1590) ([#1646](https://github.com/scriptscat/scriptcat/pull/1646), [#1666](https://github.com/scriptscat/scriptcat/pull/1666), [#1696](https://github.com/scriptscat/scriptcat/pull/1696)) (by @CodFrm)
- ✨ More complete backup, restore and import: ScriptCat / Tampermonkey / Violentmonkey custom configuration and settings backup, plus resource repair ([#1554](https://github.com/scriptscat/scriptcat/pull/1554)) (by @CodFrm)
- ✨ Manual download link for local backups ([#1543](https://github.com/scriptscat/scriptcat/pull/1543)) (by @cyfung1031)
- ✨ A "Disabled" option for the icon service turns favicon fetching off completely ([#1637](https://github.com/scriptscat/scriptcat/pull/1637)) (by @CodFrm)

### 🧩 GM API Changes

- ✨ Support the `@exclude-match` metadata key [#1714](https://github.com/scriptscat/scriptcat/issues/1714) ([#1798](https://github.com/scriptscat/scriptcat/pull/1798)) (by @CodFrm)
- ✨ `GM_info.userLanguage` exposes ScriptCat's current interface language [#1018](https://github.com/scriptscat/scriptcat/issues/1018) ([#1799](https://github.com/scriptscat/scriptcat/pull/1799)) (by @CodFrm)
- 🐛 Provide `GM_info.userAgentData` on Firefox, matching Tampermonkey's version granularity and field order [#1752](https://github.com/scriptscat/scriptcat/issues/1752) ([#1754](https://github.com/scriptscat/scriptcat/pull/1754)) (by @cyfung1031)
- 🐛 Native `GM_download` honors `@connect`, consistent with `GM_xmlhttpRequest` ([#1506](https://github.com/scriptscat/scriptcat/pull/1506)) (by @DudeAint)
- 🐛 Native `GM_download` no longer asks for cross-origin permission when downloading a `data:` URI [#1635](https://github.com/scriptscat/scriptcat/issues/1635) ([#1797](https://github.com/scriptscat/scriptcat/pull/1797)) (by @CodFrm)
- 🐛 `GM_download` fires `onerror` when given an empty url ([#1619](https://github.com/scriptscat/scriptcat/pull/1619)) (by @cyfung1031)
- 🐛 Custom cookies in `GM_xmlhttpRequest` replace a same-name cookie instead of being appended ([#1604](https://github.com/scriptscat/scriptcat/pull/1604)) (by @cyfung1031)
- 🐛 `GM_getTab` still returns data saved with `GM_saveTab` after the browser discards the tab [#1791](https://github.com/scriptscat/scriptcat/issues/1791) ([#1796](https://github.com/scriptscat/scriptcat/pull/1796)) (by @CodFrm)

### 🧑‍💻 Editor

- ✨ The "+" in the tab bar can create a normal, background or scheduled script directly ([#1544](https://github.com/scriptscat/scriptcat/pull/1544)) (by @cyfung1031)
- ✨ The resource panel shows `@require` / `@require-css` by file name with the full URL visible and searchable, and a new "View" action previews cached text and image resources ([#1758](https://github.com/scriptscat/scriptcat/pull/1758)) (by @cyfung1031)
- ✨ Flag undefined metadata keys, `@grant` values ScriptCat does not support, and duplicate `@resource` names ([#1608](https://github.com/scriptscat/scriptcat/pull/1608), [#1763](https://github.com/scriptscat/scriptcat/pull/1763), [#1762](https://github.com/scriptscat/scriptcat/pull/1762)) (by @cyfung1031)
- ♻️ Adjust `eslint-plugin-userscripts` rules ([#1510](https://github.com/scriptscat/scriptcat/pull/1510)) (by @cyfung1031)
- 🐛 Fix the missing guard when leaving with unsaved changes, the hidden close button on the active tab, the tab title not updating after a rename, and the empty status bar under the Storage / Resources / Script Settings tabs [#1556](https://github.com/scriptscat/scriptcat/issues/1556) ([#1656](https://github.com/scriptscat/scriptcat/pull/1656), [#1607](https://github.com/scriptscat/scriptcat/pull/1607), [#1755](https://github.com/scriptscat/scriptcat/pull/1755)) (by @CodFrm, @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fix large scripts and resources failing to install or load because of message size limits ([#1745](https://github.com/scriptscat/scriptcat/pull/1745)) (by @cyfung1031)
- 🐛 An `@match` scheme the browser does not support (such as `edge://`) no longer makes a whole batch of scripts fail to register [#1771](https://github.com/scriptscat/scriptcat/issues/1771) ([#1772](https://github.com/scriptscat/scriptcat/pull/1772)) (by @cyfung1031)
- 🐛 Fix scripts silently failing to inject on Edge Dev [#1724](https://github.com/scriptscat/scriptcat/issues/1724) ([#1725](https://github.com/scriptscat/scriptcat/pull/1725)) (by @mikemikimike)
- 🐛 Fix sandbox compatibility of `@inject-into content` scripts on Firefox: add missing EventTarget methods and fix self-reference escapes, stripped interface objects and the separate-realm issue [#1701](https://github.com/scriptscat/scriptcat/issues/1701) ([#1692](https://github.com/scriptscat/scriptcat/pull/1692), [#1697](https://github.com/scriptscat/scriptcat/pull/1697), [#1706](https://github.com/scriptscat/scriptcat/pull/1706)) (by @CodFrm, @cyfung1031)
- 🐛 Correct script resource classification and page resource permission boundaries so `@resource` / `@require-css` / `@require` no longer leak into each other ([#1686](https://github.com/scriptscat/scriptcat/pull/1686)) (by @cyfung1031)
- 🐛 Fix `@run-at context-menu`: a run-at override from the settings panel was lost after re-registration, menu items failed to register, and the script's own `GM_registerMenuCommand` was blocked; the option is also added to script settings [#1649](https://github.com/scriptscat/scriptcat/issues/1649) ([#1718](https://github.com/scriptscat/scriptcat/pull/1718), [#1652](https://github.com/scriptscat/scriptcat/pull/1652)) (by @CodFrm)
- 🐛 Installing from a web link recognizes a renamed script by its download URL, so an upstream rename no longer causes a duplicate install [#1785](https://github.com/scriptscat/scriptcat/issues/1785) ([#1786](https://github.com/scriptscat/scriptcat/pull/1786)) (by @CodFrm)
- 🐛 Fix the script settings page showing the update URL as `meta.js` after an import or WebDAV restore, which rewrote the download URL [#1793](https://github.com/scriptscat/scriptcat/issues/1793) ([#1795](https://github.com/scriptscat/scriptcat/pull/1795)) (by @CodFrm)
- 🐛 `.user.js` files served as `application/x-javascript` now open the install page [#1730](https://github.com/scriptscat/scriptcat/issues/1730) ([#1736](https://github.com/scriptscat/scriptcat/pull/1736)) (by @cyfung1031)
- 🐛 Fix manual update checks for subscriptions having no effect, and refresh the subscription list afterwards [#1773](https://github.com/scriptscat/scriptcat/issues/1773) ([#1781](https://github.com/scriptscat/scriptcat/pull/1781)) (by @CodFrm)
- 🐛 Cloud sync no longer runs on every Service Worker cold start and now runs every 30 minutes; fix sync state consistency and cloud conflict handling, scrambled script order after multi-device sync, sync failures with path-prefixed S3 endpoints (such as Supabase), and the script list and editor staying blank for a long time with cloud sync enabled [#1670](https://github.com/scriptscat/scriptcat/issues/1670) [#1682](https://github.com/scriptscat/scriptcat/issues/1682) [#1723](https://github.com/scriptscat/scriptcat/issues/1723) ([#1678](https://github.com/scriptscat/scriptcat/pull/1678), [#1504](https://github.com/scriptscat/scriptcat/pull/1504), [#1690](https://github.com/scriptscat/scriptcat/pull/1690), [#1729](https://github.com/scriptscat/scriptcat/pull/1729), [#1765](https://github.com/scriptscat/scriptcat/pull/1765)) (by @CodFrm, @cyfung1031)
- 🐛 Install and update pages: fix back / close-tab behavior, the update page failing to close after installing, and update records being overwritten by a stale check snapshot [#1669](https://github.com/scriptscat/scriptcat/issues/1669) [#1648](https://github.com/scriptscat/scriptcat/issues/1648) [#1650](https://github.com/scriptscat/scriptcat/issues/1650) [#1651](https://github.com/scriptscat/scriptcat/issues/1651) ([#1594](https://github.com/scriptscat/scriptcat/pull/1594), [#1675](https://github.com/scriptscat/scriptcat/pull/1675), [#1677](https://github.com/scriptscat/scriptcat/pull/1677)) (by @cyfung1031, @CodFrm)
- 🐛 The batch update page no longer closes itself on a countdown; when check records expire it re-checks automatically and finishes the remaining entries; opening details from a script name reuses the check cache instead of requesting again [#1715](https://github.com/scriptscat/scriptcat/issues/1715) ([#1720](https://github.com/scriptscat/scriptcat/pull/1720), [#1719](https://github.com/scriptscat/scriptcat/pull/1719)) (by @CodFrm)
- 🐛 Popup: fix the global-off notice appearing only sometimes with an empty script list for the current page, false positives in "Running on this page" (and restore iframe scripts), pages outside any tab counted as "Background scripts", and the popup collapsing into a thin strip that pushed the header and footer out of view [#1687](https://github.com/scriptscat/scriptcat/issues/1687) [#1774](https://github.com/scriptscat/scriptcat/issues/1774) [#1800](https://github.com/scriptscat/scriptcat/issues/1800) ([#1694](https://github.com/scriptscat/scriptcat/pull/1694), [#1689](https://github.com/scriptscat/scriptcat/pull/1689), [#1783](https://github.com/scriptscat/scriptcat/pull/1783), [#1801](https://github.com/scriptscat/scriptcat/pull/1801)) (by @CodFrm)
- 🐛 Fix clicks on the New Script button being swallowed by the hover menu; it now creates a user script directly [#1699](https://github.com/scriptscat/scriptcat/issues/1699) ([#1704](https://github.com/scriptscat/scriptcat/pull/1704)) (by @CodFrm)
- 🐛 Clicking the extension update notification activates the changelog tab that was already opened instead of opening another one [#1769](https://github.com/scriptscat/scriptcat/issues/1769) ([#1782](https://github.com/scriptscat/scriptcat/pull/1782)) (by @Pililink)
- 🐛 Clearing matches / excludes / tags / run-at in script settings no longer brings them back ([#1579](https://github.com/scriptscat/scriptcat/pull/1579)) (by @CodFrm)
- 🐛 Avoid scheduled-task errors when cron auto-detects an invalid time zone, and replace an unavailable demo API in the crontab example ([#1531](https://github.com/scriptscat/scriptcat/pull/1531), [#1542](https://github.com/scriptscat/scriptcat/pull/1542)) (by @cyfung1031)
- 🐛 Fix scheduled log cleanup not running ([#1599](https://github.com/scriptscat/scriptcat/pull/1599)) (by @CodFrm)
- 🐛 Fix `window.focus` window focusing and tighten windowId validation ([#1577](https://github.com/scriptscat/scriptcat/pull/1577)) (by @cyfung1031)
- 🐛 Script sync settings are saved immediately ([#1615](https://github.com/scriptscat/scriptcat/pull/1615)) (by @CodFrm)

### ⚡️ Performance Improvements

- ⚡️ Optimize the script loading cache and fix leftover popup menu items ([#1511](https://github.com/scriptscat/scriptcat/pull/1511)) (by @cyfung1031)
- ⚡️ Chunked resource downloads decode only the requested range, so large resources download faster ([#1753](https://github.com/scriptscat/scriptcat/pull/1753)) (by @cyfung1031)
- ⚡️ Use `structured_clone` serialization for internal extension messages on Chromium 148+ ([#1534](https://github.com/scriptscat/scriptcat/pull/1534)) (by @cyfung1031)

### 🎨 UI Improvements

- 💄 Android layout: dynamic viewport height, and tables, settings rows and the log stats bar re-flow on narrow screens ([#1636](https://github.com/scriptscat/scriptcat/pull/1636)) (by @RenjiYuusei)
- 💄 The three list pages use one adaptive list row on desktop and mobile, so script names are no longer squeezed out in narrow windows [#1698](https://github.com/scriptscat/scriptcat/issues/1698) ([#1709](https://github.com/scriptscat/scriptcat/pull/1709)) (by @CodFrm)
- 💄 The batch update page splits updates into "Related" (current site) and "Other updates", each with its own select-all; similarity is rounded down; narrow-screen and mobile layouts are improved [#1778](https://github.com/scriptscat/scriptcat/issues/1778) ([#1788](https://github.com/scriptscat/scriptcat/pull/1788)) (by @CodFrm)
- 💄 When a sort is active, the list says so, drag handles show as locked, and there is a way back to the default order; fix color bleed when dragging and swiping on mobile [#1751](https://github.com/scriptscat/scriptcat/issues/1751) ([#1768](https://github.com/scriptscat/scriptcat/pull/1768), [#1756](https://github.com/scriptscat/scriptcat/pull/1756)) (by @CodFrm)
- 💄 A compact popup layout option; the popup script list expansion count is configurable on its own; with the menu expansion count set to 0, expanded menus appear before Edit / Script Settings ([#1551](https://github.com/scriptscat/scriptcat/pull/1551), [#1645](https://github.com/scriptscat/scriptcat/pull/1645), [#1688](https://github.com/scriptscat/scriptcat/pull/1688)) (by @cyfung1031, @CodFrm)

### 🔒 Security Improvements

- 🔒 Upgrade dependencies (including TypeScript 6.0) and fix pnpm audit security warnings (react-router-dom, webdav, fast-xml-parser, dompurify and more) ([#1576](https://github.com/scriptscat/scriptcat/pull/1576), [#1567](https://github.com/scriptscat/scriptcat/pull/1567), [#1760](https://github.com/scriptscat/scriptcat/pull/1760)) (by @cyfung1031)

### 🌐 Internationalization

- 🌐 Add Korean (ko-KR), Turkish (tr-TR) and Brazilian Portuguese (pt-BR), including their chrome.i18n messages.json and Monaco editor languages ([#1568](https://github.com/scriptscat/scriptcat/pull/1568), [#1557](https://github.com/scriptscat/scriptcat/pull/1557), [#1587](https://github.com/scriptscat/scriptcat/pull/1587), [#1605](https://github.com/scriptscat/scriptcat/pull/1605)) (by @moduvoice, @azizaktas, @Lucas559-noob, @CodFrm)

### Others

- 🔧 Update-check failure logs include the URL, making problems easier to track down ([#1693](https://github.com/scriptscat/scriptcat/pull/1693)) (by @cyfung1031)

<a name="1.4.0"></a>

## 1.4.0 (2026-06-26)

This release brings low-level refactoring in preparation for Firefox MV3, along with editor experience improvements (edit menu, Ctrl+Shift+F formatting, Monaco quick fix), multi-platform search engine selection for script discovery, new capabilities such as `@unwrap` / `window.onurlchange` / `@run-at context-menu`, comprehensive hardening of cloud storage sync reliability, and a large batch of GM API, UI, and stability fixes (including a long-running memory leak and prototype pollution security vulnerabilities). The ScriptCat AI Agent is available as a preview in dev / Beta builds and is not yet enabled in the stable release.

### 🚀 Major New Features

- 🧪 ScriptCat AI Agent (**Preview — available in dev / Beta builds only, not yet enabled in stable**) — AI-powered agent system with conversational interaction, tool calling, Skill system, MCP protocol, and more ([#1324](https://github.com/scriptscat/scriptcat/pull/1324)) (by @CodFrm)
- ✨ Support the `@unwrap` metadata tag ([#1213](https://github.com/scriptscat/scriptcat/pull/1213)) (by @cyfung1031)
- ✨ Implement TM's `window.onurlchange` via the Navigation API ([#1315](https://github.com/scriptscat/scriptcat/pull/1315)) (by @cyfung1031)
- ✨ Restore `@run-at context-menu` support ([#1442](https://github.com/scriptscat/scriptcat/pull/1442)) (by @cyfung1031)
- ✨ Script discovery supports multi-platform search engine selection ([#1295](https://github.com/scriptscat/scriptcat/pull/1295)) (by @CodFrm)
- ✨ Add more icon service providers ([#1333](https://github.com/scriptscat/scriptcat/pull/1333)) (by @cyfung1031)
- ✨ Add an update-check icon to the "last updated" column in the script list ([#1304](https://github.com/scriptscat/scriptcat/pull/1304)) (by @CodFrm)
- ✨ Improve edit-conflict and script-name-conflict handling ([#1223](https://github.com/scriptscat/scriptcat/pull/1223)) (by @cyfung1031)

### 🧑‍💻 Editor

- ✨ Add an edit menu to the editor (find, replace, undo, etc.) ([#1303](https://github.com/scriptscat/scriptcat/pull/1303)) (by @CodFrm)
- ✨ Editor supports Ctrl+Shift+F formatting ([#1415](https://github.com/scriptscat/scriptcat/pull/1415)) (by @cyfung1031)
- ✨ Improve Monaco quick fix and user-script metadata hints ([#1461](https://github.com/scriptscat/scriptcat/pull/1461)) (by @cyfung1031)
- 🐛 Fix Ctrl-F / Ctrl-H shortcuts ([#1312](https://github.com/scriptscat/scriptcat/pull/1312)) (by @cyfung1031)
- 🐛 Fix ESLint fix feature not working [#1079](https://github.com/scriptscat/scriptcat/issues/1079) ([#1184](https://github.com/scriptscat/scriptcat/pull/1184)) (by @cyfung1031)
- 🐛 Fix editor CSS layout issues ([#1460](https://github.com/scriptscat/scriptcat/pull/1460)) (by @cyfung1031)
- 🐛 Fix ScriptEditor script list display in light theme ([#1288](https://github.com/scriptscat/scriptcat/pull/1288)) (by @CodFrm)
- 🐛 Fix and improve ScriptEditor issues ([#1258](https://github.com/scriptscat/scriptcat/pull/1258)) (by @cyfung1031)

### ⚡️ Performance Improvements

- 🚑 Fix a potential memory leak during long-running ScriptCat sessions ([#1401](https://github.com/scriptscat/scriptcat/pull/1401)) (by @cyfung1031)
- ⚡️ Remove Baidu filesystem dependency on global DNR rules, switch to per-request cookie disabling ([#1377](https://github.com/scriptscat/scriptcat/pull/1377)) (by @cyfung1031)
- ⚡️ Optimize multi-platform search engine selection for script discovery ([#1379](https://github.com/scriptscat/scriptcat/pull/1379)) (by @cyfung1031)
- ⚡️ Use a monospace font for the install page loadingStatus to avoid jitter ([#1381](https://github.com/scriptscat/scriptcat/pull/1381)) (by @cyfung1031)
- ⚡️ Optimize pushValue handling ([#1403](https://github.com/scriptscat/scriptcat/pull/1403)) (by @cyfung1031)
- ⚡️ More complete permission checks and better userScript permission hints ([#1251](https://github.com/scriptscat/scriptcat/pull/1251)) (by @cyfung1031)
- ⚡️ Improve MessageConnect memory management and cleanup mechanism ([#1248](https://github.com/scriptscat/scriptcat/pull/1248)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Harden cloud storage sync reliability (Dropbox / WebDAV / Google Drive / OneDrive authentication, path handling, and retry logic) ([#1374](https://github.com/scriptscat/scriptcat/pull/1374) ~ [#1395](https://github.com/scriptscat/scriptcat/pull/1395)) (by @cyfung1031)
- 🐛 Fix multiple cloud sync issues: OneDrive zero-byte upload, Google Drive / OneDrive error normalization, S3 custom metadata modifiedDate ([#1405](https://github.com/scriptscat/scriptcat/pull/1405)) ([#1406](https://github.com/scriptscat/scriptcat/pull/1406)) ([#1408](https://github.com/scriptscat/scriptcat/pull/1408)) (by @cyfung1031)
- 🐛 Remove the WebDAV verify write-probe to avoid false negatives on services with a non-writable root (e.g. Nutstore) ([#1445](https://github.com/scriptscat/scriptcat/pull/1445)) (by @CodFrm)
- 🐛 Fix cross-origin request failure when site access permission is missing ([#1477](https://github.com/scriptscat/scriptcat/pull/1477)) (by @cyfung1031)
- 🐛 Fix Edge Android mobile popup adaptation [#686](https://github.com/scriptscat/scriptcat/issues/686) ([#1507](https://github.com/scriptscat/scriptcat/pull/1507)) (by @CodFrm)
- 🐛 Fix white background flash during initial load [#1497](https://github.com/scriptscat/scriptcat/issues/1497) ([#1498](https://github.com/scriptscat/scriptcat/pull/1498)) (by @cyfung1031)
- 🐛 Fix message connections (GM API / ports) not being cleaned up properly ([#1474](https://github.com/scriptscat/scriptcat/pull/1474)) (by @cyfung1031)
- 🐛 Fix `@match` template mismatch when search is missing ([#1466](https://github.com/scriptscat/scriptcat/pull/1466)) (by @cyfung1031)
- 🐛 Add `protoBaseDescs` to fix ancestor-class inheritance in the Tampermonkey semi-sandbox ([#1463](https://github.com/scriptscat/scriptcat/pull/1463)) (by @cyfung1031)
- 🐛 Fix missing null handling for `GM_xmlhttpRequest` msgConn ([#1433](https://github.com/scriptscat/scriptcat/pull/1433)) (by @cyfung1031)
- 🐛 Fix GM xhr not handling abnormal onloadend correctly ([#1412](https://github.com/scriptscat/scriptcat/pull/1412)) (by @cyfung1031)
- 🐛 Fix ScriptEditor list dynamic update and display issues ([#1414](https://github.com/scriptscat/scriptcat/pull/1414)) (by @cyfung1031)
- 🐛 Fix session rule count issue with concurrent xhr ([#1353](https://github.com/scriptscat/scriptcat/pull/1353)) (by @cyfung1031)
- 🐛 Fix entire page crash caused by an invalid cron expression ([#1327](https://github.com/scriptscat/scriptcat/pull/1327)) (by @cyfung1031)
- 🐛 Fix all scripts failing when a single script times out during batch update check ([#1265](https://github.com/scriptscat/scriptcat/pull/1265)) (by @cyfung1031)
- 🐛 Add extensionEnv handling for isIncognito, userAgent, and run-in ([#1368](https://github.com/scriptscat/scriptcat/pull/1368)) (by @cyfung1031)
- 🐛 Fix onboarding guide button being partially hidden [#1396](https://github.com/scriptscat/scriptcat/issues/1396) ([#1398](https://github.com/scriptscat/scriptcat/pull/1398)) (by @cyfung1031)
- 🐛 Fix tooltip being obscured on the script management page [#1386](https://github.com/scriptscat/scriptcat/issues/1386) ([#1387](https://github.com/scriptscat/scriptcat/pull/1387)) (by @Xdy1579883916)
- 🐛 Fix Sidebar causing abnormal resizing in card mode [#1179](https://github.com/scriptscat/scriptcat/issues/1179) ([#1373](https://github.com/scriptscat/scriptcat/pull/1373)) (by @cyfung1031)
- 🐛 Fix incorrect origin set when installing local files via drag-and-drop ([#1371](https://github.com/scriptscat/scriptcat/pull/1371)) (by @cyfung1031)
- 🐛 Fix language switching prompt message ([#1380](https://github.com/scriptscat/scriptcat/pull/1380)) (by @cyfung1031)
- 🐛 Improve log display UI ([#1372](https://github.com/scriptscat/scriptcat/pull/1372)) (by @cyfung1031)
- 🐛 Fix UserConfigPanel CSS ([#1361](https://github.com/scriptscat/scriptcat/pull/1361)) (by @cyfung1031)
- 🐛 Use `Object.create(null)` for the empty object in create_context ([#1397](https://github.com/scriptscat/scriptcat/pull/1397)) (by @cyfung1031)
- 🐛 Fix silent update and connect permission logic for subscribed scripts ([#1201](https://github.com/scriptscat/scriptcat/pull/1201)) (by @cyfung1031)
- 🐛 Fix log page query button not refreshing the time ([#1294](https://github.com/scriptscat/scriptcat/pull/1294)) (by @CodFrm)

### 🔒 Security Improvements

- 🔒 Fix prototype pollution via untrusted YAML user-config keys ([#1494](https://github.com/scriptscat/scriptcat/pull/1494)) (by @qdzsh)
- 🔒 Fix all npm dependency security vulnerabilities ([#1350](https://github.com/scriptscat/scriptcat/pull/1350)) ([#1364](https://github.com/scriptscat/scriptcat/pull/1364)) ([#1365](https://github.com/scriptscat/scriptcat/pull/1365)) (by @cyfung1031)

### ♻️ Refactoring & Compatibility

- ♻️ Low-level refactoring in preparation for Firefox MV3 adaptation ([#1457](https://github.com/scriptscat/scriptcat/pull/1457)) ([#1480](https://github.com/scriptscat/scriptcat/pull/1480)) (by @cyfung1031)
- ♻️ Refactor script resource update logic (updateResource) and concurrency control, restore resource cache compatibility ([#1193](https://github.com/scriptscat/scriptcat/pull/1193)) (by @cyfung1031)
- ♻️ Replace jszip with JSZipp for ZIP handling (backup import / export), and remove the unused jszip dependency ([#1479](https://github.com/scriptscat/scriptcat/pull/1479)) (by @cyfung1031)
- ♻️ Unify Offscreen ↔ ServiceWorker communication over the postMessage channel ([#1299](https://github.com/scriptscat/scriptcat/pull/1299)) (by @CodFrm)
- ♻️ Refactor VSCodeConnect code ([#1170](https://github.com/scriptscat/scriptcat/pull/1170)) (by @cyfung1031)
- ⚡️ Compress ts.worker.js to 4MB to pass AMO validation, fix MV3 background permission error ([#1221](https://github.com/scriptscat/scriptcat/pull/1221)) (by @cyfung1031)

### 🌐 Internationalization

- 🌐 Fix multi-language terminology translations (mainly improving Traditional Chinese) and add translation terminology guidelines ([#1468](https://github.com/scriptscat/scriptcat/pull/1468)) (by @cyfung1031)

### Others

- ✨ Switch the fetchIconByDomain icon service to scriptcat.org ([#1268](https://github.com/scriptscat/scriptcat/pull/1268)) (by @cyfung1031)
- 🔥 Remove Crowdin and ach-UG pseudo-language related content ([#1385](https://github.com/scriptscat/scriptcat/pull/1385)) (by @CodFrm)

<a name="0.16.15"></a>

## 0.16.15 (2026-05-19)

### 🐛 Bug Fixes

- 🐛 Fix MV2 packaging script build command [#1423](https://github.com/scriptscat/scriptcat/issues/1423) (by @CodFrm)
- 🐛 Adapt to WebExtensions API Changes (Firefox 149-152), including CSP adjustments ([#1448](https://github.com/scriptscat/scriptcat/pull/1448)) (by @cyfung1031)

<a name="0.16.14"></a>

## 0.16.14 (2026-04-26)

### 🚀 Major New Features

- ✨ FirefoxMV2 sync with MV3 main items: TypeScript upgraded to 4.9, tsconfig upgraded to es2022; script templates (normal/crontab/background) aligned with MV3; cron upgraded with `once(...)` expression support; Monaco Editor multi-language support ([#1331](https://github.com/scriptscat/scriptcat/pull/1331)) (by @cyfung1031)

### ♻️ Refactoring & Compatibility

- 🔥 Removed axios dependency to align with MV3 ([#1339](https://github.com/scriptscat/scriptcat/pull/1339)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fixed window.parent nested iframe not receiving postMessage messages ([#1335](https://github.com/scriptscat/scriptcat/pull/1335)) (by @cyfung1031)

<a name="1.3.2"></a>

## 1.3.2 (2026-03-28)

### 🐛 Bug Fixes

- 🐛 Remove Accept header from fetchScriptBody to avoid Error 406 ([#1306](https://github.com/scriptscat/scriptcat/pull/1306)) (by @cyfung1031)
- 🐛 Fix WebDAV cookies authentication conflict and authType support ([#1308](https://github.com/scriptscat/scriptcat/pull/1308)) (by @CodFrm)
- 🐛 Correctly display formatting errors ([#1310](https://github.com/scriptscat/scriptcat/pull/1310)) (by @cyfung1031)
- 🐛 Use chrome.storage.local for device-specific configs to avoid cross-device sync ([#1309](https://github.com/scriptscat/scriptcat/pull/1309)) (by @CodFrm)
- 🐛 Fix code editor hint issues ([#1301](https://github.com/scriptscat/scriptcat/pull/1301)) (by @cyfung1031)
- 🐛 Fix date picker popup clipping in log page ([#1292](https://github.com/scriptscat/scriptcat/pull/1292)) (by @cyfung1031)
- 🐛 Fix unbind button showing when no cloud drive is bound ([#1291](https://github.com/scriptscat/scriptcat/pull/1291)) (by @CodFrm)
- 🐛 Fix popup being obscured ([#1290](https://github.com/scriptscat/scriptcat/pull/1290)) (by @cyfung1031)

<a name="1.3.1"></a>

## 1.3.1 (2026-03-13)

### 🐛 Bug Fixes

- 🚑 Fix environment detection error caused by other extensions injecting chrome.runtime [#1280](https://github.com/scriptscat/scriptcat/issues/1280) ([#1281](https://github.com/scriptscat/scriptcat/pull/1281)) (by @CodFrm)

### Others

- ✅ Add Playwright E2E tests and GM API functional tests ([#1283](https://github.com/scriptscat/scriptcat/pull/1283)) (by @CodFrm)

<a name="1.3.0"></a>

## 1.3.0 (2026-03-10)

This update brings Amazon S3 storage, script runtime options, installation without external website access, and more. It significantly optimizes the messaging system and React performance, fixes numerous GM API, UI, and stability issues, and includes extensive code quality improvements.

### 🚀 Major New Features

- ✨ Add Amazon S3 storage [#1146](https://github.com/scriptscat/scriptcat/issues/1146) ([#1189](https://github.com/scriptscat/scriptcat/pull/1189)) (by @CodFrm)
- ✨ Script runtime options ([#895](https://github.com/scriptscat/scriptcat/pull/895)) (by @CodFrm)
- ✨ Install without external website access + install page layout adjustments ([#842](https://github.com/scriptscat/scriptcat/pull/842)) (by @cyfung1031)
- ✨ Show gray icon when script functionality is disabled [#897](https://github.com/scriptscat/scriptcat/issues/897) (by @CodFrm)
- ✨ Optimize interaction when menu expanded items count is 0 [#868](https://github.com/scriptscat/scriptcat/issues/868) (by @CodFrm)
- ✨ Default `@noframes` in template to prevent common mistakes ([#900](https://github.com/scriptscat/scriptcat/pull/900)) (by @cyfung1031)
- ✨ Prevent install link from being misjudged as new install when script name changes ([#824](https://github.com/scriptscat/scriptcat/pull/824)) (by @cyfung1031)
- ✨ Fix `@grant` conflict validation, add duplicate meta declaration error prompt ([#902](https://github.com/scriptscat/scriptcat/pull/902)) (by @cyfung1031)
- ✨ Accept `@version` with no or empty value ([#1216](https://github.com/scriptscat/scriptcat/pull/1216)) (by @cyfung1031)
- ✨ Adjust hidden editor sidebar position [#1185](https://github.com/scriptscat/scriptcat/issues/1185) ([#1254](https://github.com/scriptscat/scriptcat/pull/1254)) (by @CodFrm)

### 🧩 GM API Changes

- 🐛 Fix GM_addElement issue, move operation to content environment ([#1233](https://github.com/scriptscat/scriptcat/pull/1233)) (by @cyfung1031)
- 🐛 Add `conflictAction` parameter to `GM_download` ([#1250](https://github.com/scriptscat/scriptcat/pull/1250)) (by @cyfung1031)
- 🐛 Fix GM API async declarations, correctly return Promise ([#1169](https://github.com/scriptscat/scriptcat/pull/1169)) (by @cyfung1031)
- ♻️ Firefox compatibility: GM_setClipboard ([#928](https://github.com/scriptscat/scriptcat/pull/928)) (by @cyfung1031)
- 🐛 Fix GM_value issue [#1192](https://github.com/scriptscat/scriptcat/issues/1192) (by @CodFrm)
- 🐛 Fix download filename not supporting folders ([#1203](https://github.com/scriptscat/scriptcat/pull/1203)) (by @cyfung1031)

### ⚡️ Performance Improvements

- ♻️ Refactor messaging system: use storage.local broadcast + Firefox MV3 scripting compliance + untraceable dynamic sync MessageFlag ([#1067](https://github.com/scriptscat/scriptcat/pull/1067)) (by @cyfung1031)
- ⚡️ Fix React re-render issues (ScriptCard & ScriptTable) ([#1182](https://github.com/scriptscat/scriptcat/pull/1182)) (by @cyfung1031)
- ⚡️ Fix React re-render issues (Popup) ([#1181](https://github.com/scriptscat/scriptcat/pull/1181)) (by @cyfung1031)
- ⚡️ Optimize Repo performance ([#1232](https://github.com/scriptscat/scriptcat/pull/1232)) (by @CodFrm)
- ⚡️ Move metadata out of chrome.storage.session ([#1027](https://github.com/scriptscat/scriptcat/pull/1027)) (by @cyfung1031)
- ⚡️ Improve charset detection ([#1140](https://github.com/scriptscat/scriptcat/pull/1140)) (by @cyfung1031)
- ⚡️ Store icons by URL to avoid duplicate storage across scripts ([#909](https://github.com/scriptscat/scriptcat/pull/909)) (by @cyfung1031)
- ⚡️ Optimize parseMetadata code ([#903](https://github.com/scriptscat/scriptcat/pull/903)) (by @cyfung1031)
- 🐛 Fix memory leaks and object property exposure ([#1242](https://github.com/scriptscat/scriptcat/pull/1242)) (by @cyfung1031)
- ♻️ Remove Redux, simplify state management ([#1206](https://github.com/scriptscat/scriptcat/pull/1206)) (by @cyfung1031)

### 🧑‍💻 Editor

- ✨ Optimize Monaco Editor settings, add `/* global xxx */` fix ([#1012](https://github.com/scriptscat/scriptcat/pull/1012)) (by @cyfung1031)
- ✨ Monaco Editor hints multilingual support and add `@require-css` hint ([#960](https://github.com/scriptscat/scriptcat/pull/960)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fix conflict between incognito window permission check causing repeated restarts (by @CodFrm)
- 🐛 Fix include `*?*` expression handling [#1271](https://github.com/scriptscat/scriptcat/issues/1271) ([#1272](https://github.com/scriptscat/scriptcat/pull/1272)) (by @CodFrm)
- 🔒 Sanitize announcement notification HTML content with DOMPurify ([#1274](https://github.com/scriptscat/scriptcat/pull/1274)) (by @CodFrm)
- 🐛 Fix script settings - permission management control not working ([#1267](https://github.com/scriptscat/scriptcat/pull/1267)) (by @CodFrm)
- 🐛 Fix popup content following screen scroll [#1256](https://github.com/scriptscat/scriptcat/issues/1256) ([#1263](https://github.com/scriptscat/scriptcat/pull/1263)) (by @cyfung1031)
- 🐛 Fix install link parsing failure [#1235](https://github.com/scriptscat/scriptcat/issues/1235) ([#1260](https://github.com/scriptscat/scriptcat/pull/1260)) (by @cyfung1031)
- 🐛 Fix drag component causing focusin/focusout lag [#1224](https://github.com/scriptscat/scriptcat/issues/1224) ([#1243](https://github.com/scriptscat/scriptcat/pull/1243)) (by @CodFrm)
- 🐛 Fix external extension API not working ([#1217](https://github.com/scriptscat/scriptcat/pull/1217)) (by @cyfung1031)
- 🐛 Fix grant issue ([#1199](https://github.com/scriptscat/scriptcat/pull/1199)) (by @CodFrm)
- 🐛 Fix content.js missing UserAgentData ([#1183](https://github.com/scriptscat/scriptcat/pull/1183)) (by @cyfung1031)
- 🐛 Handle script encoding issue [#1115](https://github.com/scriptscat/scriptcat/issues/1115) ([#1138](https://github.com/scriptscat/scriptcat/pull/1138)) (by @CodFrm)
- 🐛 Fix script icon display [#1052](https://github.com/scriptscat/scriptcat/issues/1052) ([#1104](https://github.com/scriptscat/scriptcat/pull/1104)) (by @CodFrm)
- 🐛 Add UnoCSS prefix to resolve CSS conflicts, fix CSS layout ([#1013](https://github.com/scriptscat/scriptcat/pull/1013)) (by @cyfung1031)
- 🐛 Clear existing Alarm when choosing irregular script update check ([#996](https://github.com/scriptscat/scriptcat/pull/996)) (by @cyfung1031)
- 🐛 Import & export - fix incorrect script last modified date/time ([#951](https://github.com/scriptscat/scriptcat/pull/951)) (by @cyfung1031)
- 🐛 Fix i18n prefix language script name and description display [#1123](https://github.com/scriptscat/scriptcat/issues/1123) (by @CodFrm)
- 🐛 Fix unregister not executing correctly ([#1231](https://github.com/scriptscat/scriptcat/pull/1231)) (by @cyfung1031)

### ♻️ Refactoring & Compatibility

- ♻️ userScripts / scripting API adjustments, enhance compatibility (redo #704) ([#925](https://github.com/scriptscat/scriptcat/pull/925)) (by @cyfung1031)
- ♻️ Cron related changes: bug fixes, i18n, once expression enhancement, upgrade cron library ([#1126](https://github.com/scriptscat/scriptcat/pull/1126)) (by @cyfung1031)
- ♻️ Refactor and optimize script icon loading ([#893](https://github.com/scriptscat/scriptcat/pull/893)) (by @CodFrm)
- ♻️ Enhance text decoding ([#1166](https://github.com/scriptscat/scriptcat/pull/1166)) (by @cyfung1031)
- ⬆️ Upgrade swc compatible kernel version ([#1186](https://github.com/scriptscat/scriptcat/pull/1186)) (by @cyfung1031)

### 🎨 UI Improvements

- 🎨 Change default extension icon badge number to script count [#989](https://github.com/scriptscat/scriptcat/issues/989) (by @CodFrm)
- 🎨 Make install page URL prettier ([#993](https://github.com/scriptscat/scriptcat/pull/993)) (by @cyfung1031)
- 🐛 Refactor DraggableEntry, fix card height alignment ([#1245](https://github.com/scriptscat/scriptcat/pull/1245)) (by @cyfung1031)

### Misc

- 🔒 Security improvements (DOMPurify, npm dependency vulnerability fixes)
- 👷 Rspack bundling optimization, build toolchain fixes
- ⬆️ Dependency version updates

**Full changelog:** [Compare v1.2.6...v1.3.0](https://github.com/scriptscat/scriptcat/compare/v1.2.6...v1.3.0)

<a name="1.2.6"></a>

## 1.2.6 (2026-02-03)

### Fixed

- 🐛 Fix structuredClone error ([#1192](https://github.com/scriptscat/scriptcat/issues/1192)) [[265e122](https://github.com/scriptscat/scriptcat/commit/265e122342366b166d3122cc8da485cb1295b924)] (by @cyfung1031)

<a name="1.2.5"></a>

## 1.2.5 (2026-02-02)

### Fixed

- 🐛 Fix script sync deletion issue [#1158](https://github.com/scriptscat/scriptcat/issues/1158) [[5e91a31](https://github.com/scriptscat/scriptcat/commit/5e91a31e02761ba8061e3de1f4d15fc1d964346c)] (by @CodFrm)
- 🐛 Compatible with TM &#x60;@match www.website.com/*&#x60; ([#1165](https://github.com/scriptscat/scriptcat/issues/1165)) [[da66ff7](https://github.com/scriptscat/scriptcat/commit/da66ff70d25c3087cb8405289dc8b14df9c15f05)] (by @cyfung1031)
- 🐛 Edge latest version 144 adds allow user scripts [#1157](https://github.com/scriptscat/scriptcat/issues/1157) [[f7c1c73](https://github.com/scriptscat/scriptcat/commit/f7c1c730cf39cae02a9e6f815e3113ea9d2a8a05)] (by @CodFrm)
- 🐛 Fix FileSystemObserver continuous monitoring issue ([#1160](https://github.com/scriptscat/scriptcat/issues/1160)) [[9556769](https://github.com/scriptscat/scriptcat/commit/95567690d1bf77bfe8bedfd6a94c88949a77e115)] (by @cyfung1031)
- 🐛 locales.ts minor fixes ([#1154](https://github.com/scriptscat/scriptcat/issues/1154)) [[1c44b68](https://github.com/scriptscat/scriptcat/commit/1c44b680dab3a95a51eb73cf92531efd0a192dc9)] (by @cyfung1031)
- 🐛 Fix popup update window time issue ([#1155](https://github.com/scriptscat/scriptcat/issues/1155)) [[c17f761](https://github.com/scriptscat/scriptcat/commit/c17f761807fb9b14aff09b9b08d19e4cbe72b8a5)] (by @cyfung1031)
- 🐛 Fix i18n prefix language script name and description display [#1123](https://github.com/scriptscat/scriptcat/issues/1123) [[7ef7355](https://github.com/scriptscat/scriptcat/commit/7ef7355632fc989fa1cad44fd2069ff840bbd8df)] (by @CodFrm)
- 🐛 Handle value reference issue [#1141](https://github.com/scriptscat/scriptcat/issues/1141) ([#1147](https://github.com/scriptscat/scriptcat/issues/1147)) [[0892fcd](https://github.com/scriptscat/scriptcat/commit/0892fcd452758030553c33ddf14f1ce4bc6d3efc)] (by @CodFrm)

<a name="1.2.4"></a>

## 1.2.4 (2026-01-07)

Fixed synchronization bugs, and version updates will no longer automatically open the changelog page

### Added

- ✨ Sync deletion is now disabled by default ([#958](https://github.com/scriptscat/scriptcat/issues/958)) [[9c4c7dc](https://github.com/scriptscat/scriptcat/commit/9c4c7dc411357746db43a306d97ac41a71f2b49c)] (by @cyfung1031)
- ✨ Editor now supports GM.\* ([#1129](https://github.com/scriptscat/scriptcat/issues/1129)) [[bea0192](https://github.com/scriptscat/scriptcat/commit/bea0192c6cc50eff2ed4e1cc5dcc25f36bbe10e7)] (by @cyfung1031)

### Changed

- ♻️ Optimize changelog page opening logic [#1110](https://github.com/scriptscat/scriptcat/issues/1110) [[d3ffedc](https://github.com/scriptscat/scriptcat/commit/d3ffedcffe752ca548f87f1640072fcd871b8604)] (by @CodFrm)

### Fixed

- 🐛 scriptcat.d.tpl &amp; type fixes ([#1130](https://github.com/scriptscat/scriptcat/issues/1130)) [[dd22ef5](https://github.com/scriptscat/scriptcat/commit/dd22ef544684d69e24a7aae098cb05cbab03daa8)] (by @cyfung1031)
- 🐛 Fix cloud sync issues ([#1133](https://github.com/scriptscat/scriptcat/issues/1133)) [[a9383d2](https://github.com/scriptscat/scriptcat/commit/a9383d2012eb3953dc33c8886ce3891f404fa100)] (by @CodFrm)
- 🐛 Fix &#x60;GM_addElement(&quot;tagName&quot;)&#x60; error ([#1120](https://github.com/scriptscat/scriptcat/issues/1120)) [[ad19de5](https://github.com/scriptscat/scriptcat/commit/ad19de5c1793c8c079bedbf1b11c7c2ae27a469e)] (by @cyfung1031)
- 🐛 Remove cleanup logic and optimize checkuserscript logic ([#1113](https://github.com/scriptscat/scriptcat/issues/1113)) [[e635911](https://github.com/scriptscat/scriptcat/commit/e635911a3c11c3cb8acd1cfd507cb777e5ee7236)] (by @CodFrm)

### Miscellaneous

- 🏷️ TypeScript revisions ([#1127](https://github.com/scriptscat/scriptcat/issues/1127)) [[b455724](https://github.com/scriptscat/scriptcat/commit/b4557244191018c18d5ce8ea8e8627bcfb7f7cdd)] (by @cyfung1031)
- 📝 Example comment supplements ([#1131](https://github.com/scriptscat/scriptcat/issues/1131)) [[292549e](https://github.com/scriptscat/scriptcat/commit/292549ed0f65952fe9f269aace23eefc7d6a3a0f)] (by @cyfung1031)

<a name="1.2.3"></a>

## 1.2.3 (2025-12-20)

Some bug fixes

### Changed

- ⚡ Optimize next run time display [#1093](https://github.com/scriptscat/scriptcat/issues/1093) [[324ce51](https://github.com/scriptscat/scriptcat/commit/324ce515c84699ca8d3bf1ee447fc6ef0656ae0d)] (by @CodFrm)

### Fixed

- 🐛 Fix URL matching issue for early scripts ([#1096](https://github.com/scriptscat/scriptcat/issues/1096)) [[a77effb](https://github.com/scriptscat/scriptcat/commit/a77effbab5ab4d1752065ef943d9c050ff99c066)] (by @CodFrm)
- 🐛 Fix issue with update popup window displaying too briefly ([#1088](https://github.com/scriptscat/scriptcat/issues/1088)) [[b2b2d5c](https://github.com/scriptscat/scriptcat/commit/b2b2d5c41ff70ee5430f7d8d156f480ac8fc3a1a)] (by @cyfung1031)
- 🐛 Fix abnormal display when userscript notification is enabled ([#1086](https://github.com/scriptscat/scriptcat/issues/1086)) ([959c4db](https://github.com/scriptscat/scriptcat/commit/959c4dbed92f7bfe22a2f8ebb775c4189b5ff076))
- 🐛 responseHeaders: &#x60;TM compatibility: \r\n&#x60; ([#1085](https://github.com/scriptscat/scriptcat/issues/1085)) [[15232c8](https://github.com/scriptscat/scriptcat/commit/15232c8543d93abfdafa1353d39d8a15d1dc385f)] (by @cyfung1031)
- 🐛 Fix GM XHR issues ([#1082](https://github.com/scriptscat/scriptcat/issues/1082)) [[3d987c3](https://github.com/scriptscat/scriptcat/commit/3d987c300242a3c765146359c35ecd6d998f792c)] (by @CodFrm)

### Miscellaneous

- 🌐 Handling i18n issues on popup pages [#1081](https://github.com/scriptscat/scriptcat/issues/1081) [[6b17d71](https://github.com/scriptscat/scriptcat/commit/6b17d7100e8572d72b3b7aaf8ea38be9cdf33f5f)] (by @CodFrm)

<a name="1.2.2"></a>

## 1.2.2 (2025-12-13)

Some bug fixes

### Fixed

- 🐛 Fix frequent background synchronization issue ([#1076](https://github.com/scriptscat/scriptcat/issues/1076)) [[45dc39b](https://github.com/scriptscat/scriptcat/commit/45dc39baa0f3326cf12e97312ab632dc46ba40f2)] (by @CodFrm)
- 🐛 Fix special tab handling issue [#1066](https://github.com/scriptscat/scriptcat/issues/1066) ([50904fb](https://github.com/scriptscat/scriptcat/commit/50904fb46efdea10fd57677bc2d28c770b47e861))
- 🐛 Fix script handling without match rules [#1071](https://github.com/scriptscat/scriptcat/issues/1071) ([560cdc0](https://github.com/scriptscat/scriptcat/commit/560cdc01fc0fc27fb7d0e3b877c63ba431206668))
- 🐛 Fix CI packaging issue that removed background optional permissions [[1f002f0](https://github.com/scriptscat/scriptcat/commit/1f002f0edf9892f023ae93b8522ff7c5e4a96559)] (by @CodFrm)
- 🐛 Fix ignore discarded tab ([#1058](https://github.com/scriptscat/scriptcat/issues/1058)) [[6165bf4](https://github.com/scriptscat/scriptcat/commit/6165bf48eb1d53ede0561c85c30135446c2ff882)] (by @cyfung1031)

<a name="1.2.1"></a>

## 1.2.1 (2025-12-06)

Some bug fixes and handling of background running options.

### Added

- ✨ Add background running option ([#1048](https://github.com/scriptscat/scriptcat/issues/1048)) [[626e84d](https://github.com/scriptscat/scriptcat/commit/626e84dbd4dda0731e0a5ffdbdf71ae10e884489)] (by @CodFrm)

### Fixed

- 🐛 Fix message listener reset issue caused by document.write ([#1055](https://github.com/scriptscat/scriptcat/issues/1055)) [[1f3a3ec](https://github.com/scriptscat/scriptcat/commit/1f3a3ec335ed4b519599e9aa3036c66b6f0d10b2)] (by @CodFrm)
- 🐛 Fix list view filtering functionality [[e272dc6](https://github.com/scriptscat/scriptcat/commit/e272dc6ed151c15a1ef785b70ae100cb9e74a5dd)] (by @CodFrm)
- 🐛 Handle UserAgentData in early phase ([#1045](https://github.com/scriptscat/scriptcat/issues/1045)) [[b4e08a8](https://github.com/scriptscat/scriptcat/commit/b4e08a812a08f42037837bbee54610ebc565063f)] (by @CodFrm)
- 🐛 Restore useOpen option for GM_openInTab [#1043](https://github.com/scriptscat/scriptcat/issues/1043) ([#1044](https://github.com/scriptscat/scriptcat/issues/1044)) [[7f30198](https://github.com/scriptscat/scriptcat/commit/7f30198909824871e694d5ffbe7088e44a6d0b45)] (by @cyfung1031)
- 🐛 Fix userScripts undefined issue ([#1041](https://github.com/scriptscat/scriptcat/issues/1041)) [[4f2deda](https://github.com/scriptscat/scriptcat/commit/4f2deda69aa6aae7f6e791be1cd965a440b80e33)] (by @cyfung1031)
- 🐛 Fix incorrect reference to `"monaco-editor"` in `AppContext` ([#983](https://github.com/scriptscat/scriptcat/issues/983)) [[4b8dae1](https://github.com/scriptscat/scriptcat/commit/4b8dae1f49208d13c4d19c4c627762fc1b04ea5e)] (by @cyfung1031)

**Full changelog:** [Compare v1.2.0...v1.2.1](https://github.com/scriptscat/scriptcat/compare/v1.2.0...v1.2.1)

<a name="1.2.0"></a>

## 1.2.0 (2025-11-29)

This update brings script list sidebar, card view, friendlier update check logic, editor configuration, and more. Injection and runtime stability have been significantly improved, fixing critical issues with CSP, sandbox, GM API, while also bringing performance and structural optimizations.

For more details, see the v1.2.0-beta.x changelog and [v1.2](https://docs.scriptcat.org/docs/change/v1.2/) documentation.

### 🚀 Major New Features

- ✨ Script list sidebar [#794](https://github.com/scriptscat/scriptcat/issues/794) (by @CodFrm)
- ✨ Card view [#860](https://github.com/scriptscat/scriptcat/issues/860) (by @CodFrm)
- ✨ Friendlier update check logic [#755](https://github.com/scriptscat/scriptcat/issues/755) (by @cyfung1031)
- ✨ Add editor configuration and editor type definitions [#708](https://github.com/scriptscat/scriptcat/pull/708) (by @CodFrm)
- ✨ Show script count in popup ([#973](https://github.com/scriptscat/scriptcat/issues/973)) [[1134586](https://github.com/scriptscat/scriptcat/commit/1134586ff040ffc0cdddd3538e9ec493950c948a)] (by @cyfung1031)
- ✨ Add layout menu to hide code sidebar [#689](https://github.com/scriptscat/scriptcat/issues/689) [[dd64da7](https://github.com/scriptscat/scriptcat/commit/dd64da719c081acbf21645e2b1e1f38653ffae8c)]
- ✨ Add SC version check button ([#795](https://github.com/scriptscat/scriptcat/issues/795)) [[1680c66](https://github.com/scriptscat/scriptcat/commit/1680c66099120c0e497c1a1f5321f38fe0160ea0)] (by @cyfung1031)
- ✨ Add survey page after extension uninstallation [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]

### 🧩 GM API Changes

- ✨ Support inject into, scripts can now be injected into content environment [#711](https://github.com/scriptscat/scriptcat/issues/711)
- ✨ GM_openInTab supports pinned window, opening in incognito window and other parameters [#788](https://github.com/scriptscat/scriptcat/pull/788) (by @cyfung1031)
- ✨ GM_registerMenuCommand supports submenu and separator [#831](https://github.com/scriptscat/scriptcat/pull/831) (by @cyfung1031)
- 🗑 Remove useOpen option from GM_openInTab [#867](https://github.com/scriptscat/scriptcat/pull/867)
- ♻️ Adjust `@connect` logic ([#969](https://github.com/scriptscat/scriptcat/issues/969)) [[67914d2](https://github.com/scriptscat/scriptcat/commit/67914d2b7d57fa9c69706ae57ee5d3400c2643f9)] (by @cyfung1031)
- ♻️ Refactor `GM_xmlhttpRequest` and related code ([#901](https://github.com/scriptscat/scriptcat/issues/901)) [[fabd2e9](https://github.com/scriptscat/scriptcat/commit/fabd2e944235b460bc73df346b79d23ee4540af7)] (by @cyfung1031)

### Others

- ⚡️ Stability and performance optimizations
- 🐛 Fixed various issues
- ♻️ Code structure optimization
- 🌐 i18n improvements

**Full changelog:** [Compare v1.1.2...v1.2.0](https://github.com/scriptscat/scriptcat/compare/v1.1.2...v1.2.0)

<a name="1.1.2"></a>

## 1.1.2 (2025-09-18)

Bug fixes

### Fixed

- 🐛 Fix sandbox toString issue [#737](https://github.com/scriptscat/scriptcat/issues/737) [[6ca24c9](https://github.com/scriptscat/scriptcat/commit/6ca24c9b171792035803ac4e1c69e473629f9d18)]
- 🐛 Fix badge displaying 0 issue [[026c1d2](https://github.com/scriptscat/scriptcat/commit/026c1d2071dd4cfb6291f005d36717bcdf0a51c3)]
- 🐛 Fix script injection CSP issue [#739](https://github.com/scriptscat/scriptcat/issues/739) [#728](https://github.com/scriptscat/scriptcat/issues/728) [[5da21b5](https://github.com/scriptscat/scriptcat/commit/5da21b5e3d0e7e86a1fd5dff57ba03ea641c19fa)]
- 🐛 Fix background script not expanding in popup page [[66ab70f](https://github.com/scriptscat/scriptcat/commit/66ab70fb10c28aaf0c9260a9591aab7e1ae35615)]
- 🐛 Enhance message type validation [#676](https://github.com/scriptscat/scriptcat/issues/676) [[5073795](https://github.com/scriptscat/scriptcat/commit/50737957507ff9af3aa9ba9a6b7d444b643d1ff2)]
- 🐛 Fix GM xhr document issue [#716](https://github.com/scriptscat/scriptcat/issues/716) [[1c46546](https://github.com/scriptscat/scriptcat/commit/1c465462f4e14ae461d54358710f5caf74208af3)]

<a name="1.1.1"></a>

## 1.1.1 (2025-09-07)

### Added

- ✨ Add custom editor configuration and editor type definitions ([#708](https://github.com/scriptscat/scriptcat/issues/708)) [[49eb379](https://github.com/scriptscat/scriptcat/commit/49eb3794774790d61c3ef787c865a9ba6fe82841)]

### Fixed

- 🐛 Fix compatibility issues with older browser versions [#715](https://github.com/scriptscat/scriptcat/issues/715) [[4da8068](https://github.com/scriptscat/scriptcat/commit/4da806879c2b170672814d02e6f8ed98c9fae35b)]
- 💄 Optimize popup menu display when popup window is too small ([288650e](https://github.com/scriptscat/scriptcat/commit/288650e5e4cbdc3fa8658f0754ce427a1b3dec5a))
- 🐛 Fix multiple issues ([#710](https://github.com/scriptscat/scriptcat/issues/710)) [[6a2027a](https://github.com/scriptscat/scriptcat/commit/6a2027ac0bb5e0ed625df570240d068a98a34b31)] (by @WhiteSevs)

### Miscellaneous

- 🌐 Handle i18n issues [[2adf69d](https://github.com/scriptscat/scriptcat/commit/2adf69d6ec3c30186f2c2ef89f97e3cba9e15a66)]

<a name="1.1.0"></a>

## 1.1.0 (2025-09-07)

Numerous bug fixes and compatibility improvements, Dropbox support added, new @early-start feature for faster loading than page load. For more details, see the v1.1.0-beta.x changelog.

### Added

- ✨ Add script runtime environment settings [#628](https://github.com/scriptscat/scriptcat/issues/628) [[0d4a89e](https://github.com/scriptscat/scriptcat/commit/0d4a89efaecf0331dcc7fbb6df006b93a1525846)]
- ✨ Collapse by default when there are no background scripts [#626](https://github.com/scriptscat/scriptcat/issues/626) ([9d0aac6](https://github.com/scriptscat/scriptcat/commit/9d0aac6aae11b96707ca1f7c024a24e9d55f217b))
- ✨ Support Dropbox [#575](https://github.com/scriptscat/scriptcat/issues/575) [[2c66f21](https://github.com/scriptscat/scriptcat/commit/2c66f21f5118bd83a0eaa0f1baa3a31f2233e5b2)]
- ✨ Optimize external.Tampermonkey to check SC installation status when TM is not installed but both TM and SC are enabled ([#703](https://github.com/scriptscat/scriptcat/issues/703)) [[d0115c3](https://github.com/scriptscat/scriptcat/commit/d0115c33657260d803b6091139601b1b20407d4e)] (by @cyfung1031)
- ✨ Add @early-start to load faster than the page ([#649](https://github.com/scriptscat/scriptcat/issues/649)) [[eb097dd](https://github.com/scriptscat/scriptcat/commit/eb097dd146dcd6f8ca712ed883571dbfb3d09f20)]
- ✨ Global code search ([#662](https://github.com/scriptscat/scriptcat/issues/662)) [[f8eafb7](https://github.com/scriptscat/scriptcat/commit/f8eafb7f955dad62c1b41ac477e929bf00c65982)] (by @RenjiYuusei)
- ✨ Add survey page after extension uninstallation [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]
- 📝 Modify installation page and namespace ([6f2f000](https://github.com/scriptscat/scriptcat/commit/6f2f000612908b7a88f6b70c2831092805c63bc7))
- ✨ Add QR code for mobile installation ([348237c](https://github.com/scriptscat/scriptcat/commit/348237c7ce9771c69025386926b1f73710cf6f42))

### Fixed

- 🐛 Fix issue where installation cannot be triggered when network cannot access the installation intermediate page [#705](https://github.com/scriptscat/scriptcat/issues/705) [[5f1e292](https://github.com/scriptscat/scriptcat/commit/5f1e2929d79c470ba4427c3cce01f5cd184a839b)]
- 🐛 Handle `@match *://*domain/*` expression [[039b445](https://github.com/scriptscat/scriptcat/commit/039b4454148947cd3c74de82b87804ee9815e60c)]
- 🐛 Fix extension environment sandbox penetration issue [#700](https://github.com/scriptscat/scriptcat/issues/700) [[a1a868d](https://github.com/scriptscat/scriptcat/commit/a1a868dfe3199e666fe2bcb65cfb2ad0ad3d699b)]
- ✏️ backgroud -&gt; background ([#698](https://github.com/scriptscat/scriptcat/issues/698)) [[2594075](https://github.com/scriptscat/scriptcat/commit/2594075c4a50f4c79fa46bcda08d7b0cbcfe723c)] (by @cyfung1031)
- ✏️ CrhomeStorage -&gt; ChromeStorage ([#693](https://github.com/scriptscat/scriptcat/issues/693)) [[64c536d](https://github.com/scriptscat/scriptcat/commit/64c536dbd5fcb4c29eebc1109202bab69aaa3ee2)] (by @cyfung1031)
- 🐛 Fix GM.getTab and GM.getTabs ([#683](https://github.com/scriptscat/scriptcat/issues/683)) [[31de256](https://github.com/scriptscat/scriptcat/commit/31de256f02b5b61e27f0eec9ea673248ba8faa32)] (by @WhiteSevs)
- 🐛 Fix missing domain in finalUrl ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[545d7c8](https://github.com/scriptscat/scriptcat/commit/545d7c8c0dd69c83bd2f0353518aafe6af81c0f4)] (by @cyfung1031)
- 🐛 Compatibility with lower browser kernels [#647](https://github.com/scriptscat/scriptcat/issues/647) ([bba12d2](https://github.com/scriptscat/scriptcat/commit/bba12d23f04759cb9b7fdb63f0d95ae515ee94a9))
- 🐛 Fix missing domain in finalUrl ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[3ed018a](https://github.com/scriptscat/scriptcat/commit/3ed018a7a54803fcf2e1791316e0166ed0b52007)] (by @cyfung1031)
- 💚 Fix react/jsx-no-literals lint issue [[017b608](https://github.com/scriptscat/scriptcat/commit/017b60886be601e3e0e1719cf249da32d5686c30)]
- 🐛 Compatibility with lower browser kernels [#647](https://github.com/scriptscat/scriptcat/issues/647) [[0e2f817](https://github.com/scriptscat/scriptcat/commit/0e2f8173c8b44bd6ad44bdffc73fa302a96a058e)]
- 🐛 Optimize window.external injection ([#646](https://github.com/scriptscat/scriptcat/issues/646)) [[0b2668a](https://github.com/scriptscat/scriptcat/commit/0b2668aadcab35a33ff9abc4bd030dffb87ea168)] (by @cyfung1031)
- 🐛 Fix issue where cloud storage authentication page cannot auto-close [[7748088](https://github.com/scriptscat/scriptcat/commit/7748088e63c1fc660b6a6ae5613cf04f9da99b8c)]
- 🐛 Fix `@connect` \* not working issue [#623](https://github.com/scriptscat/scriptcat/issues/623) [[76481c8](https://github.com/scriptscat/scriptcat/commit/76481c845b34414a7f15ed18ec61f7dff7eef091)]
- 🐛 Add unit tests and fix `@exclude` issue ([#618](https://github.com/scriptscat/scriptcat/issues/618)) [[0046bb7](https://github.com/scriptscat/scriptcat/commit/0046bb78800a2c46edaac785b8e9592327772a3b)] (by @cyfung1031)
- 🐛 Fix issue where some .user.js links cannot install scripts [#599](https://github.com/scriptscat/scriptcat/issues/599) [[ccd2639](https://github.com/scriptscat/scriptcat/commit/ccd2639858f0f3cde28f284376fe8ed998d935ae)]
- 🐛 Fix new script creation failure [[d42d6e7](https://github.com/scriptscat/scriptcat/commit/d42d6e7d408a84674facf9ab0da6eac0e384502f)]
- 🐛 Fix metadata ([#610](https://github.com/scriptscat/scriptcat/issues/610)) [[4d98cce](https://github.com/scriptscat/scriptcat/commit/4d98cce0ca1281cc58f551ea4e6700e340780d3f)] (by @cyfung1031)
- 🐛 Fix Popup Badge ([#605](https://github.com/scriptscat/scriptcat/issues/605)) [[eff9230](https://github.com/scriptscat/scriptcat/commit/eff92309de99abb0cf48ef4727afaa113bc2fbb6)] (by @cyfung1031)
- 🐛 Fix ScriptEditor.tsx ([#603](https://github.com/scriptscat/scriptcat/issues/603)) [[a9aadba](https://github.com/scriptscat/scriptcat/commit/a9aadba372b813c16bdc5f0aeb07c68981f48c63)] (by @cyfung1031)
- 🐛 Fix code viewer &amp; editor CSS ([#602](https://github.com/scriptscat/scriptcat/issues/602)) [[2e86785](https://github.com/scriptscat/scriptcat/commit/2e8678513efaccd42c8dc2aa89f8b76679aa8420)] (by @cyfung1031)
- 🐛 Fix getFaviconFromDomain concurrency issue ([#597](https://github.com/scriptscat/scriptcat/issues/597)) [[1872fe1](https://github.com/scriptscat/scriptcat/commit/1872fe165ab204b155a56f037c111d2d7776c2b9)] (by @cyfung1031)
- 🐛 Fix tab opening error in multiple windows [#586](https://github.com/scriptscat/scriptcat/issues/586) [[54c1da2](https://github.com/scriptscat/scriptcat/commit/54c1da29c2bd8bd8f5ef2d85b7aed8b334de296f)]
- 🐛 Fix openerTabId compatibility issue ([#586](https://github.com/scriptscat/scriptcat/issues/586)) [[b861fc8](https://github.com/scriptscat/scriptcat/commit/b861fc8620e53b885cad98db03f1dd10ec9d296c)] (by @cyfung1031)

### Miscellaneous

- 📝 Create README_RU.md and CONTRIBUTING_RU.md ([#678](https://github.com/scriptscat/scriptcat/issues/678)) [[597ab03](https://github.com/scriptscat/scriptcat/commit/597ab0378fe5ced01637cf411326ef7845b8ce2b)] (by @Ioann)
- 👷 Compatibility adjustments (pack.js compatibility) ([#669](https://github.com/scriptscat/scriptcat/issues/669)) [[fec45e6](https://github.com/scriptscat/scriptcat/commit/fec45e6606a609b10b79c58d2fcba02c2ce71e16)] (by @cyfung1031)
- 🌐 Refines and expands Vietnamese locale ([#661](https://github.com/scriptscat/scriptcat/issues/661)) [[6847a59](https://github.com/scriptscat/scriptcat/commit/6847a596c4b06c75e13594ef60e4b9dfa5718cf3)] (by @RenjiYuusei)
- 🌐 Translation fixes ([#635](https://github.com/scriptscat/scriptcat/issues/635)) [[19296de](https://github.com/scriptscat/scriptcat/commit/19296de6a3815e5965eb33401a55da9b2bd22bb4)] (by @cyfung1031)
- 🌐 Fix onboarding guide i18n issue [#627](https://github.com/scriptscat/scriptcat/issues/627) [[9683f96](https://github.com/scriptscat/scriptcat/commit/9683f965400ab6a2bac15349aca4335911766eac)]
- 👷 Optimize pack.js code ([#615](https://github.com/scriptscat/scriptcat/issues/615)) [[870dd9b](https://github.com/scriptscat/scriptcat/commit/870dd9bc6b7eff3eceefa915452e773ec0565180)] (by @cyfung1031)
