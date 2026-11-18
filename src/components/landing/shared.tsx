import { type ReactNode } from "react";
import { Icon } from "../Icon";
import { Dropdown, type DropdownItem } from "./Dropdown";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./landing.module.css";
import { useInstallTarget, type InstallTarget, type StoreKey } from "./detectStore";

export type { InstallTarget, StoreKey };

// ScriptCat brand logo. `white` renders it (a blue silhouette PNG) as white
// via a CSS filter, for use on colored/dark badges.
export function Logo({ size, white }: { size: number; white?: boolean }) {
  return (
    <img
      src={useBaseUrl("/img/logo.png")}
      width={size}
      height={size}
      alt="ScriptCat"
      className={white ? styles.logoWhite : styles.logoImg}
    />
  );
}

// ---- outbound links ---------------------------------------------------
export const LINKS = {
  chrome:
    "https://chrome.google.com/webstore/detail/scriptcat/ndcooeababalnlpkfedmmbbbgkljhpjf",
  edge: "https://microsoftedge.microsoft.com/addons/detail/scriptcat/liilgpjgabokdklappibcjfablkpcekh",
  firefox: "https://addons.mozilla.org/firefox/addon/scriptcat/",
  manual: "https://github.com/scriptscat/scriptcat/releases",
  store: "https://scriptcat.org",
  github: "https://github.com/scriptscat/scriptcat",
  contributors: "https://github.com/scriptscat/scriptcat/graphs/contributors",
  issues: "https://github.com/scriptscat/scriptcat/issues",
  discord: "https://discord.gg/JF76nHCCM7",
  telegram: "https://t.me/scriptscat",
  forum: "https://bbs.tampermonkey.net.cn/",
  docs: "/docs/use/use",
  dev: "/docs/dev",
  api: "/docs/dev/api/",
  changelog: "/docs/change",
  quickstart: "/docs/use/use/",
  installScript: "/docs/use/script_installation/",
  migrate: "/docs/use/from-other/migrate-from-tampermonkey/",
  meta: "/docs/dev/meta/",
  sync: "/docs/use/sync/",
  learn: "https://learn.scriptcat.org/",
  privacy: "/docs/use/policy/privacy/",
  disclaimer: "/docs/use/policy/disclaimer/",
  license: "https://github.com/scriptscat/scriptcat/blob/main/LICENSE",
  search: (kw: string) =>
    `https://scriptcat.org/search?keyword=${encodeURIComponent(kw)}`,
};

// ---- stat formatting --------------------------------------------------
// Numbers come baked from src/data/landing-stats.json (build-time scrape).
// Every stat is abbreviated with a k/M suffix and one decimal place, rounded
// DOWN so the figure never overstates ("4836" → "4.8k", "2251969" → "2.2M",
// "3000" → "3k", "40" → "40"). Same form in every locale.
export function abbr(n: number): string {
  if (!n || n < 1) return "0";
  const fmt = (v: number, suffix: string) => {
    const r = Math.floor(v * 10) / 10; // floor to 1 decimal, never round up
    return `${Number.isInteger(r) ? r : r.toFixed(1)}${suffix}`;
  };
  if (n >= 1_000_000) return fmt(n / 1_000_000, "M");
  if (n >= 1_000) return fmt(n / 1_000, "k");
  return `${Math.floor(n)}`;
}

// ---- shared bits ------------------------------------------------------
export function Eyebrow({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <span className={styles.eyebrow}>
      <Icon icon={icon} />
      {children}
    </span>
  );
}

// ---- browser-adaptive install button ---------------------------------
export const STORES: Record<
  StoreKey,
  { label: string; icon: string; href: string }
> = {
  chrome: { label: "Chrome", icon: "logos:chrome", href: LINKS.chrome },
  edge: { label: "Edge", icon: "logos:microsoft-edge", href: LINKS.edge },
  firefox: { label: "Firefox", icon: "logos:firefox", href: LINKS.firefox },
};

// What the primary install button should point at. `store` is null when we
// couldn't confirm the browser, in which case we send people to the install
// guide (an internal page, hence `external: false`) rather than guess a store.
// Callers pick their own icon + label off `store`; the wording differs per
// placement, but the href/target logic shouldn't be re-derived three times.
export function usePrimaryInstall(): {
  target: InstallTarget;
  store: { label: string; icon: string; href: string } | null;
  href: string;
  external: boolean;
} {
  const target = useInstallTarget();
  const store = target === "unknown" ? null : STORES[target];
  // Callers render this as a plain <a>, so the internal fallback needs baseUrl
  // (which carries the active locale) applied here.
  const guide = useBaseUrl(LINKS.docs);
  return {
    target,
    store,
    href: store ? store.href : guide,
    external: store !== null,
  };
}

export function InstallButton() {
  const { store, href, external } = usePrimaryInstall();

  const items: DropdownItem[] = [
    {
      key: "edge",
      label: (
        <a
          className={styles.menuItem}
          href={LINKS.edge}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="logos:microsoft-edge" className={styles.browserIcon} />
          <Translate id="home.install.edge">添加到 Edge 浏览器</Translate>
        </a>
      ),
    },
    {
      key: "chrome",
      label: (
        <a
          className={styles.menuItem}
          href={LINKS.chrome}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="logos:chrome" className={styles.browserIcon} />
          <Translate id="home.install.chrome">添加到 Chrome 浏览器</Translate>
        </a>
      ),
    },
    {
      key: "firefox",
      label: (
        <a
          className={styles.menuItem}
          href={LINKS.firefox}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="logos:firefox" className={styles.browserIcon} />
          <Translate id="home.install.firefox">添加到 Firefox 浏览器</Translate>
        </a>
      ),
    },
    {
      key: "manual",
      label: (
        <a
          className={styles.menuItem}
          href={LINKS.manual}
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.menuManualIcon}>
            <Icon icon="lucide:package" width={14} height={14} />
          </span>
          <Translate id="home.install.manual">下载安装包手动安装</Translate>
        </a>
      ),
    },
  ];

  return (
    <div className={styles.installWrap}>
      <div className={styles.install}>
        <a
          className={styles.installMain}
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          <Icon
            icon={store ? store.icon : "lucide:book-open"}
            className={styles.browserIcon}
          />
          {store ? (
            <Translate id="home.hero.installTo" values={{ browser: store.label }}>
              {"添加到 {browser} 浏览器"}
            </Translate>
          ) : (
            <Translate id="home.install.guide">查看安装指南</Translate>
          )}
        </a>
        <span className={styles.installDivider} />
        <Dropdown items={items}>
          {(trigger) => (
            <button
              {...trigger}
              className={styles.installArrow}
              aria-label={translate({
                id: "home.hero.moreBrowsers",
                message: "更多浏览器",
              })}
            >
              <Icon icon="lucide:chevron-down" width={18} height={18} />
            </button>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
