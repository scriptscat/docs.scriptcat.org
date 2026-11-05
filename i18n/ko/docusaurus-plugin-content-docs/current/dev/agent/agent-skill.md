---
title: Skill 관리 API
---

`@grant CAT.agent.skills`

Skill 관리 API를 사용하면 스크립트가 Skill 확장 패키지를 쿼리, 설치, 제거 및 호출할 수 있습니다.

Skill 개발 및 패키징은 [Skill 개발 가이드](../agent-skill-dev)를 참조하세요. 공식 Skill 예제: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — 설치된 Skill 나열

```javascript
const skills = await CAT.agent.skills.list();
```

**`SkillSummary[]` 반환:**

| 필드 | 유형 | 설명 |
|------|------|------|
| `name` | `string` | Skill 이름 |
| `description` | `string` | Skill 설명 |
| `toolNames` | `string[]` | 포함된 SkillScript 도구의 이름 |
| `referenceNames` | `string[]` | 포함된 참조 자료 파일의 이름 |
| `hasConfig` | `boolean` | 구성 필드를 선언하는지 여부 |
| `enabled` | `boolean` | 활성화 여부 (기본값 `true`) |
| `installtime` | `number` | 설치 타임스탬프 |
| `updatetime` | `number` | 마지막 업데이트 타임스탬프 |

> 참고: `version`과 `installUrl`(관리 페이지의 업데이트 확인 기능에서 사용)은 이 스크립트 API를 통해 반환되지 않습니다. 업데이트 확인 로직과 관리 페이지 UI 내부에서만 사용됩니다.

## get — Skill 세부 정보 가져오기

```javascript
const skill = await CAT.agent.skills.get(name);
```

전체 `SkillRecord`를 반환하거나 없으면 `null`을 반환합니다.

**`SkillRecord` 형태:**

`SkillSummary`의 모든 필드를 상속하며 다음이 추가됩니다:

| 필드 | 유형 | 설명 |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md`의 Markdown 본문 (AI에 제공되는 프롬프트) |
| `config` | `Record<string, SkillConfigField>` | 구성 필드 정의 (스키마) |

**`SkillConfigField` 형태:**

| 필드 | 유형 | 설명 |
|------|------|------|
| `title` | `string` | 표시 제목 |
| `type` | `"text" \| "number" \| "select" \| "switch"` | 필드 유형 |
| `secret` | `boolean` | 민감한지 여부 (UI에서 마스킹) |
| `required` | `boolean` | 필수인지 여부 |
| `default` | `unknown` | 기본값 |
| `values` | `string[]` | 옵션 목록 (`select` 유형 전용) |

## install — Skill 설치

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md` 파일 내용 (필수) |
| `scripts` | `Array<{ name, code }>` | SkillScript 파일 목록 |
| `references` | `Array<{ name, content }>` | 참조 자료 파일 목록 |

같은 이름의 Skill이 이미 있으면 업데이트합니다.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Custom search tool
---

Use the search tool when the user needs to search.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API Docs\n..." }]
);
```

## remove — Skill 제거

```javascript
const success = await CAT.agent.skills.remove(name);
```

성공적으로 제거되면 `true`, Skill이 없으면 `false`를 반환합니다.

## call — SkillScript 직접 호출

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

AI 대화를 거치지 않고 지정된 Skill에서 SkillScript를 직접 실행합니다.

**매개변수:**

| 매개변수 | 유형 | 설명 |
|------|------|------|
| `skillName` | `string` | Skill 이름 (필수) |
| `scriptName` | `string` | SkillScript 이름 (필수) |
| `params` | `Record<string, unknown>` | 전달할 매개변수 (`@param` 선언과 일치) |

```javascript
// Skill 내부의 검색 스크립트 직접 호출
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript 실행에는 시간 제한이 있습니다 (기본 300초, `@timeout`으로 사용자 지정 가능).
