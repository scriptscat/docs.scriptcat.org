---
title: Документация API
---

## Обзор

Определения API этого расширения основаны на [документации Tampermonkey](https://www.tampermonkey.net/documentation.php). Из‑за ограничений по времени и ресурсам пока реализована только часть API, и она продолжит развиваться. Любой API, который это расширение расширяет или который отличается от исходного GM API, специально отмечен в документации (символом `*`). Для некоторых API также предоставляется синхронный/promise-вариант по правилу `GM.*` — подробности см. в содержании документации.

Подробные определения API смотрите в `scriptcat.d.ts` или во встроенных подсказках редактора — документация может быть не всегда актуальной. API, специфичные для этого расширения, описаны в [документации CatApi](cat-api.md).

Связанные примеры также можно найти в [каталоге example](https://github.com/scriptscat/scriptcat/tree/main/example).

## Определения

### GM_info

Получает информацию о скрипте, включая метаданные и параметры среды выполнения. Часто используемые поля: `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` и другие. Подробное (хотя и не исчерпывающее) определение см. в `scriptcat.d.ts`.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` сейчас имеет только значение `raw`. `runAt` не поддерживается. `userAgentData` поддерживается, но может не полностью совпадать с Tampermonkey.
* `userLanguage` (v1.5+) — текущий язык интерфейса ScriptCat, например `"zh-CN"`, `"en-US"`, `"ja-JP"`; по нему скрипт может выбрать собственный язык отображения. Значение определяется при запуске скрипта; скрипт с `@early-start` при синхронном чтении может получить пустую строку, поэтому читайте его после `CAT_scriptLoaded()`.

### GM_log \*

Функция логирования. Журналы фонового скрипта можно просмотреть в журнале запусков панели управления (щелчок по столбцу статуса выполнения). По сравнению с Tampermonkey добавлен уровень лога `level`.

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

Получает или задаёт значение в хранилище. Данные с одним и тем же [**storageName**](meta.md#storagename-) могут совместно использоваться и синхронизироваться в реальном времени.

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

#### Примечание: при вызове `GM_setValue` с `undefined` ScriptCat удаляет этот ключ, в отличие от Tampermonkey/GreaseMonkey, которые сохраняют `undefined` как значение.

#### Примечание: поскольку операции с данными асинхронны, вызов `window.close()` сразу после `GM_setValue` или `GM_deleteValue` может помешать корректному обновлению данных. Рекомендуется использовать `await GM.setValue` или `await GM.deleteValue`, чтобы дождаться завершения операции.

### GM_listValues

Возвращает список всех ключей.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Пакетные API get/set (расширение).

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

#### Примечание: поскольку операции с данными асинхронны, вызов `window.close()` сразу после `GM_setValues` или `GM_deleteValues` может помешать корректному обновлению данных. Рекомендуется использовать `await GM.setValues` или `await GM.deleteValues`, чтобы дождаться завершения операции.

### GM_add/removeValueChangeListener

> `tabid` удалён после 0.17.0-alpha — подробности см. в [GM_cookie](#gm_cookie-).

Слушает изменения значения. `add` возвращает id слушателя, `remove` отменяет его. Этот метод можно использовать для простой коммуникации; с помощью [**storageName**](meta.md#storagename-) возможна межскриптовая коммуникация.

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

Получает информацию о ресурсе, объявленном через `@resource`.

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

Вставляет элемент на страницу. Может обходить ограничения CSP.

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

Добавляет стиль на страницу и возвращает DOM-узел стиля. Может обходить ограничения CSP.

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

Открывает новое окно.

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

Метод хранения данных, похожий на `GM_setValue`, но время жизни данных привязано к циклу открытия→закрытия одной вкладки браузера, и его нельзя использовать из фонового скрипта.

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

* Регистрирует пункт меню, отображаемый на popup-странице и в контекстном меню; при нажатии вызывается функция `listener`.
* По умолчанию, как в Tampermonkey, пункты меню с одинаковым отображаемым текстом показываются только один раз.
* Указание `id` позволяет обновлять пункт меню.
* Если `name` — пустая строка и нет `listener`, в контекстное меню добавляется разделитель.

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

Удаляет зарегистрированный пункт меню по его id.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Отправляет уведомление, предоставляя возможности `progress` и `buttons` (не поддерживается в Firefox), поэтому уведомление может показывать прогресс-бар или кнопки. Также есть два дополнительных метода: `GM_closeNotification` и `GM_updateNotification` (не поддерживаются в Firefox).

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

#### Примечание: `GM_closeNotification` и `GM_updateNotification` специфичны для ScriptCat. Для обновления уведомления используйте `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

Записывает данные в буфер обмена. Обратный вызов пока не поддерживается, в отличие от Tampermonkey.

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

* Кросс-доменный HTTP-запрос, который может обходить CSP, с поддержкой доменов, объявленных через `@connect`. Часть функциональности отсутствует; функция cookie сейчас не поддерживается в Firefox. Для доступа к хосту обычно требуется разрешение пользователя; если хост объявлен через `@connect`, отдельное подтверждение пользователя не запрашивается.

* `anonymous` и `cookie` обрабатываются иначе, чем в Tampermonkey: когда `anonymous` равно true и задан `cookie`, отправляется только указанный cookie, без других cookie.

* Также поддерживаются специальные заголовки:

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

* Скачивает файл с настраиваемыми заголовками и другими опциями; по сравнению с Tampermonkey также поддерживает опции cookie и anonymous. При blob URL открывает загрузку напрямую и срабатывает только событие `onload` — это отличается от Tampermonkey и нужно для поддержки фоновых скриптов, которые иначе не могут создать загрузку (полезно, например, для генерации отчётов).
* Возвращает объект Promise и предоставляет метод `abort()`.
* В отличие от Tampermonkey, режим загрузки `native` в ScriptCat (по умолчанию) учитывает `@connect`: если хост URL загрузки не покрыт объявлениями `@connect` скрипта, ScriptCat запрашивает подтверждение пользователя; хосты из `@connect` скачиваются без запроса, а занесённые в чёрный список всегда отклоняются. Режим загрузки `browser` этой проверке не подчиняется. (В Tampermonkey `@connect` применяется только к `GM_xmlhttpRequest`, не к `GM_download`.)

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

Асинхронно работает с cookie страницы, поддерживая кросс-доменные, HttpOnly и partitioned cookies.

> После v0.17.0-alpha параметры, связанные с `store` и `tabid`, были удалены; ScriptCat теперь решает, брать cookies из окна инкогнито или обычного, исходя из текущего окна.

Нужно объявить оперируемый хост через `@connect`; это объявление разрешает расширению доступ к хосту, поэтому отдельное подтверждение пользователя не запрашивается. Хотя операция `GM_cookie.list` совместима с Tampermonkey, это не рекомендуется ради согласованности.

* `sameSite` не поддерживается.

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

**Примечание**: нужно объявить разрешённый домен в метаданных с помощью `@connect example.com`.
