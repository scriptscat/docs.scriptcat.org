---
title: Installer et utiliser des Skills
---

Un Skill est un pack d'extension pour Agent qui injecte des connaissances spécialisées et des outils personnalisés dans l'IA. Cette page explique comment installer, configurer et gérer des Skills.

:::tip Dépôt officiel de Skills
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — des Skills prêts à l'emploi pour l'automatisation du navigateur, les tâches planifiées, l'analyse de fichiers, l'assistance au développement de scripts, et plus encore.
:::

## Méthodes d'installation

### Méthode 1 : installation depuis une URL

Ouvrez une URL `SKILL.cat.md` directement dans la barre d'adresse de votre navigateur ; ScriptCat l'interceptera et affichera une page de confirmation d'installation.

Par exemple, pour installer le Skill officiel d'automatisation du navigateur :

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Vous pouvez aussi procéder depuis la page de gestion :

1. Ouvrez la page de gestion ScriptCat → **Agent → Skills**
2. Cliquez sur le bouton **URL** en haut à droite
3. Collez l'URL du fichier `SKILL.cat.md`
4. Cliquez sur Installer

ScriptCat récupère automatiquement `SKILL.cat.md` ainsi que les scripts et les fichiers de matériel de référence qu'il déclare.

### Méthode 2 : installation d'un ZIP

1. Ouvrez la page de gestion ScriptCat → **Agent → Skills**
2. Cliquez sur le bouton **+** en haut à droite
3. Sélectionnez un pack Skill au format `.zip`

La structure de répertoires du ZIP doit suivre le format Skill standard (il doit contenir `SKILL.cat.md`).

## Liste officielle des Skills

Faites un clic droit sur **Copier le lien**, puis collez le lien dans le champ URL de la gestion des Skills pour l'installer.

| Skill | Description | Installation |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Analyse de page, manipulation du DOM, remplissage de formulaires, captures d'écran, navigation | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Tâches planifiées Cron (exécution automatique par le LLM / rappel de script) | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Aide à créer, tester et empaqueter de nouveaux Skills | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Analyse les fichiers Excel, PDF, Word, CSV et PPT | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Assistant de développement de scripts ScriptCat/Tampermonkey | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Lecture/écriture de feuilles de calcul Synology Office | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Assistant de gestion de compte officiel WeChat | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Assistant de gestion Xiaohongshu (RED) | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Configurer un Skill

Certains Skills nécessitent une configuration (comme une clé API) :

1. Trouvez le Skill installé sur la page **Agent → Skills**
2. Cliquez sur l'icône **Paramètres** (engrenage)
3. Renseignez les champs de configuration et enregistrez

Les champs marqués `secret` dans la configuration sont masqués dans l'interface.

## Activer / désactiver

Sur la page de gestion des Skills, utilisez l'interrupteur sur la carte du Skill pour contrôler s'il est activé. Les Skills désactivés ne sont pas chargés dans les conversations.

## Vérifier les mises à jour

Les Skills installés via une URL prennent en charge la vérification de version :

1. Cliquez sur le bouton **Vérifier les mises à jour** en haut à droite de la page des Skills
2. Les cartes de Skills avec une nouvelle version disponible afficheront un bouton **Mettre à jour**
3. Cliquez dessus pour mettre à niveau en un clic

Les mises à jour sont comparées à l'aide du champ `version` (format semver) déclaré dans `SKILL.cat.md`.

## Utiliser les Skills dans une conversation

Les Skills installés sont automatiquement disponibles dans les conversations Agent. L'IA décide quand charger et appeler les outils d'un Skill en fonction du contenu de la conversation.

Vous pouvez aussi spécifier quels Skills charger lors de la création d'une conversation :

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Automatically load all Skills
  // or specify particular Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## En savoir plus

- [API de gestion des Skills](./agent-skill.md) — gérer les Skills programmatiquement depuis un script
- [Guide de développement des Skills](./agent-skill-dev.md) — créer votre propre Skill
