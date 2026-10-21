---
title: Документація API
---

## Огляд

Визначення API цього розширення базуються на [документації Tampermonkey](https://www.tampermonkey.net/documentation.php). Через обмеження часу та зусиль наразі реалізовано лише частину API, і воно продовжуватиме розвиватися. Будь-який API, який це розширення розширює або який відрізняється від оригінального GM API, спеціально позначений у документації (за допомогою `*`). Деякі API також надають синхронний аналог за правилом `GM.*` — дивіться вміст документації для деталей.

Для детальних визначень API дивіться `scriptcat.d.ts` або вбудовані підказки редактора, оскільки документація може не завжди бути актуальною. Для API, специфічних для цього розширення, дивіться [Документацію CatApi](cat-api.md).

Ви також можете знайти відповідні приклади в [каталозі прикладів](https://github.com/scriptscat/scriptcat/tree/main/example).

## Визначення

### GM_info

Отримує інформацію про скрипт, включаючи метадані та параметри середовища виконання. Часто використовувані поля включають `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` тощо. Дивіться `scriptcat.d.ts` для детального (хоча не вичерпного) визначення.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` наразі має лише значення `raw`. `runAt` не підтримується. `userAgentData` підтримується, але може не точно збігатися з Tampermonkey.
* `userLanguage` (v1.5+) — поточна мова інтерфейсу ScriptCat, наприклад `"zh-CN"`, `"en-US"`, `"ja-JP"`; за нею скрипт може вибрати власну мову відображення. Значення визначається під час запуску скрипта; скрипт з `@early-start` під час синхронного читання може отримати порожній рядок, тому читайте його після `CAT_scriptLoaded()`.

### GM_log \*

Функція журналювання. Журнали фонового скрипта можна переглядати в журналі запуску панелі керування (натисніть стовпець статусу запуску). Порівняно з Tampermonkey додано `level` журналу.

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

Отримує або встановлює значення у сховищі. Дані під тим самим [**storageName**](meta.md#storagename-) можна спільно використовувати та синхронізувати в реальному часі.

```typescript
// Додати дані — зверніть увагу, що дані можуть бути лише одним із bool/string/number/object; ви не можете зберігати екземпляр класу
declare function GM_setValue(name: string, value: any): void;
// Отримати дані
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Видалити дані; повторне отримання повертає undefined або defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Примітка: коли `GM_setValue` викликається з `undefined`, ScriptCat видаляє цей ключ, на відміну від Tampermonkey/GreaseMonkey, які зберігають `undefined` як значення.

#### Примітка: оскільки операції з даними асинхронні, виклик `window.close()` одразу після `GM_setValue` або `GM_deleteValue` може перешкодити правильному оновленню даних. Рекомендується використовувати `await GM.setValue` або `await GM.deleteValue`, щоб забезпечити завершення операції з даними.

### GM_listValues

Перелічує всі ключі.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

API пакетного отримання/встановлення (розширення).

```typescript
// Встановлює кілька значень; values — це об'єкт, ключі якого є назвами значень, а значення — вмістом значень
declare function GM_setValues(values: { [key: string]: any }): void;
// Отримує кілька значень; якщо keysOrDefaults — об'єкт, його значення використовуються як за замовчуванням
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Видаляє кілька значень; names — масив рядків
declare function GM_deleteValues(names: string[]): void;
```

```js
// Пакетне встановлення
GM_setValues({ a: 1, b: 2 });
// Пакетне отримання (повертає за замовчуванням, якщо відсутнє)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Пакетне видалення
GM_deleteValues(["a", "b"]);
```

#### Примітка: оскільки операції з даними асинхронні, виклик `window.close()` одразу після `GM_setValues` або `GM_deleteValues` може перешкодити правильному оновленню даних. Рекомендується використовувати `await GM.setValues` або `await GM.deleteValues`, щоб забезпечити завершення операції з даними.

### GM_add/removeValueChangeListener

> `tabid` було видалено після 0.17.0-alpha — дивіться [GM_cookie](#gm_cookie-) для деталей.

Прослуховує зміни значення. `add` повертає ідентифікатор слухача, а `remove` можна використовувати для скасування слухача. Цей метод можна використовувати для реалізації простої комунікації; використання [**storageName**](meta.md#storagename-) забезпечує міжскриптову комунікацію.

```typescript
// tabid присутній лише під час прослуховування з фонового скрипта
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

Отримує інформацію про ресурс, оголошену за допомогою `@resource`.

```typescript
// GM_getResourceText отримує текстові дані ресурсу; байтові дані, такі як зображення, повертають порожній рядок — для них використовуйте GM_getResourceURL
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL отримує дані у base64; blob URL також можна отримати через другий параметр
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Вставляє елемент у сторінку. Може обходити обмеження CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Вставити скрипт
GM_addElement("script", { src: "https://example.com/app.js" });
// Вставити стиль
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Додає стиль на сторінку та повертає вузол DOM стилю. Може обходити обмеження CSP.

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

Відкриває нове вікно.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Визначає, чи отримує нова вкладка фокус під час відкриття.
     *
     * - `true` → нова вкладка негайно перемикається на передній план.
     * - `false` → нова вкладка відкривається у фоновому режимі, не забираючи фокус із поточної сторінки.
     *
     * За замовчуванням: true
     */
    active?: boolean;

    /**
     * Визначає, куди вставляється нова вкладка.
     *
     * - Якщо `boolean`:
     *   - `true` → вставляється одразу після поточної вкладки.
     *   - `false` → вставляється в кінець вікна.
     * - Якщо `number`:
     *   - `0` → вставляється на одну позицію перед поточною вкладкою.
     *   - `1` → вставляється на одну позицію після поточної вкладки.
     *
     * За замовчуванням: true
     */
    insert?: boolean | number;

    /**
     * Визначає, чи встановлюється батьківська вкладка (тобто `openerTabId`).
     *
     * - `true` → браузер може відстежувати, яка вкладка відкрила дочірню,
     *   що допомагає деяким розширенням (наприклад, менеджерам дерева вкладок) визначати батьківсько-дочірні зв'язки.
     *
     * За замовчуванням: true
     */
    setParent?: boolean;

    /**
     * Чи відкривати вкладку в приватному (інкогніто) вікні.
     *
     * Примітка: manifest.json ScriptCat встановлює `"incognito": "split"`,
     * тому під час роботи у звичайному вікні tabId/windowId будуть недоступні,
     * і можна буде виконати лише дію "відкрити нову вкладку".
     *
     * За замовчуванням: false
     */
    incognito?: boolean;

    /**
     * Поле сумісності зі старими версіями, підтримується лише Tampermonkey.
     * Його значення є **протилежним** до `active`:
     *
     * - `true` → еквівалентно `active = false` (завантажується у фоновому режимі).
     * - `false` → еквівалентно `active = true` (завантажується на передньому плані).
     *
     * ⚠️ Не рекомендується: перетинається з `active` і легко заплутати.
     *
     * За замовчуванням: false
     * @deprecated Використовуйте `active` замість цього
     */
    loadInBackground?: boolean;

    /**
     * Чи закріплювати нову вкладку ліворуч у панелі вкладок браузера.
     *
     * - `true` → нова вкладка закріплюється.
     * - `false` → звичайна вкладка.
     *
     * За замовчуванням: false
     */
    pinned?: boolean;

    /**
     * Використовує `window.open` для відкриття нової вкладки замість `chrome.tabs.create`.
     * Корисно під час відкриття посилань із деякими спеціальними протоколами, напр. `vscode://`, `m3u8dl://`.
     * Інші параметри не мають ефекту під час використання цього методу відкриття.
     *
     * Пов'язано: Issue #178 #1043
     * За замовчуванням: false
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

Закриває вкладку, відкриту `GM_openInTab`.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

Метод зберігання даних, подібний до `GM_setValue`, але життєвий цикл цього методу прив'язаний до циклу відкриття→закриття однієї вкладки браузера, і його не можна використовувати з фонового скрипта.

```typescript
// Отримати дані вкладки
declare function GM_getTab(callback: (obj: object) => void): void;
// Зберегти дані вкладки
declare function GM_saveTab(obj: object): void;
// Отримати дані всіх вкладок
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Реєструє пункт меню, який з'являється на спливаючій сторінці та в контекстному меню; натискання викликає функцію `listener`.
* За замовчуванням, відповідно до Tampermonkey, пункти меню з однаковим відображуваним текстом показуються лише один раз.
* Вказання `id` дозволяє оновити пункт меню.
* Якщо `name` — порожній рядок і немає `listener`, до контекстного меню додається лінія-розділювач.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // Опція, специфічна для ScriptCat; за замовчуванням true, а false залишає спливаюче меню відкритим після натискання
        nested?: boolean; // Опція, специфічна для ScriptCat; за замовчуванням true, а false піднімає пункт контекстного меню браузера з третього рівня на другий
        individual?: boolean; // Опція, специфічна для ScriptCat; за замовчуванням false, а true означає, що однакові пункти меню не об'єднуються
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Видаляє зареєстрований пункт меню за його ID.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Надсилає повідомлення, надаючи можливості `progress` і `buttons` (не підтримується у Firefox), тому сповіщення може показувати смугу прогресу або кнопки. Також надає два додаткові методи: `GM_closeNotification` і `GM_updateNotification` (не підтримуються у Firefox).

[приклад](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // Щонайбільше 2 можуть існувати
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

#### Примітка: `GM_closeNotification` і `GM_updateNotification` є специфічними для ScriptCat. Щоб оновити сповіщення, використовуйте `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // оновлює прогрес
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // закривається через 1мс
```

### GM_setClipboard \*

Встановлює буфер обміну. Зворотний виклик ще не підтримується, на відміну від Tampermonkey.

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

* Крос-доменний HTTP-запит, який може обходити CSP, підтримує домени, оголошені за допомогою `@connect`. Деякі функції відсутні; функція cookie наразі не підтримується у Firefox. Для звичайного доступу потрібна авторизація користувача; хост, описаний `@connect`, може пропустити авторизацію користувача.

* `anonymous` і `cookie` обробляються інакше, ніж у Tampermonkey: коли `anonymous` має значення true і присутній `cookie`, надсилається лише вказаний cookie, без інших прикріплених cookie.

* Також підтримуються спеціальні заголовки:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream — досить базова реалізація в поточній версії
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // для узгодженості з Tampermonkey maxRedirects було застарілим після v0.17.0 на користь redirect, який примушує режим fetch
    
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

* Завантажує файл, з можливістю налаштування заголовків та інших опцій; порівняно з Tampermonkey також підтримує опції cookie та anonymous. Якщо надано blob URL, він відкриває завантаження безпосередньо та запускає лише подію `onload` — це відрізняється від Tampermonkey та існує для підтримки фонових скриптів, які інакше не можуть створити завантаження (корисно для таких сценаріїв, як генерація звітів).
* Повертає об'єкт Promise і надає метод `abort()`.
* На відміну від Tampermonkey, режим `native` завантаження ScriptCat (за замовчуванням) поважає `@connect`: коли хост URL завантаження не охоплюється оголошеннями `@connect` скрипта, ScriptCat запитує підтвердження користувача перед завантаженням; хости, охоплені `@connect`, завантажуються автоматично, а чорний список завжди відхиляється. Режим завантаження `browser` не підлягає цій перевірці. (У Tampermonkey `@connect` застосовується лише до `GM_xmlhttpRequest`, а не до `GM_download`.)

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
// Форма зворотного виклику
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Асинхронно працює з cookie сторінки, підтримуючи крос-доменні, HttpOnly та розділені cookie.

> Після v0.17.0-alpha параметри `store` та `tabid` було видалено; ScriptCat тепер вирішує, отримувати cookie з вікна інкогніто чи звичайного, на основі вікна, у якому він зараз перебуває.

Ви повинні оголосити хост, з яким працюєте, через `@connect`, і для використання потрібна авторизація користувача. Хоча сумісно з операцією `GM_cookie.list` Tampermonkey, це не рекомендується заради узгодженості.

* `sameSite` не підтримується.

```typescript
// name і domain не можуть бути порожніми одночасно
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

// Форма зворотного виклику
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

// Форма Promise
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**Примітка**: Ви повинні оголосити дозволений домен у метаданих за допомогою `@connect example.com`.
