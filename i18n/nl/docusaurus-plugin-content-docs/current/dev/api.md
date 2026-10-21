---
title: API-documentatie
---

## Overzicht

De API-definities van deze extensie zijn gebaseerd op de [Tampermonkey-documentatie](https://www.tampermonkey.net/documentation.php). Vanwege tijds- en inspanningsbeperkingen is tot nu toe slechts een deel van de API geïmplementeerd en deze zal blijven evolueren. Elke API die deze extensie uitbreidt of die afwijkt van de oorspronkelijke GM-API is speciaal gemarkeerd in de documentatie (met een `*`). Sommige API's bieden ook een synchroon-achtige tegenhanger die de regel `GM.*` volgt — zie de documentatie-inhoud voor details.

Voor de gedetailleerde API-definities, zie `scriptcat.d.ts` of de ingebouwde editorhints, aangezien de documentatie mogelijk niet altijd up-to-date is. Voor API's die specifiek zijn voor deze extensie, zie de [CatApi-documentatie](cat-api.md).

U kunt ook gerelateerde voorbeelden vinden in de [voorbeeldmap](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definities

### GM_info

Haalt informatie over het script op, inclusief metadata en runtime-omgevingsparameters. Veelgebruikte velden zijn `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` en meer. Zie `scriptcat.d.ts` voor de gedetailleerde (hoewel niet uitputtende) definitie.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` heeft momenteel alleen de waarde `raw`. `runAt` wordt niet ondersteund. `userAgentData` wordt ondersteund, maar komt mogelijk niet exact overeen met Tampermonkey.
* `userLanguage` (v1.5+) is de huidige interfacetaal van ScriptCat, bijvoorbeeld `"zh-CN"`, `"en-US"`, `"ja-JP"`, zodat een script zijn eigen weergavetaal kan kiezen. De waarde wordt vastgelegd bij het starten van het script; een `@early-start`-script kan bij synchroon lezen een lege string krijgen, lees de waarde daarom na `CAT_scriptLoaded()`.

### GM_log \*

Logfunctie. De logs van een achtergrondscript kunnen worden bekeken in het uitvoeringslogboek van het dashboard (klik op de uitvoeringsstatuskolom). In vergelijking met Tampermonkey is een log-`level` toegevoegd.

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

Haalt een waarde op uit de opslag of stelt deze in. Gegevens onder dezelfde [**storageName**](meta.md#storagename-) kunnen in realtime worden gedeeld en gesynchroniseerd.

```typescript
// Gegevens toevoegen — houd er rekening mee dat gegevens slechts één van bool/string/number/object kunnen zijn; u kunt geen klasse-instantie opslaan
declare function GM_setValue(name: string, value: any): void;
// Gegevens ophalen
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// Gegevens verwijderen; opnieuw ophalen retourneert undefined of defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Opmerking: Wanneer `GM_setValue` wordt aangeroepen met `undefined`, verwijdert ScriptCat die sleutel, in tegenstelling tot Tampermonkey/GreaseMonkey, die `undefined` als waarde opslaat.

#### Opmerking: Omdat gegevensbewerkingen asynchroon zijn, kan het aanroepen van `window.close()` onmiddellijk na `GM_setValue` of `GM_deleteValue` voorkomen dat de gegevens correct worden bijgewerkt. Het wordt aanbevolen om `await GM.setValue` of `await GM.deleteValue` te gebruiken om ervoor te zorgen dat de gegevensbewerking wordt voltooid.

### GM_listValues

Geeft alle sleutels weer.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

Batch-get/set-API's (extensie).

```typescript
// Stelt meerdere waarden in; values is een object waarvan de sleutels de waardenamen zijn en de waarden de inhoud van de waarden
declare function GM_setValues(values: { [key: string]: any }): void;
// Haalt meerdere waarden op; als keysOrDefaults een object is, worden de waarden ervan als standaardwaarden gebruikt
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// Verwijdert meerdere waarden; names is een array van strings
declare function GM_deleteValues(names: string[]): void;
```

```js
// Batch instellen
GM_setValues({ a: 1, b: 2 });
// Batch ophalen (retourneert de standaardwaarde indien niet aanwezig)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// Batch verwijderen
GM_deleteValues(["a", "b"]);
```

#### Opmerking: Omdat gegevensbewerkingen asynchroon zijn, kan het aanroepen van `window.close()` onmiddellijk na `GM_setValues` of `GM_deleteValues` voorkomen dat de gegevens correct worden bijgewerkt. Het wordt aanbevolen om `await GM.setValues` of `await GM.deleteValues` te gebruiken om ervoor te zorgen dat de gegevensbewerking wordt voltooid.

### GM_add/removeValueChangeListener

> `tabid` is verwijderd na 0.17.0-alpha — zie [GM_cookie](#gm_cookie-) voor details.

Luistert naar wijzigingen van een waarde. `add` retourneert een luisteraar-ID en `remove` kan worden gebruikt om de luisteraar te annuleren. Deze methode kan worden gebruikt om eenvoudige communicatie te implementeren; het gebruik van [**storageName**](meta.md#storagename-) maakt communicatie tussen scripts mogelijk.

```typescript
// tabid is alleen aanwezig wanneer er vanuit een achtergrondscript wordt geluisterd
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

Haalt resource-informatie op die is gedeclareerd met `@resource`.

```typescript
// GM_getResourceText haalt de tekstgegevens van de resource op; byte-type gegevens zoals afbeeldingen retourneren een lege string — gebruik daarvoor GM_getResourceURL
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL haalt base64-gecodeerde gegevens op; een blob-URL kan ook worden verkregen via de tweede parameter
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Voegt een element in de pagina in. Kan CSP-beperkingen omzeilen.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// Een script invoegen
GM_addElement("script", { src: "https://example.com/app.js" });
// Een stijl invoegen
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Voegt een stijl toe aan de pagina en retourneert het stijl-DOM-knooppunt. Kan CSP-beperkingen omzeilen.

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

Opent een nieuw venster.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * Bepaalt of het nieuwe tabblad focus krijgt wanneer het wordt geopend.
     *
     * - `true` → het nieuwe tabblad wordt onmiddellijk naar de voorgrond geschakeld.
     * - `false` → het nieuwe tabblad wordt op de achtergrond geopend, zonder focus van de huidige pagina af te nemen.
     *
     * Standaard: true
     */
    active?: boolean;

    /**
     * Bepaalt waar het nieuwe tabblad wordt ingevoegd.
     *
     * - Indien een `boolean`:
     *   - `true` → ingevoegd direct na het huidige tabblad.
     *   - `false` → ingevoegd aan het einde van het venster.
     * - Indien een `number`:
     *   - `0` → ingevoegd één positie vóór het huidige tabblad.
     *   - `1` → ingevoegd één positie na het huidige tabblad.
     *
     * Standaard: true
     */
    insert?: boolean | number;

    /**
     * Bepaalt of het bovenliggende tabblad (d.w.z. `openerTabId`) wordt ingesteld.
     *
     * - `true` → de browser kan bijhouden welk tabblad het onderliggende tabblad heeft geopend,
     *   wat sommige extensies (zoals tab-tree-managers) helpt om bovenliggende/onderliggende relaties te identificeren.
     *
     * Standaard: true
     */
    setParent?: boolean;

    /**
     * Of het tabblad in een privévenster (incognito) moet worden geopend.
     *
     * Opmerking: het manifest.json van ScriptCat stelt `"incognito": "split"` in,
     * dus wanneer u in een normaal venster draait, zijn tabId/windowId niet
     * beschikbaar en kan alleen de actie "nieuw tabblad openen" worden uitgevoerd.
     *
     * Standaard: false
     */
    incognito?: boolean;

    /**
     * Compatibiliteitsveld uit het verleden, alleen ondersteund door Tampermonkey.
     * De betekenis ervan is het **tegenovergestelde** van `active`:
     *
     * - `true` → gelijk aan `active = false` (laadt op de achtergrond).
     * - `false` → gelijk aan `active = true` (laadt op de voorgrond).
     *
     * ⚠️ Niet aanbevolen: overlapt met `active` en is gemakkelijk te verwarren.
     *
     * Standaard: false
     * @deprecated Gebruik in plaats daarvan `active`
     */
    loadInBackground?: boolean;

    /**
     * Of het nieuwe tabblad aan de linkerkant van de tabbladbalk van de browser moet worden vastgezet.
     *
     * - `true` → het nieuwe tabblad wordt vastgezet.
     * - `false` → een gewoon tabblad.
     *
     * Standaard: false
     */
    pinned?: boolean;

    /**
     * Gebruikt `window.open` om het nieuwe tabblad te openen in plaats van `chrome.tabs.create`.
     * Handig bij het openen van links met bepaalde speciale protocollen, bv. `vscode://`, `m3u8dl://`.
     * Andere parameters hebben geen effect bij gebruik van deze open-methode.
     *
     * Gerelateerd: Issue #178 #1043
     * Standaard: false
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

Sluit een tabblad dat is geopend door `GM_openInTab`.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

Een methode voor het opslaan van gegevens vergelijkbaar met `GM_setValue`, maar de levensduur van deze methode is gekoppeld aan de open→sluit-cyclus van één browsertabblad en kan niet vanuit een achtergrondscript worden gebruikt.

```typescript
// Tabbladgegevens ophalen
declare function GM_getTab(callback: (obj: object) => void): void;
// Tabbladgegevens opslaan
declare function GM_saveTab(obj: object): void;
// Gegevens van alle tabbladen ophalen
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Registreert een menu-item dat verschijnt in de pop-up-pagina en het rechtsklikmenu; klikken roept de `listener`-functie aan.
* Standaard, overeenkomend met Tampermonkey, worden menu-items met dezelfde weergegeven tekst slechts één keer getoond.
* Het opgeven van een `id` maakt het mogelijk het menu-item bij te werken.
* Als `name` een lege string is en er geen `listener` is, wordt een scheidingslijn aan het rechtsklikmenu toegevoegd.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat-specifieke optie; standaard true, en false houdt de pop-upmenu-pagina open na het klikken
        nested?: boolean; // ScriptCat-specifieke optie; standaard true, en false verheft het menu-item van het rechtsklikmenu van een derde-niveau naar een tweede-niveau menu
        individual?: boolean; // ScriptCat-specifieke optie; standaard false, en true betekent dat identieke menu-items niet worden samengevoegd
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

Verwijdert een geregistreerd menu-item op basis van de id.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Verzendt een meldingsbericht, met `progress`- en `buttons`-mogelijkheden (niet ondersteund in Firefox), zodat een melding een voortgangsbalk of knoppen kan tonen. Biedt ook twee extra methoden, `GM_closeNotification` en `GM_updateNotification` (niet ondersteund in Firefox).

[voorbeeld](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // Maximaal 2 kunnen bestaan
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

#### Opmerking: `GM_closeNotification` en `GM_updateNotification` zijn ScriptCat-specifiek. Gebruik `tag` om een melding bij te werken.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // werkt de voortgang bij
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // sluit na 1ms
```

### GM_setClipboard \*

Stelt het klembord in. Een callback wordt nog niet ondersteund, in tegenstelling tot Tampermonkey.

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

* Een cross-origin HTTP-verzoek dat CSP kan omzeilen en domeinen ondersteunt die zijn gedeclareerd met `@connect`. Sommige functionaliteit ontbreekt; de cookie-functie wordt momenteel niet ondersteund in Firefox. Gebruikersautorisatie is vereist voor normale toegang; een host die door `@connect` wordt beschreven, kan gebruikersautorisatie overslaan.

* `anonymous` en `cookie` worden anders behandeld dan bij Tampermonkey: wanneer `anonymous` waar is en `cookie` aanwezig is, wordt alleen de opgegeven cookie verzonden, zonder andere bijgevoegde cookies.

* Speciale headers worden ook ondersteund:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream is een vrij eenvoudige implementatie in de huidige versie
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // om consistent te blijven met Tampermonkey, is maxRedirects na v0.17.0 verouderd ten gunste van redirect, die de fetch-modus forceert
    
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

* Downloadt een bestand, met configureerbare headers en andere opties; in vergelijking met Tampermonkey ondersteunt het ook cookie- en anonymous-opties. Als er een blob-URL wordt gegeven, wordt de download direct geopend en wordt alleen de `onload`-gebeurtenis geactiveerd — dit verschilt van Tampermonkey en bestaat om achtergrondscripts te ondersteunen, die anders geen download kunnen maken (nuttig voor scenario's zoals het genereren van rapporten).
* Retourneert een Promise-object en biedt een `abort()`-methode.
* In tegenstelling tot Tampermonkey respecteert de `native`-downloadmodus van ScriptCat (de standaard) `@connect`: wanneer de host van de download-URL niet wordt gedekt door de `@connect`-declaraties van het script, vraagt ScriptCat de gebruiker om bevestiging vóór het downloaden; hosts die door `@connect` worden gedekt, downloaden stil en geblokkeerde hosts worden altijd geweigerd. De `browser`-downloadmodus is niet aan deze controle onderworpen. (Bij Tampermonkey geldt `@connect` alleen voor `GM_xmlhttpRequest`, niet voor `GM_download`.)

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
// Callback-vorm
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Werkt asynchroon op paginacookies en ondersteunt cross-origin-, HttpOnly- en gepartitioneerde cookies.

> Na v0.17.0-alpha zijn de parameters `store` en `tabid` verwijderd; ScriptCat beslist nu op basis van het venster waarin het zich bevindt of cookies uit het incognito- of normale venster moeten worden opgehaald.

U moet de bewerkte host declareren met `@connect` en er is gebruikersautorisatie vereist om het te gebruiken. Hoewel het compatibel is met de `GM_cookie.list`-bewerking van Tampermonkey, wordt dit niet aanbevolen, ter wille van de consistentie.

* `sameSite` wordt niet ondersteund.

```typescript
// name en domain kunnen niet beide leeg zijn
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

// Callback-vorm
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

// Promise-vorm
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**Opmerking**: u moet het toegestane domein in de metadata declareren met `@connect example.com`.
