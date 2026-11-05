---
title: Agent
---

:::caution Fase de pruebas
La función Agent actualmente aún está en fase de prueba; las siguientes API y comportamientos pueden cambiar antes del lanzamiento oficial.
:::

## Descripción general

ScriptCat v1.4 introduce el sistema Agent, dando a los scripts de usuario un conjunto de capacidades que incluyen conversación con IA, automatización del navegador, gestión de archivos y tareas programadas.

Los scripts llaman a estas capacidades a través del namespace `CAT.agent.*`, y cada API requiere que se declare la permiso correspondiente con `@grant`.

## Módulos de funcionalidad

| Módulo | Permiso | Descripción |
|------|---------|------|
| [Conversación](./agent-conversation) | `@grant CAT.agent.conversation` | Crear conversaciones con IA, enviar mensajes, transmitir respuestas, definir herramientas personalizadas |
| [Operaciones DOM](./agent-dom) | `@grant CAT.agent.dom` | Navegación de páginas, capturas de pantalla, clics, llenado, desplazamiento, monitoreo DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Instalar/desinstalar/invocar paquetes de Skill |
| [Tareas programadas](./agent-task) | `@grant CAT.agent.task` | Tareas programadas Cron, escucha de eventos |
| [Modelo](./agent-model) | `@grant CAT.agent.model` | Consultar información de modelos configurados (solo lectura) |
| [Archivos OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Leer/escribir archivos del espacio de trabajo de Agent |
| [MCP](./agent-mcp) | — | Configurar conexiones de servidores MCP (solo página de administración, sin API de script) |
| [Desarrollo de Skill](./agent-skill-dev) | — | Guía de desarrollo de SKILL.cat.md + SkillScript |

## Inicio rápido

El script Agent más simple posible:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hola, por favor preséntate");
console.log(reply.content);
```

## Descripción de la arquitectura

El sistema Agent abarca múltiples contextos aislados dentro de la extensión del navegador:

```
Script de usuario → Sandbox (ejecución aislada)
              ↓ WindowMessage
           Offscreen (acceso DOM)
              ↓ ExtensionMessage
           Service Worker (programación central)
              ├── Proveedor LLM (OpenAI / Anthropic)
              ├── ToolRegistry (registro y ejecución de herramientas)
              ├── SkillScriptExecutor (ejecución de scripts Skill)
              ├── MCPClient (cliente de protocolo MCP)
              └── TaskScheduler (programación de tareas)
```

### Estructura de almacenamiento

Agent almacena datos usando el OPFS (Origin Private File System) del navegador:

```
agents/
├── conversations/       # historial de conversaciones
├── attachments/         # archivos adjuntos (imágenes, archivos)
├── skills/{name}/       # archivos de paquetes Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # configuración y registros de ejecución de tareas programadas
└── workspace/           # archivos del espacio de trabajo del usuario (el directorio que operan las herramientas opfs_*)
```

### Modelos soportados

| Proveedor | Formato | Características |
|----------|------|------|
| Compatible con OpenAI | API de Chat Completions de OpenAI | Soporta GPT-4o, DeepSeek y otros modelos compatibles |
| Anthropic | API de Messages de Anthropic | Soporta la familia Claude, Prompt Caching |
| 智譜 | API de 智譜 | Soporta la familia de modelos GLM |

Agregue un proveedor y clave de API en "Configuración de modelos" en el panel de control para usarlo.

### El ecosistema Skill

Un Skill es un paquete que combina prompts + scripts de herramientas + material de referencia, permitiéndole inyectar conocimiento específico del dominio y herramientas personalizadas en el Agent.

**Repositorio oficial de Skills: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Incluye Skills listos para usar para automatización del navegador, tareas programadas, una herramienta de creación de Skills, ejemplos de conversación/DOM/configuración y más.

**Métodos de instalación:**

- **Instalación por URL** — abra directamente la URL de `SKILL.cat.md` en el navegador; ScriptCat la intercepta automáticamente y muestra la página de instalación. También puede pegar la URL bajo Agent → Gestión de Skill en el panel de control.
- **Instalación por script** — instale programáticamente a través de la API `CAT.agent.skills.install()`

**Verificación de actualizaciones:**

Un Skill instalado por URL registra su fuente de instalación; el panel de control le permite verificar actualizaciones y actualizar con un clic (basado en comparación semver del campo `version`).

Consulte [API de gestión de Skill](./agent-skill) y [Guía de desarrollo de Skill](./agent-skill-dev) para más detalles.
