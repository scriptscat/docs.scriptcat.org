---
title: API Belgeleri
---

## Genel Bakış

Bu eklentinin API tanımları [Tampermonkey belgelerine](https://www.tampermonkey.net/documentation.php) dayanır. Zaman ve çaba kısıtlamaları nedeniyle şu ana kadar API'nin yalnızca bir kısmı uygulanmıştır ve geliştirmeye devam edilecektir. Bu eklentinin genişlettiği veya orijinal GM API'sinden farklı olan her API, belgelerde özel olarak işaretlenir (`*` kullanılarak). Bazı API'ler ayrıca `GM.*` kuralını izleyen eşzamanlı tarzda bir karşılık sağlar — ayrıntılar için belge içeriğine bakın.

Ayrıntılı API tanımları için, belgeler her zaman güncel olmayabileceğinden `scriptcat.d.ts` dosyasına veya yerleşik editör ipuçlarına bakın. Bu eklentiye özgü API'ler için [CatApi Belgelerine](cat-api.md) bakın.

İlgili örnekleri [örnek dizininde](https://github.com/scriptscat/scriptcat/tree/main/example) de bulabilirsiniz.

## Tanımlar

### GM_info

Betik hakkında, meta veriler ve çalışma zamanı ortamı parametreleri dahil bilgi alır. Yaygın olarak kullanılan alanlar arasında `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` ve daha fazlası bulunur. Ayrıntılı (ancak kapsamlı olmayan) tanım için `scriptcat.d.ts` dosyasına bakın.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` şu anda yalnızca `raw` değerine sahiptir. `runAt` desteklenmez. `userAgentData` desteklenir, ancak Tampermonkey ile tam olarak eşleşmeyebilir.
* `userLanguage` (v1.5+), ScriptCat'in geçerli arayüz dilidir; örneğin `"zh-CN"`, `"en-US"`, `"ja-JP"`. Betik kendi görüntüleme dilini buna göre seçebilir. Değer betik başlatılırken belirlenir; `@early-start` betiği eşzamanlı okurken boş bir dize alabilir, bu nedenle değeri `CAT_scriptLoaded()` sonrasında okuyun.

### GM_log \*

Günlük kaydı işlevi. Bir arka plan betiğinin günlükleri, paneldeki çalıştırma günlüğünde görüntülenebilir (çalıştırma durumu sütununa tıklayın). Tampermonkey'e kıyasla bir günlük `level` değeri eklenmiştir.

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

Depolamada bir değer alır veya ayarlar. Aynı [**storageName**](meta.md#storagename-) altındaki veriler paylaşılabilir ve gerçek zamanlı olarak senkronize edilebilir.

```typescript
// Veri ekle — verinin yalnızca bool/string/number/object türlerinden biri olabileceğini unutmayın; bir sınıf örneği saklayamazsınız
declare function GM_setValue(name: string, value: any): void;
// Veri al
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Veriyi sil; tekrar almak undefined veya defaultValue döndürür
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Not: `GM_setValue` `undefined` ile çağrıldığında, ScriptCat `undefined` değerini değer olarak saklayan Tampermonkey/GreaseMonkey'in aksine o anahtarı siler.

#### Not: Veri işlemleri zaman uyumsuz olduğundan, `GM_setValue` veya `GM_deleteValue` çağrısından hemen sonra `window.close()` çağrısı yapmak verilerin doğru şekilde güncellenmesini engelleyebilir. Veri işleminin tamamlandığından emin olmak için `await GM.setValue` veya `await GM.deleteValue` kullanmanız önerilir.

### GM_listValues

Tüm anahtarları listeler.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Toplu alma/ayarlama API'leri (eklenti).

```typescript
// Birden çok değer ayarlar; values, anahtarları değer adları ve değerleri değer içerikleri olan bir nesnedir
declare function GM_setValues(values: { [key: string]: any }): void;
// Birden çok değer alır; keysOrDefaults bir nesneyse, değerleri varsayılan olarak kullanılır
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Birden çok değeri siler; names bir dize dizisidir
declare function GM_deleteValues(names: string[]): void;
```

```js
// Toplu ayarla
GM_setValues({ a: 1, b: 2 });
// Toplu al (yoksa varsayılanı döndürür)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Toplu sil
GM_deleteValues(["a", "b"]);
```

#### Not: Veri işlemleri zaman uyumsuz olduğundan, `GM_setValues` veya `GM_deleteValues` çağrısından hemen sonra `window.close()` çağrısı yapmak verilerin doğru şekilde güncellenmesini engelleyebilir. Veri işleminin tamamlandığından emin olmak için `await GM.setValues` veya `await GM.deleteValues` kullanmanız önerilir.

### GM_add/removeValueChangeListener

> `tabid`, 0.17.0-alpha sonrasında kaldırıldı — ayrıntılar için [GM_cookie](#gm_cookie-) bölümüne bakın.

Bir değerdeki değişiklikleri dinler. `add` bir dinleyici kimliği döndürür ve `remove` dinleyiciyi iptal etmek için kullanılabilir. Bu yöntem basit iletişim uygulamak için kullanılabilir; [**storageName**](meta.md#storagename-) kullanmak betikler arası iletişimi sağlar.

```typescript
// tabid yalnızca bir arka plan betiğinden dinlerken bulunur
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

`@resource` ile bildirilen kaynak bilgilerini alır.

```typescript
// GM_getResourceText kaynağın metin verilerini alır; görseller gibi bayt türündeki veriler boş bir dize döndürür — bunlar için GM_getResourceURL kullanın
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL base64 kodlu verileri alır; ikinci parametreyle bir blob URL de elde edilebilir
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Sayfaya bir öğe ekler. CSP kısıtlamalarını atlayabilir.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Bir betik ekle
GM_addElement("script", { src: "https://example.com/app.js" });
// Bir stil ekle
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Sayfaya bir stil ekler ve stil DOM düğümünü döndürür. CSP kısıtlamalarını atlayabilir.

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

Yeni bir pencere açar.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Yeni sekmenin açıldığında odak alıp almayacağını belirler.
     *
     * - `true` → yeni sekme hemen ön plana geçirilir.
     * - `false` → yeni sekme arka planda açılır ve geçerli sayfadan odağı çalmaz.
     *
     * Varsayılan: true
     */
    active?: boolean;

    /**
     * Yeni sekmenin nereye ekleneceğini belirler.
     *
     * - Bir `boolean` ise:
     *   - `true` → geçerli sekmenin hemen ardına eklenir.
     *   - `false` → pencerenin sonuna eklenir.
     * - Bir `number` ise:
     *   - `0` → geçerli sekmenin bir konum öncesine eklenir.
     *   - `1` → geçerli sekmenin bir konum sonrasına eklenir.
     *
     * Varsayılan: true
     */
    insert?: boolean | number;

    /**
     * Üst sekmenin (yani `openerTabId`) ayarlanıp ayarlanmayacağını belirler.
     *
     * - `true` → tarayıcı, alt sekmeyi hangi sekmenin açtığını izleyebilir,
     *   bu da bazı eklentilerin (sekme ağacı yöneticileri gibi) üst/alt ilişkilerini
     *   tanımlamasına yardımcı olur.
     *
     * Varsayılan: true
     */
    setParent?: boolean;

    /**
     * Sekmenin gizli (gizli mod) bir pencerede açılıp açılmayacağı.
     *
     * Not: ScriptCat'in manifest.json dosyası `"incognito": "split"` ayarlar,
     * bu nedenle normal bir pencerede çalışırken tabId/windowId
     * kullanılamaz ve yalnızca "yeni sekme aç" eylemi gerçekleştirilebilir.
     *
     * Varsayılan: false
     */
    incognito?: boolean;

    /**
     * Eski uyumluluk alanı, yalnızca Tampermonkey tarafından desteklenir.
     * Anlamı `active` değerinin **zıttıdır**:
     *
     * - `true` → `active = false` ile eşdeğerdir (arka planda yüklenir).
     * - `false` → `active = true` ile eşdeğerdir (ön planda yüklenir).
     *
     * ⚠️ Önerilmez: `active` ile örtüşür ve karıştırılması kolaydır.
     *
     * Varsayılan: false
     * @deprecated Bunun yerine `active` kullanın
     */
    loadInBackground?: boolean;

    /**
     * Yeni sekmenin tarayıcının sekme çubuğunun sol tarafına sabitlenip sabitlenmeyeceği.
     *
     * - `true` → yeni sekme sabitlenir.
     * - `false` → normal bir sekme.
     *
     * Varsayılan: false
     */
    pinned?: boolean;

    /**
     * Yeni sekmeyi `chrome.tabs.create` yerine `window.open` ile açar.
     * `vscode://`, `m3u8dl://` gibi bazı özel protokollere sahip bağlantıları açarken kullanışlıdır.
     * Bu açma yöntemi kullanıldığında diğer parametrelerin etkisi yoktur.
     *
     * İlgili: Issue #178 #1043
     * Varsayılan: false
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

`GM_openInTab` ile açılan bir sekmeyi kapatır.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

`GM_setValue`'ya benzer veri saklama yöntemi, ancak bu yöntemin ömrü tek bir tarayıcı sekmesinin açılma→kapanma döngüsüne bağlıdır ve bir arka plan betiğinden kullanılamaz.

```typescript
// Sekme verilerini al
declare function GM_getTab(callback: (obj: object) => void): void;
// Sekme verilerini kaydet
declare function GM_saveTab(obj: object): void;
// Tüm sekmelerin verilerini al
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Açılır sayfada ve sağ tıklama menüsünde görünen bir menü öğesi kaydeder; tıklandığında `listener` işlevini çağırır.
* Varsayılan olarak, Tampermonkey ile eşleşecek şekilde, aynı görünen metne sahip menü öğeleri yalnızca bir kez gösterilir.
* Bir `id` belirtmek, menü öğesini güncellemenizi sağlar.
* `name` boş bir dizeyse ve `listener` yoksa, sağ tıklama menüsüne bir ayırıcı çizgi eklenir.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat'e özgü seçenek; varsayılan true'dur ve false, tıklandıktan sonra açılır menü sayfasını açık tutar
        nested?: boolean; // ScriptCat'e özgü seçenek; varsayılan true'dur ve false, tarayıcının sağ tıklama menü öğesini üçüncü düzey bir menüden ikinci düzey bir menüye çıkarır
        individual?: boolean; // ScriptCat'e özgü seçenek; varsayılan false'dur ve true, aynı menü öğelerinin birleştirilmemesi anlamına gelir
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Kimliğine göre kayıtlı bir menü öğesini kaldırır.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Bir bildirim mesajı gönderir; `progress` ve `buttons` yetenekleri sağlar (Firefox'ta desteklenmez), böylece bir bildirim ilerleme çubuğu veya düğmeler gösterebilir. Ayrıca `GM_closeNotification` ve `GM_updateNotification` (Firefox'ta desteklenmez) adlı iki ek yöntem sağlar.

[örnek](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // En fazla 2 tane olabilir
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

#### Not: `GM_closeNotification` ve `GM_updateNotification` ScriptCat'e özgüdür. Bir bildirimi güncellemek için `tag` kullanın.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // ilerlemeyi günceller
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // 1ms sonra kapanır
```

### GM_setClipboard \*

Panoyu ayarlar. Tampermonkey'den farklı olarak bir geri çağırma henüz desteklenmez.

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

* CSP'yi atlayabilen, `@connect` ile bildirilen alan adlarını destekleyen çapraz kaynaklı bir HTTP isteğidir. Bazı işlevler eksiktir; çerez özelliği şu anda Firefox'ta desteklenmez. Normal erişim için kullanıcı yetkilendirmesi gerekir; `@connect` ile tanımlanan bir konak, kullanıcı yetkilendirmesini atlayabilir.

* `anonymous` ve `cookie`, Tampermonkey'den farklı şekilde işlenir: `anonymous` true olduğunda ve `cookie` mevcut olduğunda, başka hiçbir çerez eklenmeden yalnızca belirtilen çerez gönderilir.

* Özel başlıklar da desteklenir:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream, geçerli sürümde oldukça temel bir uygulamadır
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // Tampermonkey ile tutarlı kalmak için maxRedirects, v0.17.0 sonrasında redirect lehine kullanımdan kaldırıldı; redirect, fetch modunu zorlar
    
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

* Başlıklar ve diğer seçenekler yapılandırılabilir şekilde bir dosya indirir; Tampermonkey'e kıyasla cookie ve anonymous seçeneklerini de destekler. Bir blob URL verilirse, indirmeyi doğrudan açar ve yalnızca `onload` olayını tetikler — bu Tampermonkey'den farklıdır ve başka türlü indirme oluşturamayan arka plan betiklerini desteklemek için vardır (rapor oluşturma gibi senaryolar için kullanışlıdır).
* Bir Promise nesnesi döndürür ve bir `abort()` yöntemi sağlar.
* Tampermonkey'den farklı olarak ScriptCat'in `native` indirme modu (varsayılan) `@connect` değerini dikkate alır: indirme URL'sinin konağı betiğin `@connect` bildirimleriyle kapsanmadığında, ScriptCat indirmeden önce kullanıcıdan onay ister; `@connect` ile kapsanan konaklar sessizce indirilir ve kara listedeki konaklar her zaman reddedilir. `browser` indirme modu bu kontrole tabi değildir. (Tampermonkey'de `@connect` yalnızca `GM_xmlhttpRequest` için geçerlidir, `GM_download` için değil.)

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
// Geri çağırma biçimi
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Sayfa çerezleri üzerinde zaman uyumsuz olarak işlem yapar; çapraz kaynaklı, HttpOnly ve bölümlenmiş çerezleri destekler.

> v0.17.0-alpha sonrasında `store` ve `tabid` ile ilgili parametreler kaldırıldı; ScriptCat artık şu anda bulunduğu pencereye göre çerezleri gizli veya normal pencereden alıp almayacağına karar verir.

İşlem yapılan konağı `@connect` ile bildirmelisiniz ve kullanmak için kullanıcı yetkilendirmesi gerektirir. Tampermonkey'in `GM_cookie.list` işlemiyle uyumlu olsa da, tutarlılık açısından bu önerilmez.

* `sameSite` desteklenmez.

```typescript
// name ve domain aynı anda boş olamaz
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

// Geri çağırma biçimi
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

// Promise biçimi
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**Not**: Meta verilerde izin verilen alan adını `@connect example.com` kullanarak bildirmelisiniz.
