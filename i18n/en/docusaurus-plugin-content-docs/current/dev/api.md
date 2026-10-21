---
title: API Documentation
---

## Overview

This extension's API definitions are based on the [Tampermonkey documentation](https://www.tampermonkey.net/documentation.php). Due to time and effort constraints, only part of the API has been implemented so far, and it will keep iterating. Any API that this extension extends or that differs from the original GM API is specially marked in the documentation (using a `*`). Some APIs also provide a synchronous-style counterpart following the rule `GM.*` — see the documentation content for details.

For the detailed API definitions, see `scriptcat.d.ts` or the built-in editor hints, as the documentation may not always be up to date. For APIs specific to this extension, see the [CatApi Documentation](cat-api.md).

You can also find related examples in the [example directory](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definitions

### GM_info

Gets information about the script, including metadata and runtime environment parameters. Commonly used fields include `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode`, and more. See `scriptcat.d.ts` for the detailed (though not exhaustive) definition.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` currently only has the value `raw`. `runAt` is not supported. `userAgentData` is supported, but may not exactly match Tampermonkey.
* `userLanguage` (v1.5+) is ScriptCat's current interface language, e.g. `"zh-CN"`, `"en-US"`, `"ja-JP"`, so a script can choose its own display language. The value is fixed when the script starts; an `@early-start` script may see an empty string when reading it synchronously, so read it after `CAT_scriptLoaded()`.

### GM_log \*

Logging function. A background script's logs can be viewed in the dashboard's run log (click the run status column). Compared to Tampermonkey, a log `level` has been added.

```typescript
declare function GM_log(message: string, level?: GMTypes.LoggerLevel): void;

declare namespace GMTypes {
  type LoggerLevel = "debug" | "info" | "warn" | "error";
}
```

```js
GM_log("debug info", "debug");
```

### GM_get/set/deleteValue

Gets or sets a value in storage. Data under the same [**storageName**](meta.md#storagename-) can be shared and synced in real time.

```typescript
// Add data — note that data can only be one of bool/string/number/object; you cannot store a class instance
declare function GM_setValue(name: string, value: any): void;
// Get data
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Delete data; getting it again returns undefined or defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Note: When `GM_setValue` is called with `undefined`, ScriptCat deletes that key, unlike Tampermonkey/GreaseMonkey, which stores `undefined` as the value.

#### Note: Because data operations are asynchronous, calling `window.close()` immediately after `GM_setValue` or `GM_deleteValue` may prevent the data from being correctly updated. It's recommended to use `await GM.setValue` or `await GM.deleteValue` to ensure the data operation completes.

### GM_listValues

Lists all keys.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Batch get/set APIs (extension).

```typescript
// Sets multiple values; values is an object whose keys are the value names and whose values are the value contents
declare function GM_setValues(values: { [key: string]: any }): void;
// Gets multiple values; if keysOrDefaults is an object, its values are used as the defaults
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Deletes multiple values; names is an array of strings
declare function GM_deleteValues(names: string[]): void;
```

```js
// Batch set
GM_setValues({ a: 1, b: 2 });
// Batch get (returns the default if not present)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Batch delete
GM_deleteValues(["a", "b"]);
```

#### Note: Because data operations are asynchronous, calling `window.close()` immediately after `GM_setValues` or `GM_deleteValues` may prevent the data from being correctly updated. It's recommended to use `await GM.setValues` or `await GM.deleteValues` to ensure the data operation completes.

### GM_add/removeValueChangeListener

> `tabid` was removed after 0.17.0-alpha — see [GM_cookie](#gm_cookie-) for details.

Listens for changes to a value. `add` returns a listener id, and `remove` can be used to cancel the listener. This method can be used to implement simple communication; using [**storageName**](meta.md#storagename-) enables cross-script communication.

```typescript
// tabid is only present when listening from a background script
type ValueChangeListener = (
  name: string,
  oldValue: any,
  newValue: any,
  remote: boolean,
  tabid?: number
) => any;

declare function GM_addValueChangeListener(
  name: string,
  listener: GMTypes.ValueChangeListener
): number;

declare function GM_removeValueChangeListener(listenerId: number): void;
```

```js
const id = GM_addValueChangeListener("foo", (k, oldV, newV, remote) => {
  console.log(k, oldV, newV, remote);
});
GM_removeValueChangeListener(id);
```

### GM_getResourceText/GM_getResourceURL

Gets resource information declared with `@resource`.

```typescript
// GM_getResourceText gets the resource's text data; byte-type data such as images returns an empty string — use GM_getResourceURL for those instead
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL gets base64-encoded data; a blob URL can also be obtained via the second parameter
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Inserts an element into the page. Can bypass CSP restrictions.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Insert a script
GM_addElement("script", { src: "https://example.com/app.js" });
// Insert a style
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Adds a style to the page and returns the style DOM node. Can bypass CSP restrictions.

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

```js
GM_addStyle(`
  body { background: #f0f0f0; }
  .btn { color: red; }
`);
```

### GM_openInTab \*

Opens a new window.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Determines whether the new tab gets focus when opened.
     *
     * - `true` → the new tab is immediately switched to the foreground.
     * - `false` → the new tab opens in the background, without stealing focus from the current page.
     *
     * Default: true
     */
    active?: boolean;

    /**
     * Determines where the new tab is inserted.
     *
     * - If a `boolean`:
     *   - `true` → inserted right after the current tab.
     *   - `false` → inserted at the end of the window.
     * - If a `number`:
     *   - `0` → inserted one position before the current tab.
     *   - `1` → inserted one position after the current tab.
     *
     * Default: true
     */
    insert?: boolean | number;

    /**
     * Determines whether the parent tab (i.e. `openerTabId`) is set.
     *
     * - `true` → the browser can track which tab opened the child tab,
     *   which helps some extensions (like tab-tree managers) identify parent/child relationships.
     *
     * Default: true
     */
    setParent?: boolean;

    /**
     * Whether to open the tab in a private (incognito) window.
     *
     * Note: ScriptCat's manifest.json sets `"incognito": "split"`,
     * so when running in a normal window, tabId/windowId will not be
     * available, and only the "open a new tab" action can be performed.
     *
     * Default: false
     */
    incognito?: boolean;

    /**
     * Legacy compatibility field, supported only by Tampermonkey.
     * Its meaning is the **opposite** of `active`:
     *
     * - `true` → equivalent to `active = false` (loads in the background).
     * - `false` → equivalent to `active = true` (loads in the foreground).
     *
     * ⚠️ Not recommended: overlaps with `active` and is easy to confuse.
     *
     * Default: false
     * @deprecated Use `active` instead
     */
    loadInBackground?: boolean;

    /**
     * Whether to pin the new tab to the left side of the browser's tab bar.
     *
     * - `true` → the new tab is pinned.
     * - `false` → a regular tab.
     *
     * Default: false
     */
    pinned?: boolean;

    /**
     * Uses `window.open` to open the new tab instead of `chrome.tabs.create`.
     * Useful when opening links with certain special protocols, e.g. `vscode://`, `m3u8dl://`.
     * Other parameters have no effect when using this open method.
     *
     * Related: Issue #178 #1043
     * Default: false
     */
    useOpen?: boolean;
  }

  interface Tab {
    close(): void;
    onclose?: () => void;
    closed?: boolean;
    name?: string;
  }
}
```

```js
const tab = GM_openInTab("https://example.com", { active: false });
tab.onclose = () => console.log("closed");
tab.close();
```

### GM_get/saveTab/GM_getTabs

A method for storing data similar to `GM_setValue`, but this method's lifetime is tied to a single browser tab's open→close cycle, and it cannot be used from a background script.

```typescript
// Get tab data
declare function GM_getTab(callback: (obj: object) => void): void;
// Save tab data
declare function GM_saveTab(obj: object): void;
// Get all tabs' data
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Registers a menu item that appears in the popup page and the right-click menu; clicking it calls the `listener` function.
* By default, matching Tampermonkey, menu items with the same displayed text only show once.
* Specifying an `id` lets you update the menu item.
* If `name` is an empty string and there is no `listener`, a separator line is added to the right-click menu.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat-specific option; defaults to true, and false keeps the popup menu page open after clicking
        nested?: boolean; // ScriptCat-specific option; defaults to true, and false raises the browser's right-click menu item from a third-level to a second-level menu
        individual?: boolean; // ScriptCat-specific option; defaults to false, and true means identical menu items are not merged together
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Removes a registered menu item by its id.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Sends a notification message, providing `progress` and `buttons` capabilities (not supported in Firefox), so a notification can show a progress bar or buttons. Also provides two extra methods, `GM_closeNotification` and `GM_updateNotification` (not supported in Firefox).

[example](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

```typescript
declare function GM_notification(
  details: GMTypes.NotificationDetails,
  ondone?: GMTypes.NotificationOnDone
): void;
declare function GM_notification(
  text: string,
  title: string,
  image: string,
  onclick: GMTypes.NotificationOnClick
): void;
declare function GM_closeNotification(id: string): void;
declare function GM_updateNotification(id: string, details: GMTypes.NotificationDetails): void;

declare namespace GMTypes {
  interface NotificationDetails {
    text?: string;
    title?: string;
    tag?: string;
    image?: string;
    highlight?: boolean;
    silent?: boolean;
    timeout?: number;
    url?: string;
    onclick?: NotificationOnClick;
    ondone?: NotificationOnDone;
    progress?: number;
    oncreate?: NotificationOnClick;
    // At most 2 can exist
    buttons?: NotificationButton[];
  }

  interface NotificationThis extends NotificationDetails {
    id: string;
  }

  type NotificationOnClickEvent = {
    event: "click" | "buttonClick";
    id: string;
    isButtonClick: boolean;
    buttonClickIndex: number | undefined;
    byUser: boolean | undefined;
    preventDefault: () => void;
    highlight: NotificationDetails["highlight"];
    image: NotificationDetails["image"];
    silent: NotificationDetails["silent"];
    tag: NotificationDetails["tag"];
    text: NotificationDetails["tag"];
    timeout: NotificationDetails["timeout"];
    title: NotificationDetails["title"];
    url: NotificationDetails["url"];
  };
  type NotificationOnClick = (this: NotificationThis, event: NotificationOnClickEvent) => unknown;
  type NotificationOnDone = (this: NotificationThis, user?: boolean) => unknown;

  interface NotificationButton {
    title: string;
    iconUrl?: string;
  }

}

```

```js
GM_notification({ title: "Progress", text: "Loading", progress: 50 });
```

#### Note: `GM_closeNotification` and `GM_updateNotification` are ScriptCat-specific. To update a notification, use `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

Sets the clipboard. A callback is not yet supported, unlike Tampermonkey.

```typescript
declare function GM_setClipboard(
  data: string,
  info?: string | { type?: string; mimetype?: string }
): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* A cross-origin HTTP request that can bypass CSP, supporting domains declared with `@connect`. Some functionality is missing; the cookie feature is not currently supported in Firefox. User authorization is required for normal access; a host described by `@connect` can skip user authorization.

* `anonymous` and `cookie` are handled differently from Tampermonkey: when `anonymous` is true and `cookie` is present, only the specified cookie is sent, without any other cookies attached.

* Special headers are also supported:

  - user-agent
  - origin
  - referer
  - cookie
  - host
  - ...

```typescript
declare function GM_xmlhttpRequest(details: GMTypes.XHRDetails): GMTypes.AbortHandle<void>;

declare namespace GMTypes {
  interface XHRResponse {
    finalUrl?: string;
    readyState?: 0 | 1 | 2 | 3 | 4;
    responseHeaders?: string;
    status?: number;
    statusText?: string;
    response?: any;
    responseText?: string;
    responseXML?: Document | null;
  }

  interface XHRProgress extends XHRResponse {
    done: number;
    lengthComputable: boolean;
    loaded: number;
    position: number;
    total: number;
    totalSize: number;
  }

  type Listener<OBJ> = (event: OBJ) => any;

  interface XHRDetails {
    method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
    url: string;
    headers?: { [key: string]: string };
    data?: string | FormData;
    cookie?: string;
    binary?: boolean;
    timeout?: number;
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream is a fairly basic implementation in the current version
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // to stay consistent with Tampermonkey, maxRedirects was deprecated after v0.17.0 in favor of redirect, which forces fetch mode
    
    onload?: Listener<XHRResponse>;
    onloadstart?: Listener<XHRResponse>;
    onloadend?: Listener<XHRResponse>;
    onprogress?: Listener<XHRProgress>;
    onreadystatechange?: Listener<XHRResponse>;
    ontimeout?: () => void;
    onabort?: () => void;
    onerror?: (err: string) => void;
  }
}
```

```js
GM_xmlhttpRequest({
  method: "GET",
  url: "https://api.example.com/data",
  onload: res => console.log(res.responseText)
});
```

### GM_download

* Downloads a file, with headers and other options configurable; compared to Tampermonkey it also supports cookie and anonymous options. If given a blob URL, it opens the download directly and only fires the `onload` event — this differs from Tampermonkey and exists to support background scripts, which can't otherwise create a download (useful for scenarios like generating reports).
* Returns a Promise object and provides an `abort()` method.
* Unlike Tampermonkey, ScriptCat's `native` download mode (the default) honors `@connect`: when the download URL's host is not covered by the script's `@connect` declarations, ScriptCat prompts the user for confirmation before downloading; hosts covered by `@connect` download silently, and blacklisted hosts are always refused. The `browser` download mode is not subject to this check. (In Tampermonkey, `@connect` applies only to `GM_xmlhttpRequest`, not `GM_download`.)

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;

declare namespace GMTypes {
  interface DownloadError {
    error:
      | "not_enabled"
      | "not_whitelisted"
      | "not_permitted"
      | "not_supported"
      | "not_succeeded"
      | "unknown";
    details?: string;
  }

  interface DownloadDetails {
    method?: "GET" | "POST";
    downloadMode?: "native" | "browser";
    url: string;
    name: string;
    headers?: { [key: string]: string };
    saveAs?: boolean;
    timeout?: number;
    cookie?: string;
    anonymous?: boolean;

    onerror?: Listener<DownloadError>;
    ontimeout?: () => void;
    onload?: Listener<object>;
    onprogress?: Listener<XHRProgress>;
  }
}
```

```js
// Callback form
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Asynchronously operates on page cookies, supporting cross-origin, HttpOnly, and partitioned cookies.

> After v0.17.0-alpha, the `store` and `tabid` related parameters were removed; ScriptCat now decides whether to get cookies from the incognito or normal window based on the window it's currently in.

You must declare the operated host with `@connect`, and it requires user authorization to use. While compatible with Tampermonkey's `GM_cookie.list` operation, this isn't recommended, for the sake of consistency.

* `sameSite` is not supported.

```typescript
// name and domain cannot both be empty
declare function GM_cookie(
  action: GMTypes.CookieAction,
  details: GMTypes.CookieDetails,
  ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void
): void;

declare namespace GMTypes {
  type CookieAction = "list" | "delete" | "set";
  interface CookieDetails {
    url?: string;
    name?: string;
    value?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    session?: boolean;
    httpOnly?: boolean;
    expirationDate?: number;
    partitionKey?: CookieDetailsPartitionKeyType;
  }
  interface Cookie {
    domain: string;
    name: string;
    value: string;
    session: boolean;
    hostOnly: boolean;
    expirationDate?: number;
    path: string;
    httpOnly: boolean;
    secure: boolean;
  }
}

// Callback form
GM_cookie("list", { url: "https://example.com" }, (cookies) => {
  console.log(cookies);
  GM_cookie("set", {
    name: "foo",
    value: "bar",
    domain: "example.com"
  }, (result) => {
    console.log(result);
    GM_cookie("delete", { name: "foo", domain: "example.com" }, (result) => {
      console.log(result);
    });
  });
});

// Promise form
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**Note**: You must declare the allowed domain in the metadata using `@connect example.com`.
