---
title: Beta Changelog
---

import GithubStar from '@site/src/components/GithubStar';
import BetaTheme from '@site/src/components/BetaTheme';

<BetaTheme />
<GithubStar variant="bar" scene="beta-changelog" />

ScriptCat's version releases are divided into two main branches: stable releases and pre-release versions. For the stable release changelog, please see: [Changelog](./index.md)

Pre-release versions are released before the official stable version. They are typically used to test new features. Pre-release version numbers contain a pre-release identifier, for example:
`1.0.0-beta.1`.

You can obtain pre-release versions from the [Release](https://github.com/scriptscat/scriptcat/releases) page or from the extension store pages below:

- [Chrome](https://chromewebstore.google.com/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/jaehimmlecjmebpekkipmpmbpfhdacom?authuser=0&hl=zh-CN)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/nimmbghgpcjmeniofmpdfkofcedcjpfi)
- [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/scriptcat-pre/)

Additionally, besides pre-releases, ScriptCat builds the extension on [Github Action](https://github.com/scriptscat/scriptcat/actions/workflows/build.yaml) after each code commit is merged to the main branch. If you want to experience the latest features or fixes, you can download them from the [Github Action](https://github.com/scriptscat/scriptcat/actions/workflows/build.yaml) page.

<a name="1.5.0-beta.5"></a>

## 1.5.0-beta.5 (2026-10-15)

This pre-release focuses on polish and fixes: the editor's Resources panel can now preview cached resources and flags unsupported `@grant` values and duplicate `@resource` names; the batch update page groups updates by the current site; and it fixes duplicate installs from web pages after an upstream rename, subscription manual update checks doing nothing, long blank pages while cloud sync is enabled, and unsupported `@match` schemes breaking registration of every script.

### 🧑‍💻 Editor

- ✨ The Resources panel shows `@require` / `@require-css` by file name with the full URL visible and searchable, and adds a View action that previews cached text and image resources (automatic preview up to 1 MiB) ([#1758](https://github.com/scriptscat/scriptcat/pull/1758)) (by @cyfung1031)
- ✨ The editor flags `@grant` values that ScriptCat does not support ([#1763](https://github.com/scriptscat/scriptcat/pull/1763)) (by @cyfung1031)
- ✨ The editor warns about duplicate `@resource` names ([#1762](https://github.com/scriptscat/scriptcat/pull/1762)) (by @cyfung1031)
- 🐛 The Storage, Resources and Script Settings tabs no longer leave an empty status bar ([#1755](https://github.com/scriptscat/scriptcat/pull/1755)) (by @cyfung1031)

### 🧩 GM API Changes

- 🐛 Provide `GM_info.userAgentData` on Firefox and align version granularity and field order with Tampermonkey [#1752](https://github.com/scriptscat/scriptcat/issues/1752) ([#1754](https://github.com/scriptscat/scriptcat/pull/1754)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Installing from a web link now recognizes a renamed script by its download URL, so an upstream rename no longer creates a duplicate install [#1785](https://github.com/scriptscat/scriptcat/issues/1785) ([#1786](https://github.com/scriptscat/scriptcat/pull/1786)) (by @CodFrm)
- 🐛 Fix manual update checks for subscriptions doing nothing, and refresh the subscription list afterwards [#1773](https://github.com/scriptscat/scriptcat/issues/1773) ([#1781](https://github.com/scriptscat/scriptcat/pull/1781)) (by @CodFrm)
- 🐛 A `@match` scheme the browser does not support (such as `edge://`) no longer makes registration of the whole script batch fail [#1771](https://github.com/scriptscat/scriptcat/issues/1771) ([#1772](https://github.com/scriptscat/scriptcat/pull/1772)) (by @cyfung1031)
- 🐛 Fix the script list and editor staying blank for a long time while cloud sync is enabled ([#1765](https://github.com/scriptscat/scriptcat/pull/1765)) (by @CodFrm)
- 🐛 Pages that do not belong to any tab are no longer counted in the popup's background script list [#1774](https://github.com/scriptscat/scriptcat/issues/1774) ([#1783](https://github.com/scriptscat/scriptcat/pull/1783)) (by @CodFrm)
- 🐛 Clicking the extension update notification focuses the changelog page that was already opened instead of opening another one [#1769](https://github.com/scriptscat/scriptcat/issues/1769) ([#1782](https://github.com/scriptscat/scriptcat/pull/1782)) (by @Pililink)

### ⚡️ Performance Improvements

- ⚡️ Chunked resource downloads decode only the requested range, making large resource downloads faster ([#1753](https://github.com/scriptscat/scriptcat/pull/1753)) (by @cyfung1031)

### 🎨 UI Improvements

- 💄 The batch update page splits updates into "related to this site" and "other updates", each with its own select-all; similarity is rounded down so anything below 100% is never shown as 100%; and the narrow-screen and mobile layouts are improved [#1778](https://github.com/scriptscat/scriptcat/issues/1778) ([#1788](https://github.com/scriptscat/scriptcat/pull/1788)) (by @CodFrm)
- 💄 When a sort order is active, the list states it clearly, drag handles show as locked, and there is a way back to the default order [#1751](https://github.com/scriptscat/scriptcat/issues/1751) ([#1768](https://github.com/scriptscat/scriptcat/pull/1768)) (by @CodFrm)
- 💄 Fix color bleed when dragging or swiping scripts on mobile, and adjust the desktop drag cursor ([#1756](https://github.com/scriptscat/scriptcat/pull/1756)) (by @CodFrm)

### 🔒 Security Improvements

- 🔒 Upgrade dependencies to resolve pnpm audit security warnings (react-router-dom, webdav, fast-xml-parser, dompurify and more) ([#1760](https://github.com/scriptscat/scriptcat/pull/1760)) (by @cyfung1031)

<a name="1.5.0-beta.4"></a>

## 1.5.0-beta.4 (2026-09-18)

This pre-release reworks the install page: before installing you can see which directives and GM capabilities ScriptCat will not honour, an update highlights only the permissions that actually changed, and the code can be viewed full screen. New-script templates are now customisable per script type. It also removes the message size limit that blocked large scripts and resources, and fixes Firefox sandbox compatibility, script resource classification, and a batch of install / update issues.

### 🚀 Major New Features

- ✨ The install page now flags directives, values and GM capabilities that are declared but have no effect in ScriptCat, and marks the ones that are ScriptCat-only [#1713](https://github.com/scriptscat/scriptcat/issues/1713) ([#1742](https://github.com/scriptscat/scriptcat/pull/1742)) (by @CodFrm)
- ✨ When updating a script, permissions are shown as a diff against the installed version with unchanged entries collapsed; the permanent security warning banner is removed [#1716](https://github.com/scriptscat/scriptcat/issues/1716) ([#1732](https://github.com/scriptscat/scriptcat/pull/1732)) (by @CodFrm)
- ✨ New-script templates can be customised per type (normal / background / scheduled) under Settings → Developer Tools → Script Templates, with variables such as `{{name}}`, `{{match}}` and `{{date:YYYY-MM-DD}}` [#1722](https://github.com/scriptscat/scriptcat/issues/1722) ([#1731](https://github.com/scriptscat/scriptcat/pull/1731)) (by @CodFrm)
- ✨ Added a full-screen view for the script code on the install page ([#1743](https://github.com/scriptscat/scriptcat/pull/1743)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fixed large scripts and large resources failing to install or load because of the message size limit ([#1745](https://github.com/scriptscat/scriptcat/pull/1745)) (by @cyfung1031)
- 🐛 Fixed split-realm sandbox compatibility for `@inject-into content` scripts on Firefox [#1701](https://github.com/scriptscat/scriptcat/issues/1701) ([#1706](https://github.com/scriptscat/scriptcat/pull/1706)) (by @cyfung1031)
- 🐛 Fixed script resource classification and the page resource permission boundary, so `@resource` / `@require-css` / `@require` no longer leak into each other ([#1686](https://github.com/scriptscat/scriptcat/pull/1686)) (by @cyfung1031)
- 🐛 Fixed `@run-at context-menu`: a run-at override set in the script settings was lost after re-registration, the menu item failed to register, and the script's own `GM_registerMenuCommand` was blocked [#1649](https://github.com/scriptscat/scriptcat/issues/1649) ([#1718](https://github.com/scriptscat/scriptcat/pull/1718)) (by @CodFrm)
- 🐛 Fixed script injection silently failing on Edge Dev [#1724](https://github.com/scriptscat/scriptcat/issues/1724) ([#1725](https://github.com/scriptscat/scriptcat/pull/1725)) (by @mikemikimike)
- 🐛 The batch update page no longer closes itself on a countdown; an expired check record now triggers an automatic re-check and continues with the remaining entries [#1715](https://github.com/scriptscat/scriptcat/issues/1715) ([#1720](https://github.com/scriptscat/scriptcat/pull/1720)) (by @CodFrm)
- 🐛 Opening update details from the batch update page now reuses the cached check result instead of refetching, and blocks repeated clicks ([#1719](https://github.com/scriptscat/scriptcat/pull/1719)) (by @CodFrm)
- 🐛 Fixed sync failing against S3 endpoints that carry a path prefix (such as Supabase) [#1723](https://github.com/scriptscat/scriptcat/issues/1723) ([#1729](https://github.com/scriptscat/scriptcat/pull/1729)) (by @CodFrm)
- 🐛 Fixed script MIME type compatibility so a `.user.js` served as `application/x-javascript` also opens the install page [#1730](https://github.com/scriptscat/scriptcat/issues/1730) ([#1736](https://github.com/scriptscat/scriptcat/pull/1736)) (by @cyfung1031)

### ⚡️ Performance Improvements

- ⚡️ Compressed the DNR output compiled from user network rules, merging same-kind response headers into a single rule ([#1733](https://github.com/scriptscat/scriptcat/pull/1733)) (by @cyfung1031)

### 🎨 UI Improvements

- 💄 Fixed an incorrect `overflow-hidden` style ([#1746](https://github.com/scriptscat/scriptcat/pull/1746)) (by @cyfung1031)

<a name="1.5.0-beta.3"></a>

## 1.5.0-beta.3 (2026-09-01)

This pre-release introduces Network Rules (DNR), which can strip CSP and other response headers, rewrite request/response headers, and block or redirect requests on a per-domain basis. Popup site-scope actions are now always available and reversible, and several Firefox sandbox, Popup script list, and multi-device sync ordering issues are fixed.

### 🚀 Major New Features

- ✨ Added Network Rules (DNR): strip CSP / X-Frame-Options and other response headers, rewrite request and response headers, block or redirect requests on matched domains, with scenario templates, rule ordering, bulk actions, quota hints, and match testing ([#1598](https://github.com/scriptscat/scriptcat/pull/1598)) (by @cyfung1031)
- ✨ Popup site-scope actions are now always available; "Exclude on X" now removes the site from `@match` where possible instead of always writing an `@exclude` rule ([#1696](https://github.com/scriptscat/scriptcat/pull/1696)) (by @CodFrm)

### 🔒 Security Improvements

- 🔒 Restricted Agent OPFS write operations to the workspace directory, and added rename and move support [#1572](https://github.com/scriptscat/scriptcat/issues/1572) ([#1578](https://github.com/scriptscat/scriptcat/pull/1578)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fixed the Firefox `@inject-into content` script sandbox missing EventTarget methods, leaking a self-reference, and having interface objects stripped ([#1692](https://github.com/scriptscat/scriptcat/pull/1692)) ([#1697](https://github.com/scriptscat/scriptcat/pull/1697)) (by @CodFrm)
- 🐛 Fixed the Popup "scripts globally disabled" notice showing inconsistently while the current-page script list stayed empty ([#1694](https://github.com/scriptscat/scriptcat/pull/1694)) (by @CodFrm)
- 🐛 Fixed false positives in the Popup "scripts running on this page" list: non-runnable pages are filtered out and iframe scripts are shown again [#1687](https://github.com/scriptscat/scriptcat/issues/1687) ([#1689](https://github.com/scriptscat/scriptcat/pull/1689)) (by @CodFrm)
- 🐛 Fixed script ordering getting scrambled when syncing across multiple devices [#1682](https://github.com/scriptscat/scriptcat/issues/1682) ([#1690](https://github.com/scriptscat/scriptcat/pull/1690)) (by @CodFrm)
- 🐛 Fixed the "new script" button click being swallowed by its hover menu; it now creates a user script directly [#1699](https://github.com/scriptscat/scriptcat/issues/1699) ([#1704](https://github.com/scriptscat/scriptcat/pull/1704)) (by @CodFrm)

### 🎨 UI Improvements

- 💄 Unified the three desktop and mobile list pages into responsive list rows, fixing script names being squeezed out in narrow windows [#1698](https://github.com/scriptscat/scriptcat/issues/1698) ([#1709](https://github.com/scriptscat/scriptcat/pull/1709)) (by @CodFrm)
- 💄 When the menu expand count is 0, the expanded Popup menu now appears before Edit / Script settings ([#1688](https://github.com/scriptscat/scriptcat/pull/1688)) (by @CodFrm)

### Others

- 🔧 Update-check failure logs now include the specific URL, making problems easier to diagnose ([#1693](https://github.com/scriptscat/scriptcat/pull/1693)) (by @cyfung1031)

<a name="1.5.0-beta.2"></a>

## 1.5.0-beta.2 (2026-08-21)

This pre-release improves the built-in Agent's conversation, tool-loop, persistence, and MCP reliability, reworks the popup site-scope operations into a reversible state machine, and fixes several cloud-sync and update-page issues.

### 🚀 Major New Features

- ♻️ Agent conversation, tool-loop, persistence, and MCP reliability improvements [#1545](https://github.com/scriptscat/scriptcat/issues/1545) ([#1549](https://github.com/scriptscat/scriptcat/pull/1549)) (by @cyfung1031)
- ✨ Popup site-scope operations: S1–S4 reversible state machine [#1590](https://github.com/scriptscat/scriptcat/issues/1590) ([#1666](https://github.com/scriptscat/scriptcat/pull/1666)) (by @CodFrm)

### 🧩 GM API Changes

- 🐛 Fix GM_download not triggering onerror when passed an empty url ([#1619](https://github.com/scriptscat/scriptcat/pull/1619)) (by @cyfung1031)

### 🎨 UI Improvements

- 💄 Update-page / install-page / editor UX fixes, and correct update records overwritten by stale check snapshots [#1650](https://github.com/scriptscat/scriptcat/issues/1650) [#1648](https://github.com/scriptscat/scriptcat/issues/1648) [#1651](https://github.com/scriptscat/scriptcat/issues/1651) ([#1677](https://github.com/scriptscat/scriptcat/pull/1677)) (by @CodFrm)

### 🐛 Bug Fixes

- 🐛 Cloud sync no longer triggers on service-worker cold starts; alarm period changed to 30 minutes [#1670](https://github.com/scriptscat/scriptcat/issues/1670) ([#1678](https://github.com/scriptscat/scriptcat/pull/1678)) (by @CodFrm)
- 🐛 Fix the install/update page not closing properly [#1669](https://github.com/scriptscat/scriptcat/issues/1669) ([#1675](https://github.com/scriptscat/scriptcat/pull/1675)) (by @CodFrm)

<a name="1.5.0-beta.1"></a>

## 1.5.0-beta.1 (2026-08-06)

This pre-release highlights two major features — **External Access (MCP bridge)** and a **script recycle bin** — officially supports Firefox MV3, adds Korean, Turkish, and Brazilian Portuguese, and fixes a number of GM API, cloud-sync, and editor issues.

### 🚀 Major New Features

- 💥 New "External Access (MCP bridge)": a local `sctl` daemon unifies CLI and MCP-client access; every script read/write is gated by tiered authorization and a human confirmation page with three levels — Deny / Allow / Allow this session — and every operation is audited ([#1573](https://github.com/scriptscat/scriptcat/pull/1573)) (by @cyfung1031)

  [sctl](https://github.com/scriptscat/sctl) is ScriptCat's companion local bridge, a single cross-platform executable. Once you pair it with a one-time code under **Tools → External Access** in ScriptCat, the `sctl` command in your terminal and [MCP](https://modelcontextprotocol.io/)-capable AI clients such as Claude Code can manage your scripts; see [External Access](/docs/use/external-access/) for the full setup.

  ![sctl architecture: the CLI, AI clients and Playwright reach sctl serve, which talks to ScriptCat and sctl Browser over WebSocket](v1.5.assets/architecture.svg)
- 💥 Script recycle bin: deleted scripts go to the recycle bin first, with restore (preserving the original data and permissions), permanent delete, and expiry-based auto-cleanup; the retention period is configurable (default 30 days, or never) ([#1585](https://github.com/scriptscat/scriptcat/pull/1585)) (by @CodFrm)
- 💥 Official Firefox MV3 support, with improved sandbox/offscreen communication ([#1561](https://github.com/scriptscat/scriptcat/pull/1561)) (by @cyfung1031)
- ✨ Add quick site-scope actions to the popup ([#1646](https://github.com/scriptscat/scriptcat/pull/1646)) (by @CodFrm)
- ✨ Popup script-list expand count is now configurable, separate from the menu expand count ([#1645](https://github.com/scriptscat/scriptcat/pull/1645)) (by @CodFrm)
- ✨ Icon service gains a "disabled" tier to fully turn off favicon fetching ([#1637](https://github.com/scriptscat/scriptcat/pull/1637)) (by @CodFrm)
- ✨ Undefined metadata tags now show a warning in the editor ([#1608](https://github.com/scriptscat/scriptcat/pull/1608)) (by @cyfung1031)
- ✨ Backup/restore/import completeness: ScriptCat/Tampermonkey/Violentmonkey custom config + settings backup + resource repair ([#1554](https://github.com/scriptscat/scriptcat/pull/1554)) (by @CodFrm)

### ♻️ Refactoring & Compatibility

- ♻️ Refactor the client onto the official MCP SDK ([#1643](https://github.com/scriptscat/scriptcat/pull/1643)) (by @CodFrm)

### 🐛 Bug Fixes

- 🐛 Fix GM_xmlhttpRequest custom cookies being appended instead of overriding same-name cookies ([#1604](https://github.com/scriptscat/scriptcat/pull/1604)) (by @cyfung1031)
- 🐛 Fix script-sync state consistency and provider-safe conflict handling ([#1504](https://github.com/scriptscat/scriptcat/pull/1504)) (by @cyfung1031)
- 🐛 Fix scheduled log cleanup no longer working ([#1599](https://github.com/scriptscat/scriptcat/pull/1599)) (by @CodFrm)
- 🐛 Fix missing context-menu run timing in script settings ([#1652](https://github.com/scriptscat/scriptcat/pull/1652)) (by @CodFrm)
- 🐛 Fix install-page back/close-tab logic ([#1594](https://github.com/scriptscat/scriptcat/pull/1594)) (by @cyfung1031)
- 🐛 Fix browser tab title not updating after renaming a saved script ([#1607](https://github.com/scriptscat/scriptcat/pull/1607)) (by @cyfung1031)
- 🐛 Fix window.focus focus behavior and harden windowId validation ([#1577](https://github.com/scriptscat/scriptcat/pull/1577)) (by @cyfung1031)
- 🐛 Fix the editor's active-tab close button being hidden [#1556](https://github.com/scriptscat/scriptcat/issues/1556) (by @CodFrm)
- 🐛 Fix the navigation guard for unsaved editor content ([#1656](https://github.com/scriptscat/scriptcat/pull/1656)) (by @CodFrm)
- 🐛 Fix the recycle-bin same-name script save confirmation wording ([#1622](https://github.com/scriptscat/scriptcat/pull/1622)) (by @CodFrm)
- 🐛 selfMetadata supports empty overrides: fix match/exclude/tag/run-at "delete then revive" ([#1579](https://github.com/scriptscat/scriptcat/pull/1579)) (by @CodFrm)

### 🎨 UI Improvements

- 💄 Fix Android UI adaptation: dynamic viewport height + narrow-screen table/settings-row/log-stat-bar reflow ([#1636](https://github.com/scriptscat/scriptcat/pull/1636)) (by @RenjiYuusei)
- 💄 Add a compact layout option to the popup ([#1551](https://github.com/scriptscat/scriptcat/pull/1551)) (by @cyfung1031)

### 🌐 Internationalization

- 🌐 Add Korean (ko-KR) translation ([#1568](https://github.com/scriptscat/scriptcat/pull/1568)) (by @moduvoice)
- 🌐 Add Turkish (tr-TR) translation ([#1557](https://github.com/scriptscat/scriptcat/pull/1557)) (by @azizaktas)
- 🌐 Add Brazilian Portuguese (pt-BR) translation ([#1587](https://github.com/scriptscat/scriptcat/pull/1587)) (by @Lucas559-noob)
- 🌐 Fill in chrome.i18n messages.json and Monaco editor languages for pt-BR / tr-TR ([#1605](https://github.com/scriptscat/scriptcat/pull/1605)) (by @CodFrm)

### Others

- ⬆️ Upgrade dependencies (incl. TypeScript 6.0) and fix pnpm audit warnings ([#1576](https://github.com/scriptscat/scriptcat/pull/1576), [#1567](https://github.com/scriptscat/scriptcat/pull/1567)) (by @cyfung1031)
- Script-sync settings now save instantly ([#1615](https://github.com/scriptscat/scriptcat/pull/1615)) (by @CodFrm)
- 📝 Improve the store description and README tagline for better "user script" discoverability ([#1553](https://github.com/scriptscat/scriptcat/pull/1553)) (by @CodFrm)

<a name="1.5.0-beta"></a>

## 1.5.0-beta (2026-07-08)

This pre-release brings a **brand-new UI** with a cleaner, more consistent interface and a smoother overall experience, along with dedicated design optimizations for mobile so mobile users get a great experience too. In addition, it adds new-script-type selection in the editor, a manual download link for local backups, and more, while fixing scheduled-task invalid-timezone and native GM_download cross-origin issues. If you have any suggestions about the new UI/UX, feel free to join the discussion on [GitHub](https://github.com/scriptscat/scriptcat/discussions).

### 🎨 UI Improvements

- ♻️ Brand-new UI: a full interface rewrite, with improved mobile adaptation for a better experience on both desktop and mobile ([#1514](https://github.com/scriptscat/scriptcat/pull/1514)) (by @CodFrm)

### 🚀 Major New Features

- ✨ Editor tab-bar "＋" now supports choosing the new script type ([#1544](https://github.com/scriptscat/scriptcat/pull/1544)) (by @cyfung1031)
- ✨ Add a manual download link for local backups ([#1543](https://github.com/scriptscat/scriptcat/pull/1543)) (by @cyfung1031)
- ✨ Enable structured_clone serialization for extension messaging on Chromium 148+ ([#1534](https://github.com/scriptscat/scriptcat/pull/1534)) (by @cyfung1031)
- ✨ Pre-release (beta) versions now auto-open the changelog page after an update (by @CodFrm)

### 🧩 GM API Changes

- 🐛 Make native GM_download honor @connect, like GM_xmlhttpRequest ([#1506](https://github.com/scriptscat/scriptcat/pull/1506)) (by @DudeAint)

### ⚡️ Performance Improvements

- ⚡️ Optimize script loading cache and fix leftover Popup menu items ([#1511](https://github.com/scriptscat/scriptcat/pull/1511)) (by @cyfung1031)

### 🧑‍💻 Editor

- ♻️ Adjust `eslint-plugin-userscripts` rules ([#1510](https://github.com/scriptscat/scriptcat/pull/1510)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Avoid scheduled-task errors caused by cron auto-detecting an invalid timezone ([#1531](https://github.com/scriptscat/scriptcat/pull/1531)) (by @cyfung1031)
- 🐛 Fix the unavailable demo API in the crontab example ([#1542](https://github.com/scriptscat/scriptcat/pull/1542)) (by @cyfung1031)

### 🌐 Localization

- 🌐 Add Turkish language (by @azizaktas)

<a name="1.4.0-beta.4"></a>

## 1.4.0-beta.4 (2026-06-13)

This release fixes Edge Android mobile popup layout, the white background flash during initial load, and cross-origin request failures when site access permission is missing; patches a prototype pollution vulnerability triggered via untrusted YAML user-config keys; refactors script resource updating and ZIP handling (replacing jszip with JSZipp); and continues to improve Firefox MV3 compatibility and localization.

### 🧑‍💻 Editor

- ✨ Improve Monaco quick fix and userscript metadata hints ([#1461](https://github.com/scriptscat/scriptcat/pull/1461)) (by @cyfung1031)
- 🐛 Fix editor CSS layout issues ([#1460](https://github.com/scriptscat/scriptcat/pull/1460)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fix Edge Android mobile popup layout ([#686](https://github.com/scriptscat/scriptcat/issues/686)) ([#1507](https://github.com/scriptscat/scriptcat/pull/1507)) (by @CodFrm)
- 🐛 Fix white background flash during initial load ([#1497](https://github.com/scriptscat/scriptcat/issues/1497)) ([#1498](https://github.com/scriptscat/scriptcat/pull/1498)) (by @cyfung1031)
- 🐛 Fix cross-origin request failure when site access permission is missing ([#1477](https://github.com/scriptscat/scriptcat/pull/1477)) (by @cyfung1031)
- 🐛 Fix message connection (GM API / port) not being cleaned up properly ([#1474](https://github.com/scriptscat/scriptcat/pull/1474)) (by @cyfung1031)
- 🐛 Fix @match template mismatch when search is missing ([#1466](https://github.com/scriptscat/scriptcat/pull/1466)) (by @cyfung1031)
- 🐛 Add `protoBaseDescs` to fix ancestor class inheritance in the Tampermonkey semi-sandbox ([#1463](https://github.com/scriptscat/scriptcat/pull/1463)) (by @cyfung1031)

### 🔒 Security Improvements

- 🔒 Fix prototype pollution via untrusted YAML user-config keys ([#1494](https://github.com/scriptscat/scriptcat/pull/1494)) (by @qdzsh)

### ♻️ Refactoring & Compatibility

- ♻️ Refactor script resource updating (updateResource) and concurrency control, and restore resource cache compatibility ([#1193](https://github.com/scriptscat/scriptcat/pull/1193)) (by @cyfung1031)
- ♻️ Replace jszip with JSZipp for ZIP handling (backup import/export), and remove the unused jszip dependency ([#1479](https://github.com/scriptscat/scriptcat/pull/1479)) (by @cyfung1031)
- ♻️ Improve Firefox MV3 compatibility ([#1457](https://github.com/scriptscat/scriptcat/pull/1457), [#1480](https://github.com/scriptscat/scriptcat/pull/1480)) (by @cyfung1031)

### 🌐 Localization

- 🌐 Fix multi-language terminology translations (notably improving Traditional Chinese) and add translation terminology guidelines ([#1468](https://github.com/scriptscat/scriptcat/pull/1468)) (by @cyfung1031)

<a name="1.4.0-beta.3"></a>

## 1.4.0-beta.3 (2026-05-19)

Continuing the direction set in beta.2, this release further hardens cloud sync reliability (OneDrive/Google Drive/WebDAV error handling and upload flows), fixes a number of ScriptEditor and GM xhr exception-handling issues, and adds Ctrl+Shift+F formatting and the return of `@run-at context-menu`.

### 🚀 Major New Features

- ✨ Editor: Ctrl+Shift+F to format code ([#1415](https://github.com/scriptscat/scriptcat/pull/1415)) (by @cyfung1031)
- ✨ Bring back `@run-at context-menu` support ([#1442](https://github.com/scriptscat/scriptcat/pull/1442)) (by @cyfung1031)

### ⚡️ Performance Improvements

- ⚡️ Optimize pushValue handling ([#1403](https://github.com/scriptscat/scriptcat/pull/1403)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Cloud sync fixes: OneDrive zero-byte upload, Google Drive/OneDrive error normalization, S3 custom metadata modifiedDate ([#1405](https://github.com/scriptscat/scriptcat/pull/1405)) ([#1406](https://github.com/scriptscat/scriptcat/pull/1406)) ([#1408](https://github.com/scriptscat/scriptcat/pull/1408)) (by @cyfung1031)
- 🐛 WebDAV verify: drop the write probe so services like Jianguoyun with non-writable root no longer fail verification ([#1445](https://github.com/scriptscat/scriptcat/pull/1445)) (by @CodFrm)
- 🐛 Fix missing null handling for `GM_xmlhttpRequest` msgConn ([#1433](https://github.com/scriptscat/scriptcat/pull/1433)) (by @cyfung1031)
- 🐛 Fix GM xhr improperly handling abnormal onloadend ([#1412](https://github.com/scriptscat/scriptcat/pull/1412)) (by @cyfung1031)
- 🐛 Fix ScriptEditor list dynamic update and display issues ([#1414](https://github.com/scriptscat/scriptcat/pull/1414)) (by @cyfung1031)
- 🐛 Fix interaction issues with edit-related actions in the ScriptEditor toolbar ([#1417](https://github.com/scriptscat/scriptcat/pull/1417)) (by @cyfung1031)
- 🐛 Fix `chrome.downloads.download` code and Mock ([#1410](https://github.com/scriptscat/scriptcat/pull/1410)) (by @cyfung1031)
- 🐛 Fix closeWindow in src/pages/install/App.tsx ([#1435](https://github.com/scriptscat/scriptcat/pull/1435)) (by @cyfung1031)
- 🐛 Add wheel event boundary at the root layout to prevent internal scrolling from triggering browser swipe-navigation ([#1431](https://github.com/scriptscat/scriptcat/pull/1431)) (by @cyfung1031)
- 🐛 Dedupe concurrent initial auth requests ([#1437](https://github.com/scriptscat/scriptcat/pull/1437)) (by @cyfung1031)
- 🐛 Refactor encoding.ts to consolidate and improve detection ([#1426](https://github.com/scriptscat/scriptcat/pull/1426)) (by @cyfung1031)
- 🐛 Add Tooltip so the menu is visible ([#1429](https://github.com/scriptscat/scriptcat/pull/1429)) (by @cyfung1031)
- 🐛 overscroll-behavior fix ([#1413](https://github.com/scriptscat/scriptcat/pull/1413)) (by @cyfung1031)
- 🐛 Stop showing the update button for scripts that don't support updates ([#1418](https://github.com/scriptscat/scriptcat/pull/1418)) (by @cyfung1031)
- 🐛 Fix missing i18n key references ([#1422](https://github.com/scriptscat/scriptcat/pull/1422)) (by @cyfung1031)
- 🐛 Add `frames` to sandbox createContext, fixing [#1427](https://github.com/scriptscat/scriptcat/issues/1427) ([#1428](https://github.com/scriptscat/scriptcat/pull/1428)) (by @cyfung1031)
- 🐛 Fix SkillScript compilation error from missing isContextMenu field (5fdc8e39) (by @CodFrm)

### ♻️ Refactoring & Compatibility

- ♻️ Move install resources to `chrome.storage.local` tempStorage; code part lives in `OPFS/temp_install_codes` ([#1318](https://github.com/scriptscat/scriptcat/pull/1318)) (by @cyfung1031)
- ♻️ Fix double-slash created by path-joining logic ([#1432](https://github.com/scriptscat/scriptcat/pull/1432)) (by @tomaioo)

### 🌐 Internationalization

- 🌐 Improve Japanese UI translations with companion fixes for other languages ([#1419](https://github.com/scriptscat/scriptcat/pull/1419)) ([#1421](https://github.com/scriptscat/scriptcat/pull/1421)) (by @GoodLight999, @cyfung1031)

<a name="1.4.0-beta.2"></a>

## 1.4.0-beta.2 (2026-05-06)

This update focuses on **comprehensive cloud storage sync reliability hardening** (auth, path handling, and retry fixes for Dropbox/WebDAV/Google Drive/OneDrive backends), **Agent tool-call stability improvements**, and a large number of UI and script runtime bug fixes including a long-running memory leak.

### ⚡️ Performance Improvements

- ⚡️ Remove Baidu filesystem dependency on global DNR rules; disable cookies per-request instead ([#1377](https://github.com/scriptscat/scriptcat/pull/1377)) (by @cyfung1031)
- ⚡️ Optimize multi-platform search engine selection for fetching scripts ([#1379](https://github.com/scriptscat/scriptcat/pull/1379)) (by @cyfung1031)
- ⚡️ Use monospace for the install page loadingStatus to avoid jitter ([#1381](https://github.com/scriptscat/scriptcat/pull/1381)) (by @cyfung1031)
- ⚡️ Strengthen Agent prompt reliability — result verification, budget semantics, safety boundaries ([#1354](https://github.com/scriptscat/scriptcat/pull/1354)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🚑 Fix potential memory leak when ScriptCat runs for an extended period ([#1401](https://github.com/scriptscat/scriptcat/pull/1401)) (by @cyfung1031)
- 🐛 Harden cloud sync reliability across backends (Dropbox/WebDAV/Google Drive/OneDrive auth, path handling, retry logic) ([#1374](https://github.com/scriptscat/scriptcat/pull/1374)) ([#1375](https://github.com/scriptscat/scriptcat/pull/1375)) ([#1376](https://github.com/scriptscat/scriptcat/pull/1376)) ([#1390](https://github.com/scriptscat/scriptcat/pull/1390)) ([#1391](https://github.com/scriptscat/scriptcat/pull/1391)) ([#1392](https://github.com/scriptscat/scriptcat/pull/1392)) ([#1393](https://github.com/scriptscat/scriptcat/pull/1393)) ([#1394](https://github.com/scriptscat/scriptcat/pull/1394)) ([#1395](https://github.com/scriptscat/scriptcat/pull/1395)) (by @cyfung1031)
- 🐛 Properly populate extensionEnv with isIncognito (early-start & bgScript), userAgent and run-in for bgScript ([#1368](https://github.com/scriptscat/scriptcat/pull/1368)) (by @cyfung1031)
- 🐛 Fix onboarding guide button being clipped [#1396](https://github.com/scriptscat/scriptcat/issues/1396) ([#1398](https://github.com/scriptscat/scriptcat/pull/1398)) (by @cyfung1031)
- 🐛 Fix tooltip occlusion on the script management page [#1386](https://github.com/scriptscat/scriptcat/issues/1386) ([#1387](https://github.com/scriptscat/scriptcat/pull/1387)) (by @Xdy1579883916)
- 🐛 Fix Sidebar causing layout sizing issues in card mode [#1179](https://github.com/scriptscat/scriptcat/issues/1179) ([#1373](https://github.com/scriptscat/scriptcat/pull/1373)) (by @cyfung1031)
- 🐛 Fix incorrect origin for local file drag-and-drop installs ([#1371](https://github.com/scriptscat/scriptcat/pull/1371)) (by @cyfung1031)
- 🐛 Fix language-switch messaging ([#1380](https://github.com/scriptscat/scriptcat/pull/1380)) (by @cyfung1031)
- 🐛 Improve log display UI ([#1372](https://github.com/scriptscat/scriptcat/pull/1372)) (by @cyfung1031)
- 🐛 Resolve session rule count issues with concurrent xhr ([#1353](https://github.com/scriptscat/scriptcat/pull/1353)) (by @cyfung1031)
- 🐛 Fix UserConfigPanel CSS ([#1361](https://github.com/scriptscat/scriptcat/pull/1361)) (by @cyfung1031)
- 🐛 Use Object.create(null) for empty objects in create_context ([#1397](https://github.com/scriptscat/scriptcat/pull/1397)) (by @cyfung1031)
- 🐛 Fix Agent streaming tool_call argument concatenation errors and parallel tool-call cross-talk ([#1355](https://github.com/scriptscat/scriptcat/pull/1355)) (by @cyfung1031)
- 🐛 Fix Agent compatibility with reasoning models ([#1357](https://github.com/scriptscat/scriptcat/pull/1357)) (by @cyfung1031)
- 🐛 Fix Agent web_fetch/web_search contract inconsistency (7bbd6d18) (by @CodFrm)
- 🐛 Fix missing extension env in Agent skill script runtime (e143c4a7) (by @CodFrm)

### 🔒 Security Improvements

- 🔒 Fix all npm vulnerabilities ([#1350](https://github.com/scriptscat/scriptcat/pull/1350)) ([#1364](https://github.com/scriptscat/scriptcat/pull/1364)) ([#1365](https://github.com/scriptscat/scriptcat/pull/1365)) (by @cyfung1031)

### Others

- 🔥 Remove Crowdin and ach-UG pseudo-locale content ([#1385](https://github.com/scriptscat/scriptcat/pull/1385)) (by @CodFrm)

<a name="1.4.0-beta.1"></a>

## 1.4.0-beta.1 (2026-04-07)

The highlight of this release is **ScriptCat AI Agent**, a built-in AI-powered agent system that can invoke tools from the userscript ecosystem through conversational interaction. This update also adds `@unwrap` tag support, `window.onurlchange` event, editor menu improvements, and numerous bug fixes.

### 🚀 Major New Features

- 💥 ScriptCat AI Agent — AI-powered intelligent agent system with conversational interaction, tool calling, Skill system, MCP protocol support, and more ([#1324](https://github.com/scriptscat/scriptcat/pull/1324)) (by @CodFrm)
- ✨ Support `@unwrap` metadata tag ([#1213](https://github.com/scriptscat/scriptcat/pull/1213)) (by @cyfung1031)
- ✨ Implement TM's `window.onurlchange` using Navigation API ([#1315](https://github.com/scriptscat/scriptcat/pull/1315)) (by @cyfung1031)

### 🧑‍💻 Editor

- ✨ Add editor menu (find, replace, undo, etc.) ([#1303](https://github.com/scriptscat/scriptcat/pull/1303)) (by @CodFrm)
- 🐛 Fix Ctrl-F / Ctrl-H shortcuts ([#1312](https://github.com/scriptscat/scriptcat/pull/1312)) (by @cyfung1031)
- 🐛 Fix ESLint auto-fix not working [#1079](https://github.com/scriptscat/scriptcat/issues/1079) ([#1184](https://github.com/scriptscat/scriptcat/pull/1184)) (by @cyfung1031)
- 🐛 Correctly display formatting errors ([#1310](https://github.com/scriptscat/scriptcat/pull/1310)) (by @cyfung1031)
- 🐛 Fix code editor tooltip issues ([#1301](https://github.com/scriptscat/scriptcat/pull/1301)) (by @cyfung1031)

### ✨ Feature Improvements

- ✨ Support multi-platform search engine selection for script search ([#1295](https://github.com/scriptscat/scriptcat/pull/1295)) (by @CodFrm)
- ✨ Add more icon service providers ([#1333](https://github.com/scriptscat/scriptcat/pull/1333)) (by @cyfung1031)
- ✨ Add update check icon in script list last update column ([#1304](https://github.com/scriptscat/scriptcat/pull/1304)) (by @CodFrm)
- ✨ Improve edit conflict and script name conflict handling ([#1223](https://github.com/scriptscat/scriptcat/pull/1223)) (by @cyfung1031)

### 🐛 Bug Fixes

- 🐛 Fix cron expression errors crashing the entire page ([#1327](https://github.com/scriptscat/scriptcat/pull/1327)) (by @cyfung1031)
- 🐛 Fix script installation triggering Error 406 ([#1306](https://github.com/scriptscat/scriptcat/pull/1306)) (by @cyfung1031)
- 🐛 Fix WebDAV cookies authentication conflict and authType support ([#1308](https://github.com/scriptscat/scriptcat/pull/1308)) (by @CodFrm)
- 🐛 Use chrome.storage.local for device-specific settings to avoid cross-device sync ([#1309](https://github.com/scriptscat/scriptcat/pull/1309)) (by @CodFrm)
- 🐛 Fix subscription script silent update and connect permission logic ([#1201](https://github.com/scriptscat/scriptcat/pull/1201)) (by @cyfung1031)
- 🐛 Fix batch script update check failing entirely when one script times out ([#1265](https://github.com/scriptscat/scriptcat/pull/1265)) (by @cyfung1031)
- 🐛 Fix logger page query button not refreshing time ([#1294](https://github.com/scriptscat/scriptcat/pull/1294)) (by @CodFrm)
- 🐛 Fix logger page date picker popup being clipped ([#1292](https://github.com/scriptscat/scriptcat/pull/1292)) (by @cyfung1031)
- 🐛 Fix unbind button showing when no cloud drive is bound ([#1291](https://github.com/scriptscat/scriptcat/pull/1291)) (by @CodFrm)
- 🐛 Fix ScriptEditor script list light theme display issue ([#1288](https://github.com/scriptscat/scriptcat/pull/1288)) (by @CodFrm)
- 🐛 Fix popup being obscured ([#1290](https://github.com/scriptscat/scriptcat/pull/1290)) (by @cyfung1031)

## 1.4.0-beta (2026-03-13)

### 🐛 Bug Fixes

- 🚑 Fix environment detection error caused by other extensions injecting chrome.runtime [#1280](https://github.com/scriptscat/scriptcat/issues/1280) ([#1281](https://github.com/scriptscat/scriptcat/pull/1281)) (by @CodFrm)
- 🐛 Fix and optimize ScriptEditor issues ([#1258](https://github.com/scriptscat/scriptcat/pull/1258)) (by @cyfung1031)
- 🐛 Fix repeated restart caused by incognito window permission check conflict (6c308f60) (by @CodFrm)
- 🐛 Fix confirm page issues ([#1275](https://github.com/scriptscat/scriptcat/pull/1275)) (by @cyfung1031)
- 🐛 Fix include *?* expression handling issue [#1271](https://github.com/scriptscat/scriptcat/issues/1271) ([#1272](https://github.com/scriptscat/scriptcat/pull/1272)) (by @CodFrm)
- 🐛 Fix script settings - permission management control not working ([#1267](https://github.com/scriptscat/scriptcat/pull/1267)) (by @CodFrm)

### 🔒 Security Improvements

- 🔒 Use DOMPurify to sanitize announcement notification HTML content ([#1274](https://github.com/scriptscat/scriptcat/pull/1274)) (by @CodFrm)

### Others

- ✅ Add Playwright E2E tests and GM API functional tests ([#1283](https://github.com/scriptscat/scriptcat/pull/1283)) (by @CodFrm)
- 📄 docs: update Chrome Web Store URLs to new domain ([#1279](https://github.com/scriptscat/scriptcat/pull/1279)) (by @theluckystrike)

## 1.3.0-beta.4 (2026-02-19)

### Added

- ✨ Add Amazon S3 storage [#1146](https://github.com/scriptscat/scriptcat/issues/1146) ([#1189](https://github.com/scriptscat/scriptcat/pull/1189)) (by @CodFrm)
- ✨ Adjust hidden editor sidebar position [#1185](https://github.com/scriptscat/scriptcat/issues/1185) ([#1254](https://github.com/scriptscat/scriptcat/pull/1254)) (by @CodFrm)
- ✨ Accept `@version` with no or empty value ([#1216](https://github.com/scriptscat/scriptcat/pull/1216)) (by @cyfung1031)

### Fixed

- 🐛 Fix changelog notification opening page issue ([#1266](https://github.com/scriptscat/scriptcat/pull/1266)) (by @CodFrm)
- 🐛 Fix unregister not executing correctly ([#1231](https://github.com/scriptscat/scriptcat/pull/1231)) (by @cyfung1031)
- 🐛 Fix GM_addElement issue, move operation to content environment ([#1233](https://github.com/scriptscat/scriptcat/pull/1233)) (by @cyfung1031)
- 🐛 Refactor DraggableEntry, fix card height alignment ([#1245](https://github.com/scriptscat/scriptcat/pull/1245)) (by @cyfung1031)
- 🐛 Fix popup content following screen scroll issue ([#1263](https://github.com/scriptscat/scriptcat/pull/1263)) (by @cyfung1031) ([#1259](https://github.com/scriptscat/scriptcat/pull/1259)) (by @cyfung1031)
- 🐛 Fix memory leak and object property exposure, and TTP XML parsing fallback to null ([#1242](https://github.com/scriptscat/scriptcat/pull/1242)) (by @cyfung1031) ([#1260](https://github.com/scriptscat/scriptcat/pull/1260)) (by @cyfung1031)
- 🐛 Add `conflictAction` parameter to `GM_download` ([#1250](https://github.com/scriptscat/scriptcat/pull/1250)) (by @cyfung1031)
- 🐛 Fix install link parsing failure [#1235](https://github.com/scriptscat/scriptcat/issues/1235) ([#1238](https://github.com/scriptscat/scriptcat/pull/1238)) (by @cyfung1031)
- 🐛 Fix drag component causing focusin/focusout lag [#1224](https://github.com/scriptscat/scriptcat/issues/1224) ([#1243](https://github.com/scriptscat/scriptcat/pull/1243)) (by @CodFrm)
- 🐛 Fix subscribeUrl origin related parts in installScript ([#1218](https://github.com/scriptscat/scriptcat/pull/1218)) (by @cyfung1031)
- 🐛 Fix ScriptCard animation issue ([#1234](https://github.com/scriptscat/scriptcat/pull/1234)) (by @cyfung1031)
- 🐛 Fix hide_sidebar to show_main_sidebar & hide_main_sidebar ([#1225](https://github.com/scriptscat/scriptcat/pull/1225)) (by @cyfung1031)
- 🐛 Fix external extension API not working ([#1217](https://github.com/scriptscat/scriptcat/pull/1217)) (by @cyfung1031)
- 🐛 Fix download filename not supporting folders ([#1203](https://github.com/scriptscat/scriptcat/pull/1203)) (by @cyfung1031)

<a name="1.3.0-beta.3"></a>

## 1.3.0-beta.3 (2026-02-07)

### Added

- ✨ Cron-related modifications: bug fixes, i18n, once expression enhancements, upgrade cron library ([#1126](https://github.com/scriptscat/scriptcat/issues/1126)) (by @cyfung1031)

### Changed

- ♻️ Refactor communication mechanism: adopt storage.local broadcast + Firefox MV3 scripting compliant + untraceable dynamic sync MessageFlag ([#1067](https://github.com/scriptscat/scriptcat/issues/1067)) (by @cyfung1031)
- ⚡ Enhanced text decoding ([#1166](https://github.com/scriptscat/scriptcat/issues/1166)) (by @cyfung1031)
- 🎨 Code adjustments (minor) - `isContent` variable location ([#1171](https://github.com/scriptscat/scriptcat/issues/1171)) (by @cyfung1031)
- 🎨 Code adjustments - Value-related class & variable names ([#1175](https://github.com/scriptscat/scriptcat/issues/1175)) (by @cyfung1031)
- 🎨 Code adjustments (minor) - ScriptClient ([#1172](https://github.com/scriptscat/scriptcat/issues/1172)) (by @cyfung1031)
- 🎨 (TypeScript) Custom class name revision: File -> FileInfo ([#1174](https://github.com/scriptscat/scriptcat/issues/1174)) (by @cyfung1031)
- ⬆️ Fix rspack's `jsc.target` to es2020 / Upgrade core version ([#1186](https://github.com/scriptscat/scriptcat/issues/1186)) (by @cyfung1031)
- 🎨 Improve charset detection ([#1140](https://github.com/scriptscat/scriptcat/issues/1140)) (by @cyfung1031)
- 🎨 Update popup window display time ([#1155](https://github.com/scriptscat/scriptcat/issues/1155)) (by @cyfung1031)
- 🎨 Minor locales.ts corrections ([#1154](https://github.com/scriptscat/scriptcat/issues/1154)) (by @cyfung1031)
- 🎨 Logo 128x128 ([#1176](https://github.com/scriptscat/scriptcat/issues/1176)) (by @cyfung1031)
- 🎨 Image processing ([#1177](https://github.com/scriptscat/scriptcat/issues/1177)) (by @cyfung1031)

### Removed

- 🔥 package.json: drop pako ([#1188](https://github.com/scriptscat/scriptcat/issues/1188)) (by @cyfung1031)

### Fixed

- 🐛 Handle script encoding issues [#1115](https://github.com/scriptscat/scriptcat/issues/1115) ([#1138](https://github.com/scriptscat/scriptcat/issues/1138)) (by @CodFrm)
- 🐛 Handle value reference issues [#1141](https://github.com/scriptscat/scriptcat/issues/1141) ([#1147](https://github.com/scriptscat/scriptcat/issues/1147)) (by @CodFrm)
- 🐛 Fix button rendering logic, avoid render phase side effects, use JSX conditional rendering & named slots ([#1153](https://github.com/scriptscat/scriptcat/issues/1153)) (by @cyfung1031)
- 🐛 Fix FileSystemObserver unable to continuously monitor issue ([#1160](https://github.com/scriptscat/scriptcat/issues/1160)) (by @cyfung1031)
- 🐛 fix: TM compatibility `@match www.website.com/*` ([#1165](https://github.com/scriptscat/scriptcat/issues/1165)) (by @cyfung1031)
- 🐛 Fix GM API async declarations, correctly return Promise ([#1169](https://github.com/scriptscat/scriptcat/issues/1169)) (by @cyfung1031)
- 🐛 Fix content.js missing UserAgentData issue ([#1183](https://github.com/scriptscat/scriptcat/issues/1183)) (by @cyfung1031)
- 🐛 Fix 1.2.5 structuredClone error ([#1192](https://github.com/scriptscat/scriptcat/issues/1192)) (by @cyfung1031)
- 🐛 Fix modification 9343f2d6e49aec78d208d0e3ba3d96ec2a4d5a1c ([#1195](https://github.com/scriptscat/scriptcat/issues/1195)) (by @cyfung1031)
- 🐛 Fix grant issues ([#1199](https://github.com/scriptscat/scriptcat/issues/1199)) (by @CodFrm)

<a name="1.3.0-beta.2"></a>

## 1.3.0-beta.2 (2026-01-07)

### Added

- ✨ Synchronous deletion now defaults to off ([#958](https://github.com/scriptscat/scriptcat/issues/958)) [[9c4c7dc](https://github.com/scriptscat/scriptcat/commit/9c4c7dc411357746db43a306d97ac41a71f2b49c)] (by @cyfung1031)
- ✨ Editor now supports GM.\* ([#1129](https://github.com/scriptscat/scriptcat/issues/1129)) [[bea0192](https://github.com/scriptscat/scriptcat/commit/bea0192c6cc50eff2ed4e1cc5dcc25f36bbe10e7)] (by @cyfung1031)

### Changed

- ♻️ Optimize changelog page opening logic [#1110](https://github.com/scriptscat/scriptcat/issues/1110) [[d3ffedc](https://github.com/scriptscat/scriptcat/commit/d3ffedcffe752ca548f87f1640072fcd871b8604)] (by @CodFrm)

### Fixed

- 🐛 Fix script icon display [#1052](https://github.com/scriptscat/scriptcat/issues/1052) ([#1104](https://github.com/scriptscat/scriptcat/issues/1104)) [[2e5c601](https://github.com/scriptscat/scriptcat/commit/2e5c601274fa27aa67b49ef9d352e3a1c3975979)] (by @CodFrm)
- 🐛 Fix scriptcat.d.tpl & type corrections ([#1130](https://github.com/scriptscat/scriptcat/issues/1130)) [[dd22ef5](https://github.com/scriptscat/scriptcat/commit/dd22ef544684d69e24a7aae098cb05cbab03daa8)] (by @cyfung1031)
- 🐛 Fix cloud sync issues ([#1133](https://github.com/scriptscat/scriptcat/issues/1133)) [[a9383d2](https://github.com/scriptscat/scriptcat/commit/a9383d2012eb3953dc33c8886ce3891f404fa100)] (by @CodFrm)
- 🐛 Fix `GM_addElement("tagName")` error ([#1120](https://github.com/scriptscat/scriptcat/issues/1120)) [[ad19de5](https://github.com/scriptscat/scriptcat/commit/ad19de5c1793c8c079bedbf1b11c7c2ae27a469e)] (by @cyfung1031)
- 🐛 Remove cleanup logic and optimize checkuserscript logic ([#1113](https://github.com/scriptscat/scriptcat/issues/1113)) [[e635911](https://github.com/scriptscat/scriptcat/commit/e635911a3c11c3cb8acd1cfd507cb777e5ee7236)] (by @CodFrm)

### Miscellaneous

- 🏷️ TypeScript revisions ([#1127](https://github.com/scriptscat/scriptcat/issues/1127)) [[b455724](https://github.com/scriptscat/scriptcat/commit/b4557244191018c18d5ce8ea8e8627bcfb7f7cdd)] (by @cyfung1031)
- 📝 Additional example comments ([#1131](https://github.com/scriptscat/scriptcat/issues/1131)) [[292549e](https://github.com/scriptscat/scriptcat/commit/292549ed0f65952fe9f269aace23eefc7d6a3a0f)] (by @cyfung1031)

<a name="1.3.0-beta.1"></a>

## 1.3.0-beta.1 (2025-12-21)

### Added

- ✨ Optimize Monaco Editor settings, add `/* global xxx */` fix ([#1012](https://github.com/scriptscat/scriptcat/issues/1012)) [[b1a738d](https://github.com/scriptscat/scriptcat/commit/b1a738d98b5e852993da322d56dbfa20f68d20e3)] (by @cyfung1031)

### Changed

- ⚡ Move metadata out of chrome.storage.session ([#1027](https://github.com/scriptscat/scriptcat/issues/1027)) [[9c81f6c](https://github.com/scriptscat/scriptcat/commit/9c81f6c42b087411669adef35df30714e184ee93)] (by @cyfung1031)
- ⚡ Optimize next run time display [#1093](https://github.com/scriptscat/scriptcat/issues/1093) [[324ce51](https://github.com/scriptscat/scriptcat/commit/324ce515c84699ca8d3bf1ee447fc6ef0656ae0d)] (by @CodFrm)

### Fixed

- 🐛 Fix popup page issues ([#1100](https://github.com/scriptscat/scriptcat/issues/1100)) [[9c67e4a](https://github.com/scriptscat/scriptcat/commit/9c67e4a2c609f8c1ef82c493bb1ed68da6396d2e)] (by @CodFrm)
- 🐛 Fix type error [[f5a73c7](https://github.com/scriptscat/scriptcat/commit/f5a73c71649621e519b32630ae7717411732aa50)] (by @CodFrm)
- 🐛 Fix English log containing full-width character issue ([#1095](https://github.com/scriptscat/scriptcat/issues/1095)) [[a68b100](https://github.com/scriptscat/scriptcat/commit/a68b10048cb01a8e26fe8d524102bfb23ed4e179)] (by @cyfung1031)
- 🐛 Add UnoCSS prefix to resolve CSS conflicts, fix CSS layout ([#1013](https://github.com/scriptscat/scriptcat/issues/1013)) [[723e64c](https://github.com/scriptscat/scriptcat/commit/723e64cc0c23763dfed322e907c0a960c4f9060e)] (by @cyfung1031)
- 🐛 Fix early script URL matching issue ([#1096](https://github.com/scriptscat/scriptcat/issues/1096)) [[a77effb](https://github.com/scriptscat/scriptcat/commit/a77effbab5ab4d1752065ef943d9c050ff99c066)] (by @CodFrm)
- 🐛 Fix issue where update popup window displays for too short a time ([#1088](https://github.com/scriptscat/scriptcat/issues/1088)) [[b2b2d5c](https://github.com/scriptscat/scriptcat/commit/b2b2d5c41ff70ee5430f7d8d156f480ac8fc3a1a)] (by @cyfung1031)
- 🐛 Fix abnormal display issue when user script notifications are enabled ([#1086](https://github.com/scriptscat/scriptcat/issues/1086)) ([959c4db](https://github.com/scriptscat/scriptcat/commit/959c4dbed92f7bfe22a2f8ebb775c4189b5ff076))
- 🐛 responseHeaders: `TM compatibility: \r\n` ([#1085](https://github.com/scriptscat/scriptcat/issues/1085)) [[15232c8](https://github.com/scriptscat/scriptcat/commit/15232c8543d93abfdafa1353d39d8a15d1dc385f)] (by @cyfung1031)
- 🐛 Fix GM xhr issues ([#1082](https://github.com/scriptscat/scriptcat/issues/1082)) [[3d987c3](https://github.com/scriptscat/scriptcat/commit/3d987c300242a3c765146359c35ecd6d998f792c)] (by @CodFrm)
- 🐛 Fix issue with frequent background sync ([#1076](https://github.com/scriptscat/scriptcat/issues/1076)) [[45dc39b](https://github.com/scriptscat/scriptcat/commit/45dc39baa0f3326cf12e97312ab632dc46ba40f2)] (by @CodFrm)
- 🐛 Fix special tab handling issue [#1066](https://github.com/scriptscat/scriptcat/issues/1066) ([50904fb](https://github.com/scriptscat/scriptcat/commit/50904fb46efdea10fd57677bc2d28c770b47e861))
- 🐛 Fix script handling without match rules [#1071](https://github.com/scriptscat/scriptcat/issues/1071) ([560cdc0](https://github.com/scriptscat/scriptcat/commit/560cdc01fc0fc27fb7d0e3b877c63ba431206668))
- 🐛 Fix CI packaging issue that removed background optional permissions [[1f002f0](https://github.com/scriptscat/scriptcat/commit/1f002f0edf9892f023ae93b8522ff7c5e4a96559)] (by @CodFrm)
- 🐛 Fix ignore discarded tab ([#1058](https://github.com/scriptscat/scriptcat/issues/1058)) [[6165bf4](https://github.com/scriptscat/scriptcat/commit/6165bf48eb1d53ede0561c85c30135446c2ff882)] (by @cyfung1031)

<a name="1.3.0-beta"></a>

## 1.3.0-beta (2025-12-13)

### Added

- ✨ New script installation logic ([#842](https://github.com/scriptscat/scriptcat/issues/842)) ([80d342e](https://github.com/scriptscat/scriptcat/commit/80d342e80c9c1b36f88b7dcd4c65c663bb1d9185))
- ✨ Internationalize monaco editor hints and add `@require-css` hint ([#960](https://github.com/scriptscat/scriptcat/issues/960)) [[51a6f94](https://github.com/scriptscat/scriptcat/commit/51a6f94be3a430691f73057eae61a3814560a5b3)] (by @cyfung1031)
- ✨ Fix `@grant` conflict validation, add meta duplicate declaration error prompt ([#902](https://github.com/scriptscat/scriptcat/issues/902)) [[8fbd0f1](https://github.com/scriptscat/scriptcat/commit/8fbd0f1041f5c5dcdb5a515348a5f54934acfdc7)] (by @cyfung1031)
- ✨ Template preset `@noframes` to prevent beginners from pitfalls ([#900](https://github.com/scriptscat/scriptcat/issues/900)) [[c9d5840](https://github.com/scriptscat/scriptcat/commit/c9d584066ff2395112b9a930aaa409cda764a5e6)] (by @cyfung1031)
- ✨ Prevent script installation link from being misjudged as install instead of update when script name changes ([#824](https://github.com/scriptscat/scriptcat/issues/824)) [[5c7a5dd](https://github.com/scriptscat/scriptcat/commit/5c7a5ddc81e3bd1dd0a71cc80460a5239178c1de)] (by @cyfung1031)
- ✨ Script run-at options ([#895](https://github.com/scriptscat/scriptcat/issues/895)) [[b0ea187](https://github.com/scriptscat/scriptcat/commit/b0ea187c2e6d69b60c981aa9b4d068fed7c2c2a2)] (by @CodFrm)
- ✨ Display gray icon when script functionality is disabled [#897](https://github.com/scriptscat/scriptcat/issues/897) ([3e406dc](https://github.com/scriptscat/scriptcat/commit/3e406dc4562adf7d7f3b79b52623b87e87ef1ad3))
- ✨ Optimize menu interaction logic when expandable items are 0 [#868](https://github.com/scriptscat/scriptcat/issues/868) ([da24ac2](https://github.com/scriptscat/scriptcat/commit/da24ac234f0eeae0159dce6c2b346d06fb72eaa5))

### Changed

- 🎨 Fix Typography reference ([#984](https://github.com/scriptscat/scriptcat/issues/984)) [[a70400c](https://github.com/scriptscat/scriptcat/commit/a70400cdca8a5b64cffaca85017513d4e5e7171c)] (by @cyfung1031)
- ♻️ Firefox compatibility: GM_setClipboard ([#928](https://github.com/scriptscat/scriptcat/issues/928)) [[d1a5cb1](https://github.com/scriptscat/scriptcat/commit/d1a5cb19dc4e05fac838258d15c48cc6f876d416)] (by @cyfung1031)
- ♻️ Adjust userScripts / scripting API, enhance compatibility (redo [#704](https://github.com/scriptscat/scriptcat/issues/704)) ([#925](https://github.com/scriptscat/scriptcat/issues/925)) [[43bc40f](https://github.com/scriptscat/scriptcat/commit/43bc40ff5da5ef36a13564504293f1928138cf12)] (by @cyfung1031)
- ♻️ Refactor and optimize script icon loading ([#893](https://github.com/scriptscat/scriptcat/issues/893)) ([ab36c86](https://github.com/scriptscat/scriptcat/commit/ab36c86b5d031b88e71fbf9151696a42acba86fa))
- ⚡ parseMetadata code optimization ([#903](https://github.com/scriptscat/scriptcat/issues/903)) [[0efc648](https://github.com/scriptscat/scriptcat/commit/0efc648257f74591765869dedee5d98f8a1dc610)] (by @cyfung1031)
- 🎨 Change default extension icon number display to script count [#989](https://github.com/scriptscat/scriptcat/issues/989) [[70f67b6](https://github.com/scriptscat/scriptcat/commit/70f67b6bd8cf803d7a18bf26fdccdfa6f8a92893)] (by @CodFrm)
- 🐛 Import & Export - Fix issue not following script last modified date time ([#951](https://github.com/scriptscat/scriptcat/issues/951)) ([6e7272f](https://github.com/scriptscat/scriptcat/commit/6e7272f52ef2d49d9fceb3e30babfee1cbd72e75))
- 🎨 Adjust sourceURL for easier debugging ([#987](https://github.com/scriptscat/scriptcat/issues/987)) [[ed741e7](https://github.com/scriptscat/scriptcat/commit/ed741e7d0188fa5e95eae87bcd3a28e82ee008e1)] (by @cyfung1031)
- ⬆️ Package version updates ([#922](https://github.com/scriptscat/scriptcat/issues/922)) [[9b1df8d](https://github.com/scriptscat/scriptcat/commit/9b1df8dda794e5e95ecc12cef37ed66712ae561e)] (by @cyfung1031)
- ⚡ Values-related common adjustments ([#949](https://github.com/scriptscat/scriptcat/issues/949)) [[b258fb2](https://github.com/scriptscat/scriptcat/commit/b258fb2c73d790f7f277a9a31d07e2931a7d680d)] (by @cyfung1031)
- ⚡ Commonize URL.createObjectURL, Firefox compatibility ([#929](https://github.com/scriptscat/scriptcat/issues/929)) [[54ad4de](https://github.com/scriptscat/scriptcat/commit/54ad4de48b81170b90283fb6ce3b4d6e7c908cdf)] (by @cyfung1031)
- ⚡ Store icons based on URL to avoid multiple scripts storing the same icon ([#909](https://github.com/scriptscat/scriptcat/issues/909)) [[c6e8efb](https://github.com/scriptscat/scriptcat/commit/c6e8efbe8d11719034a9aaa3fd871519025671ff)] (by @cyfung1031)
- ♻️ Adjust updateIcon code ([#908](https://github.com/scriptscat/scriptcat/issues/908)) [[642e3b9](https://github.com/scriptscat/scriptcat/commit/642e3b9e57f01f2b008990cc7cb1461f5dccd256)] (by @cyfung1031)

### Fixed

- 🐛 Clear existing Alarm when selecting irregular script update checks ([#996](https://github.com/scriptscat/scriptcat/issues/996)) [[8bb9a2d](https://github.com/scriptscat/scriptcat/commit/8bb9a2d5741acb7d547e743c7bef8a2139f1401a)] (by @cyfung1031)
- 🐛 Remove extra whitespace at top of backup page ([#995](https://github.com/scriptscat/scriptcat/issues/995)) ([9c149ce](https://github.com/scriptscat/scriptcat/commit/9c149ce5999b7a70375a41c6604c8e8dbd19e9df))
- ✨ Installation without relying on external website access + installation page layout adjustment ([#842](https://github.com/scriptscat/scriptcat/issues/842)) ([80d342e](https://github.com/scriptscat/scriptcat/commit/80d342e80c9c1b36f88b7dcd4c65c663bb1d9185))
- 🐛 Add UnoCSS prefix to resolve CSS conflicts, fix CSS layout ([#1013](https://github.com/scriptscat/scriptcat/issues/1013)) [[723e64c](https://github.com/scriptscat/scriptcat/commit/723e64cc0c23763dfed322e907c0a960c4f9060e)] (by @cyfung1031)
- 🐛 Optimize systemconfig and fix i18n issues in SW ([#976](https://github.com/scriptscat/scriptcat/issues/976)) [[c50fcf7](https://github.com/scriptscat/scriptcat/commit/c50fcf7770df633462c2f25f8cf22d302002ec57)] (by @CodFrm)
- 🐛 Fix type errors ([#975](https://github.com/scriptscat/scriptcat/issues/975)) [[7d85856](https://github.com/scriptscat/scriptcat/commit/7d8585687c71cde1c2793d742abb7c22d9d358f0)] (by @cyfung1031)

<a name="1.2.0-beta.5"></a>

## 1.2.0-beta.5 (2025-11-17)

### Added

- ✨ Display script count in popup ([#973](https://github.com/scriptscat/scriptcat/issues/973)) [[1134586](https://github.com/scriptscat/scriptcat/commit/1134586ff040ffc0cdddd3538e9ec493950c948a)] (by @cyfung1031)

### Changed

- ⚡ Handle `check_script_update_cycle` ([#906](https://github.com/scriptscat/scriptcat/issues/906)) [[760562f](https://github.com/scriptscat/scriptcat/commit/760562f92ad64bc538873b2ca61dfafe067c3f6e)] (by @cyfung1031)
- ♻️ Organize inject & content, modify pageLoad information transfer ([#952](https://github.com/scriptscat/scriptcat/issues/952)) [[0554159](https://github.com/scriptscat/scriptcat/commit/0554159c105606192d48e1153194e09314d43bc9)] (by @cyfung1031)
- 🎨 Simplify messageFlag, revise according to event naming standards ([#926](https://github.com/scriptscat/scriptcat/issues/926)) [[d725d85](https://github.com/scriptscat/scriptcat/commit/d725d85a2f4917c08f6d3daa035a45fd15d12451)] (by @cyfung1031)
- ♻️ Refactor `GM_xmlhttpRequest` and related code ([#901](https://github.com/scriptscat/scriptcat/issues/901)) [[fabd2e9](https://github.com/scriptscat/scriptcat/commit/fabd2e944235b460bc73df346b79d23ee4540af7)] (by @cyfung1031)
- ⚡ Micro-optimize toCamelCase ([#930](https://github.com/scriptscat/scriptcat/issues/930)) [[88d8bdf](https://github.com/scriptscat/scriptcat/commit/88d8bdfc726f1a4ed63bd3cf81ebad88426273e8)] (by @cyfung1031)

### Fixed

- 🐛 Fix corrupted sandbox ([#966](https://github.com/scriptscat/scriptcat/issues/966)) [[dd80386](https://github.com/scriptscat/scriptcat/commit/dd8038666481d1319dd0f8ab80f79f1b13c1730d)] (by @cyfung1031)
- 🐛 Fix undefined `valueChangeListener.clear` in setInvalidContext ([#970](https://github.com/scriptscat/scriptcat/issues/970)) [[2a399e9](https://github.com/scriptscat/scriptcat/commit/2a399e96a1e848f2f569566479b48dcee280f543)] (by @cyfung1031)
- 🐛 Adjust `@connect` logic ([#969](https://github.com/scriptscat/scriptcat/issues/969)) [[67914d2](https://github.com/scriptscat/scriptcat/commit/67914d2b7d57fa9c69706ae57ee5d3400c2643f9)] (by @cyfung1031)
- 🐛 Fix service worker i18n handling [#956](https://github.com/scriptscat/scriptcat/issues/956) [[843e618](https://github.com/scriptscat/scriptcat/commit/843e618daf13ec659cc16759c5de13dacf23c534)] (by @CodFrm)
- 🐛 Fix deleteValue/deleteValues execution issue ([#943](https://github.com/scriptscat/scriptcat/issues/943)) [[3d92bfb](https://github.com/scriptscat/scriptcat/commit/3d92bfb4a0334ffd2c279a1e6d33e98eed0a1a81)] (by @cyfung1031)
- 🐛 Fix unable to install scripts via GitHub link ([#877](https://github.com/scriptscat/scriptcat/issues/877)) [[b9268e7](https://github.com/scriptscat/scriptcat/commit/b9268e7207081fcaa4591c9e1385f98446ade04a)] (by @cyfung1031)
- 🐛 Fix `@connect *` not taking effect ([#967](https://github.com/scriptscat/scriptcat/issues/967)) [[6bcb93c](https://github.com/scriptscat/scriptcat/commit/6bcb93c20c9690a2ce4f50d0978948e20ba407b8)] (by @cyfung1031)

### Miscellaneous

- 🌐 Translation updates ([#920](https://github.com/scriptscat/scriptcat/issues/920)) [[ede013b](https://github.com/scriptscat/scriptcat/commit/ede013b8e725ddefa626e3e432cbaee756535259)] (by @cyfung1031)

<a name="1.2.0-beta.4"></a>

## 1.2.0-beta.4 (2025-11-07)

### Added

- ✨ Card mode guide ([#894](https://github.com/scriptscat/scriptcat/issues/894)) [[0627a0f](https://github.com/scriptscat/scriptcat/commit/0627a0faacf3a41645e985ec6f6960568427d5a4)] (by @CodFrm)

### Changed

- ♻️ Refactor EarlyStart implementation ([#882](https://github.com/scriptscat/scriptcat/issues/882)) [[cca11e0](https://github.com/scriptscat/scriptcat/commit/cca11e02b98de285423b04ec0d95eab995cee378)] (by @CodFrm)
- 💄 Fine-tune card view layout ([#872](https://github.com/scriptscat/scriptcat/issues/872)) [[5aa21b8](https://github.com/scriptscat/scriptcat/commit/5aa21b88bf423d5d03f7df70b654249bac4b7a88)] (by @Coxxs)

### Fixed

- 🐛 Fix error caused by missing semicolon between two `@require` [#917](https://github.com/scriptscat/scriptcat/issues/917) ([#921](https://github.com/scriptscat/scriptcat/issues/921)) [[2769a24](https://github.com/scriptscat/scriptcat/commit/2769a24e129da79926816886fe42bbc4d9a97875)] (by @cyfung1031)
- 🐛 Fix Check Update page exception issue ([#912](https://github.com/scriptscat/scriptcat/issues/912)) [[12272e1](https://github.com/scriptscat/scriptcat/commit/12272e1ad4787cc6768f2f157d272faff5782f37)] (by @cyfung1031)
- 🐛 Fix GM_openInTab not working in background scripts [#873](https://github.com/scriptscat/scriptcat/issues/873) [[a526664](https://github.com/scriptscat/scriptcat/commit/a52666429710e150d81cac33af5511401b697355)] (by @CodFrm)
- 🐛 Fix table list loading state issue [#874](https://github.com/scriptscat/scriptcat/issues/874) [[0b53cb0](https://github.com/scriptscat/scriptcat/commit/0b53cb07cf1ca1d3e42b15fd9c104c83031502d5)] (by @CodFrm)
- 🐛 Fix script injection failure after `@early-start` removal ([#871](https://github.com/scriptscat/scriptcat/issues/871)) [[426e878](https://github.com/scriptscat/scriptcat/commit/426e8788d9b934ee96cf5ec22b432a08681a9e8c)] (by @cyfung1031)

<a name="1.2.0-beta.3"></a>

## 1.2.0-beta.3 (2025-10-23)

### Added

- ✨ Card view ([#860](https://github.com/scriptscat/scriptcat/issues/860)) [[c9f2350](https://github.com/scriptscat/scriptcat/commit/c9f23509648a41b06f82e79da2bc1fc05a783e06)] (by @CodFrm)

### Changed

- ♻️ Null code adjustment ([#852](https://github.com/scriptscat/scriptcat/issues/852)) [[fa1031d](https://github.com/scriptscat/scriptcat/commit/fa1031df9c3e8bc2550f429e7cf8d1c3869a1ea3)] (by @cyfung1031)
- ♻️ GMApiRequest code adjustment, GM_log code fix, @connect judgment fix ([#849](https://github.com/scriptscat/scriptcat/issues/849)) [[ee4a8b2](https://github.com/scriptscat/scriptcat/commit/ee4a8b28715fb48fa627f5231c8dc30e55c006ed)] (by @cyfung1031)

### Removed

- 🔥 Remove `GM_openInTab({ useOpen: true })` ([#867](https://github.com/scriptscat/scriptcat/issues/867)) [[aa61335](https://github.com/scriptscat/scriptcat/commit/aa613354c7b7c84d461000ed0362cf9916c8aa39)] (by @cyfung1031)

### Fixed

- 🐛 checkUserScriptsAvailable compatibility with Vivaldi ([#859](https://github.com/scriptscat/scriptcat/issues/859)) [[014d62d](https://github.com/scriptscat/scriptcat/commit/014d62de6b731bfda82babf5db5aa5ae909908f1)] (by @cyfung1031)
- 🚑 Critical fix: GM.delete/setValue Promise not fulfilling ([#865](https://github.com/scriptscat/scriptcat/issues/865)) [[43572a3](https://github.com/scriptscat/scriptcat/commit/43572a3110b8b083f840b472a231400223da7751)] (by @cyfung1031)
- 🐛 Fix GM xhr fetch issue [#847](https://github.com/scriptscat/scriptcat/issues/847) [[c6e95c2](https://github.com/scriptscat/scriptcat/commit/c6e95c210748d091ff9f610f3801eaa055d9d6de)]

### Miscellaneous

- 📝 Add `@compatible` comment to monaco-editor ([#853](https://github.com/scriptscat/scriptcat/issues/853)) [[752b951](https://github.com/scriptscat/scriptcat/commit/752b95122ab324df358e45ec468194cc8466f8bb)] (by @cyfung1031)
- 🌐 Add subscribe_source_tooltip translation [#850](https://github.com/scriptscat/scriptcat/issues/850) [[8d675bd](https://github.com/scriptscat/scriptcat/commit/8d675bd5398d403dfc8e7ee2016fbaffd821da64)]

<a name="1.2.0-beta.2"></a>

## 1.2.0-beta.2 (2025-10-15)

Optimized script update logic, added script list sidebar, enhanced GM_registerMenuCommand and GM_openInTab functionality, and fixed many bugs

### Added

- ✨ Unified update notification mechanism ([#755](https://github.com/scriptscat/scriptcat/issues/755)) ([741b0bd](https://github.com/scriptscat/scriptcat/commit/741b0bd2ec2f75a7e84c62fbe02654ce6bc41543))
- ✨ GM_registerMenuCommand second-level menu &amp; separator ([#831](https://github.com/scriptscat/scriptcat/issues/831)) [[bd08959](https://github.com/scriptscat/scriptcat/commit/bd089595c922aa63af0fb6d41fa9f6dc2587e096)] (by @cyfung1031)
- ✨ Add parameters to GM_openInTab ([#788](https://github.com/scriptscat/scriptcat/issues/788)) [[eb33d61](https://github.com/scriptscat/scriptcat/commit/eb33d613473815b12017e34f46ed9eb292a9dcba)] (by @cyfung1031)
- ✨ Add SC version check button ([#795](https://github.com/scriptscat/scriptcat/issues/795)) [[1680c66](https://github.com/scriptscat/scriptcat/commit/1680c66099120c0e497c1a1f5321f38fe0160ea0)] (by @cyfung1031)
- ✨ Add script list sidebar filtering and tagging functionality ([#794](https://github.com/scriptscat/scriptcat/issues/794)) [[6aabf59](https://github.com/scriptscat/scriptcat/commit/6aabf594cd62fa7358ba34c1c69060dc9e24919c)]
- ✨ Use window.showOpenFilePicker to open files enabling local file monitoring [#749](https://github.com/scriptscat/scriptcat/issues/749) [[7dcfbf1](https://github.com/scriptscat/scriptcat/commit/7dcfbf1309fff28c3d806d4ccb36bd0ef51050f5)]

### Changed

- ♻️ Separate indexeddb and chrome.storage migration logic ([#844](https://github.com/scriptscat/scriptcat/issues/844)) [[b8389fb](https://github.com/scriptscat/scriptcat/commit/b8389fbc21932dbbe9394b576fbd8605a3b820c8)]
- ♻️ Fix registerMenuCommand &amp; unregisterMenuCommand ([#826](https://github.com/scriptscat/scriptcat/issues/826)) [[3ecde9e](https://github.com/scriptscat/scriptcat/commit/3ecde9e0125089744c2d81f759b043deb5440be6)] (by @cyfung1031)
- ⚡ Optimize Runtime startup loading ([#775](https://github.com/scriptscat/scriptcat/issues/775)) [[3e69401](https://github.com/scriptscat/scriptcat/commit/3e69401feb98bd789a85dbda7d9e690f71bae696)] (by @cyfung1031)

### Fixed

- 🐛 Revise `GM_registerMenuCommand` related code design ([#790](https://github.com/scriptscat/scriptcat/issues/790)) ([a71cfe4](https://github.com/scriptscat/scriptcat/commit/a71cfe496fcb2457109dd97742a795585860a6d7))
- 🐛 Handle popup data cleanup [#784](https://github.com/scriptscat/scriptcat/issues/784) [[7bd9b16](https://github.com/scriptscat/scriptcat/commit/7bd9b162b178a534a8be31aca210af2106f110b7)]
- 🐛 Fix CAT_fileStorage download issue [#829](https://github.com/scriptscat/scriptcat/issues/829) [[81d4e49](https://github.com/scriptscat/scriptcat/commit/81d4e496df8abd3715348fe979758a63311b54c3)]
- 🐛 Fix userconfig group order issue [#818](https://github.com/scriptscat/scriptcat/issues/818) [[74881c0](https://github.com/scriptscat/scriptcat/commit/74881c0a05d599ad13300c3c69b33b01a5a7b552)]
- 🐛 Fix installation source data compatibility and handling issues [[574b3c6](https://github.com/scriptscat/scriptcat/commit/574b3c6506a21e1b8ebd891fd91fcd8b19774b96)]
- 🐛 Fix background script state sync issue in popup page [#838](https://github.com/scriptscat/scriptcat/issues/838) ([edd13c6](https://github.com/scriptscat/scriptcat/commit/edd13c65c9643dece7c38665f58146c9e59c802c))
- 🐛 Fix inconsistency between context menu and script menu [#768](https://github.com/scriptscat/scriptcat/issues/768) ([191ffcd](https://github.com/scriptscat/scriptcat/commit/191ffcd1e55d842acabbc44fdf1f1098f0b0093d))
- 🐛 Fix manual import local file error [#745](https://github.com/scriptscat/scriptcat/issues/745) ([fe14991](https://github.com/scriptscat/scriptcat/commit/fe149914e6eef99761ca44681abd95919613adb3))
- 🐛 Fix manual import local file error [#745](https://github.com/scriptscat/scriptcat/issues/745) ([52950a2](https://github.com/scriptscat/scriptcat/commit/52950a2ad04c79aecaa530a6eb615e9c54bba884))
- 🐛 Support local \*.user.js recognition [#812](https://github.com/scriptscat/scriptcat/issues/812) [[cec8ffc](https://github.com/scriptscat/scriptcat/commit/cec8ffc5f6947a54b7a59365928a1ccf47b336a2)]
- 🐛 Fix early start script unable to use GM_addElement [#801](https://github.com/scriptscat/scriptcat/issues/801) [[4d17645](https://github.com/scriptscat/scriptcat/commit/4d17645c0659d8ecd283473cbdd88b6eda065758)]
- 🐛 Fix early script GM_info.scriptMetaStr issue [#801](https://github.com/scriptscat/scriptcat/issues/801) [[a9a4333](https://github.com/scriptscat/scriptcat/commit/a9a433393ceb259aecc4fe9c1d32a0c9a8333160)]
- 🐛 Metadata block documentation and minor code fixes ([#832](https://github.com/scriptscat/scriptcat/issues/832)) [[c40822b](https://github.com/scriptscat/scriptcat/commit/c40822b293f1283d420797a0cbe549153541f3c8)] (by @cyfung1031)
- 🐛 Avoid menuCommand update triggering after Tab removal ([#828](https://github.com/scriptscat/scriptcat/issues/828)) [[c64f6d9](https://github.com/scriptscat/scriptcat/commit/c64f6d9a4e087f7788f5b160b91c2b808161e58e)] (by @cyfung1031)
- 🐛 Fix Modali18n issue ([#825](https://github.com/scriptscat/scriptcat/issues/825)) [[03da1ba](https://github.com/scriptscat/scriptcat/commit/03da1ba07c0fd212627bf3c18dbb3afa6affed78)] (by @cyfung1031)
- 🐛 Fix Modal.confirm i18n issue [#821](https://github.com/scriptscat/scriptcat/issues/821) [[b3c30f5](https://github.com/scriptscat/scriptcat/commit/b3c30f55db8b37ccbfa7278b83af21159c72f2cb)]
- ✏️ &quot;minetype&quot; should be &quot;mimetype&quot; in parameter type ([#823](https://github.com/scriptscat/scriptcat/issues/823)) [[fb3d132](https://github.com/scriptscat/scriptcat/commit/fb3d132ece659cb18082e383dfb925a5cc242c4c)] (by @cyfung1031)
- 🐛 Abort operations &amp; release resources when invalid Extension Context error occurs ([#800](https://github.com/scriptscat/scriptcat/issues/800)) [[c110e74](https://github.com/scriptscat/scriptcat/commit/c110e746336e63fc1266bb4cacc056e126d919e0)] (by @cyfung1031)
- 🐛 Fix batchUpdate page refetching updates + post-installation not updating issue ([#803](https://github.com/scriptscat/scriptcat/issues/803)) [[73f1f32](https://github.com/scriptscat/scriptcat/commit/73f1f329388c07588f2a532b71e5318bf3a92392)] (by @cyfung1031)
- 🐛 Adjust default jsconfig [#813](https://github.com/scriptscat/scriptcat/issues/813) [[06f0e1c](https://github.com/scriptscat/scriptcat/commit/06f0e1c7f0974b954d7ab546ce86f22f830dc28f)]
- 🐛 ui render issue ([#806](https://github.com/scriptscat/scriptcat/issues/806)) [[5c75c8b](https://github.com/scriptscat/scriptcat/commit/5c75c8b8e8fc92fcd830db094b34a7ad16fb4c9f)] (by @cyfung1031)
- 🐛 Suppress ambiguous unicode warnings [#747](https://github.com/scriptscat/scriptcat/issues/747) [[5e7c077](https://github.com/scriptscat/scriptcat/commit/5e7c077ef250e1b8eef5662bc416b82d62927b52)]
- 🐛 ScriptList column names and content not updated after language switch ([#792](https://github.com/scriptscat/scriptcat/issues/792)) [[3ad58b8](https://github.com/scriptscat/scriptcat/commit/3ad58b82bf1d4955cddd3e50b570c601f7e90143)] (by @cyfung1031)
- 🐛 Fix chrome.tabs.query ([#786](https://github.com/scriptscat/scriptcat/issues/786)) [[de607fd](https://github.com/scriptscat/scriptcat/commit/de607fd8eca841748a3e422fe5e84f84f84619d5)] (by @cyfung1031)
- 🐛 [UI Fix] Resolve useCallback issue ([#769](https://github.com/scriptscat/scriptcat/issues/769)) [[511de96](https://github.com/scriptscat/scriptcat/commit/511de96d2b271142244f9874f87bb23ec75f626a)] (by @cyfung1031)
- 🐛 Add background permission to fix unable to run in background issue [#762](https://github.com/scriptscat/scriptcat/issues/762) [[4205837](https://github.com/scriptscat/scriptcat/commit/42058379ab6d0e29003cc1f63d5df48dbe601f4e)]
- 🐛 Fix GM_download unable to download files with illegal characters in filename ([#758](https://github.com/scriptscat/scriptcat/issues/758)) [[2518722](https://github.com/scriptscat/scriptcat/commit/2518722c8bc14b9f52e8720624dd835b1fbdfb1b)] (by @WhiteSevs)
- 🐛 Fix sandbox toString issue [#737](https://github.com/scriptscat/scriptcat/issues/737) [[6ca24c9](https://github.com/scriptscat/scriptcat/commit/6ca24c9b171792035803ac4e1c69e473629f9d18)]
- 🐛 Fix badge showing 0 issue [[026c1d2](https://github.com/scriptscat/scriptcat/commit/026c1d2071dd4cfb6291f005d36717bcdf0a51c3)]
- 🐛 Fix script injection CSP issue [#739](https://github.com/scriptscat/scriptcat/issues/739) [#728](https://github.com/scriptscat/scriptcat/issues/728) [[5da21b5](https://github.com/scriptscat/scriptcat/commit/5da21b5e3d0e7e86a1fd5dff57ba03ea641c19fa)]

### Miscellaneous

- 📝 TypeScript comment fixes ([#839](https://github.com/scriptscat/scriptcat/issues/839)) [[6b575ca](https://github.com/scriptscat/scriptcat/commit/6b575cac4841bdf86de70e4b0e702e342a00ca76)] (by @cyfung1031)
- 🌐 Handle translation issues for notifications and errors, add `@grant` conflict validation ([#819](https://github.com/scriptscat/scriptcat/issues/819)) [[ef3482d](https://github.com/scriptscat/scriptcat/commit/ef3482d2c6406927a72835067f66a28cdb0f3b79)] (by @cyfung1031)
- 🌐 "No message content" i18n handling ([#811](https://github.com/scriptscat/scriptcat/issues/811)) [[f9486d6](https://github.com/scriptscat/scriptcat/commit/f9486d6e53d68c085625ac370dc717daf8af232e)] (by @cyfung1031)
- 🌐 UI modify source format display ([#783](https://github.com/scriptscat/scriptcat/issues/783)) [[9242b95](https://github.com/scriptscat/scriptcat/commit/9242b957cf5f90f6d186a0b1f07bfce8d6ed1cd7)] (by @cyfung1031)
- 🌐 updatepage translation ([#777](https://github.com/scriptscat/scriptcat/issues/777)) [[757c954](https://github.com/scriptscat/scriptcat/commit/757c954768be8fc94e05200822a23efef5e6bc01)] (by @cyfung1031)
- 🌐 Update translation.json ([#746](https://github.com/scriptscat/scriptcat/issues/746)) [[85b48e2](https://github.com/scriptscat/scriptcat/commit/85b48e2982e0c81f82622528a3aa600c3c88ce8d)] (by @cyfung1031)

<a name="1.2.0-beta.1"></a>

## 1.2.0-beta.1 (2025-09-18)

### Added

- ✨ Add layout menu to hide sidebar [#689](https://github.com/scriptscat/scriptcat/issues/689) [[dd64da7](https://github.com/scriptscat/scriptcat/commit/dd64da719c081acbf21645e2b1e1f38653ffae8c)]
- ✨ Implement inject into ([#711](https://github.com/scriptscat/scriptcat/issues/711)) [[4c708c2](https://github.com/scriptscat/scriptcat/commit/4c708c2c5a0f7cea6daa2f32f51e182a4f83c50c)]
- ✨ : add a shortcut to activate the toolbar button for Firefox mv3 ([#718](https://github.com/scriptscat/scriptcat/issues/718)) [[06a9040](https://github.com/scriptscat/scriptcat/commit/06a904046034aad59564ea07d8ec441f4def5278)] (by @xymoryn)

### Changed

- ⚡ Optimize popup page re-rendering causing collapse issue after clicking background script run button [[d83ad0d](https://github.com/scriptscat/scriptcat/commit/d83ad0dda600db59adf70f9db2304381db7ab80f)]
- ⚡ Optimize script list, reduce re-render [[610fba0](https://github.com/scriptscat/scriptcat/commit/610fba08bbac5c01791aac756eed60a75bc1d483)]
- ♻️ Enhance background script task checking, reduce errors [#714](https://github.com/scriptscat/scriptcat/issues/714) [[3850af2](https://github.com/scriptscat/scriptcat/commit/3850af22abefced1f2ec6c773c92599a18bb0f8a)]
- 🐛 Fix background scripts not expanding in popup page ([66ab70f](https://github.com/scriptscat/scriptcat/commit/66ab70fb10c28aaf0c9260a9591aab7e1ae35615))
- ✨ Popup page doesn't auto-close after excluding websites [#725](https://github.com/scriptscat/scriptcat/issues/725) ([e432210](https://github.com/scriptscat/scriptcat/commit/e43221051d52d7394a579442519e99d258df872a))
- ♻️ Optimize ReduxStore and broadcast mechanism ([#729](https://github.com/scriptscat/scriptcat/issues/729)) [[b62781e](https://github.com/scriptscat/scriptcat/commit/b62781e11f0f4771094e42cb3479a70b8134cdf6)] (by @cyfung1031)
- ⚡ React.forwardRef code optimization ([#734](https://github.com/scriptscat/scriptcat/issues/734)) [[a7faa48](https://github.com/scriptscat/scriptcat/commit/a7faa48f9a4615318104fa5d501184a4faec73cd)] (by @cyfung1031)
- ♻️ Refactor and optimize systemConfig [[3acd3f3](https://github.com/scriptscat/scriptcat/commit/3acd3f3890031a7e90bd57eb63320007164ed4ff)]

### Fixed

- 🐛 Fix state update error [[94fd65b](https://github.com/scriptscat/scriptcat/commit/94fd65bfb765a9511e0efb2dc6fb2bfd216e570f)]
- ✏️ Fix typo ([#738](https://github.com/scriptscat/scriptcat/issues/738)) ([4e55c06](https://github.com/scriptscat/scriptcat/commit/4e55c06212336bd3356e6d1ead3b75cf97f3b9d8))
- 🐛 Fix badge showing 0 issue ([6edad14](https://github.com/scriptscat/scriptcat/commit/6edad1491820665fad8cd6ee5c85e93c57aa0d42))
- 🐛 Enhance message type checking [#676](https://github.com/scriptscat/scriptcat/issues/676) ([5073795](https://github.com/scriptscat/scriptcat/commit/50737957507ff9af3aa9ba9a6b7d444b643d1ff2))
- 🐛 Fix sandbox toString issue [#737](https://github.com/scriptscat/scriptcat/issues/737) [[a4cefbc](https://github.com/scriptscat/scriptcat/commit/a4cefbc791fc2c2e53f3e934e0e4725023f49f72)]
- ✏️ Fix typo [[35b6f58](https://github.com/scriptscat/scriptcat/commit/35b6f581c6421a6db001eebadaa8ae216f5b8575)]
- 🐛 Fix GM xhr document issue [#716](https://github.com/scriptscat/scriptcat/issues/716) [[1c46546](https://github.com/scriptscat/scriptcat/commit/1c465462f4e14ae461d54358710f5caf74208af3)]

<a name="1.2.0-beta"></a>

## 1.2.0-beta (2025-09-07)

### Added

- ✨ Add custom editor configuration and editor type definitions ([#708](https://github.com/scriptscat/scriptcat/issues/708)) [[49eb379](https://github.com/scriptscat/scriptcat/commit/49eb3794774790d61c3ef787c865a9ba6fe82841)]
- ✨ Add uninstall survey page [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]
- 📝 Modify installation opening page and namespace ([6f2f000](https://github.com/scriptscat/scriptcat/commit/6f2f000612908b7a88f6b70c2831092805c63bc7))
- ✨ Add mobile installation QR code ([348237c](https://github.com/scriptscat/scriptcat/commit/348237c7ce9771c69025386926b1f73710cf6f42))

### Fixed

- 🐛 Fix older browser version compatibility issues [#715](https://github.com/scriptscat/scriptcat/issues/715) [[4da8068](https://github.com/scriptscat/scriptcat/commit/4da806879c2b170672814d02e6f8ed98c9fae35b)]
- 💄 Optimize popup menu display when window is too small ([288650e](https://github.com/scriptscat/scriptcat/commit/288650e5e4cbdc3fa8658f0754ce427a1b3dec5a))
- 🐛 Fix N issues ([#710](https://github.com/scriptscat/scriptcat/issues/710)) [[6a2027a](https://github.com/scriptscat/scriptcat/commit/6a2027ac0bb5e0ed625df570240d068a98a34b31)] (by @WhiteSevs)
- 🐛 Fix GM XHR redirect losing headers issue [#664](https://github.com/scriptscat/scriptcat/issues/664) close [#664](https://github.com/scriptscat/scriptcat/issues/664) [[1f29e69](https://github.com/scriptscat/scriptcat/commit/1f29e699ded25ec5270844c1fb54001b5bbf5038)]

### Miscellaneous

- 🌐 Handle i18n issues [[2adf69d](https://github.com/scriptscat/scriptcat/commit/2adf69d6ec3c30186f2c2ef89f97e3cba9e15a66)]
- 🌐 Handle translation issues [[55223dd](https://github.com/scriptscat/scriptcat/commit/55223dde8c545e974d19dd8126756aaae407e1fd)]

<a name="1.1.0-beta.2"></a>

## 1.1.0-beta.2 (2025-09-03)

Added Dropbox support, made compatibility improvements, added @early-start for faster-than-page loading

### Added

- ✨ Add script runtime environment settings [#628](https://github.com/scriptscat/scriptcat/issues/628) [[0d4a89e](https://github.com/scriptscat/scriptcat/commit/0d4a89efaecf0331dcc7fbb6df006b93a1525846)]
- ✨ Collapse by default when there are no background scripts [#626](https://github.com/scriptscat/scriptcat/issues/626) ([9d0aac6](https://github.com/scriptscat/scriptcat/commit/9d0aac6aae11b96707ca1f7c024a24e9d55f217b))
- ✨ Support Dropbox [#575](https://github.com/scriptscat/scriptcat/issues/575) [[2c66f21](https://github.com/scriptscat/scriptcat/commit/2c66f21f5118bd83a0eaa0f1baa3a31f2233e5b2)]
- ✨ Optimize external.Tampermonkey when TM and SC launch together, check SC installation status if TM is not installed ([#703](https://github.com/scriptscat/scriptcat/issues/703)) [[d0115c3](https://github.com/scriptscat/scriptcat/commit/d0115c33657260d803b6091139601b1b20407d4e)] (by @cyfung1031)
- ✨ Add @early-start for faster-than-page loading ([#649](https://github.com/scriptscat/scriptcat/issues/649)) [[eb097dd](https://github.com/scriptscat/scriptcat/commit/eb097dd146dcd6f8ca712ed883571dbfb3d09f20)]

### Changed

- ♻️ Compatible with FF: `chrome.scripting.registerContentScripts` ([#704](https://github.com/scriptscat/scriptcat/issues/704)) [[a9ad0ea](https://github.com/scriptscat/scriptcat/commit/a9ad0ea2b34744dbd4488bda0a16d73bd6a1cc2b)] (by @cyfung1031)
- ♻️ url_matcher code optimization ([#702](https://github.com/scriptscat/scriptcat/issues/702)) [[27b8baa](https://github.com/scriptscat/scriptcat/commit/27b8baa90372f75cbf428dd32ef02d842688cf33)] (by @cyfung1031)
- ⚡ const now = Date.now(); ([#695](https://github.com/scriptscat/scriptcat/issues/695)) [[400b45c](https://github.com/scriptscat/scriptcat/commit/400b45cc487da4cc8a7b866916855acdc18a8023)] (by @cyfung1031)
- ⚡ forEach -> for of ([#694](https://github.com/scriptscat/scriptcat/issues/694)) [[70927b6](https://github.com/scriptscat/scriptcat/commit/70927b6f0ddcf4a60d5838597d1df5acaaa7ca94)] (by @cyfung1031)
- ⚡ Common code optimization ([#692](https://github.com/scriptscat/scriptcat/issues/692)) [[cf05973](https://github.com/scriptscat/scriptcat/commit/cf0597305a158fd8ba8489f30906d7bbbd7a4b0b)] (by @cyfung1031)
- ⚡ Code optimization: Global Search ([#697](https://github.com/scriptscat/scriptcat/issues/697)) [[a5c12bd](https://github.com/scriptscat/scriptcat/commit/a5c12bd94f249ea194bececf2ecb39a0dea3c7dc)] (by @cyfung1031)
- ♻️ Use middleware to handle initReady [[758e926](https://github.com/scriptscat/scriptcat/commit/758e92690194462982282dca25041c825d0b05e2)]
- ♻️ Optimize Server and MessageQueue components [[0932edc](https://github.com/scriptscat/scriptcat/commit/0932edc49722226cac97403dcd14dbaef01b5528)]
- ♻️ Compatibility adjustment: optional_permission handling ([#679](https://github.com/scriptscat/scriptcat/issues/679)) [[bfc558a](https://github.com/scriptscat/scriptcat/commit/bfc558a0dfd167234100d95b9180ee6db4ab4c04)] (by @cyfung1031)
- ♻️ Compatibility adjustment: `content.js` should error if no `chrome.runtime.onMessage` ([#675](https://github.com/scriptscat/scriptcat/issues/675)) [[4e9adc0](https://github.com/scriptscat/scriptcat/commit/4e9adc00562981aa9d930d8a3f199e9418bdff30)] (by @cyfung1031)
- ♻️ Compatibility adjustment (offscreen) and code optimization ([#674](https://github.com/scriptscat/scriptcat/issues/674)) [[a3e56dd](https://github.com/scriptscat/scriptcat/commit/a3e56dd9d76cad73c8c8ec75c71fdbcfb9ca40e0)] (by @cyfung1031)
- 🎨 Compatibility adjustment: notificationsUpdate ([#673](https://github.com/scriptscat/scriptcat/issues/673)) [[a345d93](https://github.com/scriptscat/scriptcat/commit/a345d93187e26efe99cc331072ffc854b3fe7b4d)] (by @cyfung1031)
- 🎨 Enhance chrome.tabs.create compatibility ([#639](https://github.com/scriptscat/scriptcat/issues/639)) [[ac0d7de](https://github.com/scriptscat/scriptcat/commit/ac0d7deb5957ea71579ef7a44594a75300e1cca6)] (by @cyfung1031)

### Fixed

- 🐛 修复网络无法访问安装中间页时无法触发安装的问题 [#705](https://github.com/scriptscat/scriptcat/issues/705) [[5f1e292](https://github.com/scriptscat/scriptcat/commit/5f1e2929d79c470ba4427c3cce01f5cd184a839b)]
- 🐛 处理`@match *://*domain/*`的表达式 [[039b445](https://github.com/scriptscat/scriptcat/commit/039b4454148947cd3c74de82b87804ee9815e60c)]
- 🐛 修复扩展环境沙盒穿透问题 [#700](https://github.com/scriptscat/scriptcat/issues/700) [[a1a868d](https://github.com/scriptscat/scriptcat/commit/a1a868dfe3199e666fe2bcb65cfb2ad0ad3d699b)]
- ✏️ backgroud -&gt; background ([#698](https://github.com/scriptscat/scriptcat/issues/698)) [[2594075](https://github.com/scriptscat/scriptcat/commit/2594075c4a50f4c79fa46bcda08d7b0cbcfe723c)] (by @cyfung1031)
- ✏️ CrhomeStorage -&gt; ChromeStorage ([#693](https://github.com/scriptscat/scriptcat/issues/693)) [[64c536d](https://github.com/scriptscat/scriptcat/commit/64c536dbd5fcb4c29eebc1109202bab69aaa3ee2)] (by @cyfung1031)
- 🐛 修复 GM.getTab、GM.getTabs ([#683](https://github.com/scriptscat/scriptcat/issues/683)) [[31de256](https://github.com/scriptscat/scriptcat/commit/31de256f02b5b61e27f0eec9ea673248ba8faa32)] (by @WhiteSevs)
- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[545d7c8](https://github.com/scriptscat/scriptcat/commit/545d7c8c0dd69c83bd2f0353518aafe6af81c0f4)] (by @cyfung1031)
- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) ([bba12d2](https://github.com/scriptscat/scriptcat/commit/bba12d23f04759cb9b7fdb63f0d95ae515ee94a9))

### Miscellaneous

- 📝 Create README_RU.md and CONTRIBUTING_RU.md ([#678](https://github.com/scriptscat/scriptcat/issues/678)) [[597ab03](https://github.com/scriptscat/scriptcat/commit/597ab0378fe5ced01637cf411326ef7845b8ce2b)] (by @Ioann)
- 👷 兼容性调整（pack.js 兼容性） ([#669](https://github.com/scriptscat/scriptcat/issues/669)) [[fec45e6](https://github.com/scriptscat/scriptcat/commit/fec45e6606a609b10b79c58d2fcba02c2ce71e16)] (by @cyfung1031)

**Full Changelog**: https://github.com/scriptscat/scriptcat/compare/v1.1.0-beta.1...v1.1.0-beta.2

<a name="1.1.0-beta.1"></a>

## 1.1.0-beta.1 (2025-08-29)

### Added

- ✅ Modify unit tests ([#690](https://github.com/scriptscat/scriptcat/issues/690)) [[71f9d70](https://github.com/scriptscat/scriptcat/commit/71f9d709868b96352494889ea864c22c0b2ce197)] (by @cyfung1031)
- 🎨 Async code optimization ([#651](https://github.com/scriptscat/scriptcat/issues/651)) ([55440e7](https://github.com/scriptscat/scriptcat/commit/55440e725a706e4358f08bc430ebea77bcb25335))
- ✨ Global code search ([#662](https://github.com/scriptscat/scriptcat/issues/662)) [[f8eafb7](https://github.com/scriptscat/scriptcat/commit/f8eafb7f955dad62c1b41ac477e929bf00c65982)] (by @RenjiYuusei)
- ✅ Adjust nextTime unit test [[0a6ed8c](https://github.com/scriptscat/scriptcat/commit/0a6ed8c72b8ee6dc15b66f8053ae3bf3ee95584d)]

### Changed

- ♻️ ScriptMatchInfo related code optimization ([#653](https://github.com/scriptscat/scriptcat/issues/653)) [[556c493](https://github.com/scriptscat/scriptcat/commit/556c493f027fbfa7299ee68c3a9d927de6f41f08)] (by @cyfung1031)
- 🎨 Optimize window opening logic [[0de44bf](https://github.com/scriptscat/scriptcat/commit/0de44bfc90eeee003d9708ba0678e6c23f859579)]
- 🌐 Handle translation issues ([cbe880e](https://github.com/scriptscat/scriptcat/commit/cbe880efcf3a148301dce4ffa90aa29a14407a26))
- 🎨 `@scriptURL` ([#654](https://github.com/scriptscat/scriptcat/issues/654)) [[4b1a5de](https://github.com/scriptscat/scriptcat/commit/4b1a5de9ed3b328091f582925b8a442535953a9e)] (by @cyfung1031)
- ♻️ Rewrite UrlMatch ([#637](https://github.com/scriptscat/scriptcat/issues/637)) [[5b01c10](https://github.com/scriptscat/scriptcat/commit/5b01c10859b80890456a44a66d78204b42040870)] (by @cyfung1031)
- 🎨 getEnableScript optimization ([#645](https://github.com/scriptscat/scriptcat/issues/645)) [[04910cf](https://github.com/scriptscat/scriptcat/commit/04910cf6213fe90fc8cbca28f2826414855dd7b1)] (by @cyfung1031)
- ⚡ runtime.ts code optimization ([#642](https://github.com/scriptscat/scriptcat/issues/642)) [[641cc1d](https://github.com/scriptscat/scriptcat/commit/641cc1d1ec0ec2dff5d32689ba46d27d30f7b45f)] (by @cyfung1031)
- 🎨 Enhance chrome.tabs.create compatibility ([#639](https://github.com/scriptscat/scriptcat/issues/639)) [[601b933](https://github.com/scriptscat/scriptcat/commit/601b933bd5cec1405ac6169a6160a57dfe0dbcfc)] (by @cyfung1031)
- 🎨 Fix new script `@match` `@icon` ([#636](https://github.com/scriptscat/scriptcat/issues/636)) [[aec08a3](https://github.com/scriptscat/scriptcat/commit/aec08a331f868defee6279eb420f6b90aba39cfe)] (by @cyfung1031)

### Removed

- 🔥 Remove script site crowdin documentation [[695f4d1](https://github.com/scriptscat/scriptcat/commit/695f4d1ba2d039508415235dd8e606d238be8035)]

### Fixed

- 🐛 Fix finalUrl missing domain ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[3ed018a](https://github.com/scriptscat/scriptcat/commit/3ed018a7a54803fcf2e1791316e0166ed0b52007)] (by @cyfung1031)
- 💚 Fix react/jsx-no-literals lint issue [[017b608](https://github.com/scriptscat/scriptcat/commit/017b60886be601e3e0e1719cf249da32d5686c30)]
- 🐛 Compatible with older browser kernels [#647](https://github.com/scriptscat/scriptcat/issues/647) [[0e2f817](https://github.com/scriptscat/scriptcat/commit/0e2f8173c8b44bd6ad44bdffc73fa302a96a058e)]
- 🐛 Optimize window.external injection ([#646](https://github.com/scriptscat/scriptcat/issues/646)) [[0b2668a](https://github.com/scriptscat/scriptcat/commit/0b2668aadcab35a33ff9abc4bd030dffb87ea168)] (by @cyfung1031)
- 🐛 Fix cloud storage auth page unable to auto-close [[7748088](https://github.com/scriptscat/scriptcat/commit/7748088e63c1fc660b6a6ae5613cf04f9da99b8c)]

### Miscellaneous

- 🌐 Refines and expands Vietnamese locale ([#661](https://github.com/scriptscat/scriptcat/issues/661)) [[6847a59](https://github.com/scriptscat/scriptcat/commit/6847a596c4b06c75e13594ef60e4b9dfa5718cf3)] (by @RenjiYuusei)
- 🌐 Translation fixes ([#635](https://github.com/scriptscat/scriptcat/issues/635)) [[19296de](https://github.com/scriptscat/scriptcat/commit/19296de6a3815e5965eb33401a55da9b2bd22bb4)] (by @cyfung1031)
- 🌐 Fix onboarding guide i18n issue [#627](https://github.com/scriptscat/scriptcat/issues/627) [[9683f96](https://github.com/scriptscat/scriptcat/commit/9683f965400ab6a2bac15349aca4335911766eac)]

<a name="1.1.0-beta"></a>

## 1.1.0-beta (2025-08-18)

### Changed

- ⚡ Don't use .reduce syntax ([#619](https://github.com/scriptscat/scriptcat/issues/619)) [[71e97d5](https://github.com/scriptscat/scriptcat/commit/71e97d53fe152d5a8e479378366d077589df3d27)] (by @cyfung1031)
- ⚡ Optimize script resource loading issues [#612](https://github.com/scriptscat/scriptcat/issues/612) [[e206562](https://github.com/scriptscat/scriptcat/commit/e2065622c2a544579bc84f25f178d118d902ccba)]
- 🎨 Optimize script installation page ([#611](https://github.com/scriptscat/scriptcat/issues/611)) ([bbc76b1](https://github.com/scriptscat/scriptcat/commit/bbc76b1110d417a445b3cc065488fe11b7f2ddc2))
- 🐛 Fix open in current window method ([70be8a3](https://github.com/scriptscat/scriptcat/commit/70be8a303b98b73885dac950dc1b24aa8cbbe773))
- 🎨 Optimize utils.ts ([#608](https://github.com/scriptscat/scriptcat/issues/608)) [[37bb763](https://github.com/scriptscat/scriptcat/commit/37bb763306c7e06df085022c2cb2fa9cc2788204)] (by @cyfung1031)
- 🎨 doThrow and TypeScript organization ([#606](https://github.com/scriptscat/scriptcat/issues/606)) [[4362802](https://github.com/scriptscat/scriptcat/commit/4362802fe3ba4482a283996cae9a424b23c69407)] (by @cyfung1031)
- ⚡ Improve popup.ts and runtime.ts (code optimization) ([#607](https://github.com/scriptscat/scriptcat/issues/607)) [[e48ca66](https://github.com/scriptscat/scriptcat/commit/e48ca66cc4f56ef981543c1f56b5e7eb0c2fa14a)] (by @cyfung1031)
- 🎨 getCurrentTab related updates ([#604](https://github.com/scriptscat/scriptcat/issues/604)) [[b4a9f2e](https://github.com/scriptscat/scriptcat/commit/b4a9f2efd48ee8cbacac6872ddb25c7d630bfd8a)] (by @cyfung1031)
- 🎨 TMessage TS definition ([#596](https://github.com/scriptscat/scriptcat/issues/596)) [[6aeb61d](https://github.com/scriptscat/scriptcat/commit/6aeb61da8ae7efdd718facacf90e4ed40ddb4caf)] (by @cyfung1031)
- 🎨 Use Service Worker to obtain favicon ([#594](https://github.com/scriptscat/scriptcat/issues/594)) [[727872d](https://github.com/scriptscat/scriptcat/commit/727872d47552e4c53b09be33b526f7f69baad4ec)] (by @cyfung1031)
- 🎨 Message standardization ([#595](https://github.com/scriptscat/scriptcat/issues/595)) [[791608b](https://github.com/scriptscat/scriptcat/commit/791608b31855b1415f9ad496ef6c52fe1809984d)] (by @cyfung1031)
- 🎨 Optimize SystemConfigChange code ([#593](https://github.com/scriptscat/scriptcat/issues/593)) [[041d985](https://github.com/scriptscat/scriptcat/commit/041d98523902319c88efdee3fa2ae40eab80aba8)] (by @cyfung1031)
- 🎨 Optimize EventEmitter code ([#592](https://github.com/scriptscat/scriptcat/issues/592)) [[67543c4](https://github.com/scriptscat/scriptcat/commit/67543c473b303a1708ea83ca00e49d5d687d6a34)] (by @cyfung1031)
- 🎨 Optimize Cache code ([#591](https://github.com/scriptscat/scriptcat/issues/591)) [[34e42ac](https://github.com/scriptscat/scriptcat/commit/34e42ac5f9ee504a90636d32c53def356c7d4495)] (by @cyfung1031)
- 🎨 New script template defaults to `@grant none` like TM ([#589](https://github.com/scriptscat/scriptcat/issues/589)) [[e5a2d5d](https://github.com/scriptscat/scriptcat/commit/e5a2d5d3adafdcac2cf95b865550e395ba8443c7)] (by @cyfung1031)
- ⚡ new Date().getTime() → Date.now() ([#587](https://github.com/scriptscat/scriptcat/issues/587)) [[245ecbf](https://github.com/scriptscat/scriptcat/commit/245ecbfc23f1811aeee5671e48151e94b0ebc128)] (by @cyfung1031)

### Fixed

- 🐛 Fix `@connect` \* not taking effect issue [#623](https://github.com/scriptscat/scriptcat/issues/623) [[76481c8](https://github.com/scriptscat/scriptcat/commit/76481c845b34414a7f15ed18ec61f7dff7eef091)]
- 🐛 Add unit tests and fix `@exclude` issue ([#618](https://github.com/scriptscat/scriptcat/issues/618)) [[0046bb7](https://github.com/scriptscat/scriptcat/commit/0046bb78800a2c46edaac785b8e9592327772a3b)] (by @cyfung1031)
- 🐛 Fix some .user.js links unable to install scripts [#599](https://github.com/scriptscat/scriptcat/issues/599) [[ccd2639](https://github.com/scriptscat/scriptcat/commit/ccd2639858f0f3cde28f284376fe8ed998d935ae)]
- 🐛 Fix new script creation failure [[d42d6e7](https://github.com/scriptscat/scriptcat/commit/d42d6e7d408a84674facf9ab0da6eac0e384502f)]
- 🐛 Metadata fixes ([#610](https://github.com/scriptscat/scriptcat/issues/610)) [[4d98cce](https://github.com/scriptscat/scriptcat/commit/4d98cce0ca1281cc58f551ea4e6700e340780d3f)] (by @cyfung1031)
- 🐛 Popup Badge fixes ([#605](https://github.com/scriptscat/scriptcat/issues/605)) [[eff9230](https://github.com/scriptscat/scriptcat/commit/eff92309de99abb0cf48ef4727afaa113bc2fbb6)] (by @cyfung1031)
- 🐛 ScriptEditor.tsx fixes ([#603](https://github.com/scriptscat/scriptcat/issues/603)) [[a9aadba](https://github.com/scriptscat/scriptcat/commit/a9aadba372b813c16bdc5f0aeb07c68981f48c63)] (by @cyfung1031)
- 🐛 Code viewer &amp; editor CSS fixes ([#602](https://github.com/scriptscat/scriptcat/issues/602)) [[2e86785](https://github.com/scriptscat/scriptcat/commit/2e8678513efaccd42c8dc2aa89f8b76679aa8420)] (by @cyfung1031)
- 🐛 Fix getFaviconFromDomain concurrency issue ([#597](https://github.com/scriptscat/scriptcat/issues/597)) [[1872fe1](https://github.com/scriptscat/scriptcat/commit/1872fe165ab204b155a56f037c111d2d7776c2b9)] (by @cyfung1031)
- 🐛 Fix opening tab error in multi-window scenarios [#586](https://github.com/scriptscat/scriptcat/issues/586) [[54c1da2](https://github.com/scriptscat/scriptcat/commit/54c1da29c2bd8bd8f5ef2d85b7aed8b334de296f)]
- 🐛 Fix openerTabId compatibility issue ([#586](https://github.com/scriptscat/scriptcat/issues/586)) [[b861fc8](https://github.com/scriptscat/scriptcat/commit/b861fc8620e53b885cad98db03f1dd10ec9d296c)] (by @cyfung1031)

### Miscellaneous

- 👷 pack.js code optimization ([#615](https://github.com/scriptscat/scriptcat/issues/615)) [[870dd9b](https://github.com/scriptscat/scriptcat/commit/870dd9bc6b7eff3eceefa915452e773ec0565180)] (by @cyfung1031)
