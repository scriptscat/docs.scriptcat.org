---
title: Documentazione API
---

## Panoramica

Le definizioni API di questa estensione si basano sulla [documentazione di Tampermonkey](https://www.tampermonkey.net/documentation.php). Solo parte dell'API è stata implementata finora, e continuerà a iterare. Ogni API che questa estensione estende o che differisce dall'API GM originale è contrassegnata nella documentazione (usando `*`). Alcune API forniscono anche una controparte stile sincrono seguendo la regola `GM.*`.

Per le definizioni API dettagliate, consultare `scriptcat.d.ts` o gli hint integrati dell'editor. Per le API specifiche di questa estensione, consultare la [Documentazione CatApi](cat-api.md).

Esempi correlati sono disponibili nella [directory degli esempi](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definizioni

### GM_info

Ottiene informazioni sullo script, inclusi metadati e parametri dell'ambiente di esecuzione.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` attualmente ha solo il valore `raw`. `runAt` non è supportato.
* `userLanguage` (v1.5+) è la lingua corrente dell'interfaccia di ScriptCat, ad esempio `"zh-CN"`, `"en-US"`, `"ja-JP"`, così uno script può scegliere la propria lingua di visualizzazione. Il valore viene fissato all'avvio dello script; uno script `@early-start` può ottenere una stringa vuota leggendolo in modo sincrono, quindi lo legga dopo `CAT_scriptLoaded()`.

### GM_log \*

Funzione di logging. I log di uno script di background possono essere visualizzati nel log di esecuzione della dashboard.

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

Ottiene o imposta un valore nell'archivio. I dati sotto lo stesso [**storageName**](meta.md#storagename-) possono essere condivisi e sincronizzati in tempo reale.

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

#### Nota: Quando `GM_setValue` viene chiamato con `undefined`, ScriptCat elimina quella chiave, a differenza di Tampermonkey/GreaseMonkey che memorizza `undefined` come valore.

#### Nota: Poiché le operazioni sui dati sono asincrone, chiamare `window.close()` immediatamente dopo `GM_setValue` o `GM_deleteValue` può impedire l'aggiornamento corretto dei dati. Si consiglia di usare `await GM.setValue` o `await GM.deleteValue`.

### GM_listValues

Elenca tutte le chiavi.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

API batch get/set (estensione).

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

> `tabid` è stato rimosso dopo 0.17.0-alpha.

Ascolta i cambiamenti di un valore. `add` restituisce un ID listener, `remove` può essere usato per annullare.

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

Ottiene le informazioni sulle risorse dichiarate con `@resource`.

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Inserisce un elemento nella pagina. Può aggirare le restrizioni CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Aggiunge uno stile alla pagina e restituisce il nodo DOM dello stile. Può aggirare le restrizioni CSP.

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

### GM_openInTab \*

Apre una nuova finestra.

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

Un metodo per memorizzare dati simile a `GM_setValue`, ma il ciclo di vita di questo metodo è legato al ciclo apri→chiudi di una singola scheda del browser.

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

* Registra una voce di menu che appare nella pagina popup e nel menu contestuale.
* Per impostazione predefinita, le voci di menu con lo stesso testo visualizzato appaiono solo una volta.
* Specificando un `id` è possibile aggiornare la voce.

```typescript
function GM_registerMenuCommand(name: string, listener?: (inputValue?: any) => void, options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string): number;
```

### GM_unregisterMenuCommand

Rimuove una voce di menu registrata tramite il suo ID.

```typescript
declare function GM_unregisterCommand(id: number): void;
```

### GM_notification \*

Invia un messaggio di notifica, fornendo funzionalità `progress` e `buttons`. Fornisce anche `GM_closeNotification` e `GM_updateNotification`.

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

#### Nota: `GM_closeNotification` e `GM_updateNotification` sono specifici di ScriptCat. Usa `tag` per aggiornare.

### GM_setClipboard \*

Imposta gli appunti. Il callback non è ancora supportato.

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* Una richiesta HTTP cross-origin che può aggirare CSP. È necessaria l'autorizzazione utente; gli host descritti da `@connect` possono saltare l'autorizzazione.

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

* Scarica un file. Restituisce un oggetto Promise e fornisce un metodo `abort()`.

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Opera asincronamente sui cookie della pagina, supportando cookie cross-origin, HttpOnly e suddivisi.

> Dopo v0.17.0-alpha, i parametri relativi a `store` e `tabid` sono stati rimossi.

L'host operato deve essere dichiarato con `@connect` e richiede l'autorizzazione dell'utente.

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**Nota**: È necessario dichiarare il dominio consentito nei metadati usando `@connect example.com`.
