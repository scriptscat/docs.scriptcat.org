---
title: Documentación API
---

## Resumen

Las definiciones de API de esta extensión se basan en la [documentación de Tampermonkey](https://www.tampermonkey.net/documentation.php). Solo se ha implementado parte de la API hasta ahora, y seguirá iterando. Cada API que esta extensión extiende o que difiere de la API GM original está especialmente marcada en la documentación (usando `*`). Algunas APIs también proporcionan una contraparte de estilo sincrónico siguiendo la regla `GM.*`.

Para las definiciones detalladas de la API, consulte `scriptcat.d.ts` o las sugerencias integradas del editor. Para APIs específicas de esta extensión, consulte la [Documentación CatApi](cat-api.md).

También puede encontrar ejemplos relacionados en el [directorio de ejemplos](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definiciones

### GM_info

Obtiene información sobre el script, incluyendo metadatos y parámetros del entorno de ejecución.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` actualmente solo tiene el valor `raw`. `runAt` no es compatible.
* `userLanguage` (v1.5+) es el idioma actual de la interfaz de ScriptCat, por ejemplo `"zh-CN"`, `"en-US"`, `"ja-JP"`, para que un script pueda elegir su propio idioma de visualización. El valor se fija al iniciarse el script; un script con `@early-start` puede obtener una cadena vacía al leerlo de forma síncrona, así que léalo después de `CAT_scriptLoaded()`.

### GM_log \*

Función de registro. Los logs de un script de fondo se pueden ver en el registro de ejecución del panel.

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

Obtiene o establece un valor en el almacenamiento. Los datos bajo el mismo [**storageName**](meta.md#storagename-) se pueden compartir y sincronizar en tiempo real.

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

#### Nota: Cuando se llama a `GM_setValue` con `undefined`, ScriptCat elimina esa clave, a diferencia de Tampermonkey/GreaseMonkey que almacena `undefined` como valor.

#### Nota: Debido a que las operaciones de datos son asincrónicas, llamar a `window.close()` inmediatamente después de `GM_setValue` o `GM_deleteValue` puede impedir que los datos se actualicen correctamente. Se recomienda usar `await GM.setValue` o `await GM.deleteValue`.

### GM_listValues

Lista todas las claves.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

APIs de obtención/establecimiento por lotes (extensión).

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

> `tabid` fue eliminado después de 0.17.0-alpha.

Escucha cambios en un valor. `add` devuelve un ID de listener, `remove` se puede usar para cancelar.

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

Obtiene información de recursos declarados con `@resource`.

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Inserta un elemento en la página. Puede eludir restricciones CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Agrega un estilo a la página y devuelve el nodo DOM del estilo. Puede eludir restricciones CSP.

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

### GM_openInTab \*

Abre una nueva ventana.

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

Un método para almacenar datos similar a `GM_setValue`, pero la vida útil de este método está vinculada al ciclo abrir→cerrar de una sola pestaña del navegador.

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

* Registra un elemento de menú que aparece en la página emergente y el menú contextual.
* Por defecto, los elementos de menú con el mismo texto solo se muestran una vez.
* Especificar un `id` permite actualizar el elemento.

```typescript
function GM_registerMenuCommand(name: string, listener?: (inputValue?: any) => void, options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string): number;
```

### GM_unregisterMenuCommand

Elimina un elemento de menú registrado por su ID.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

### GM_notification \*

Envía un mensaje de notificación, proporcionando capacidades de `progress` y `buttons`. También proporciona `GM_closeNotification` y `GM_updateNotification`.

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

#### Nota: `GM_closeNotification` y `GM_updateNotification` son específicos de ScriptCat. Use `tag` para actualizar.

### GM_setClipboard \*

Establece el portapapeles. Aún no se admite callback.

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* Una solicitud HTTP de origen cruzado que puede eludir CSP. Se requiere autorización de usuario; los hosts descritos por `@connect` pueden saltarse la autorización.

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

* Descarga un archivo. Devuelve un objeto Promise y proporciona un método `abort()`.

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Opera asincrónicamente con las cookies de la página, admitiendo cookies de origen cruzado, HttpOnly y particionadas.

> Después de v0.17.0-alpha, se eliminaron los parámetros relacionados con `store` y `tabid`.

El host operado debe declararse con `@connect` y requiere autorización de usuario.

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**Nota**: Debe declarar el dominio permitido en los metadatos usando `@connect example.com`.
