---
title: API Dokumentation
---

## Überblick

Die API-Definitionen dieser Erweiterung basieren auf der [Tampermonkey-Dokumentation](https://www.tampermonkey.net/documentation.php). Aufgrund von Zeit- und Aufwandsbeschränkungen wurde bisher nur ein Teil der API implementiert, und sie wird weiter iteriert. Jede API, die diese Erweiterung erweitert oder sich von der ursprünglichen GM-API unterscheidet, wird in der Dokumentation speziell markiert (mit `*`). Einige APIs bieten auch eine synchrone Gegenstelle gemäß der Regel `GM.*`.

Für detaillierte API-Definitionen siehe `scriptcat.d.ts` oder die integrierten Editor-Hinweise, da die Dokumentation nicht immer aktuell sein muss. Für APIs, die speziell für diese Erweiterung sind, siehe die [CatApi-Dokumentation](cat-api.md).

Verwandte Beispiele finden Sie im [Beispielverzeichnis](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definitionen

### GM_info

Ruft Informationen über das Skript ab, einschließlich Metadaten und Runtime-Umgebungsparameter. Häufig verwendete Felder sind `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` usw.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` hatcurrently nur den Wert `raw`. `runAt` wird nicht unterstützt. `userAgentData` wird unterstützt, stimmt aber möglicherweise nicht genau mit Tampermonkey überein.
* `userLanguage` (v1.5+) ist die aktuelle Oberflächensprache von ScriptCat, z. B. `"zh-CN"`, `"en-US"`, `"ja-JP"`, sodass ein Skript seine eigene Anzeigesprache danach wählen kann. Der Wert wird beim Start des Skripts festgelegt; ein `@early-start`-Skript kann beim synchronen Lesen eine leere Zeichenkette erhalten – lesen Sie ihn daher nach `CAT_scriptLoaded()`.

### GM_log \*

Logfunktion. Logs eines Hintergrundskripts können im Dashboard unter Ausführungslog angesehen werden. Im Vergleich zu Tampermonkey wurde ein Log-`level` hinzugefügt.

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

Ruft einen Wert aus dem Speicher ab oder setzt ihn. Daten unter demselben [**storageName**](meta.md#storagename-) können geteilt und in Echtzeit synchronisiert werden.

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

#### Hinweis: Wenn `GM_setValue` mit `undefined` aufgerufen wird, löscht ScriptCat diesen Schlüssel, anders als Tampermonkey/GreaseMonkey, der `undefined` als Wert speichert.

#### Hinweis: Da Datenoperationen asynchron sind, kann ein sofortiger Aufruf von `window.close()` nach `GM_setValue` oder `GM_deleteValue` verhindern, dass die Daten korrekt aktualisiert werden. Es wird empfohlen, `await GM.setValue` oder `await GM.deleteValue` zu verwenden.

### GM_listValues

Listet alle Schlüssel auf.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Batch-Get/Set-APIs (Erweiterung).

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

> `tabid` wurde nach 0.17.0-alpha entfernt.

Hört auf Änderungen eines Werts. `add` gibt eine Listener-ID zurück, `remove` kann zum Abbrechen verwendet werden. Diese Methode kann zur einfachen Kommunikation verwendet werden; mit [**storageName**](meta.md#storagename-) ist Skript-übergreifende Kommunikation möglich.

```typescript
type ValueChangeListener = (
  name: string, oldValue: any, newValue: any, remote: boolean, tabid?: number
) => any;

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

Ruft Ressourceninformationen ab, die mit `@resource` deklariert wurden.

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Fügt ein Element in die Seite ein. Kann CSP-Beschränkungen umgehen.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Fügt einen Stil zur Seite hinzu und gibt den Style-DOM-Knoten zurück. Kann CSP-Beschränkungen umgehen.

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

Öffnet ein neues Fenster.

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

Eine Methode zum Speichern von Daten, ähnlich wie `GM_setValue`, aber die Lebensdauer dieser Methode ist an den Offen→Schließen-Zyklus eines einzelnen Browsertabs gebunden und kann nicht aus einem Hintergrundskript verwendet werden.

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

* Registriert ein Menüelement, das auf der Popup-Seite und im Kontextmenü erscheint.
* Standardmäßig werden Menüelemente mit demselben angezeigten Text nur einmal angezeigt.
* Durch Angabe einer `id` können Menüelemente aktualisiert werden.

```typescript
function GM_registerMenuCommand(
  name: string, listener?: (inputValue?: any) => void,
  options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Entfernt ein registriertes Menüelement anhand seiner ID.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
```

### GM_notification \*

Sendet eine Benachrichtigung und bietet `progress`- und `buttons`-Funktionen (nicht in Firefox unterstützt). Bietet auch `GM_closeNotification` und `GM_updateNotification` (nicht in Firefox unterstützt).

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

#### Hinweis: `GM_closeNotification` und `GM_updateNotification` sind ScriptCat-spezifisch. Verwenden Sie `tag` zum Aktualisieren.

```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1});
```

### GM_setClipboard \*

Setzt die Zwischenablage. Ein Callback wird noch nicht unterstützt.

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* Eine Cross-Origin HTTP-Anfrage, die CSP umgehen kann. Benutzerautorisierung ist für normalen Zugriff erforderlich; von `@connect` beschriebene Hosts können die Autorisierung überspringen.

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

* Lädt eine Datei herunter. Unterstützt auch Cookie- und anonymous-Optionen. Gibt ein Promise-Objekt zurück und bietet eine `abort()`-Methode.

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Arbeitet asynchron mit Seiten-Cookies, unterstützt Cross-Origin, HttpOnly und partitionierte Cookies.

> Nach v0.17.0-alpha wurden die `store`- und `tabid`-bezogenen Parameter entfernt.

Der betriebene Host muss mit `@connect` deklariert werden und erfordert eine Benutzerautorisierung.

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**Hinweis**: Sie müssen die erlaubte Domain in den Metadaten mit `@connect example.com` deklarieren.
