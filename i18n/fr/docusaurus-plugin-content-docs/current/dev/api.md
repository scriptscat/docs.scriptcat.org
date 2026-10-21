---
title: Documentation API
---

## Vue d'ensemble

Les définitions API de cette extension sont basées sur la [documentation Tampermonkey](https://www.tampermonkey.net/documentation.php). En raison des contraintes de temps et d'efforts, seule une partie de l'API a été implémentée jusqu'à présent, et elle continuera d'évoluer. Toute API que cette extension étend ou qui diffère de l'API GM d'origine est spécialement marquée dans la documentation (avec un `*`). Certaines API fournissent également un équivalent de style synchrone suivant la règle `GM.*` — voir le contenu de la documentation pour plus de détails.

Pour les définitions API détaillées, voir `scriptcat.d.ts` ou les suggestions de l'éditeur intégré, car la documentation peut ne pas être toujours à jour. Pour les API spécifiques à cette extension, voir la [Documentation CatApi](cat-api.md).

Vous pouvez également trouver des exemples liés dans le [répertoire d'exemples](https://github.com/scriptscat/scriptcat/tree/main/example).

## Définitions

### GM_info

Obtient des informations sur le script, notamment les métadonnées et les paramètres de l'environnement d'exécution. Les champs couramment utilisés incluent `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode`, et plus encore. Voir `scriptcat.d.ts` pour la définition détaillée (bien que non exhaustive).

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` n'a actuellement que la valeur `raw`. `runAt` n'est pas pris en charge. `userAgentData` est pris en charge, mais peut ne pas correspondre exactement à Tampermonkey.
* `userLanguage` (v1.5+) est la langue actuelle de l'interface de ScriptCat, par exemple `"zh-CN"`, `"en-US"`, `"ja-JP"`, ce qui permet à un script de choisir sa propre langue d'affichage. La valeur est fixée au démarrage du script ; un script `@early-start` peut obtenir une chaîne vide en la lisant de manière synchrone, lisez-la donc après `CAT_scriptLoaded()`.

### GM_log \*

Fonction de journalisation. Les journaux d'un script en arrière-plan peuvent être consultés dans le journal d'exécution du tableau de bord (cliquez sur la colonne d'état d'exécution). Par rapport à Tampermonkey, un `level` de journal a été ajouté.

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

Obtient ou définit une valeur dans le stockage. Les données sous le même [**storageName**](meta.md#storagename-) peuvent être partagées et synchronisées en temps réel.

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

#### Remarque : lorsque `GM_setValue` est appelée avec `undefined`, ScriptCat supprime cette clé, contrairement à Tampermonkey/GreaseMonkey, qui stockent `undefined` comme valeur.

#### Remarque : comme les opérations de données sont asynchrones, appeler `window.close()` immédiatement après `GM_setValue` ou `GM_deleteValue` peut empêcher la mise à jour correcte des données. Il est recommandé d'utiliser `await GM.setValue` ou `await GM.deleteValue` pour garantir que l'opération de données aboutisse.

### GM_listValues

Liste toutes les clés.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

API de lecture/écriture par lots (extension).

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

#### Remarque : comme les opérations de données sont asynchrones, appeler `window.close()` immédiatement après `GM_setValues` ou `GM_deleteValues` peut empêcher la mise à jour correcte des données. Il est recommandé d'utiliser `await GM.setValues` ou `await GM.deleteValues` pour garantir que l'opération de données aboutisse.

### GM_add/removeValueChangeListener

> `tabid` a été supprimé après 0.17.0-alpha — voir [GM_cookie](#gm_cookie-) pour plus de détails.

Écoute les changements d'une valeur. `add` renvoie un identifiant d'écouteur, et `remove` permet d'annuler l'écouteur. Cette méthode peut être utilisée pour implémenter une communication simple ; l'utilisation de [**storageName**](meta.md#storagename-) permet la communication entre scripts.

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

Obtient les informations de ressource déclarées avec `@resource`.

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

Insère un élément dans la page. Peut contourner les restrictions CSP.

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

Ajoute un style à la page et renvoie le nœud DOM du style. Peut contourner les restrictions CSP.

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

Ouvre une nouvelle fenêtre.

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

Ferme un onglet ouvert par `GM_openInTab`.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

Une méthode de stockage de données similaire à `GM_setValue`, mais dont la durée de vie est liée au cycle ouverture→fermeture d'un seul onglet du navigateur ; elle ne peut pas être utilisée depuis un script en arrière-plan.

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

* Enregistre un élément de menu qui apparaît dans la page popup et le menu contextuel ; un clic appelle la fonction `listener`.
* Par défaut, comme pour Tampermonkey, les éléments de menu ayant le même texte affiché n'apparaissent qu'une seule fois.
* Spécifier un `id` permet de mettre à jour l'élément de menu.
* Si `name` est une chaîne vide et qu'il n'y a pas de `listener`, une ligne de séparation est ajoutée au menu contextuel.

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

Supprime un élément de menu enregistré par son identifiant.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

Envoie un message de notification, avec les capacités `progress` et `buttons` (non pris en charge dans Firefox), de sorte qu'une notification peut afficher une barre de progression ou des boutons. Fournit également deux méthodes supplémentaires, `GM_closeNotification` et `GM_updateNotification` (non prises en charge dans Firefox).

[exemple](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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

#### Remarque : `GM_closeNotification` et `GM_updateNotification` sont spécifiques à ScriptCat. Pour mettre à jour une notification, utilisez `tag`.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // updates the progress
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // closes after 1ms
```

### GM_setClipboard \*

Définit le presse-papiers. Un callback n'est pas encore pris en charge, contrairement à Tampermonkey.

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

* Une requête HTTP inter-origine qui peut contourner la CSP, prenant en charge les domaines déclarés avec `@connect`. Certaines fonctionnalités manquent ; la fonctionnalité de cookie n'est actuellement pas prise en charge dans Firefox. L'autorisation de l'utilisateur est requise pour un accès normal ; un hôte décrit par `@connect` peut sauter l'autorisation de l'utilisateur.

* `anonymous` et `cookie` sont gérés différemment de Tampermonkey : lorsque `anonymous` est vrai et que `cookie` est présent, seul le cookie spécifié est envoyé, sans aucun autre cookie joint.

* Des en-têtes spéciaux sont également pris en charge :

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

* Télécharge un fichier, avec en-têtes et autres options configurables ; par rapport à Tampermonkey, il prend également en charge les options cookie et anonymous. Si une URL de blob est fournie, le téléchargement est ouvert directement et seul l'événement `onload` est déclenché — cela diffère de Tampermonkey et existe pour prendre en charge les scripts en arrière-plan, qui ne peuvent pas créer de téléchargement autrement (utile pour des scénarios comme la génération de rapports).
* Renvoie un objet Promise et fournit une méthode `abort()`.
* Contrairement à Tampermonkey, le mode de téléchargement `native` de ScriptCat (par défaut) respecte `@connect` : lorsque l'hôte de l'URL de téléchargement n'est pas couvert par les déclarations `@connect` du script, ScriptCat demande une confirmation à l'utilisateur avant de télécharger ; les hôtes couverts par `@connect` téléchargent silencieusement, et les hôtes sur liste noire sont toujours refusés. Le mode de téléchargement `browser` n'est pas soumis à cette vérification. (Dans Tampermonkey, `@connect` s'applique uniquement à `GM_xmlhttpRequest`, pas à `GM_download`.)

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

Opère de manière asynchrone sur les cookies de la page, prenant en charge les cookies inter-origines, HttpOnly et partitionnés.

> Après v0.17.0-alpha, les paramètres liés à `store` et `tabid` ont été supprimés ; ScriptCat décide désormais de récupérer les cookies de la fenêtre de navigation privée ou normale en fonction de la fenêtre dans laquelle il se trouve.

Vous devez déclarer l'hôte concerné avec `@connect`, et cela nécessite l'autorisation de l'utilisateur. Bien que compatible avec l'opération `GM_cookie.list` de Tampermonkey, ce n'est pas recommandé, par souci de cohérence.

* `sameSite` n'est pas pris en charge.

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

**Remarque** : vous devez déclarer le domaine autorisé dans les métadonnées en utilisant `@connect example.com`.
