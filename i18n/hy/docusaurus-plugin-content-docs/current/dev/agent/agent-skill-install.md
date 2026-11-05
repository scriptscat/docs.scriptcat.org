---
title: Skills-ի տեղադրում և օգտագործում
---

Skill-ը Agent-ի ընդլայնման փաթեթ է, որը դոմեն-հատուկ գիտելիքներ և կաստոմ գործիքներ է ներարկում AI-ի մեջ: Այս էջը ներառում է Skills-ի տեղադրման, կարգավորման և կառավարման եղանակները:

:::tip Պաշտոնական Skill պահեստ
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — պատրաստի օգտագործման Skills զննարկչի ավտոմատացման, պլանավորված առաջադրանքների, ֆայլերի վերլուծության, սկրիպտ-մշակման օգնության և այլնի համար:
:::

## Տեղադրման մեթոդներ

### Մեթոդ 1. տեղադրում URL-ից

Բացեք `SKILL.cat.md` URL-ը ուղղակիորեն ձեր զննարկչի հասցեագոտում. ScriptCat-ը այն կընդհատի և կցուցադրի տեղադրման հաստատման էջ:

Օրինակ՝ պաշտոնական browser-automation Skill-ը տեղադրելու համար՝

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Կարող եք նաև դա անել կառավարման էջից՝

1. Բացեք ScriptCat կառավարման էջը → **Agent → Skills**
2. Սեղմեք վերևի աջ անկյունի **URL** կոճակը
3. Տեղադրեք `SKILL.cat.md` URL-ը
4. Սեղմեք Տեղադրել

ScriptCat-ը ավտոմատ կերպով ֆեչում է `SKILL.cat.md`-ը՝ դրա հայտարարած սկրիպտ ֆայլերի և հղման նյութերի հետ միասին:

### Մեթոդ 2. ZIP-ի տեղադրում

1. Բացեք ScriptCat կառավարման էջը → **Agent → Skills**
2. Սեղմեք վերևի աջ անկյունի **+** կոճակը
3. Ընտրեք Skill փաթեթ `.zip` ձևաչափով

ZIP-ի դիրեկտորիայի կառուցվածքը պետք է հետևի ստանդարտ Skill ձևաչափին (այն պետք է պարունակի `SKILL.cat.md`):

## Պաշտոնական Skill ցուցակ

Աջ սեղմեք **Պատճենել հղումը**, այնուհետև տեղադրեք հղումը Skills կառավարման URL դաշտում՝ տեղադրելու համար:

| Skill | Նկարագրություն | Տեղադրում |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Էջի վերլուծություն, DOM մանիպուլյացիա, ձևերի լրացում, սքրինշոթներ, նավիգացիա | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron պլանավորված առաջադրանքներ (ավտոմատ գործարկվում են LLM-ի / սկրիպտի կանչով) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Օգնում է ստեղծել, թեստավորել և փաթեթավորել նոր Skills | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Վերլուծում է Excel, PDF, Word, CSV և PPT ֆայլերը | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey սկրիպտի մշակման օգնական | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Office աղյուսակների ընթերցում/գրառում | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat պաշտոնական հաշվի գործառնական օգնական | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu (RED) գործառնական օգնական | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Skill-ի կարգավորում

Որոշ Skills պահանջում են կարգավորում (օրինակ՝ API բանալի).

1. Գտեք տեղադրված Skill-ը **Agent → Skills** էջում
2. Սեղմեք **Կարգավորումներ** պատկերակը (հանդերձանք)
3. Լրացրեք կոնֆիգուրացիայի դաշտերը և պահպանեք

Կոնֆիգուրացիայում `secret` նշված դաշտերը UI-ում քողարկվում են:

## Միացում / անջատում

Skills կառավարման էջում օգտագործեք Skill-ի քարտի անջատիչը՝ դրա միացված լինելը վերահսկելու համար: Անջատված Skills-ը զրույցներում չեն բեռնվում:

## Թարմացումների ստուգում

URL-ի միջոցով տեղադրված Skills-ը աջակցում են տարբերակի ստուգմանը՝

1. Սեղմեք Skills էջի վերևի աջ անկյունի **Ստուգել թարմացումները** կոճակը
2. Նոր տարբերակով Skill քարտերը կցուցադրեն **Թարմացնել** կոճակը
3. Սեղմեք այն՝ մեկ սեղմումով թարմացնելու համար

Թարմացումները համեմատվում են `SKILL.cat.md`-ում հայտարարված `version` դաշտով (semver ձևաչափ):

## Skills-ի օգտագործումը զրույցում

Տեղադրված Skills-ը ավտոմատ կերպով հասանելի են Agent զրույցներում: AI-ն որոշում է, թե երբ բեռնել և կանչել Skill-ի գործիքները՝ ելնելով զրույցի բովանդակությունից:

Կարող եք նաև նշել, թե որ Skills-ը բեռնել զրույց ստեղծելիս՝

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Automatically load all Skills
  // or specify particular Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## Իմանալ ավելին

- [Skill կառավարման API](./agent-skill.md) — Skills-ի ծրագրային կառավարում սկրիպտից
- [Skill մշակման ուղեցույց](./agent-skill-dev.md) — ստեղծեք ձեր սեփական Skill-ը
