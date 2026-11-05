---
title: Skill 개발 가이드
---

Skill은 Agent 시스템용 확장 패키지로, **프롬프트 + 도구 스크립트 + 참조 자료로** 구성됩니다. Skill을 사용하면 AI에 도메인별 지식과 사용자 지정 도구 기능을 주입할 수 있습니다.

## Skill 디렉터리 구조

```
my-skill/
├── SKILL.cat.md          # 필수: 메타데이터 + 프롬프트 (진입 파일)
├── scripts/              # 선택 사항: SkillScript 도구 스크립트
│   ├── search.js
│   └── export.js
└── references/           # 선택 사항: 참조 자료 파일
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md`는 Skill의 진입 파일입니다. URL에서 설치할 때 ScriptCat은 먼저 이 파일을 가져온 다음 frontmatter에 선언된 `scripts` 및 `references`를 기반으로 상대 경로로 다른 파일을 가져옵니다.

## SKILL.cat.md 형식

`SKILL.cat.md`는 YAML frontmatter로 메타데이터를 선언하며 Markdown 본문은 AI에 제공되는 프롬프트 역할을 합니다.

```markdown
---
name: "weather-assistant"
description: "Weather lookup assistant, supports weather queries and forecasts for cities worldwide"
config:
  apiKey:
    title: "OpenWeather API Key"
    type: "text"
    secret: true
    required: true
  unit:
    title: "Temperature unit"
    type: "select"
    values: ["celsius", "fahrenheit"]
    default: "celsius"
  detailed:
    title: "Detailed mode"
    type: "switch"
    default: false
  maxDays:
    title: "Forecast days"
    type: "number"
    default: 7
---

# Weather assistant

You can use the following tools to look up weather information:

## Tool description

- **get_weather**: look up the current weather and forecast for a specified city
  - The `city` parameter is the city name (Chinese and English names both supported)
  - The `days` parameter is the number of forecast days

## Usage rules

1. When the user asks about weather, confirm the city name first
2. By default, return current weather + a 3-day forecast
3. Display temperature according to the configured unit
```

### 메타데이터 필드

| 필드 | 유형 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 예 | 고유 Skill 식별자 (kebab-case 영어 권장) |
| `description` | `string` | 예 | 짧은 설명 (목록에 표시) |
| `version` | `string` | 아니요 | 버전 (semver 형식, 예: `1.0.0`), 업데이트 확인에 사용 |
| `scripts` | `string[]` | 아니요 | 스크립트 파일 이름 목록 (예: `["search.js"]`), URL 설치 시 `scripts/` 디렉터리에서 자동 가져옴 |
| `references` | `string[]` | 아니요 | 참조 자료 파일 이름 목록 (예: `["api-docs.md"]`), URL 설치 시 `references/` 디렉터리에서 자동 가져옴 |
| `config` | `object` | 아니요 | 구성 필드 정의 |

### 구성 필드 유형

| type | 설명 | 유형별 속성 |
|------|------|---------|
| `text` | 텍스트 입력 | `secret`: UI에서 마스킹되는지 여부 |
| `number` | 숫자 입력 | — |
| `select` | 드롭다운 | `values`: 옵션 목록 (`string[]`) |
| `switch` | 토글 | — |

**공통 속성:**

| 속성 | 유형 | 설명 |
|------|------|------|
| `title` | `string` | 표시 제목 |
| `required` | `boolean` | 필수인지 여부 |
| `default` | `unknown` | 기본값 |
| `secret` | `boolean` | 민감한 정보인지 여부 |

사용자는 관리 페이지의 Skill 설정에서 이러한 구성 값을 입력합니다.

### 프롬프트 본문

Markdown 본문은 AI의 시스템 프롬프트로 주입됩니다. 작성 팁:

- Skill이 제공하는 도구와 용도를 설명하세요
- 각 도구의 매개변수가 의미하는 바와 사용 규칙을 설명하세요
- 일반적인 사용 시나리오와 주의할 점을 제시하세요
- 참조 자료가 있으면 참조 방법을 설명하세요

## SkillScript 도구 스크립트

SkillScript는 AI가 호출할 수 있는 도구 스크립트입니다. 각 SkillScript 파일은 하나의 LLM 도구로 등록됩니다.

### 메타데이터 형식

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name, Chinese and English names both supported
// @param       days number Number of forecast days, defaults to 3
// @param       format string [json,text] Output format
// @grant       CAT.agent.opfs
// @require     https://cdn.example.com/utils.js
// @timeout     60
// ==SkillScript==
```

### 메타데이터 필드

| 태그 | 설명 | 예 |
|------|------|------|
| `@name` | 도구 이름 (AI가 호출할 때 사용) | `get_weather` |
| `@description` | 도구 설명 (AI가 호출 시점을 결정하는 데 사용) | `Look up city weather` |
| `@param` | 매개변수 정의 (여러 번 나타날 수 있음) | 아래 참조 |
| `@grant` | 필요한 GM API 권한 | `CAT.agent.opfs` |
| `@require` | 외부 라이브러리 URL (로드 및 캐시됨) | `https://cdn.example.com/lib.js` |
| `@timeout` | 초 단위 실행 시간 초과 | `60` (기본값 `300`) |

### `@param` 구문

```
@param paramName type[enumValues] [required] description
```

**유형:** `string`, `number`, `boolean`

**Enum 값(선택 사항):** 대괄호로 감싸고 쉼표로 구분

**필수 표시:** 설명 앞에 `[required]`

```javascript
// 필수 문자열 매개변수
// @param city string [required] City name

// Enum이 있는 문자열 매개변수
// @param unit string [celsius,fahrenheit] Temperature unit

// 선택 숫자 매개변수
// @param days number Number of forecast days

// 불리언 매개변수
// @param detailed boolean Whether to return detailed information
```

매개변수 정의는 LLM이 도구를 호출할 때 사용하도록 자동으로 JSON Schema로 변환됩니다.

### 스크립트 작성

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. arguments[0]을 통해 AI가 전달한 매개변수 받기
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG는 사용자가 관리 페이지에서 입력한 Skill 구성을 제공합니다
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. 실제 작업 수행
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. `return`을 통해 결과를 AI에 반환
return {
  city: data.city.name,
  country: data.city.country,
  forecasts: data.list.map(item => ({
    date: item.dt_txt,
    temp: item.main.temp,
    description: item.weather[0].description
  }))
};
```

### 실행 환경

| 기능 | 설명 |
|------|------|
| **실행 위치** | 샌드박스 처리된 격리 환경 (DOM 액세스 없음) |
| **매개변수 받기** | `arguments[0]` — AI가 전달한 매개변수 객체 |
| **구성 받기** | `CAT_CONFIG` — 사용자의 구성을 포함하는 전역 읽기 전용 객체 |
| **반환 값** | `return` 문은 JSON 직렬화 가능한 값을 반환 |
| **비동기 지원** | `async/await`, `fetch`, `Promise` 모두 지원 |
| **외부 라이브러리** | `@require`로 로드, 로컬에 캐시됨 |
| **시간 초과** | 기본 300초, `@timeout`으로 사용자 지정 가능 |
| **GM API** | `@grant`로 선언 후 사용 가능 (예: `CAT.agent.opfs`) |

### `@require` 외부 라이브러리

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// @require로 로드된 라이브러리는 직접 사용할 수 있습니다
const result = _.groupBy(data, "category");
return result;
```

외부 라이브러리는 처음 로드될 때 캐시되며 이후 실행은 캐시된 버전을 직접 사용합니다.

## 참조 자료

`references/` 디렉터리의 파일은 AI가 참조할 수 있는 참조 자료 역할을 합니다. AI가 필요할 때 기본 제공 `read_reference` 도구를 통해 읽습니다.

참조 자료로 적합한 콘텐츠:
- API 문서
- 데이터 형식 사양
- 사용 예제 모음
- 도메인 지식 문서

## 예제 저장소

여러 즉시 사용 가능한 Skill과 스크립트 API 예제를 포함하는 공식 관리 Skill 예제 저장소가 있습니다:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill 목록:**

| 디렉터리 | 설명 | 설치 |
|------|------|------|
| `browser-automation/` | 페이지 분석, DOM 조작, 양식 작성, 스크린샷, 탐색 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron 예약 작업 (내부 + 이벤트 모드) | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | 새 Skill 생성, 테스트 및 패키징 지원 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | 일반 파일 형식 구문 분석 (Excel, PDF, Word, CSV, PPT) | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey 스크립트 개발 도우미 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Synology Office 스프레드시트 읽기/쓰기 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat 공식 계정 운영 도우미 — 콘텐츠 수집, 기사 작성 및 게시 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu(RED) 운영 도우미 — 노트 작성, 이미지 생성 및 게시 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**예제 코드:**

| 디렉터리 | 설명 |
|------|------|
| `examples/conversation/` | 대화 API 예제 — 채팅, 스트리밍, 도구 호출 |
| `examples/dom/` | DOM API 예제 — 페이지 읽기, 양식 작성, 탭 관리 |
| `examples/config/` | Skill 구성 예제 — 구성 필드 선언 및 `CAT_CONFIG` 사용 |
| `examples/page_copilot.user.js` | 완전한 사용자 스크립트 예제 — 스트리밍 UI가 있는 오른쪽 클릭 AI 도우미 |

예제 저장소의 코드에서 Skill 개발을 배우기 시작하는 것이 좋습니다.

## 설치 방법

### URL에서 설치

브라우저에서 `SKILL.cat.md` URL을 직접 엽니다. ScriptCat이 이를 가로채서 설치 페이지를 표시합니다.

관리 페이지 → Agent → Skill 관리에서도 할 수 있습니다:

1. URL 설치 버튼 클릭
2. `SKILL.cat.md` URL 붙여넣기
3. 설치 확인

ScriptCat은 먼저 `SKILL.cat.md`를 가져온 다음 frontmatter에 선언된 `scripts` 및 `references`를 기반으로 상대 경로로 다른 파일을 가져옵니다. 설치 후 `installUrl`이 기록되므로 나중에 버전 번호로 업데이트를 확인할 수 있습니다.

### 스크립트에서 설치

```javascript
// ==UserScript==
// @grant CAT.agent.skills
// ==/UserScript==

await CAT.agent.skills.install(
  skillMdContent,
  [{ name: "search.js", code: scriptCode }],
  [{ name: "docs.md", content: docsContent }]
);
```

## Skill 로드 방법

Skill은 컨텍스트 사용을 최적화하기 위해 3계층 점진적 로딩을 사용합니다:

| 계층 | 시기 | 콘텐츠 |
|------|------|------|
| **요약** | 대화 시작 시 | Skill 이름 + 설명 + 도구 목록 (시스템 프롬프트에 주입) |
| **프롬프트** | AI가 `load_skill`을 호출할 때 | `SKILL.cat.md`의 전체 본문 |
| **도구** | `load_skill` 이후 | SkillScript가 호출 가능한 LLM 도구로 등록됨 |

AI는 Skill의 전체 콘텐츠와 도구를 로드해야 할 때 `load_skill`을 자동으로 호출합니다.

## 전체 예제

### 디렉터리 구조

```
translator-skill/
├── SKILL.cat.md
├── scripts/
│   └── translate.js
└── references/
    └── language-codes.md
```

### SKILL.cat.md

```markdown
---
name: "translator"
description: "Multilingual translation tool, supports 100+ languages"
version: "1.0.0"
scripts:
  - translate.js
references:
  - language-codes.md
config:
  apiKey:
    title: "Translation API Key"
    type: "text"
    secret: true
    required: true
  defaultTarget:
    title: "Default target language"
    type: "select"
    values: ["zh", "en", "ja", "ko", "fr", "de", "es"]
    default: "zh"
---

# Translation assistant

Use the `translate` tool to translate text. Refer to language-codes.md for the full list of language codes.

## Usage rules

- If the user hasn't specified a target language, use the default language from the configuration
- Long text is automatically translated in chunks
- Preserve the original formatting (Markdown, code blocks, etc.)
```

### scripts/translate.js

```javascript
// ==SkillScript==
// @name        translate
// @description Translate text into a specified language
// @param       text string [required] The text to translate
// @param       target string Target language code (uses the config value by default)
// @param       source string Source language code (auto-detected by default)
// @timeout     60
// ==SkillScript==

const { text, target, source } = arguments[0];
const apiKey = CAT_CONFIG.apiKey;
const targetLang = target || CAT_CONFIG.defaultTarget || "zh";

const response = await fetch("https://api.example.com/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    text,
    target_language: targetLang,
    source_language: source || "auto"
  })
});

if (!response.ok) {
  throw new Error(`Translation failed: ${response.statusText}`);
}

const result = await response.json();
return {
  original: text,
  translated: result.translated_text,
  source_language: result.detected_language,
  target_language: targetLang
};
```

### references/language-codes.md

```markdown
# Language code reference

| Code | Language |
|------|------|
| zh | Chinese |
| en | English |
| ja | Japanese |
| ko | Korean |
| fr | French |
| de | German |
| es | Spanish |
| ...  | ... |
```
