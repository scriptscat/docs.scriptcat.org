# AGENTS.md

Agent guide for the ScriptCat documentation site (docs.scriptcat.org). Human contributors should start with [CONTRIBUTING.md](./CONTRIBUTING.md).

> Note on language: this file is in English. [CONTRIBUTING.md](./CONTRIBUTING.md) and [agents/i18n.md](./agents/i18n.md) are written in Chinese with an English summary at the top — read that summary line first if you only need the gist.

## Project overview

The official documentation and marketing site for ScriptCat, a browser extension that runs user scripts. Stack: Docusaurus 3, React 18, TypeScript, Tailwind CSS, Ant Design.

Package manager is **pnpm** (v10.9.0). Node.js >= 18.

## Commands

```bash
pnpm i                       # Install dependencies
pnpm run start               # Dev server (Chinese, default locale)
pnpm run start:en            # Dev server (English, port 3001)
pnpm run start:ru            # Dev server (Russian, port 3002)
pnpm run build               # Production build (builds every locale in one pass)
npx docusaurus build         # Same, minus the prebuild stats scrape (what CI runs)
pnpm run serve               # Serve the production build locally
pnpm run typecheck           # TypeScript type checking
pnpm run check               # URL contract / fallback output / i18n parity / frontmatter
pnpm run write-translations  # Scaffold i18n translation files
```

## Before you commit

`.gitea/workflows/ci.yaml` runs one job: install, typecheck, build every locale, then `pnpm run check` over the result. `deploy.yaml` does the same before shipping. Both are deliberately unsharded, and neither carries a build cache between runs — the whole 20-locale build takes about a minute, and the artifact and cache round trips needed to split it up cost more than they save. The workflow header carries the measurements; read it before reintroducing either. CI lives on Gitea, so GitHub shows no status checks — that does **not** mean there is no CI. Run this locally at minimum:

```bash
pnpm run typecheck && pnpm run build && pnpm run check
```

Three things to know:

- **`pnpm run check` needs the `build/` output** (`check:fallbacks` reads the generated HTML), so build first.
- **Do not build a single locale only.** `onBrokenLinks` and `onBrokenAnchors` are both `throw`, but a broken link or anchor only surfaces in the locale that contains it — `--locale zh-Hans` alone misses breakage in the other 19 locales.
- After touching anything in `src/`, spot-check a page in `build/`, `build/en/` **and** `build/ru/`. Verifying only the Chinese output is how most of this repo's localization bugs got through.

## Hard constraints

1. **These URLs are hardcoded by the browser extension and must never change**: `/docs/script_installation/`, `/docs/use/install_comple/` (`install_comple` is a legacy spelling, deliberately kept — not a typo), `/uninstall/`. `scripts/url-inventory.txt` is the committed route baseline and `check:urls` diffs against it.
2. **Intentional new routes** must update that baseline in the same PR via `node scripts/check-url-inventory.mjs --write`, so reviewers can see what you added on purpose.
3. **Never put non-documentation markdown under `docs/`.** `docs/` is the published tree: a new `.md` there creates a public route, requires a mirror in every locale, and requires `title:` frontmatter — it trips `check:urls`, `check:i18n` and `check:frontmatter` at once. Repo-internal docs belong in `agents/` or the repo root.
4. **Never assume the site has only Chinese and English.** There are three locales; see below.

## Layout

| Path | What it is |
|---|---|
| `docusaurus.config.js` | Site config (i18n, navbar, footer, Algolia, GA, per-locale SEO metadata) |
| `sidebars.js` | Three sidebars (`use`/`dev`/`change`), all explicit lists |
| `docs/` | Chinese docs (default locale). Three sections: `use/` guides, `dev/` API docs, `change/` changelogs |
| `i18n/<locale>/` | Per-locale doc mirrors and UI strings |
| `src/pages/` | Custom pages (`index.tsx` landing page, `uninstall.tsx` feedback survey) |
| `src/components/landing/` | Landing page: one component + CSS module per section (`Hero`, `Scenes`, `Steps`, `Features`, `AI`, `Developers`, `Closing`), shared animation helpers in `motion.tsx`, plus `LandingNav.tsx` and `shared.tsx` |
| `src/theme/` | Docusaurus theme overrides (custom `Footer`, `Root` language-detection redirect) |
| `src/service/` | API layer (calls `https://scriptcat.org/api/v2`) |
| `scripts/` | Check scripts, `check-config.json`, `url-inventory.txt` route baseline |
| `deploy/` | Dockerfile, nginx config, Helm chart |
| `agents/` | Detailed conventions written for agents |

## Localization (read before touching i18n code)

Twenty locales, listed in `scripts/check-config.json` (`docusaurus.config.js` and the check scripts all read that one list). `zh-Hans` is the default and has no URL prefix; every other locale is served under `/<locale>/`. Each one is a full separate site build, compiled sequentially in a single `docusaurus build` process.

The four mistakes that keep recurring — **full rules and incident notes in [agents/i18n.md](./agents/i18n.md)**:

1. **Hardcoding a locale name.** `currentLocale !== "en"` or `pathname.startsWith("/en/")` classifies Russian as Chinese; building a prefix without stripping the existing one produces `/en/ru/x` (a 404). Read the locale from `useDocusaurusContext().i18n.currentLocale`; iterate with `i18n.locales` and `i18n.localeConfigs`.
2. **Forgetting baseUrl on a plain `<a href="/...">`.** For non-default locales `baseUrl` is `/en/` or `/ru/`. `<Link to>` and markdown links apply it automatically; a plain `<a>` — including the ones inside `landing/Dropdown.tsx` items and `uninstall/ui.tsx`'s `<Btn href>` — does not. Wrap those in `withBaseUrl()`.
3. **Hardcoded UI copy.** Everything user-facing goes through `<Translate>` / `translate()`, with keys added to every non-default `i18n/<locale>/code.json` (identical key count **and** order — `check:i18n-ui` enforces this across all 19).
4. **Locale assumptions outside `src/`.** Adding a language means an `i18n/<locale>/code.json`, a `localeConfigs` entry in `docusaurus.config.js`, an entry in `scripts/check-config.json`'s `locales`, and a `deploy/docker/nginx.conf` 404 routing branch. The nginx one is invisible to the build and to `pnpm run check` — it only shows up in production.

Changelogs under `change/` are not translated into Russian: the Russian routes compile the English doc tree directly (`docusaurus.config.js` swaps `docs.path` based on `DOCUSAURUS_CURRENT_LOCALE`). **That fallback covers the whole tree**, so any file missing under `i18n/ru/` silently renders in English instead of failing the build — only `check:i18n` catches it. Do not skip `pnpm run check`.

## Styling

- Tailwind CSS via `@gracefullight/docusaurus-plugin-tailwind`
- Component-scoped styles via CSS Modules (`.module.css`)
- Theme colors through Infima CSS variables (primary: `#4594d5`)
- Dark mode via the `[data-theme="dark"]` selector; for components that must react to theme changes use `useTheme()` from `src/components/useTheme.ts`
- The landing page's mock code cards are width-sensitive (`.code` in `features.module.css` is a fixed 360px, and the editor mock in `Developers.tsx` has a hardcoded 11-line gutter). Translated copy that is too long wraps and desyncs the gutter — see [agents/i18n.md](./agents/i18n.md).
- **RTL locales (ar, fa) get every stylesheet run through RTLCSS**, which flips `left`/`right`, `translateX`, `transform-origin`, gradient angles and `text-align` automatically. Write plain LTR CSS; a hand-written `[dir="rtl"]` override for something RTLCSS already mirrors gets flipped a second time. Put `/* rtl:ignore */` before a declaration that must stay physical — see [agents/i18n.md](./agents/i18n.md) §8.

## Key dependencies

**@iconify/react** (icons), **react-device-detect** (browser detection for the install guide, dynamically imported), **clsx**, **motion** (landing-page animation only — see "Bundle budget"). There is deliberately **no UI framework** — see "Bundle budget" below. The two components that would otherwise call for one are in-house: `src/components/landing/Dropdown.tsx` (menus) and `src/components/uninstall/ui.tsx` (card / button / radio / textarea / alert / toast).

### Icons

Import `Icon` from `src/components/Icon` (`@site/src/components/Icon` in markdown) — **never from `@iconify/react` directly**. That package's default entry fetches icon data from `api.iconify.design` after hydration, so icons are absent from the SSR'd HTML and only pop in once the request lands. The wrapper uses the `/offline` entry, which never touches the network and renders only what has been registered with it.

`src/components/Icon.tsx` is that registry: one `import` from `@iconify-icons/<prefix>/<name>` per icon plus a row in `REGISTRY`, which is what keeps usage sites writing plain strings (`icon="lucide:zap"`, or `{ icon: "lucide:zap" }` inside a data array). To add an icon, add both lines. **An icon used without a row renders blank, silently** — there is no build-time check for this.

Import individual icons, never a whole collection. `import { icons } from "@iconify-json/logos"` pulls in all 2110 icons; doing that for the four collections in use adds about 10 MB to `main.js`. Add the matching `@iconify-icons/*` dev dependency before using a new prefix.

### Bundle budget

`main.js` ships on **every** page, so anything a shared component imports statically is paid for site-wide. A few rules keep it honest:

- **Don't add a UI framework.** antd is the usual temptation and a good measure of the price: its `Dropdown` alone is ~280 KB (cssinjs + rc-trigger + rc-menu + theme tokens), and a form page on its `Card`/`Radio`/`Input`/`Form` runs ~500 KB — more than the rest of the site's JS put together, for controls that are a `<label>` and an `<input>` underneath. Extend `landing/Dropdown.tsx` or `uninstall/ui.tsx` instead.
- **In `uninstall/ui.module.css`, never set a property that the page also sets with a Tailwind utility.** A CSS-module class and a utility class have equal specificity, so which one wins depends on their order in the bundled `styles.css` — not something either file controls. Margins and the overridden font sizes live only on the page; sizes that belong to the primitive (button height, radius) live only in the module and are selected by prop.
- **`motion` is for the homepage only.** Import it from `src/components/landing/*` (through `motion.tsx`'s `MotionProvider`, which is `LazyMotion strict` — use `m.*`, not `motion.*`) and never from `src/theme/` or anything a docs page renders, so it stays in a homepage-only chunk (~162 KB raw / ~55 KB gzip) instead of `main.js`. Scroll-reveal content must stay visible in the SSR HTML: animate with keyframes on `whileInView` and hide via the `.reveal` / `[data-lp-motion]` CSS gate, not with `initial`.
- **`@docsearch/react` must stay on v4.** v3 has no `version` / `useDocSearchKeyboardEvents` / `useTheme` subpath entries, so Docusaurus aliases all three to the package root — which resolves through `main` to the CommonJS `dist/umd` build, a second un-shakeable copy of the whole library (~205 KB, modal included) in `main.js` alongside the ESM one. v4 ships those subpaths for real, so only the search *button* is eager and the modal splits into its own lazily-fetched chunk.

To see where the bytes are: `npx docusaurus build --locale zh-Hans --bundle-analyzer`, then read the report at <http://127.0.0.1:8888>. For reference, the homepage loads ~750 KB of JS (`main.js` ~507 KB + the motion chunk ~162 KB + the page ~75 KB, measured 2026-11), `/uninstall/` ~965 KB and a docs page ~1.1 MB — the bulk of the last two being `docs/change/index.md`, which compiles to a 320 KB chunk that Docusaurus prefetches from the navbar link.

## Conventions index

- [CONTRIBUTING.md](./CONTRIBUTING.md) — markdown/doc structure: file path is the URL, `title:` is the only page-title source, images in a sibling `.assets/` folder, the URL contract, translation glossary
- [agents/i18n.md](./agents/i18n.md) — localization in code: locale detection, baseUrl, translated copy, cross-locale anchors, the single-source fallback mechanism, and a step-by-step checklist for adding a locale
