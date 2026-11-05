---
title: Metadata Block
---

The content inside `==UserScript==` describes the permissions a script needs, information about the script, and so on. It sits at the very start of the script.

```js
// ==UserScript==
// @name         New Userscript
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @crontab      * * once * *
// ==/UserScript==
```

## Main Values

### name

Script name

### namespace

Script namespace. `name + namespace` determines the script's uniqueness.

### version

The script's version. It's recommended to follow [semantic versioning](https://semver.org/), so that when a version change is detected, the user is prompted to update, and so on.

### description

A detailed description of the script

### author

Script author

### run-at

When the script runs

| Value          | Runs                                                              | Supported since        |
| -------------- | ------------------------------------------------------------------ | ---------------------- |
| document-start | Injects the script into the page as soon as the URL matches on the frontend | v0.3.0          |
| document-end   | Injects the script after the DOM has finished loading; page scripts and images may still be loading at this point | v0.3.0 |
| document-idle  | Injects the script after all content has finished loading         | v0.3.0                  |
| document-body  | The script is only injected once the page has a `body` element     | v0.6.2                  |
| document-menu  | Shows a menu on right-click; running the script uses the script name as the menu name | v0.3.4-v0.9.4 (🔥 removed) |

For menu icons, you can refer to [Unicode Symbols](https://unicode-table.com/en/) and [emoji](https://www.emojiall.com/en-US/).

### run-in

Specifies the environment the script is injected into: `@run-in normal-tabs` for regular tabs, `@run-in incognito-tabs` for incognito tabs.

### early-start (v1.1.0+)

When `run-at` is `document-start`, the script runs as early as possible, but it still can't guarantee loading faster than the page.

Once you've defined `@run-at document-start`, you can add `@early-start` to make the script load faster than the page: [example](https://github.com/scriptscat/scriptcat/blob/main/example/early-start.js)

### inject-into

:::tip

In the content-script environment (`content`), `unsafeWindow` only points to the environment's own current `window`, and cannot access the page's `window`.

ScriptCat does not support automatically checking CSP restrictions to decide whether to inject as `content` or `page` (i.e. Tampermonkey's `@inject-into auto`).

:::

Specifies where the script is injected, supporting `page` and `content`, defaulting to `page`.

- `page`: the script is injected into the page environment, and can use `unsafeWindow` to access the page's `window` and `DOM`
- `content`: the script is injected into the content-script environment, cannot directly access the page's `window` object, but can access the page `DOM`, and is not subject to `CSP`

### storageName 🧪

The storage space for `Value`; data under the same `storageName` can be shared and communicated across scripts. This is ScriptCat-specific.

### background

Marks this script as a background script, which needs to run in the background environment. See [Background Script](./background.md#background-script-background) for details.

### crontab

Marks the script as a scheduled script, which requires a cron expression value. Only one cron expression can exist, and it runs on that schedule in the background environment. See [Scheduled Script](./background.md#scheduled-script-crontab) for details.

### match

Only URLs matched by `match` will run the script, following [Match patterns](https://developer.chrome.com/docs/extensions/mv3/match_patterns/). In `match`, `*` is a wildcard, `tld` matches the top-level domain, and a domain starting with `*.` will also match `xxx.com`:

| Value                             | Correct examples                                                                                                                          | Incorrect examples                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `http://scriptcat.org/doc/match`  | `http://scriptcat.org/doc/match`                                                                                                            | `http://scriptcat.org/doc/runAt`         |
| `*://*/param?*`                   | `https://scriptcat.org/param` \| `http://scriptcat.org/param?search=userscript`                                                            | `https://scriptcat.org/test/param`       |
| `*://*/prefix*suffix`             | `http://scriptcat.org/prefix/suffix` \| `http://scriptcat.org/prefix/mid/suffix` \| `http://scriptcat.org/prefixsuffix`                      | `http://scriptcat.org/prefix/suffix/end` |
| `http*://scriptcat.org/*`         | `https://scriptcat.org/` \| `https://scriptcat.org/doc` \| `http://scriptcat.org/doc/match` \| `http://scriptcat.org/param?search=userscript` | `https://doc.scriptcat.org/`            |
| `http*://scriptcat.org/doc/*`     | `https://scriptcat.org/doc` \| `http://scriptcat.org/doc/match`                                                                              | `http://scriptcat.org/param?search=userscript` |
| `http*://scriptcat.tld/doc/*`     | `https://scriptcat.cn/doc` \| `http://scriptcat.net.cn/doc/match`                                                                            | `http://google.com/param?search=userscript` |
| `http*://*.scriptcat.org/doc/*`   | `https://scriptcat.cn/doc` \| `http://www.scriptcat.net.cn/doc/match`                                                                        | `http://google.com/param?search=userscript` |

### include

Supports `\*` for fuzzy matching, allowing non-standard URLs

### exclude

URLs that should not match; uses the same expression syntax as `include`

### grant

Requests API permission — an API can only be called once it has been requested. See the permission list at: [API Documentation](./api.md) and [CAT API Documentation](./cat-api.md).

Two special values:

- **none**: the script does not run in the sandbox environment, but directly in the page environment. In this environment, no GM APIs are available, but the page's `window` object can be accessed directly.
- **unsafeWindow**: in the sandbox environment, if you need to access the page's `window` object, use `unsafeWindow` to do so. (Tampermonkey doesn't require declaring this — it's kept only for compatibility, which admittedly isn't very clean.)

### connect

Requests access permission for a site; see `GM_cookie` and `GM_xmlhttpRequest`. `GM_download` in `native` mode also honors `@connect` (undeclared hosts trigger a confirmation prompt, unlike Tampermonkey)

### resource

Includes a resource file. After declaring `@resource`, you can use `GM_getResourceText`/`GM_getResourceURL` to retrieve the information.

```js
// @resource icon https://bbs.tampermonkey.net.cn/favicon.ico
// @resource html https://bbs.tampermonkey.net.cn/
// @resource xml https://bbs.tampermonkey.net.cn/sitemap.xml
// Adding resource integrity verification
// @resource icon https://bbs.tampermonkey.net.cn/favicon.ico#md5-xxx,sha256-xxx
```

### require

Includes an external JS file; supports [resource integrity verification](#resource-integrity-verification)

### require-css

Includes an external CSS file; supports [resource integrity verification](#resource-integrity-verification)

### noframes

Marks the script as not running inside a `<frame>`

### definition

The reference address of a `.d.ts` file, enabling editor auto-completion hints

### antifeature

This is related to the script marketplace; unwelcome features need to be flagged with this description value, for example:

```js
// @antifeature ads This script has ads
// @antifeature referral-link This script modifies or redirects to the author's referral link
```

## Additional Description Values

### license

The current script's open-source license

### updateURL

Update checking requires the remote script to have a `@version` tag for this to take effect.

The link the script uses to check for updates; if not set, it defaults to the link's `user.js => meta.js`, or the current link if there's no `user.js`.

If `@updateURL` is configured, `@downloadURL` must also be configured for `@updateURL` to take effect.

### downloadURL

The download address for the script update

### supportURL

Support site, bug report page

### homepage, homepageURL, website

Script homepage

### source

Script source code page

### icon, iconURL, defaulticon

Script icon

### icon64, icon64URL

64x64-sized script icon

### Notes

### Resource Integrity Verification

- Use md5, sha1, sha256, sha384, or sha512 to verify resources against tampering. Multiple verification methods can be separated with `;` or `,`.
- Per [W3C recommendations](https://w3c.github.io/webappsec-subresource-integrity/#hash-collision-attacks), md5 and sha1 are not recommended; use sha384 or a stronger hash algorithm instead.

For example:

```js
// @require https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js#md5-d55836f30c097da753179f82fa6f108f,sha256-a476ab8560837a51938aa6e1720c8be87c2862b6221690e9de7ffac113811a90
```
