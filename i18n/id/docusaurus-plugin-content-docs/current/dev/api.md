---
title: Dokumentasi API
---

## Ringkasan

Definisi API ekstensi ini didasarkan pada [dokumentasi Tampermonkey](https://www.tampermonkey.net/documentation.php). Karena keterbatasan waktu dan tenaga, hanya sebagian API yang telah diimplementasikan sejauh ini, dan akan terus diiterasi. API apa pun yang diperluas ekstensi ini atau yang berbeda dari API GM asli ditandai secara khusus dalam dokumentasi (menggunakan `*`). Beberapa API juga menyediakan padanan bergaya sinkron mengikuti aturan `GM.*` — lihat isi dokumentasi untuk detailnya.

Untuk definisi API yang terperinci, lihat `scriptcat.d.ts` atau petunjuk editor bawaan, karena dokumentasi mungkin tidak selalu terbaru. Untuk API khusus ekstensi ini, lihat [Dokumentasi CatApi](cat-api.md).

Anda juga dapat menemukan contoh terkait di [direktori contoh](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definisi

### GM_info

Mendapatkan informasi tentang skrip, termasuk metadata dan parameter lingkungan runtime. Bidang yang umum digunakan meliputi `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode`, dan lainnya. Lihat `scriptcat.d.ts` untuk definisi terperinci (meskipun tidak lengkap).

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` saat ini hanya memiliki nilai `raw`. `runAt` tidak didukung. `userAgentData` didukung, tetapi mungkin tidak persis cocok dengan Tampermonkey.
* `userLanguage` (v1.5+) adalah bahasa antarmuka ScriptCat saat ini, misalnya `"zh-CN"`, `"en-US"`, `"ja-JP"`, sehingga skrip dapat memilih bahasa tampilannya sendiri. Nilainya ditetapkan saat skrip dimulai; skrip `@early-start` mungkin mendapat string kosong saat membacanya secara sinkron, jadi bacalah setelah `CAT_scriptLoaded()`.

### GM_log \*

Fungsi pencatatan log. Log skrip latar belakang dapat dilihat di log berjalan dasbor (klik kolom status berjalan). Dibandingkan dengan Tampermonkey, `level` log telah ditambahkan.

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

Mendapatkan atau mengatur nilai di penyimpanan. Data di bawah [**storageName**](meta.md#storagename-) yang sama dapat dibagikan dan disinkronkan secara waktu nyata.

```typescript
// Tambahkan data — perhatikan bahwa data hanya dapat berupa salah satu dari bool/string/number/object; Anda tidak dapat menyimpan instance kelas
declare function GM_setValue(name: string, value: any): void;
// Dapatkan data
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Hapus data; mendapatkannya lagi mengembalikan undefined atau defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Catatan: Saat `GM_setValue` dipanggil dengan `undefined`, ScriptCat menghapus kunci tersebut, tidak seperti Tampermonkey/GreaseMonkey, yang menyimpan `undefined` sebagai nilainya.

#### Catatan: Karena operasi data bersifat asinkron, memanggil `window.close()` segera setelah `GM_setValue` atau `GM_deleteValue` dapat mencegah data diperbarui dengan benar. Disarankan menggunakan `await GM.setValue` atau `await GM.deleteValue` untuk memastikan operasi data selesai.

### GM_listValues

Mendaftar semua kunci.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

API get/set batch (ekstensi).

```typescript
// Mengatur beberapa nilai; values adalah objek yang kuncinya adalah nama nilai dan nilainya adalah isi nilai
declare function GM_setValues(values: { [key: string]: any }): void;
// Mendapatkan beberapa nilai; jika keysOrDefaults adalah objek, nilainya digunakan sebagai bawaan
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Menghapus beberapa nilai; names adalah array string
declare function GM_deleteValues(names: string[]): void;
```

```js
// Set batch
GM_setValues({ a: 1, b: 2 });
// Get batch (mengembalikan bawaan jika tidak ada)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Hapus batch
GM_deleteValues(["a", "b"]);
```

#### Catatan: Karena operasi data bersifat asinkron, memanggil `window.close()` segera setelah `GM_setValues` atau `GM_deleteValues` dapat mencegah data diperbarui dengan benar. Disarankan menggunakan `await GM.setValues` atau `await GM.deleteValues` untuk memastikan operasi data selesai.

### GM_add/removeValueChangeListener

> `tabid` dihapus setelah 0.17.0-alpha — lihat [GM_cookie](#gm_cookie-) untuk detailnya.

Mendengarkan perubahan nilai. `add` mengembalikan id pendengar, dan `remove` dapat digunakan untuk membatalkan pendengar. Metode ini dapat digunakan untuk mengimplementasikan komunikasi sederhana; menggunakan [**storageName**](meta.md#storagename-) memungkinkan komunikasi lintas skrip.

```typescript
// tabid hanya ada saat mendengarkan dari skrip latar belakang
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

Mendapatkan informasi sumber daya yang dideklarasikan dengan `@resource`.

```typescript
// GM_getResourceText mendapatkan data teks sumber daya; data tipe byte seperti gambar mengembalikan string kosong — gunakan GM_getResourceURL untuk itu
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL mendapatkan data berenkode base64; URL blob juga dapat diperoleh melalui parameter kedua
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Menyisipkan elemen ke halaman. Dapat melewati pembatasan CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Sisipkan skrip
GM_addElement("script", { src: "https://example.com/app.js" });
// Sisipkan gaya
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Menambahkan gaya ke halaman dan mengembalikan node DOM gaya. Dapat melewati pembatasan CSP.

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

Membuka jendela baru.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Menentukan apakah tab baru mendapat fokus saat dibuka.
     *
     * - `true` → tab baru segera dialihkan ke latar depan.
     * - `false` → tab baru terbuka di latar belakang, tanpa mengambil fokus dari halaman saat ini.
     *
     * Bawaan: true
     */
    active?: boolean;

    /**
     * Menentukan tempat tab baru disisipkan.
     *
     * - Jika `boolean`:
     *   - `true` → disisipkan tepat setelah tab saat ini.
     *   - `false` → disisipkan di akhir jendela.
     * - Jika `number`:
     *   - `0` → disisipkan satu posisi sebelum tab saat ini.
     *   - `1` → disisipkan satu posisi setelah tab saat ini.
     *
     * Bawaan: true
     */
    insert?: boolean | number;

    /**
     * Menentukan apakah tab induk (yaitu `openerTabId`) diatur.
     *
     * - `true` → browser dapat melacak tab mana yang membuka tab anak,
     *   yang membantu beberapa ekstensi (seperti pengelola pohon tab) mengidentifikasi hubungan induk/anak.
     *
     * Bawaan: true
     */
    setParent?: boolean;

    /**
     * Apakah membuka tab di jendela privat (penyamaran).
     *
     * Catatan: manifest.json ScriptCat mengatur `"incognito": "split"`,
     * jadi saat berjalan di jendela normal, tabId/windowId tidak akan
     * tersedia, dan hanya aksi "buka tab baru" yang dapat dilakukan.
     *
     * Bawaan: false
     */
    incognito?: boolean;

    /**
     * Bidang kompatibilitas lama, hanya didukung oleh Tampermonkey.
     * Artinya **kebalikan** dari `active`:
     *
     * - `true` → setara dengan `active = false` (dimuat di latar belakang).
     * - `false` → setara dengan `active = true` (dimuat di latar depan).
     *
     * ⚠️ Tidak disarankan: tumpang tindih dengan `active` dan mudah membingungkan.
     *
     * Bawaan: false
     * @deprecated Gunakan `active` sebagai gantinya
     */
    loadInBackground?: boolean;

    /**
     * Apakah menyematkan tab baru ke sisi kiri bilah tab browser.
     *
     * - `true` → tab baru disematkan.
     * - `false` → tab biasa.
     *
     * Bawaan: false
     */
    pinned?: boolean;

    /**
     * Menggunakan `window.open` untuk membuka tab baru alih-alih `chrome.tabs.create`.
     * Berguna saat membuka tautan dengan protokol khusus tertentu, mis. `vscode://`, `m3u8dl://`.
     * Parameter lain tidak berpengaruh saat menggunakan metode buka ini.
     *
     * Terkait: Issue #178 #1043
     * Bawaan: false
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

Menutup tab yang dibuka oleh `GM_openInTab`.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

Metode penyimpanan data yang mirip dengan `GM_setValue`, tetapi masa hidup metode ini terikat pada siklus buka→tutup satu tab browser, dan tidak dapat digunakan dari skrip latar belakang.

```typescript
// Dapatkan data tab
declare function GM_getTab(callback: (obj: object) => void): void;
// Simpan data tab
declare function GM_saveTab(obj: object): void;
// Dapatkan data semua tab
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Mendaftarkan item menu yang muncul di halaman popup dan menu klik kanan; mengkliknya memanggil fungsi `listener`.
* Secara bawaan, menyesuaikan Tampermonkey, item menu dengan teks tampilan yang sama hanya ditampilkan sekali.
* Menentukan `id` memungkinkan Anda memperbarui item menu.
* Jika `name` adalah string kosong dan tidak ada `listener`, garis pemisah ditambahkan ke menu klik kanan.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // Opsi khusus ScriptCat; bawaan true, dan false menjaga halaman menu popup tetap terbuka setelah diklik
        nested?: boolean; // Opsi khusus ScriptCat; bawaan true, dan false menaikkan item menu klik kanan browser dari menu tingkat ketiga ke tingkat kedua
        individual?: boolean; // Opsi khusus ScriptCat; bawaan false, dan true berarti item menu yang identik tidak digabungkan
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Menghapus item menu terdaftar berdasarkan id-nya.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Mengirim pesan notifikasi, menyediakan kemampuan `progress` dan `buttons` (tidak didukung di Firefox), sehingga notifikasi dapat menampilkan bilah kemajuan atau tombol. Juga menyediakan dua metode tambahan, `GM_closeNotification` dan `GM_updateNotification` (tidak didukung di Firefox).

[contoh](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // Maksimal 2 dapat ada
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

#### Catatan: `GM_closeNotification` dan `GM_updateNotification` khusus ScriptCat. Untuk memperbarui notifikasi, gunakan `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // memperbarui kemajuannya
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // menutup setelah 1ms
```

### GM_setClipboard \*

Mengatur clipboard. Callback belum didukung, tidak seperti Tampermonkey.

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

* Permintaan HTTP lintas origin yang dapat melewati CSP, mendukung domain yang dideklarasikan dengan `@connect`. Beberapa fungsionalitas hilang; fitur cookie saat ini tidak didukung di Firefox. Otorisasi pengguna diperlukan untuk akses normal; host yang dijelaskan oleh `@connect` dapat melewati otorisasi pengguna.

* `anonymous` dan `cookie` ditangani berbeda dari Tampermonkey: saat `anonymous` true dan `cookie` ada, hanya cookie yang ditentukan yang dikirim, tanpa cookie lain yang dilampirkan.

* Header khusus juga didukung:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream adalah implementasi yang cukup dasar di versi saat ini
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // agar konsisten dengan Tampermonkey, maxRedirects tidak digunakan lagi setelah v0.17.0 demi redirect, yang memaksa mode fetch
    
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

* Mengunduh file, dengan header dan opsi lain yang dapat dikonfigurasi; dibandingkan dengan Tampermonkey juga mendukung opsi cookie dan anonymous. Jika diberi URL blob, ia langsung membuka unduhan dan hanya memicu peristiwa `onload` — ini berbeda dari Tampermonkey dan ada untuk mendukung skrip latar belakang, yang tidak dapat membuat unduhan dengan cara lain (berguna untuk skenario seperti menghasilkan laporan).
* Mengembalikan objek Promise dan menyediakan metode `abort()`.
* Tidak seperti Tampermonkey, mode unduhan `native` ScriptCat (bawaan) menghormati `@connect`: saat host URL unduhan tidak tercakup oleh deklarasi `@connect` skrip, ScriptCat meminta konfirmasi pengguna sebelum mengunduh; host yang tercakup oleh `@connect` mengunduh secara senyap, dan host yang masuk daftar hitam selalu ditolak. Mode unduhan `browser` tidak tunduk pada pemeriksaan ini. (Di Tampermonkey, `@connect` hanya berlaku untuk `GM_xmlhttpRequest`, bukan `GM_download`.)

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
// Bentuk callback
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Mengoperasikan cookie halaman secara asinkron, mendukung cookie lintas origin, HttpOnly, dan terpartisi.

> Setelah v0.17.0-alpha, parameter terkait `store` dan `tabid` dihapus; ScriptCat sekarang memutuskan apakah akan mendapatkan cookie dari jendela penyamaran atau normal berdasarkan jendela tempatnya berada saat ini.

Anda harus mendeklarasikan host yang dioperasikan dengan `@connect`, dan memerlukan otorisasi pengguna untuk menggunakannya. Meskipun kompatibel dengan operasi `GM_cookie.list` Tampermonkey, ini tidak disarankan, demi konsistensi.

* `sameSite` tidak didukung.

```typescript
// name dan domain tidak boleh keduanya kosong
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

// Bentuk callback
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

// Bentuk Promise
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**Catatan**: Anda harus mendeklarasikan domain yang diizinkan di metadata menggunakan `@connect example.com`.
