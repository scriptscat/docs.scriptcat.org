---
title: مستندات API
---

## نمای کلی

تعاریف API این افزونه بر اساس [مستندات تامپرمانکی](https://www.tampermonkey.net/documentation.php) است. به دلیل محدودیت‌های زمان و تلاش، تاکنون فقط بخشی از API پیاده‌سازی شده است و به تکرار ادامه خواهد داد. هر API که این افزونه گسترش می‌دهد یا با API اصلی GM تفاوت دارد به طور ویژه در مستندات علامت‌گذاری شده است (با استفاده از `*`). برخی APIها همچنین همتای سبک همزمان را ارائه می‌دهند که از قاعده `GM.*` پیروی می‌کند — برای جزئیات به محتوای مستندات مراجعه کنید.

برای تعاریف دقیق API، به `scriptcat.d.ts` یا نکات داخلی ویرایشگر مراجعه کنید، زیرا مستندات ممکن است همیشه به‌روز نباشند. برای APIهای مخصوص این افزونه، به [مستندات CatApi](cat-api.md) مراجعه کنید.

همچنین می‌توانید مثال‌های مرتبط را در [دایرکتوری مثال](https://github.com/scriptscat/scriptcat/tree/main/example) بیابید.

## تعاریف

### GM_info

اطلاعات مربوط به اسکریپت را دریافت می‌کند، از جمله فراداده و پارامترهای محیط اجرا. فیلدهای پرکاربرد شامل `scriptHandler`، `version`، `scriptMetaStr`، `scriptUpdateURL`، `downloadMode` و موارد دیگر است. برای تعریف دقیق (هرچند نه جامع) به `scriptcat.d.ts` مراجعه کنید.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` در حال حاضر فقط مقدار `raw` را دارد. `runAt` پشتیبانی نمی‌شود. `userAgentData` پشتیبانی می‌شود، اما ممکن است دقیقاً با تامپرمانکی مطابقت نداشته باشد.
* `userLanguage` (v1.5+) زبان فعلی رابط کاربری ScriptCat است، مانند `"zh-CN"`، `"en-US"`، `"ja-JP"`، تا اسکریپت بتواند زبان نمایش خود را بر اساس آن انتخاب کند. این مقدار هنگام شروع اسکریپت تعیین می‌شود؛ اسکریپت `@early-start` ممکن است هنگام خواندن همگام رشتهٔ خالی دریافت کند، پس آن را پس از `CAT_scriptLoaded()` بخوانید.

### GM_log \*

تابع ثبت لاگ. لاگ‌های یک اسکریپت پس‌زمینه را می‌توان در لاگ اجرای داشبورد مشاهده کرد (روی ستون وضعیت اجرا کلیک کنید). در مقایسه با تامپرمانکی، یک `level` لاگ اضافه شده است.

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

مقداری را در ذخیره‌سازی دریافت یا تنظیم می‌کند. داده‌های تحت همان [**storageName**](meta.md#storagename-) می‌توانند در زمان واقعی به اشتراک گذاشته و همگام‌سازی شوند.

```typescript
// افزودن داده — توجه کنید که داده فقط می‌تواند یکی از bool/string/number/object باشد؛ نمی‌توانید یک نمونه کلاس ذخیره کنید
declare function GM_setValue(name: string, value: any): void;
// دریافت داده
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// حذف داده؛ دریافت دوباره آن undefined یا defaultValue برمی‌گرداند
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### توجه: وقتی `GM_setValue` با `undefined` فراخوانی می‌شود، ScriptCat آن کلید را حذف می‌کند، برخلاف تامپرمانکی/GreaseMonkey که `undefined` را به عنوان مقدار ذخیره می‌کنند.

#### توجه: چون عملیات داده ناهمگام است، فراخوانی `window.close()` بلافاصله پس از `GM_setValue` یا `GM_deleteValue` ممکن است از به‌روزرسانی صحیح داده جلوگیری کند. توصیه می‌شود از `await GM.setValue` یا `await GM.deleteValue` استفاده کنید تا مطمئن شوید عملیات داده کامل می‌شود.

### GM_listValues

همه کلیدها را فهرست می‌کند.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

APIهای دریافت/تنظیم دسته‌ای (افزونه).

```typescript
// چند مقدار را تنظیم می‌کند؛ values یک شیء است که کلیدهای آن نام مقادیر و مقادیر آن محتوای مقادیر هستند
declare function GM_setValues(values: { [key: string]: any }): void;
// چند مقدار را دریافت می‌کند؛ اگر keysOrDefaults یک شیء باشد، مقادیر آن به عنوان پیش‌فرض استفاده می‌شوند
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// چند مقدار را حذف می‌کند؛ names یک آرایه از رشته‌ها است
declare function GM_deleteValues(names: string[]): void;
```

```js
// تنظیم دسته‌ای
GM_setValues({ a: 1, b: 2 });
// دریافت دسته‌ای (اگر موجود نباشد پیش‌فرض را برمی‌گرداند)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// حذف دسته‌ای
GM_deleteValues(["a", "b"]);
```

#### توجه: چون عملیات داده ناهمگام است، فراخوانی `window.close()` بلافاصله پس از `GM_setValues` یا `GM_deleteValues` ممکن است از به‌روزرسانی صحیح داده جلوگیری کند. توصیه می‌شود از `await GM.setValues` یا `await GM.deleteValues` استفاده کنید تا مطمئن شوید عملیات داده کامل می‌شود.

### GM_add/removeValueChangeListener

> `tabid` پس از 0.17.0-alpha حذف شد — برای جزئیات به [GM_cookie](#gm_cookie-) مراجعه کنید.

به تغییرات یک مقدار گوش می‌دهد. `add` یک شناسه شنونده برمی‌گرداند و `remove` می‌تواند برای لغو شنونده استفاده شود. این روش می‌تواند برای پیاده‌سازی ارتباط ساده استفاده شود؛ استفاده از [**storageName**](meta.md#storagename-) ارتباط بین اسکریپت‌ها را ممکن می‌سازد.

```typescript
// tabid فقط زمانی وجود دارد که از یک اسکریپت پس‌زمینه گوش می‌دهید
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

اطلاعات منبع اعلام‌شده با `@resource` را دریافت می‌کند.

```typescript
// GM_getResourceText داده متنی منبع را دریافت می‌کند؛ داده‌های نوع بایت مانند تصاویر یک رشته خالی برمی‌گردانند — برای آن‌ها از GM_getResourceURL استفاده کنید
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL داده کدگذاری‌شده base64 را دریافت می‌کند؛ یک URL blob نیز می‌تواند از طریق پارامتر دوم به دست آید
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

یک عنصر را در صفحه وارد می‌کند. می‌تواند محدودیت‌های CSP را دور بزند.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// درج یک اسکریپت
GM_addElement("script", { src: "https://example.com/app.js" });
// درج یک استایل
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

یک استایل به صفحه اضافه می‌کند و گره DOM استایل را برمی‌گرداند. می‌تواند محدودیت‌های CSP را دور بزند.

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

یک پنجره جدید باز می‌کند.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * تعیین می‌کند آیا تب جدید هنگام باز شدن فوکوس می‌گیرد.
     *
     * - `true` → تب جدید بلافاصله به پیش‌زمینه منتقل می‌شود.
     * - `false` → تب جدید در پس‌زمینه باز می‌شود، بدون گرفتن فوکوس از صفحه فعلی.
     *
     * پیش‌فرض: true
     */
    active?: boolean;

    /**
     * تعیین می‌کند تب جدید کجا درج شود.
     *
     * - اگر یک `boolean` باشد:
     *   - `true` → بلافاصله پس از تب فعلی درج می‌شود.
     *   - `false` → در انتهای پنجره درج می‌شود.
     * - اگر یک `number` باشد:
     *   - `0` → یک موقعیت قبل از تب فعلی درج می‌شود.
     *   - `1` → یک موقعیت بعد از تب فعلی درج می‌شود.
     *
     * پیش‌فرض: true
     */
    insert?: boolean | number;

    /**
     * تعیین می‌کند آیا تب والد (یعنی `openerTabId`) تنظیم می‌شود.
     *
     * - `true` → مرورگر می‌تواند پیگیری کند کدام تب تب فرزند را باز کرده است،
     *   که به برخی افزونه‌ها (مانند مدیرهای درخت تب) کمک می‌کند روابط والد/فرزند را شناسایی کنند.
     *
     * پیش‌فرض: true
     */
    setParent?: boolean;

    /**
     * آیا تب در یک پنجره خصوصی (ناشناس) باز شود.
     *
     * توجه: manifest.json اسکریپت‌کت `"incognito": "split"` را تنظیم می‌کند،
     * بنابراین هنگام اجرا در یک پنجره عادی، tabId/windowId
     * در دسترس نخواهند بود و فقط عمل «باز کردن تب جدید» قابل انجام است.
     *
     * پیش‌فرض: false
     */
    incognito?: boolean;

    /**
     * فیلد سازگاری قدیمی، فقط توسط تامپرمانکی پشتیبانی می‌شود.
     * معنی آن **مخالف** `active` است:
     *
     * - `true` → معادل `active = false` (در پس‌زمینه بارگذاری می‌شود).
     * - `false` → معادل `active = true` (در پیش‌زمینه بارگذاری می‌شود).
     *
     * ⚠️ توصیه نمی‌شود: با `active` همپوشانی دارد و به راحتی گیج‌کننده است.
     *
     * پیش‌فرض: false
     * @deprecated به جای آن از `active` استفاده کنید
     */
    loadInBackground?: boolean;

    /**
     * آیا تب جدید به سمت چپ نوار تب مرورگر سنجاق شود.
     *
     * - `true` → تب جدید سنجاق می‌شود.
     * - `false` → یک تب معمولی.
     *
     * پیش‌فرض: false
     */
    pinned?: boolean;

    /**
     * برای باز کردن تب جدید به جای `chrome.tabs.create` از `window.open` استفاده می‌کند.
     * هنگام باز کردن پیوندها با برخی پروتکل‌های خاص مفید است، مثلاً `vscode://`، `m3u8dl://`.
     * سایر پارامترها هنگام استفاده از این روش باز کردن اثری ندارند.
     *
     * مرتبط: Issue #178 #1043
     * پیش‌فرض: false
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

تبی را که توسط `GM_openInTab` باز شده است می‌بندد.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

روشی برای ذخیره‌سازی داده مشابه `GM_setValue`، اما طول عمر این روش به چرخه باز→بسته شدن یک تب مرورگر گره خورده است و نمی‌توان از یک اسکریپت پس‌زمینه استفاده کرد.

```typescript
// دریافت داده تب
declare function GM_getTab(callback: (obj: object) => void): void;
// ذخیره داده تب
declare function GM_saveTab(obj: object): void;
// دریافت داده همه تب‌ها
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* یک آیتم منو ثبت می‌کند که در صفحه popup و منوی کلیک راست ظاهر می‌شود؛ کلیک روی آن تابع `listener` را فراخوانی می‌کند.
* به طور پیش‌فرض، مطابق تامپرمانکی، آیتم‌های منو با همان متن نمایشی فقط یک بار نشان داده می‌شوند.
* مشخص‌کردن یک `id` به شما امکان می‌دهد آیتم منو را به‌روزرسانی کنید.
* اگر `name` یک رشته خالی باشد و `listener` وجود نداشته باشد، یک خط جداکننده به منوی کلیک راست اضافه می‌شود.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // گزینه مخصوص ScriptCat؛ پیش‌فرض true، و false صفحه منوی popup را پس از کلیک باز نگه می‌دارد
        nested?: boolean; // گزینه مخصوص ScriptCat؛ پیش‌فرض true، و false آیتم منوی کلیک راست مرورگر را از منوی سطح سوم به سطح دوم ارتقا می‌دهد
        individual?: boolean; // گزینه مخصوص ScriptCat؛ پیش‌فرض false، و true به این معنی است که آیتم‌های منوی یکسان با هم ادغام نمی‌شوند
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

یک آیتم منوی ثبت‌شده را با id آن حذف می‌کند.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

یک پیام اعلان ارسال می‌کند و قابلیت‌های `progress` و `buttons` را فراهم می‌کند (در فایرفاکس پشتیبانی نمی‌شود)، بنابراین یک اعلان می‌تواند نوار پیشرفت یا دکمه‌ها را نشان دهد. همچنین دو روش اضافی ارائه می‌دهد، `GM_closeNotification` و `GM_updateNotification` (در فایرفاکس پشتیبانی نمی‌شود).

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
    // حداکثر ۲ می‌توانند وجود داشته باشند
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

#### توجه: `GM_closeNotification` و `GM_updateNotification` مخصوص ScriptCat هستند. برای به‌روزرسانی یک اعلان از `tag` استفاده کنید.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // پیشرفت را به‌روزرسانی می‌کند
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // پس از 1ms بسته می‌شود
```

### GM_setClipboard \*

کلیپ‌بورد را تنظیم می‌کند. یک بازخوانی هنوز پشتیبانی نمی‌شود، برخلاف تامپرمانکی.

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

* یک درخواست HTTP بین‌مبدئی که می‌تواند CSP را دور بزند و از دامنه‌های اعلام‌شده با `@connect` پشتیبانی می‌کند. برخی عملکردها وجود ندارد؛ ویژگی کوکی در حال حاضر در فایرفاکس پشتیبانی نمی‌شود. برای دسترسی عادی مجوز کاربر لازم است؛ میزبانی که توسط `@connect` توصیف می‌شود می‌تواند مجوز کاربر را رد کند.

* `anonymous` و `cookie` متفاوت از تامپرمانکی مدیریت می‌شوند: وقتی `anonymous` درست باشد و `cookie` وجود داشته باشد، فقط کوکی مشخص‌شده ارسال می‌شود، بدون هیچ کوکی دیگری.

* هدرهای خاص نیز پشتیبانی می‌شوند:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream یک پیاده‌سازی نسبتاً ساده در نسخه فعلی است
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // برای سازگاری با تامپرمانکی، maxRedirects پس از v0.17.0 به نفع redirect منسوخ شد که حالت fetch را اجباری می‌کند
    
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

* یک فایل را دانلود می‌کند، با هدرها و گزینه‌های دیگر قابل پیکربندی؛ در مقایسه با تامپرمانکی از گزینه‌های cookie و anonymous نیز پشتیبانی می‌کند. اگر یک URL blob داده شود، دانلود را مستقیماً باز می‌کند و فقط رویداد `onload` را فعال می‌کند — این با تامپرمانکی متفاوت است و برای پشتیبانی از اسکریپت‌های پس‌زمینه وجود دارد که در غیر این صورت نمی‌توانند دانلود ایجاد کنند (مفید برای سناریوهایی مانند تولید گزارش).
* یک شیء Promise برمی‌گرداند و یک روش `abort()` ارائه می‌دهد.
* برخلاف تامپرمانکی، حالت دانلود `native` اسکریپت‌کت (پیش‌فرض) `@connect` را رعایت می‌کند: وقتی میزبان URL دانلود تحت پوشش اعلام‌های `@connect` اسکریپت نیست، ScriptCat قبل از دانلود از کاربر تأیید می‌خواهد؛ میزبان‌های تحت پوشش `@connect` بی‌صدا دانلود می‌شوند و میزبان‌های لیست سیاه همیشه رد می‌شوند. حالت دانلود `browser` مشمول این بررسی نیست. (در تامپرمانکی، `@connect` فقط برای `GM_xmlhttpRequest` اعمال می‌شود، نه `GM_download`.)

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
// فرم بازخوانی
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

به صورت ناهمگام روی کوکی‌های صفحه عمل می‌کند و از کوکی‌های بین‌مبدئی، HttpOnly و پارتیشن‌بندی‌شده پشتیبانی می‌کند.

> پس از v0.17.0-alpha، پارامترهای مرتبط `store` و `tabid` حذف شدند؛ ScriptCat اکنون بر اساس پنجره‌ای که در آن است تصمیم می‌گیرد آیا کوکی‌ها را از پنجره ناشناس یا عادی دریافت کند.

شما باید میزبان مورد عمل را با `@connect` اعلام کنید و برای استفاده از آن مجوز کاربر لازم است. در حالی که با عملیات `GM_cookie.list` تامپرمانکی سازگار است، این توصیه نمی‌شود، به خاطر سازگاری.

* `sameSite` پشتیبانی نمی‌شود.

```typescript
// name و domain نمی‌توانند هر دو خالی باشند
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

// فرم بازخوانی
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

// فرم Promise
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**توجه**: شما باید دامنه مجاز را در فراداده با `@connect example.com` اعلام کنید.
