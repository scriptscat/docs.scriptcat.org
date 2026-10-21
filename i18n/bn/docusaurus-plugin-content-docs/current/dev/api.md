---
title: API ডকুমেন্টেশন
---

## ওভারভিউ

এই এক্সটেনশনের API সংজ্ঞাগুলো [Tampermonkey ডকুমেন্টেশন](https://www.tampermonkey.net/documentation.php)-এর উপর ভিত্তি করে তৈরি। সময় ও পরিশ্রমের সীমাবদ্ধতার কারণে, এখন পর্যন্ত API-এর শুধুমাত্র একটি অংশ বাস্তবায়িত হয়েছে, এবং এটি ক্রমাগত বিকশিত হতে থাকবে। এই এক্সটেনশন যে কোনো API বাড়িয়েছে বা মূল GM API থেকে ভিন্ন, তা ডকুমেন্টেশনে বিশেষভাবে চিহ্নিত (একটি `*` ব্যবহার করে)। কিছু API `GM.*` নিয়ম অনুসরণ করে একটি সিঙ্ক্রোনাস-স্টাইল প্রতিরূপও প্রদান করে — বিস্তারিত জানতে ডকুমেন্টেশনের বিষয়বস্তু দেখুন।

বিস্তারিত API সংজ্ঞার জন্য `scriptcat.d.ts` বা বিল্ট-ইন এডিটর হিন্ট দেখুন, কারণ ডকুমেন্টেশন সবসময় হালনাগাদ নাও থাকতে পারে। এই এক্সটেনশনের জন্য নির্দিষ্ট API-গুলোর জন্য, [CatApi ডকুমেন্টেশন](cat-api.md) দেখুন।

আপনি [উদাহরণ ডিরেক্টরিতে](https://github.com/scriptscat/scriptcat/tree/main/example) সম্পর্কিত উদাহরণও খুঁজে পেতে পারেন।

## সংজ্ঞা

### GM_info

স্ক্রিপ্ট সম্পর্কে তথ্য পায়, মেটাডেটা এবং রানটাইম পরিবেশের প্যারামিটারসহ। সাধারণত ব্যবহৃত ফিল্ডগুলোর মধ্যে রয়েছে `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` এবং আরও অনেক কিছু। বিস্তারিত (যদিও সম্পূর্ণ নয়) সংজ্ঞার জন্য `scriptcat.d.ts` দেখুন।

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` বর্তমানে শুধুমাত্র `raw` মান আছে। `runAt` সমর্থিত নয়। `userAgentData` সমর্থিত, তবে Tampermonkey-এর সাথে হুবহু মিল নাও হতে পারে।
* `userLanguage` (v1.5+) হলো ScriptCat-এর বর্তমান ইন্টারফেস ভাষা, যেমন `"zh-CN"`, `"en-US"`, `"ja-JP"`, যাতে স্ক্রিপ্ট নিজের প্রদর্শনের ভাষা বেছে নিতে পারে। স্ক্রিপ্ট শুরু হওয়ার সময় মানটি নির্ধারিত হয়; `@early-start` স্ক্রিপ্ট সিঙ্ক্রোনাসভাবে পড়লে খালি স্ট্রিং পেতে পারে, তাই `CAT_scriptLoaded()`-এর পরে পড়ুন।

### GM_log \*

লগিং ফাংশন। একটি ব্যাকগ্রাউন্ড স্ক্রিপ্টের লগ ড্যাশবোর্ডের রান লগে দেখা যায় (রান স্ট্যাটাস কলামে ক্লিক করুন)। Tampermonkey-এর তুলনায়, একটি লগ `level` যোগ করা হয়েছে।

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

স্টোরেজে একটি মান পায় বা সেট করে। একই [**storageName**](meta.md#storagename-) এর অধীনে থাকা ডেটা শেয়ার এবং রিয়েল টাইমে সিঙ্ক করা যায়।

```typescript
// ডেটা যোগ করুন — মনে রাখবেন ডেটা শুধুমাত্র bool/string/number/object-এর একটি হতে পারে; আপনি একটি ক্লাস ইনস্ট্যান্স সংরক্ষণ করতে পারবেন না
declare function GM_setValue(name: string, value: any): void;
// ডেটা পান
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// ডেটা মুছুন; আবার পেতে চাইলে undefined বা defaultValue ফেরত আসে
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### নোট: `GM_setValue` যখন `undefined` দিয়ে কল করা হয়, ScriptCat সেই কী মুছে দেয় — Tampermonkey/GreaseMonkey-এর বিপরীতে, যারা `undefined` কে মান হিসেবে সংরক্ষণ করে।

#### নোট: ডেটা অপারেশনগুলো অ্যাসিঙ্ক্রোনাস হওয়ায়, `GM_setValue` বা `GM_deleteValue`-এর ঠিক পরেই `window.close()` কল করলে ডেটা সঠিকভাবে আপডেট নাও হতে পারে। ডেটা অপারেশন সম্পন্ন হয়েছে তা নিশ্চিত করতে `await GM.setValue` বা `await GM.deleteValue` ব্যবহার করার পরামর্শ দেওয়া হয়।

### GM_listValues

সব কী তালিকা করে।

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

ব্যাচ get/set API (এক্সটেনশন)।

```typescript
// একাধিক মান সেট করে; values একটি অবজেক্ট যার কীগুলো মানের নাম এবং যার মানগুলো মানের বিষয়বস্তু
declare function GM_setValues(values: { [key: string]: any }): void;
// একাধিক মান পায়; keysOrDefaults একটি অবজেক্ট হলে, এর মানগুলো ডিফল্ট হিসেবে ব্যবহৃত হয়
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// একাধিক মান মুছে দেয়; names স্ট্রিংয়ের একটি অ্যারে
declare function GM_deleteValues(names: string[]): void;
```

```js
// ব্যাচ সেট
GM_setValues({ a: 1, b: 2 });
// ব্যাচ গেট (না থাকলে ডিফল্ট ফেরত আসে)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// ব্যাচ ডিলিট
GM_deleteValues(["a", "b"]);
```

#### নোট: ডেটা অপারেশনগুলো অ্যাসিঙ্ক্রোনাস হওয়ায়, `GM_setValues` বা `GM_deleteValues`-এর ঠিক পরেই `window.close()` কল করলে ডেটা সঠিকভাবে আপডেট নাও হতে পারে। ডেটা অপারেশন সম্পন্ন হয়েছে তা নিশ্চিত করতে `await GM.setValues` বা `await GM.deleteValues` ব্যবহার করার পরামর্শ দেওয়া হয়।

### GM_add/removeValueChangeListener

> 0.17.0-alpha-এর পরে `tabid` সরানো হয়েছে — বিস্তারিত জানতে [GM_cookie](#gm_cookie-) দেখুন।

একটি মানের পরিবর্তন শোনে। `add` একটি লিসেনার id ফেরত দেয়, এবং `remove` দিয়ে লিসেনার বাতিল করা যায়। এই পদ্ধতিটি সাধারণ যোগাযোগ বাস্তবায়নে ব্যবহার করা যেতে পারে; [**storageName**](meta.md#storagename-) ব্যবহার করলে ক্রস-স্ক্রিপ্ট যোগাযোগ সম্ভব।

```typescript
// tabid শুধুমাত্র তখনই থাকে যখন ব্যাকগ্রাউন্ড স্ক্রিপ্ট থেকে শোনা হয়
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

`@resource` দিয়ে ঘোষিত রিসোর্স তথ্য পায়।

```typescript
// GM_getResourceText রিসোর্সের টেক্সট ডেটা পায়; ছবির মতো বাইট-টাইপ ডেটা একটি খালি স্ট্রিং ফেরত দেয় — সেগুলোর জন্য পরিবর্তে GM_getResourceURL ব্যবহার করুন
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL base64-এনকোডেড ডেটা পায়; দ্বিতীয় প্যারামিটারের মাধ্যমে একটি ব্লব URL-ও পাওয়া যায়
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

পেজে একটি এলিমেন্ট সন্নিবেশ করে। CSP সীমাবদ্ধতা এড়িয়ে যেতে পারে।

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// একটি স্ক্রিপ্ট সন্নিবেশ করুন
GM_addElement("script", { src: "https://example.com/app.js" });
// একটি স্টাইল সন্নিবেশ করুন
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

পেজে একটি স্টাইল যোগ করে এবং স্টাইল DOM নোড ফেরত দেয়। CSP সীমাবদ্ধতা এড়িয়ে যেতে পারে।

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

একটি নতুন উইন্ডো খোলে।

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * নতুন ট্যাবটি খোলার সময় ফোকাস পাবে কিনা তা নির্ধারণ করে।
     *
     * - `true` → নতুন ট্যাবটি অবিলম্বে ফোরগ্রাউন্ডে চলে যায়।
     * - `false` → নতুন ট্যাবটি ব্যাকগ্রাউন্ডে খোলে, বর্তমান পেজ থেকে ফোকাস চুরি করে না।
     *
     * ডিফল্ট: true
     */
    active?: boolean;

    /**
     * নতুন ট্যাবটি কোথায় সন্নিবেশ করা হবে তা নির্ধারণ করে।
     *
     * - যদি একটি `boolean` হয়:
     *   - `true` → বর্তমান ট্যাবের ঠিক পরে সন্নিবেশ করা হয়।
     *   - `false` → উইন্ডোর শেষে সন্নিবেশ করা হয়।
     * - যদি একটি `number` হয়:
     *   - `0` → বর্তমান ট্যাবের এক অবস্থান আগে সন্নিবেশ করা হয়।
     *   - `1` → বর্তমান ট্যাবের এক অবস্থান পরে সন্নিবেশ করা হয়।
     *
     * ডিফল্ট: true
     */
    insert?: boolean | number;

    /**
     * প্যারেন্ট ট্যাব (অর্থাৎ `openerTabId`) সেট করা হবে কিনা তা নির্ধারণ করে।
     *
     * - `true` → ব্রাউজার ট্র্যাক করতে পারে কোন ট্যাব শিশু ট্যাবটি খুলেছে,
     *   যা কিছু এক্সটেনশনকে (যেমন ট্যাব-ট্রি ম্যানেজার) প্যারেন্ট/শিশু সম্পর্ক সনাক্ত করতে সাহায্য করে।
     *
     * ডিফল্ট: true
     */
    setParent?: boolean;

    /**
     * ট্যাবটি একটি প্রাইভেট (ইনকগনিটো) উইন্ডোতে খোলা হবে কিনা।
     *
     * নোট: ScriptCat-এর manifest.json-এ `"incognito": "split"` সেট করা আছে,
     * তাই সাধারণ উইন্ডোতে চলার সময় tabId/windowId উপলব্ধ হবে না,
     * এবং শুধুমাত্র "নতুন ট্যাব খোলা" কাজটি করা যাবে।
     *
     * ডিফল্ট: false
     */
    incognito?: boolean;

    /**
     * লিগ্যাসি সামঞ্জস্য ফিল্ড, শুধুমাত্র Tampermonkey দ্বারা সমর্থিত।
     * এর অর্থ `active`-এর **বিপরীত**:
     *
     * - `true` → `active = false`-এর সমতুল্য (ব্যাকগ্রাউন্ডে লোড হয়)।
     * - `false` → `active = true`-এর সমতুল্য (ফোরগ্রাউন্ডে লোড হয়)।
     *
     * ⚠️ সুপারিশ করা হয় না: `active`-এর সাথে ওভারল্যাপ করে এবং বিভ্রান্ত করা সহজ।
     *
     * ডিফল্ট: false
     * @deprecated পরিবর্তে `active` ব্যবহার করুন
     */
    loadInBackground?: boolean;

    /**
     * নতুন ট্যাবটি ব্রাউজারের ট্যাব বারের বাম পাশে পিন করা হবে কিনা।
     *
     * - `true` → নতুন ট্যাবটি পিন করা হয়।
     * - `false` → একটি সাধারণ ট্যাব।
     *
     * ডিফল্ট: false
     */
    pinned?: boolean;

    /**
     * `chrome.tabs.create`-এর পরিবর্তে নতুন ট্যাব খুলতে `window.open` ব্যবহার করে।
     * নির্দিষ্ট বিশেষ প্রোটোকলসহ লিংক খোলার সময় কার্যকর, যেমন `vscode://`, `m3u8dl://`।
     * এই খোলার পদ্ধতি ব্যবহার করলে অন্যান্য প্যারামিটারের কোনো প্রভাব থাকে না।
     *
     * সম্পর্কিত: Issue #178 #1043
     * ডিফল্ট: false
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

`GM_openInTab` দিয়ে খোলা একটি ট্যাব বন্ধ করে।

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

`GM_setValue`-এর মতো ডেটা সংরক্ষণের একটি পদ্ধতি, তবে এই পদ্ধতির লাইফটাইম একটি একক ব্রাউজার ট্যাবের খোলা→বন্ধ চক্রের সাথে আবদ্ধ, এবং এটি ব্যাকগ্রাউন্ড স্ক্রিপ্ট থেকে ব্যবহার করা যায় না।

```typescript
// ট্যাব ডেটা পান
declare function GM_getTab(callback: (obj: object) => void): void;
// ট্যাব ডেটা সংরক্ষণ করুন
declare function GM_saveTab(obj: object): void;
// সব ট্যাবের ডেটা পান
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* পপআপ পেজ এবং রাইট-ক্লিক মেনুতে প্রদর্শিত একটি মেনু আইটেম নিবন্ধন করে; এটিতে ক্লিক করলে `listener` ফাংশন কল হয়।
* ডিফল্টভাবে, Tampermonkey-এর সাথে সামঞ্জস্য রেখে, একই প্রদর্শিত টেক্সটসহ মেনু আইটেমগুলো শুধুমাত্র একবার দেখায়।
* একটি `id` নির্দিষ্ট করলে মেনু আইটেমটি আপডেট করা যায়।
* `name` যদি একটি খালি স্ট্রিং হয় এবং কোনো `listener` না থাকে, তাহলে রাইট-ক্লিক মেনুতে একটি বিভাজক রেখা যোগ হয়।

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat-নির্দিষ্ট বিকল্প; ডিফল্ট true, এবং false ক্লিক করার পর পপআপ মেনু পেজটি খোলা রাখে
        nested?: boolean; // ScriptCat-নির্দিষ্ট বিকল্প; ডিফল্ট true, এবং false ব্রাউজারের রাইট-ক্লিক মেনু আইটেমটিকে তৃতীয়-স্তরের থেকে দ্বিতীয়-স্তরের মেনুতে উন্নীত করে
        individual?: boolean; // ScriptCat-নির্দিষ্ট বিকল্প; ডিফল্ট false, এবং true মানে অভিন্ন মেনু আইটেমগুলো একত্রিত করা হয় না
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

একটি নিবন্ধিত মেনু আইটেম তার id দিয়ে সরিয়ে দেয়।

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

একটি নোটিফিকেশন বার্তা পাঠায়, `progress` এবং `buttons` ক্ষমতা প্রদান করে (Firefox-এ সমর্থিত নয়), তাই একটি নোটিফিকেশন প্রগ্রেস বার বা বাটন দেখাতে পারে। আরও দুটি অতিরিক্ত পদ্ধতি প্রদান করে, `GM_closeNotification` এবং `GM_updateNotification` (Firefox-এ সমর্থিত নয়)।

[উদাহরণ](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // সর্বোচ্চ ২টি থাকতে পারে
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

#### নোট: `GM_closeNotification` এবং `GM_updateNotification` ScriptCat-নির্দিষ্ট। একটি নোটিফিকেশন আপডেট করতে, `tag` ব্যবহার করুন।


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

ক্লিপবোর্ড সেট করে। Tampermonkey-এর বিপরীতে, একটি কলব্যাক এখনও সমর্থিত নয়।

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

* একটি ক্রস-অরিজিন HTTP রিকোয়েস্ট যা CSP এড়িয়ে যেতে পারে, `@connect` দিয়ে ঘোষিত ডোমেইন সমর্থন করে। কিছু কার্যকারিতা অনুপস্থিত; কুকি ফিচারটি বর্তমানে Firefox-এ সমর্থিত নয়। সাধারণ অ্যাক্সেসের জন্য ব্যবহারকারীর অনুমোদন প্রয়োজন; `@connect` দিয়ে বর্ণিত একটি হোস্ট ব্যবহারকারীর অনুমোদন এড়িয়ে যেতে পারে।

* `anonymous` এবং `cookie` Tampermonkey-এর থেকে ভিন্নভাবে পরিচালিত হয়: `anonymous` true এবং `cookie` উপস্থিত থাকলে, শুধুমাত্র নির্দিষ্ট কুকিটি পাঠানো হয়, অন্য কোনো কুকি সংযুক্ত হয় না।

* বিশেষ হেডারগুলোও সমর্থিত:

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

* একটি ফাইল ডাউনলোড করে, হেডার এবং অন্যান্য বিকল্প কনফিগারযোগ্য; Tampermonkey-এর তুলনায় এটি cookie এবং anonymous বিকল্পও সমর্থন করে। একটি ব্লব URL দেওয়া হলে, এটি সরাসরি ডাউনলোড খোলে এবং শুধুমাত্র `onload` ইভেন্ট ফায়ার করে — এটি Tampermonkey থেকে ভিন্ন এবং ব্যাকগ্রাউন্ড স্ক্রিপ্টগুলোকে সমর্থন করার জন্য বিদ্যমান, যারা অন্যথায় ডাউনলোড তৈরি করতে পারে না (রিপোর্ট তৈরি করার মতো পরিস্থিতির জন্য কার্যকর)।
* একটি Promise অবজেক্ট ফেরত দেয় এবং একটি `abort()` পদ্ধতি প্রদান করে।
* Tampermonkey-এর বিপরীতে, ScriptCat-এর `native` ডাউনলোড মোড (ডিফল্ট) `@connect` সম্মান করে: ডাউনলোড URL-এর হোস্ট যখন স্ক্রিপ্টের `@connect` ঘোষণা দ্বারা আচ্ছাদিত না হয়, তখন ScriptCat ডাউনলোড করার আগে ব্যবহারকারীর কাছ থেকে নিশ্চিতকরণ চায়; `@connect` দ্বারা আচ্ছাদিত হোস্টগুলো নীরবে ডাউনলোড হয়, এবং ব্ল্যাকলিস্টেড হোস্টগুলো সর্বদা প্রত্যাখ্যাত হয়। `browser` ডাউনলোড মোড এই চেকের অধীন নয়। (Tampermonkey-এ, `@connect` শুধুমাত্র `GM_xmlhttpRequest`-এ প্রযোজ্য, `GM_download`-এ নয়।)

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

পেজ কুকিগুলোতে অ্যাসিঙ্ক্রোনাসভাবে কাজ করে, ক্রস-অরিজিন, HttpOnly এবং পার্টিশনড কুকি সমর্থন করে।

> v0.17.0-alpha-এর পরে, `store` এবং `tabid` সম্পর্কিত প্যারামিটারগুলো সরানো হয়েছে; ScriptCat এখন এটি বর্তমানে যে উইন্ডোতে আছে তার উপর ভিত্তি করে ইনকগনিটো বা সাধারণ উইন্ডো থেকে কুকি পাবে কিনা তা সিদ্ধান্ত নেয়।

আপনাকে অবশ্যই পরিচালিত হোস্ট `@connect` দিয়ে ঘোষণা করতে হবে, এবং এটি ব্যবহারের জন্য ব্যবহারকারীর অনুমোদন প্রয়োজন। Tampermonkey-এর `GM_cookie.list` অপারেশনের সাথে সামঞ্জস্যপূর্ণ হলেও, ধারাবাহিকতার স্বার্থে এটি সুপারিশ করা হয় না।

* `sameSite` সমর্থিত নয়।

```typescript
// name এবং domain দুটোই খালি হতে পারে না
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

**নোট**: আপনাকে অবশ্যই মেটাডেটায় `@connect example.com` ব্যবহার করে অনুমোদিত ডোমেইন ঘোষণা করতে হবে।
