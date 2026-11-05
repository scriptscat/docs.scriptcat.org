---
title: Assistant Intelligent Agent
---

:::caution PHASE DE TEST
La fonctionnalité Agent est actuellement en phase de test (bêta). Les API et les comportements suivants peuvent être ajustés avant la version finale.
:::

## Présentation

ScriptCat v1.4 introduit le système d'Assistant Intelligent Agent, qui offre aux scripts utilisateurs une série de capacités telles que le dialogue IA, l'automatisation du navigateur, la gestion de fichiers et les tâches planifiées.

Les scripts font appel à ces capacités via l'espace de noms `CAT.agent.*`. Toutes les API nécessitent la déclaration des autorisations correspondantes via `@grant`.

## Modules Fonctionnels

| Module | Déclaration de Permission | Description |
|------|---------|------|
| [Dialogue](./agent-conversation) | `@grant CAT.agent.conversation` | Créer des dialogues IA, envoyer des messages, réception en flux (streaming), outils personnalisés |
| [Opérations DOM](./agent-dom) | `@grant CAT.agent.dom` | Navigation de page, capture d'écran, clic, remplissage, défilement, surveillance du DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Installer/Désinstaller/Appeler des packs d'extension Skill |
| [Tâches Planifiées](./agent-task) | `@grant CAT.agent.task` | Tâches planifiées Cron, écoute d'événements |
| [Modèle](./agent-model) | `@grant CAT.agent.model` | Consulter les informations sur les modèles configurés (lecture seule) |
| [Fichiers OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Lire et écrire des fichiers dans l'espace de travail de l'Agent |
| [MCP](./agent-mcp) | — | Configurer les connexions au serveur MCP (page de gestion uniquement, pas d'API de script) |
| [Développement de Skill](./agent-skill-dev) | — | Guide de développement SKILL.cat.md + SkillScript |

## Démarrage Rapide

Un script Agent très simple :

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Bonjour, présente-toi s'il te plaît");
console.log(reply.content);
```

## Architecture en bref

Le système Agent traverse plusieurs contextes isolés de l'extension du navigateur :

```
Script utilisateur → Sandbox (Exécution isolée)
              ↓ WindowMessage
           Offscreen (Accès DOM)
              ↓ ExtensionMessage
           Service Worker (Ordonnanceur central)
              ├── Fournisseur LLM (OpenAI / Anthropic)
              ├── ToolRegistry (Enregistrement et exécution des outils)
              ├── SkillScriptExecutor (Exécution des scripts Skill)
              ├── MCPClient (Client protocole MCP)
              └── TaskScheduler (Ordonnanceur de tâches planifiées)
```

### Structure de Stockage

L'Agent utilise le système de fichiers OPFS (Origin Private File System) du navigateur pour stocker les données :

```
agents/
├── conversations/       # Historique des dialogues
├── attachments/         # Pièces jointes (images, fichiers)
├── skills/{name}/       # Fichiers de pack Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # Configuration des tâches et rapports d'exécution
└── workspace/           # Fichiers de l'espace de travail (répertoire pour opfs_*)
```

### Modèles Supportés

| Fournisseur | Format | Caractéristiques |
|----------|------|------|
| Compatible OpenAI | OpenAI Chat Completions API | Supporte GPT-4o, DeepSeek et autres modèles compatibles |
| Anthropic | Anthropic Messages API | Supporte la série Claude, Mise en cache des invites (Prompt Caching) |
| Zhipu | Zhipu API | Supporte les modèles de la série GLM |

Ajoutez simplement le Fournisseur et la clé API dans « Configuration du modèle » sur la page de gestion pour commencer.

### Écosystème Skill

Un Skill est un pack d'extension comprenant des invites, des scripts d'outils et des documents de référence, permettant d'injecter des connaissances spécialisées et des outils personnalisés dans l'Agent.

**Dépôt officiel de Skills : [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Contient des Skills prêts à l'emploi pour l'automatisation du navigateur, les tâches planifiées, les outils de création de Skills, et des exemples de Dialogue/DOM/Configuration.

**Méthodes d'installation :**

- **Installation par URL** — Ouvrez directement l'URL du fichier `SKILL.cat.md` dans le navigateur, ScriptCat l'interceptera automatiquement et affichera la page d'installation ; vous pouvez également coller l'URL dans Gestion → Agent → Gestion des Skills.
- **Installation par script** — Installation programmatique via l'API `CAT.agent.skills.install()`.

**Vérification des mises à jour :**

Les Skills installés via une URL enregistrent leur source. Vous pouvez vérifier les mises à jour et mettre à niveau en un clic (basé sur la comparaison semver du champ `version`) dans la page de gestion.

Voir [API de gestion des Skills](./agent-skill) et [Guide de développement des Skills](./agent-skill-dev).
