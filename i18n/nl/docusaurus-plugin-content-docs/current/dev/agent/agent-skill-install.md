---
title: Skills installeren en gebruiken
---

Een Skill is een uitbreidingspakket voor Agent dat domeinspecifieke kennis en aangepaste tools in de AI injecteert. Deze pagina behandelt hoe u Skills installeert, configureert en beheert.

:::tip Officiële Skill-repository
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — kant-en-klare Skills voor browserautomatisering, geplande taken, bestandsparsing, scriptontwikkelingsassistentie en meer.
:::

## Installatiemethoden

### Methode 1: installeren vanaf een URL

Open een `SKILL.cat.md`-URL rechtstreeks in de adresbalk van uw browser; ScriptCat onderschept deze en toont een installatiebevestigingspagina.

Om bijvoorbeeld de officiële browserautomatiserings-Skill te installeren:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

U kunt dit ook doen vanaf de beheerpagina:

1. Open de beheerpagina van ScriptCat → **Agent → Skills**
2. Klik op de knop **URL** rechtsboven
3. Plak de `SKILL.cat.md`-URL
4. Klik op Installeren

ScriptCat haalt automatisch `SKILL.cat.md` op samen met de scripts en referentiemateriaalbestanden die het declareert.

### Methode 2: een ZIP installeren

1. Open de beheerpagina van ScriptCat → **Agent → Skills**
2. Klik op de knop **+** rechtsboven
3. Selecteer een Skill-pakket in `.zip`-indeling

De mapstructuur van de ZIP moet de standaard Skill-indeling volgen (deze moet `SKILL.cat.md` bevatten).

## Officiële Skill-lijst

Klik met de rechtermuisknop op **Link kopiëren** en plak de link vervolgens in het URL-veld van het Skillbeheer om te installeren.

| Skill | Beschrijving | Installeren |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Pagina-analyse, DOM-manipulatie, formulieren invullen, schermafbeeldingen, navigatie | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron-geplande taken (automatisch uitgevoerd door de LLM / scriptcallback) | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Helpt bij het maken, testen en verpakken van nieuwe Skills | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Parseert Excel-, PDF-, Word-, CSV- en PPT-bestanden | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey-scriptontwikkelingsassistent | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Office-spreadsheets lezen/schrijven | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Assistent voor WeChat Official Account-bewerkingen | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu (RED)-bewerkingenassistent | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Een Skill configureren

Sommige Skills vereisen configuratie (zoals een API-sleutel):

1. Zoek de geïnstalleerde Skill op de pagina **Agent → Skills**
2. Klik op het pictogram **Instellingen** (tandwiel)
3. Vul de configuratievelden in en sla op

Velden die in de configuratie als `secret` zijn gemarkeerd, worden in de interface gemaskeerd.

## In- / uitschakelen

Gebruik op de Skillbeheerpagina de schakelaar op de kaart van een Skill om te bepalen of deze is ingeschakeld. Uitgeschakelde Skills worden niet in gesprekken geladen.

## Controleren op updates

Via URL geïnstalleerde Skills ondersteunen versiecontrole:

1. Klik op de knop **Controleren op updates** rechtsboven op de Skillpagina
2. Skill-kaarten met een nieuwe beschikbare versie tonen een knop **Bijwerken**
3. Klik erop om met één klik te upgraden

Updates worden vergeleken met behulp van het veld `version` (semver-indeling) dat in `SKILL.cat.md` is gedeclareerd.

## Skills gebruiken in een gesprek

Geïnstalleerde Skills zijn automatisch beschikbaar in Agent-gesprekken. De AI beslist op basis van de gespreksinhoud wanneer de tools van een Skill worden geladen en aangeroepen.

U kunt ook specificeren welke Skills moeten worden geladen bij het maken van een gesprek:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Laadt automatisch alle Skills
  // of specificeer bepaalde Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## Meer leren

- [Skill-beheer-API](./agent-skill.md) — Skills programmatisch beheren vanuit een script
- [Skill-ontwikkelgids](./agent-skill-dev.md) — maak uw eigen Skill
