---
title: API 文件
---

## 概覽

此擴充功能的 API 定義基於 [Tampermonkey 文件](https://www.tampermonkey.net/documentation.php)。由於時間和精力限制，目前僅實現了部分 API，並且會持續迭代。此擴充功能擴展或與原始 GM API 不同的 API 在文件中特別標註（使用 `*`）。部分 API 也提供遵循 `GM.*` 規則的同步式對應方法。

詳細 API 定義請參閱 `scriptcat.d.ts` 或編輯器內建提示。此擴充功能特有的 API 請參閱 [CatApi 文件](cat-api.md)。

相關範例可在 [example 目錄](https://github.com/scriptscat/scriptcat/tree/main/example) 找到。

## 定義

### GM_info

取得腳本資訊，包括元資料和執行環境參數。

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` 目前僅有 `raw` 值。`runAt` 不受支援。
* `userLanguage`（v1.5+）為腳本貓目前的介面語言，如 `"zh-CN"`、`"en-US"`、`"ja-JP"`，腳本可據此決定自身的顯示語言。該值在腳本啟動時確定；`@early-start` 腳本同步讀取時可能為空字串，請在 `CAT_scriptLoaded()` 之後讀取。

### GM_log \*

日誌函數。背景腳本的日誌可在控制面板的執行日誌中查看。

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

從儲存中取得或設定值。相同 [**storageName**](meta.md#storagename-) 下的資料可共享並即時同步。

```typescript
declare function GM_setValue(name: string, value: any): void;
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### 注意：當 `GM_setValue` 使用 `undefined` 呼叫時，ScriptCat 會刪除該鍵，與 Tampermonkey/GreaseMonkey 將 `undefined` 作為值儲存不同。

#### 注意：由於資料操作是非同步的，在 `GM_setValue` 或 `GM_deleteValue` 後立即呼叫 `window.close()` 可能會阻止資料正確更新。建議使用 `await GM.setValue` 或 `await GM.deleteValue`。

### GM_listValues

列出所有鍵。

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

批次取得/設定 API（擴展）。

```typescript
declare function GM_setValues(values: { [key: string]: any }): void;
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
declare function GM_deleteValues(names: string[]): void;
```

```js
GM_setValues({ a: 1, b: 2 });
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
GM_deleteValues(["a", "b"]);
```

### GM_add/removeValueChangeListener

> `tabid` 在 0.17.0-alpha 後已被移除。

監聽值的變更。`add` 返回監聽器 ID，`remove` 用於取消。此方法可用於簡單通訊；使用 [**storageName**](meta.md#storagename-) 可實現跨腳本通訊。

```typescript
type ValueChangeListener = (name: string, oldValue: any, newValue: any, remote: boolean, tabid?: number) => any;
declare function GM_addValueChangeListener(name: string, listener: GMTypes.ValueChangeListener): number;
declare function GM_removeValueChangeListener(listenerId: number): void;
```

```js
const id = GM_addValueChangeListener("foo", (k, oldV, newV, remote) => {
  console.log(k, oldV, newV, remote);
});
GM_removeValueChangeListener(id);
```

### GM_getResourceText/GM_getResourceURL

取得使用 `@resource` 宣告的資源資訊。

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

在頁面中插入元素。可繞過 CSP 限制。

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

向頁面添加樣式並返回樣式 DOM 節點。可繞過 CSP 限制。

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

### GM_openInTab \*

開啟新視窗。

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    active?: boolean;
    insert?: boolean | number;
    setParent?: boolean;
    incognito?: boolean;
    loadInBackground?: boolean;
    pinned?: boolean;
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

類似 `GM_setValue` 的資料儲存方法，但此方法的生命週期與單一瀏覽器分頁的開啟→關閉週期綁定，無法從背景腳本使用。

```typescript
declare function GM_getTab(callback: (obj: object) => void): void;
declare function GM_saveTab(obj: object): void;
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* 註冊出現在彈出頁面和右鍵選單中的選單項目；點擊時呼叫 `listener` 函數。
* 預設情況下，顯示文字相同的選單項目僅顯示一次。
* 指定 `id` 可更新選單項目。

```typescript
function GM_registerMenuCommand(name: string, listener?: (inputValue?: any) => void, options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string): number;
```

### GM_unregisterMenuCommand

按 ID 移除已註冊的選單項目。

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

### GM_notification \*

發送通知訊息，提供 `progress` 和 `buttons` 功能。也提供 `GM_closeNotification` 和 `GM_updateNotification`。

[example](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

```typescript
declare function GM_notification(details: GMTypes.NotificationDetails, ondone?: GMTypes.NotificationOnDone): void;
declare function GM_notification(text: string, title: string, image: string, onclick: GMTypes.NotificationOnClick): void;
declare function GM_closeNotification(id: string): void;
declare function GM_updateNotification(id: string, details: GMTypes.NotificationDetails): void;
```

```js
GM_notification({ title: "Progress", text: "Loading", progress: 50 });
```

#### 注意：`GM_closeNotification` 和 `GM_updateNotification` 是 ScriptCat 特有的。使用 `tag` 來更新。

### GM_setClipboard \*

設定剪貼簿。尚未支援回呼。

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* 跨來源 HTTP 請求，可繞過 CSP。需要使用者授權；由 `@connect` 描述的主機可跳過授權。

```typescript
declare function GM_xmlhttpRequest(details: GMTypes.XHRDetails): GMTypes.AbortHandle<void>;
```

```js
GM_xmlhttpRequest({
  method: "GET",
  url: "https://api.example.com/data",
  onload: res => console.log(res.responseText)
});
```

### GM_download

* 下載檔案。返回 Promise 物件並提供 `abort()` 方法。

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

非同步操作頁面 cookie，支援跨來源、HttpOnly 和分区 cookie。

> 在 v0.17.0-alpha 之後，與 `store` 和 `tabid` 相關的參數已被移除。

操作的主機必須使用 `@connect` 宣告，且需要使用者授權。

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**注意**：您必須在元資料中使用 `@connect example.com` 宣告允許的網域。
