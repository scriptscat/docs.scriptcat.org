---
title: Instalación y uso de Skills
---

Una Skill es un paquete de extensión para Agent que inyecta conocimientos específicos del dominio y herramientas personalizadas en la IA. Esta página cubre cómo instalar, configurar y gestionar Skills.

:::tip Repositorio oficial de Skills
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skills listos para usar para automatización de navegadores, tareas programadas, análisis de archivos, asistencia en desarrollo de scripts y más.
:::

## Métodos de instalación

### Método 1: instalar desde una URL

Abra directamente una URL de `SKILL.cat.md` en la barra de direcciones de su navegador; ScriptCat lo interceptará y mostrará una página de confirmación de instalación.

Por ejemplo, para instalar la Skill oficial de automatización de navegadores:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

También puede hacerlo desde la página de gestión:

1. Abra la página de gestión de ScriptCat → **Agent → Skills**
2. Haga clic en el botón **URL** en la esquina superior derecha
3. Pegue la URL de `SKILL.cat.md`
4. Haga clic en Instalar

ScriptCat obtiene automáticamente `SKILL.cat.md` junto con los scripts y archivos de material de referencia que declara.

### Método 2: instalar un ZIP

1. Abra la página de gestión de ScriptCat → **Agent → Skills**
2. Haga clic en el botón **+** en la esquina superior derecha
3. Seleccione un paquete Skill en formato `.zip`

La estructura de directorios del ZIP debe seguir el formato estándar de Skill (debe contener `SKILL.cat.md`).

## Lista oficial de Skills

Haga clic derecho en **Copiar enlace**, luego pegue el enlace en el campo de URL de gestión de Skills para instalar.

| Skill | Descripción | Instalar |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Análisis de páginas, manipulación de DOM, llenado de formularios, capturas de pantalla, navegación | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Tareas programadas Cron (ejecución automática por LLM/callback de script) | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Ayuda a crear, probar y empaquetar nuevas Skills | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Analiza archivos Excel, PDF, Word, CSV y PPT | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Asistente de desarrollo de scripts ScriptCat/Tampermonkey | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Lectura/escritura de hojas de cálculo Synology Office | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Asistente de operaciones de cuenta oficial de WeChat | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Asistente de operaciones de Xiaohongshu (RED) | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Configurar una Skill

Algunas Skills requieren configuración (como una clave API):

1. Encuentre la Skill instalada en la página **Agent → Skills**
2. Haga clic en el icono de **Configuración** (engranaje)
3. Complete los campos de configuración y guarde

Los campos marcados como `secret` en la configuración están enmascarados en la interfaz.

## Habilitar / deshabilitar

En la página de gestión de Skills, use el interruptor en la tarjeta de una Skill para controlar si está habilitada. Las Skills deshabilitadas no se cargan en las conversaciones.

## Comprobar actualizaciones

Las Skills instaladas mediante URL admiten comprobación de versiones:

1. Haga clic en el botón **Comprobar actualizaciones** en la esquina superior derecha de la página de Skills
2. Las tarjetas de Skills con una nueva versión disponible mostrarán un botón **Actualizar**
3. Haga clic para actualizar con un clic

Las actualizaciones se comparan usando el campo `version` (formato semver) declarado en `SKILL.cat.md`.

## Usar Skills en una conversación

Las Skills instaladas están automáticamente disponibles en las conversaciones de Agent. La IA decide cuándo cargar y llamar a las herramientas de una Skill según el contenido de la conversación.

También puede especificar qué Skills cargar al crear una conversación:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Cargar todas las Skills automáticamente
  // o especificar Skills particulares
  // skills: ["browser-automation", "file-parser"]
});
```

## Más información

- [API de gestión de Skills](./agent-skill.md) — gestione Skills programáticamente desde un script
- [Guía de desarrollo de Skills](./agent-skill-dev.md) — cree su propia Skill
