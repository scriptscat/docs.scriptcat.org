---
title: API փաստաթղթեր
---

## Ուսումնասիրություն

Այս ընդլայնման API սահմանումները հիմնված են [Tampermonkey փաստաթղթերի](https://www.tampermonkey.net/documentation.php) վրա: Ժամանակի և ջանքերի սահմանափակումների պատճառով մինչ այժմ իրականացվել է API-ի միայն մի մասը, և այն կշարունակի զարգանալ: Ցանկացած API, որը այս ընդլայնումը ընդլայնում է կամ տարբերվում է բնօրինակ GM API-ից, հատուկ նշվում է փաստաթղթերում (օգտագործելով `*`): Որոշ API-ներ նաև տրամադրում են սինխրոն-ոճի համարժեք՝ հետևելով `GM.*` կանոնին — մանրամասների համար տեսեք փաստաթղթերի բովանդակությունը:

Մանրամասն API սահմանումների համար տեսեք `scriptcat.d.ts` կամ ներկառուցված խմբագրիչի հուշումները, քանի որ փաստաթղթերը կարող են միշտ չհամապատասխանել վերջինին: Այս ընդլայնմանը հատուկ API-ների համար տեսեք [CatApi փաստաթղթերը](cat-api.md):

Դուք կարող եք նաև գտնել առնչվող օրինակներ [օրինակների դիրեկտորիայում](https://github.com/scriptscat/scriptcat/tree/main/example):

## Սահմանումներ

### GM_info

Ստանում է տեղեկատվություն սկրիպտի մասին՝ ներառյալ մետատվյալները և գործարկման միջավայրի պարամետրերը: Հաճախ օգտագործվող դաշտերը ներառում են `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` և այլն: Մանրամասն (թեև ոչ սպառիչ) սահմանման համար տեսեք `scriptcat.d.ts`:

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode`-ը ներկայումս ունի միայն `raw` արժեք: `runAt`-ը չի աջակցվում: `userAgentData`-ն աջակցվում է, բայց կարող է ճշգրիտ չհամընկնել Tampermonkey-ի հետ:
* `userLanguage` (v1.5+)-ը ScriptCat-ի ընթացիկ ինտերֆեյսի լեզուն է, օրինակ՝ `"zh-CN"`, `"en-US"`, `"ja-JP"`, որպեսզի սկրիպտը կարողանա ընտրել իր ցուցադրման լեզուն: Արժեքը որոշվում է սկրիպտի գործարկման պահին. `@early-start` սկրիպտը համաժամանակյա կարդալիս կարող է ստանալ դատարկ տող, ուստի կարդացեք այն `CAT_scriptLoaded()`-ից հետո:

### GM_log \*

Լոգագրման ֆունկցիա: Ֆոնային սկրիպտի լոգերը կարելի է դիտել վահանակի գործարկման լոգում (սեղմեք գործարկման կարգավիճակի սյունակը): Ի տարբերություն Tampermonkey-ի, ավելացվել է լոգի `level`:

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

Ստանում կամ սահմանում է արժեք պահեստում: Նույն [**storageName**](meta.md#storagename-) տակ գտնվող տվյալները կարող են կիսվել և համաժամեցվել իրական ժամանակում:

```typescript
// Ավելացնել տվյալ — նկատի ունեցեք, որ տվյալը կարող է լինել միայն bool/string/number/object-ից մեկը. դուք չեք կարող պահել կլասի ինստանս
declare function GM_setValue(name: string, value: any): void;
// Ստանալ տվյալ
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Ջնջել տվյալ. կրկին ստանալը վերադարձնում է undefined կամ defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Նշում. Երբ `GM_setValue`-ը կանչվում է `undefined`-ով, ScriptCat-ը ջնջում է այդ բանալին՝ ի տարբերություն Tampermonkey/GreaseMonkey-ի, որոնք պահում են `undefined`-ը որպես արժեք:

#### Նշում. Քանի որ տվյալների գործողությունները ասինխրոն են, `GM_setValue`-ից կամ `GM_deleteValue`-ից անմիջապես հետո `window.close()` կանչելը կարող է խանգարել տվյալների ճիշտ թարմացմանը: Խորհուրդ է տրվում օգտագործել `await GM.setValue` կամ `await GM.deleteValue`՝ համոզվելու համար, որ տվյալների գործողությունն ավարտված է:

### GM_listValues

Թվարկում է բոլոր բանալիները:

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Խմբաքանակային get/set API-ներ (ընդլայնում):

```typescript
// Սահմանում է բազմաթիվ արժեքներ. values-ը օբյեկտ է, որի բանալիները արժեքների անուններն են, իսկ արժեքները՝ բովանդակությունը
declare function GM_setValues(values: { [key: string]: any }): void;
// Ստանում է բազմաթիվ արժեքներ. եթե keysOrDefaults-ը օբյեկտ է, դրա արժեքները օգտագործվում են որպես լռելյայն
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Ջնջում է բազմաթիվ արժեքներ. names-ը տողերի զանգված է
declare function GM_deleteValues(names: string[]): void;
```

```js
// Խմբաքանակային սահմանում
GM_setValues({ a: 1, b: 2 });
// Խմբաքանակային ստացում (վերադարձնում է լռելյայն, եթե բացակայում է)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Խմբաքանակային ջնջում
GM_deleteValues(["a", "b"]);
```

#### Նշում. Քանի որ տվյալների գործողությունները ասինխրոն են, `GM_setValues`-ից կամ `GM_deleteValues`-ից անմիջապես հետո `window.close()` կանչելը կարող է խանգարել տվյալների ճիշտ թարմացմանը: Խորհուրդ է տրվում օգտագործել `await GM.setValues` կամ `await GM.deleteValues`՝ համոզվելու համար, որ տվյալների գործողությունն ավարտված է:

### GM_add/removeValueChangeListener

> `tabid`-ը հեռացվել է 0.17.0-alpha-ից հետո — մանրամասների համար տեսեք [GM_cookie](#gm_cookie-):

Լսում է արժեքի փոփոխությունները: `add`-ը վերադարձնում է լսողի id, իսկ `remove`-ը կարող է չեղարկել լսողը: Այս մեթոդը կարող է օգտագործվել պարզ հաղորդակցություն իրականացնելու համար. [**storageName**](meta.md#storagename-) օգտագործելը հնարավորություն է տալիս խաչ-սկրիպտ հաղորդակցություն:

```typescript
// tabid-ը առկա է միայն ֆոնային սկրիպտից լսելիս
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

Ստանում է `@resource`-ով հայտարարված ռեսուրսի տեղեկատվությունը:

```typescript
// GM_getResourceText-ը ստանում է ռեսուրսի տեքստային տվյալները. բայթ-տիպի տվյալները, ինչպիսիք են պատկերները, վերադարձնում են դատարկ տող — դրանց համար փոխարենը օգտագործեք GM_getResourceURL
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL-ը ստանում է base64-կոդավորված տվյալներ. blob URL կարելի է նաև ստանալ երկրորդ պարամետրի միջոցով
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Տեղադրում է տարր էջում: Կարող է շրջանցել CSP սահմանափակումները:

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Տեղադրել սկրիպտ
GM_addElement("script", { src: "https://example.com/app.js" });
// Տեղադրել ոճ
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Ավելացնում է ոճ էջում և վերադարձնում ոճի DOM հանգույցը: Կարող է շրջանցել CSP սահմանափակումները:

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

Բացում է նոր պատուհան:

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Որոշում է՝ արդյոք նոր ներդիրը ֆոկուս կստանա բացվելիս:
     *
     * - `true` → նոր ներդիրն անմիջապես տեղափոխվում է առաջին պլան:
     * - `false` → նոր ներդիրը բացվում է ֆոնում՝ առանց ընթացիկ էջից ֆոկուսը խլելու:
     *
     * Լռելյայն. true
     */
    active?: boolean;

    /**
     * Որոշում է, թե որտեղ է տեղադրվում նոր ներդիրը:
     *
     * - Եթե `boolean` է.
     *   - `true` → տեղադրվում է ընթացիկ ներդիրից անմիջապես հետո:
     *   - `false` → տեղադրվում է պատուհանի վերջում:
     * - Եթե `number` է.
     *   - `0` → տեղադրվում է ընթացիկ ներդիրից մեկ դիրք առաջ:
     *   - `1` → տեղադրվում է ընթացիկ ներդիրից մեկ դիրք հետո:
     *
     * Լռելյայն. true
     */
    insert?: boolean | number;

    /**
     * Որոշում է՝ արդյոք ծնող ներդիրը (այսինքն՝ `openerTabId`) սահմանված է:
     *
     * - `true` → զննարկիչը կարող է հետևել, թե որ ներդիրն է բացել մանկան ներդիրը,
     *   ինչը օգնում է որոշ ընդլայնումներին (օրինակ՝ ներդիր-ծառ կառավարիչներին) նույնականացնել ծնող/մանուկ հարաբերությունները:
     *
     * Լռելյայն. true
     */
    setParent?: boolean;

    /**
     * Արդյոք ներդիրը բացվում է մասնավոր (ինկոգնիտո) պատուհանում:
     *
     * Նշում. ScriptCat-ի manifest.json-ը սահմանում է `"incognito": "split"`,
     * այնպես որ սովորական պատուհանում աշխատելիս tabId/windowId հասանելի չեն լինի,
     * և կարող է կատարվել միայն «նոր ներդիր բացել» գործողությունը:
     *
     * Լռելյայն. false
     */
    incognito?: boolean;

    /**
     * Ժառանգական համատեղելիության դաշտ, աջակցվում է միայն Tampermonkey-ի կողմից:
     * Դրա իմաստը `active`-ի **հակառակն** է.
     *
     * - `true` → համարժեք է `active = false`-ին (բեռնվում է ֆոնում):
     * - `false` → համարժեք է `active = true`-ին (բեռնվում է առաջին պլանում):
     *
     * ⚠️ Խորհուրդ չի տրվում. համընկնում է `active`-ի հետ և հեշտ է շփոթվել:
     *
     * Լռելյայն. false
     * @deprecated Փոխարենը օգտագործեք `active`
     */
    loadInBackground?: boolean;

    /**
     * Արդյոք նոր ներդիրը ամրացնել զննարկչի ներդիրների տողի ձախ կողմում:
     *
     * - `true` → նոր ներդիրը ամրացվում է:
     * - `false` → սովորական ներդիր:
     *
     * Լռելյայն. false
     */
    pinned?: boolean;

    /**
     * Օգտագործում է `window.open`՝ նոր ներդիրը բացելու համար՝ `chrome.tabs.create`-ի փոխարեն:
     * Օգտակար է որոշ հատուկ պրոտոկոլներով հղումներ բացելիս, օր.՝ `vscode://`, `m3u8dl://`:
     * Այս բացման մեթոդն օգտագործելիս մյուս պարամետրերը որևէ ազդեցություն չունեն:
     *
     * Առնչվող. Issue #178 #1043
     * Լռելյայն. false
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

Փակում է `GM_openInTab`-ով բացված ներդիրը:

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

`GM_setValue`-ի նման տվյալներ պահելու մեթոդ, բայց այս մեթոդի կյանքի տևողությունը կապված է մեկ զննարկչի ներդիրի բաց→փակ ցիկլի հետ, և այն չի կարող օգտագործվել ֆոնային սկրիպտից:

```typescript
// Ստանալ ներդիրի տվյալները
declare function GM_getTab(callback: (obj: object) => void): void;
// Պահպանել ներդիրի տվյալները
declare function GM_saveTab(obj: object): void;
// Ստանալ բոլոր ներդիրների տվյալները
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Գրանցում է մենյուի տարր, որը հայտնվում է popup էջում և աջ սեղմման մենյուում. դրա վրա սեղմելը կանչում է `listener` ֆունկցիան:
* Լռելյայն, Tampermonkey-ին համապատասխանեցնելով, նույն ցուցադրվող տեքստով մենյուի տարրերը ցուցադրվում են միայն մեկ անգամ:
* `id` նշելը թույլ է տալիս թարմացնել մենյուի տարրը:
* Եթե `name`-ը դատարկ տող է և չկա `listener`, աջ սեղմման մենյուում ավելացվում է բաժանարար գիծ:

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat-ին հատուկ տարբերակ. լռելյայն true, իսկ false-ը սեղմումից հետո popup մենյուի էջը բաց է պահում
        nested?: boolean; // ScriptCat-ին հատուկ տարբերակ. լռելյայն true, իսկ false-ը զննարկչի աջ սեղմման մենյուի տարրը երրորդ մակարդակից բարձրացնում է երկրորդ մակարդակի մենյու
        individual?: boolean; // ScriptCat-ին հատուկ տարբերակ. լռելյայն false, իսկ true նշանակում է, որ նույնական մենյուի տարրերը չեն միաձուլվում
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Հեռացնում է գրանցված մենյուի տարրը նրա id-ով:

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Ուղարկում է ծանուցման հաղորդագրություն՝ տրամադրելով `progress` և `buttons` կարողություններ (չի աջակցվում Firefox-ում), այնպես որ ծանուցումը կարող է ցուցադրել առաջընթացի տող կամ կոճակներ: Նաև տրամադրում է երկու լրացուցիչ մեթոդ՝ `GM_closeNotification` և `GM_updateNotification` (չի աջակցվում Firefox-ում):

[օրինակ](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // Առավելագույնը 2 կարող է գոյություն ունենալ
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

#### Նշում. `GM_closeNotification`-ը և `GM_updateNotification`-ը ScriptCat-ին հատուկ են: Ծանուցումը թարմացնելու համար օգտագործեք `tag`:


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

Սահմանում է սեղմատախտակը: Կոլբեքը դեռ չի աջակցվում՝ ի տարբերություն Tampermonkey-ի:

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

* Խաչ-ծագում HTTP հարցում, որը կարող է շրջանցել CSP-ն՝ աջակցելով `@connect`-ով հայտարարված դոմեններին: Որոշ ֆունկցիոնալություն բացակայում է. cookie հնարավորությունը ներկայումս չի աջակցվում Firefox-ում: Նորմալ մուտքի համար պահանջվում է օգտագործողի թույլտվություն. `@connect`-ով նկարագրված հոսթը կարող է շրջանցել օգտագործողի թույլտվությունը:

* `anonymous`-ը և `cookie`-ն մշակվում են Tampermonkey-ից տարբեր. երբ `anonymous`-ը true է, և `cookie`-ն առկա է, ուղարկվում է միայն նշված cookie-ն՝ առանց որևէ այլ cookie կցելու:

* Հատուկ վերնագրերը նույնպես աջակցվում են.

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

* Ներբեռնում է ֆայլ, վերնագրերի և այլ տարբերակների կարգավորմամբ. Tampermonkey-ի համեմատ այն նաև աջակցում է cookie և anonymous տարբերակներին: Եթե տրված է blob URL, այն ուղղակիորեն բացում է ներբեռնումը և գործարկում է միայն `onload` իրադարձությունը — սա տարբերվում է Tampermonkey-ից և գոյություն ունի ֆոնային սկրիպտներին աջակցելու համար, որոնք այլապես չեն կարող ներբեռնում ստեղծել (օգտակար է հաշվետվություններ ստեղծելու նման սցենարներում):
* Վերադարձնում է Promise օբյեկտ և տրամադրում է `abort()` մեթոդ:
* Ի տարբերություն Tampermonkey-ի, ScriptCat-ի `native` ներբեռնման ռեժիմը (լռելյայն) հարգում է `@connect`-ը. երբ ներբեռնման URL-ի հոսթը չի ծածկված սկրիպտի `@connect` հայտարարություններով, ScriptCat-ը ներբեռնումից առաջ օգտագործողից հաստատում է խնդրում. `@connect`-ով ծածկված հոսթերը ներբեռնվում են լուռ, իսկ սև ցուցակում գտնվող հոսթերը միշտ մերժվում են: `browser` ներբեռնման ռեժիմը ենթակա չէ այս ստուգմանը: (Tampermonkey-ում `@connect`-ը վերաբերում է միայն `GM_xmlhttpRequest`-ին, ոչ թե `GM_download`-ին):

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

Ասինխրոն կերպով աշխատում է էջի cookie-ների վրա՝ աջակցելով խաչ-ծագում, HttpOnly և պարտիտիոնացված cookie-ներին:

> v0.17.0-alpha-ից հետո `store`-ի և `tabid`-ի հետ կապված պարամետրերը հեռացվել են. ScriptCat-ն այժմ որոշում է, թե արդյոք cookie-ներ ստանալ ինկոգնիտո կամ սովորական պատուհանից՝ ելնելով այն պատուհանից, որում այն ներկայումս գտնվում է:

Դուք պետք է հայտարարեք շահագործվող հոսթը `@connect`-ով, և դրա օգտագործման համար պահանջվում է օգտագործողի թույլտվություն: Թեև համատեղելի է Tampermonkey-ի `GM_cookie.list` գործողության հետ, դա խորհուրդ չի տրվում՝ հետևողականության համար:

* `sameSite`-ը չի աջակցվում:

```typescript
// name-ը և domain-ը երկուսն էլ չեն կարող դատարկ լինել
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

**Նշում**. Դուք պետք է մետատվյալներում հայտարարեք թույլատրված դոմենը՝ օգտագործելով `@connect example.com`:
