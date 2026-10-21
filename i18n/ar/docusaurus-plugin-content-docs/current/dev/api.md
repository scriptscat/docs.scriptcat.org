---
title: وثائق واجهة البرمجة
---

## نظرة عامة

تعريفات واجهات البرمجة لهذه الإضافة مبنية على [وثائق Tampermonkey](https://www.tampermonkey.net/documentation.php). بسبب قيود الوقت والجهد، تم تنفيذ جزء فقط من واجهات البرمجة حتى الآن، وسيستمر التطوير. أي واجهة برمجة توسعها هذه الإضافة أو تختلف عن واجهة GM الأصلية مميزة بشكل خاص في الوثائق (باستخدام `*`). توفر بعض واجهات البرمجة أيضاً نظيراً بأسلوب متزامن باتباع القاعدة `GM.*` — راجع محتوى الوثائق للتفاصيل.

للحصول على تعريفات واجهات البرمجة التفصيلية، راجع `scriptcat.d.ts` أو تلميحات المحرر المدمجة، فقد لا تكون الوثائق محدثة دائماً. لواجهات البرمجة الخاصة بهذه الإضافة، راجع [وثائق CatApi](cat-api.md).

يمكنك أيضاً العثور على أمثلة ذات صلة في [دليل الأمثلة](https://github.com/scriptscat/scriptcat/tree/main/example).

## التعريفات

### GM_info

يحصل على معلومات عن السكرپت، بما في ذلك البيانات الوصفية ومعلمات بيئة التشغيل. تتضمن الحقول الشائعة `scriptHandler` و `version` و `scriptMetaStr` و `scriptUpdateURL` و `downloadMode` والمزيد. راجع `scriptcat.d.ts` للتعريف التفصيلي (وإن لم يكن شاملاً).

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` حالياً له القيمة `raw` فقط. `runAt` غير مدعوم. `userAgentData` مدعوم، لكنه قد لا يطابق Tampermonkey تماماً.
* `userLanguage` (v1.5+) هي لغة واجهة ScriptCat الحالية، مثل `"zh-CN"` و `"en-US"` و `"ja-JP"`، بحيث يمكن للسكرپت اختيار لغة العرض الخاصة به. تُحدَّد القيمة عند بدء تشغيل السكرپت؛ قد يحصل سكرپت `@early-start` على سلسلة فارغة عند قراءتها بشكل متزامن، لذا اقرأها بعد `CAT_scriptLoaded()`.

### GM_log \*

دالة تسجيل. يمكن عرض سجلات سكرپت الخلفية في سجل التشغيل في لوحة التحكم (انقر على عمود حالة التشغيل). مقارنة بـ Tampermonkey، تمت إضافة `level` للسجل.

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

يحصل أو يضبط قيمة في التخزين. يمكن مشاركة البيانات تحت نفس [**storageName**](meta.md#storagename-) ومزامنتها في الوقت الفعلي.

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

#### ملاحظة: عند استدعاء `GM_setValue` بقيمة `undefined`، يحذف ScriptCat هذا المفتاح، على عكس Tampermonkey/GreaseMonkey الذي يخزن `undefined` كقيمة.

#### ملاحظة: نظراً لأن عمليات البيانات غير متزامنة، فإن استدعاء `window.close()` فوراً بعد `GM_setValue` أو `GM_deleteValue` قد يمنع تحديث البيانات بشكل صحيح. يُنصح باستخدام `await GM.setValue` أو `await GM.deleteValue` لضمان اكتمال عملية البيانات.

### GM_listValues

يسرد جميع المفاتيح.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

واجهات برمجة للحصول/الضبط بالجملة (امتداد).

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

#### ملاحظة: نظراً لأن عمليات البيانات غير متزامنة، فإن استدعاء `window.close()` فوراً بعد `GM_setValues` أو `GM_deleteValues` قد يمنع تحديث البيانات بشكل صحيح. يُنصح باستخدام `await GM.setValues` أو `await GM.deleteValues` لضمان اكتمال عملية البيانات.

### GM_add/removeValueChangeListener

> تمت إزالة `tabid` بعد 0.17.0-alpha — راجع [GM_cookie](#gm_cookie-) للتفاصيل.

يستمع لتغييرات قيمة. `add` يعيد معرف مستمع، ويمكن استخدام `remove` لإلغاء المستمع. يمكن استخدام هذه الطريقة لتنفيذ تواصل بسيط؛ باستخدام [**storageName**](meta.md#storagename-) يمكن تحقيق التواصل بين السكرپتات.

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

يحصل على معلومات المورد المصرح بها بـ `@resource`.

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

يدرج عنصراً في الصفحة. يمكنه تجاوز قيود CSP.

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

يضيف نمطاً إلى الصفحة ويعيد عقدة نمط DOM. يمكنه تجاوز قيود CSP.

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

يفتح نافذة جديدة.

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

### GM_closeInTab

إغلاق تبويب فُتح بواسطة `GM_openInTab`.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

طريقة لتخزين البيانات تشبه `GM_setValue`، لكن دورة حياة هذه الطريقة مرتبطة بدورة فتح→إغلاق تبويب متصفح واحد، ولا يمكن استخدامها من سكرپت خلفية.

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

* يسجل عنصر قائمة يظهر في الصفحة المنبثقة وقائمة النقر بزر الماوس الأيمن؛ النقر عليه يستدعي دالة `listener`.
* افتراضياً، مطابقةً لـ Tampermonkey، تظهر عناصر القائمة التي تحمل نفس النص المعروض مرة واحدة فقط.
* تحديد `id` يتيح لك تحديث عنصر القائمة.
* إذا كانت `name` سلسلة فارغة ولا يوجد `listener`، تتم إضافة خط فاصل إلى قائمة النقر بزر الماوس الأيمن.

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

يزيل عنصر قائمة مسجلاً حسب معرفه.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

يرسل رسالة إشعار، ويوفر إمكانيات `progress` و `buttons` (غير مدعومة في Firefox)، بحيث يمكن للإشعار عرض شريط تقدم أو أزرار. يوفر أيضاً طريقتين إضافيتين، `GM_closeNotification` و `GM_updateNotification` (غير مدعومتين في Firefox).

[مثال](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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

#### ملاحظة: `GM_closeNotification` و `GM_updateNotification` خاصتان بـ ScriptCat. لتحديث إشعار، استخدم `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

يضبط الحافظة. لا يُدعم الاستدعاء الرجعي بعد، على عكس Tampermonkey.

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

* طلب HTTP عبر النطاقات يمكنه تجاوز CSP، ويدعم النطاقات المصرح بها بـ `@connect`. بعض الوظائف مفقودة؛ ميزة الكوكيز غير مدعومة حالياً في Firefox. إذن المستخدم مطلوب للوصول العادي؛ المضيف الموصوف بواسطة `@connect` يمكنه تخطي إذن المستخدم.

* يتم التعامل مع `anonymous` و `cookie` بشكل مختلف عن Tampermonkey: عندما يكون `anonymous` صحيحاً وتوجد `cookie`، يتم إرسال الكوكي المحددة فقط، دون إرفاق أي كوكيز أخرى.

* كما تدعم الترويسات الخاصة:

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

* ينزّل ملفاً، مع إمكانية تكوين الترويسات وخيارات أخرى؛ مقارنة بـ Tampermonkey يدعم أيضاً خياري cookie و anonymous. إذا أُعطي عنوان URL لـ blob، فإنه يفتح التنزيل مباشرة ولا يطلق سوى حدث `onload` — وهذا يختلف عن Tampermonkey ويوجد لدعم سكرپتات الخلفية، التي لا يمكنها بخلاف ذلك إنشاء تنزيل (مفيد لسيناريوهات مثل إنشاء التقارير).
* يعيد كائن Promise ويوفر طريقة `abort()`.
* على عكس Tampermonkey، فإن وضع تنزيل `native` في ScriptCat (الافتراضي) يحترم `@connect`: عندما لا يكون مضيف عنوان التنزيل مغطى بتصريحات `@connect` الخاصة بالسكرپت، يطلب ScriptCat من المستخدم التأكيد قبل التنزيل؛ المضيفات المغطاة بـ `@connect` تُنزَّل بصمت، والمضيفات في القائمة السوداء تُرفض دائماً. وضع التنزيل `browser` لا يخضع لهذا الفحص. (في Tampermonkey، ينطبق `@connect` فقط على `GM_xmlhttpRequest`، وليس `GM_download`.)

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

يعمل بشكل غير متزامن على كوكيز الصفحة، ويدعم عبر النطاقات و HttpOnly و partitioned cookies.

> بعد v0.17.0-alpha، تمت إزالة المعلمات المتعلقة بـ `store` و `tabid`؛ يقرر ScriptCat الآن ما إذا كان سيحصل على الكوكيز من نافذة التصفح الخاص أو النافذة العادية بناءً على النافذة الموجودة فيها حالياً.

يجب عليك التصريح عن المضيف المشغَّل بـ `@connect`، ويتطلب إذن المستخدم للاستخدام. مع كونه متوافقاً مع عملية `GM_cookie.list` الخاصة بـ Tampermonkey، إلا أنه غير موصى به، من أجل الاتساق.

* `sameSite` غير مدعوم.

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

**ملاحظة**: يجب عليك التصريح عن النطاق المسموح في البيانات الوصفية باستخدام `@connect example.com`.
