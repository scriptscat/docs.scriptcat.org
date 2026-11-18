import { useState } from "react";
import clsx from "clsx";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { Icon } from "../Icon";
import { Dropdown, type DropdownItem } from "./Dropdown";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl, { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useTheme } from "../useTheme";
import styles from "./landing.module.css";
import stats from "@site/src/data/landing-stats.json";
import { LINKS, abbr, usePrimaryInstall } from "./shared";

// Custom landing-page navbar. The global Docusaurus navbar is hidden on the
// homepage (see custom.css) so this one takes its place; docs pages keep the
// standard navbar. It floats transparently over the hero and frosts once the
// page scrolls beneath it; a hairline along its bottom edge tracks reading
// progress.
export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));
  const logo = useBaseUrl("/img/logo.png");
  // These are plain <a> (not <Link>), so baseUrl — which carries the active
  // locale, e.g. /ru/ — has to be applied by hand. withBaseUrl leaves the
  // absolute store/GitHub URLs untouched.
  const { withBaseUrl } = useBaseUrlUtils();
  const home = useBaseUrl("/");

  const menu = [
    { label: <Translate id="home.nav.docs">文档</Translate>, href: withBaseUrl(LINKS.docs) },
    { label: <Translate id="home.nav.store">脚本商店</Translate>, href: LINKS.store },
    { label: <Translate id="home.nav.dev">开发者</Translate>, href: withBaseUrl(LINKS.dev) },
    // In-page anchor to the AI section; no baseUrl involved.
    { label: <Translate id="home.nav.ai">AI</Translate>, href: "#ai" },
    {
      label: <Translate id="home.nav.changelog">更新日志</Translate>,
      href: withBaseUrl(LINKS.changelog),
    },
  ];

  return (
    <nav className={clsx(styles.lnav, (scrolled || open) && styles.lnavScrolled)}>
      <div className={styles.lnavInner}>
        <a className={styles.lnavBrand} href={home}>
          <img src={logo} width={34} height={34} alt="ScriptCat" className={styles.lnavLogo} />
          <span className={styles.lnavWord}>ScriptCat</span>
        </a>

        <div className={styles.lnavMenu}>
          {menu.map((m, i) => (
            <a key={i} className={styles.lnavLink} href={m.href}>
              {m.label}
            </a>
          ))}
        </div>

        <div className={styles.lnavActions}>
          <ThemeToggle />
          <LangSwitch />
          <a
            className={styles.lnavStar}
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Star ScriptCat on GitHub"
          >
            <Icon icon="lucide:github" />
            <span>Star {abbr(stats.stars)}</span>
          </a>
          <NavInstall />
          <button
            className={styles.lnavBurger}
            aria-label={translate({ id: "home.nav.menu", message: "菜单" })}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={open ? "lucide:x" : "lucide:menu"} width={22} height={22} />
          </button>
        </div>
      </div>

      <m.div
        className={styles.lnavProgress}
        style={{ scaleX: scrollYProgress, opacity: scrolled ? 1 : 0 }}
        aria-hidden
      />

      {open && (
        <div className={styles.lnavPanel}>
          {menu.map((m, i) => (
            <a key={i} className={styles.lnavPanelLink} href={m.href} onClick={() => setOpen(false)}>
              {m.label}
            </a>
          ))}
          <a className={styles.lnavPanelLink} href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub · Star {abbr(stats.stars)}
          </a>
          <div className={styles.lnavPanelLang}>
            <LangSwitch />
          </div>
        </div>
      )}
    </nav>
  );
}

// Points at the detected browser's store, falling back to the install guide
// when we can't confirm one. No dropdown here — the hero's install button one
// scroll down already offers the full browser list, and the navbar is tight.
function NavInstall() {
  const { store, href, external } = usePrimaryInstall();
  return (
    <a
      className={styles.lnavInstall}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <Icon icon={store ? store.icon : "lucide:download"} />
      {store ? (
        <span className={styles.lnavInstallLabel}>
          <Translate id="home.nav.installTo" values={{ browser: store.label }}>
            {"安装到 {browser}"}
          </Translate>
        </span>
      ) : (
        <span className={styles.lnavInstallLabel}>
          <Translate id="home.nav.install">安装扩展</Translate>
        </span>
      )}
    </a>
  );
}

// Toggle the Docusaurus theme directly via the DOM + localStorage (same key
// Docusaurus uses), avoiding useColorMode's ColorModeProvider dependency.
// useTheme() reactively reads the current data-theme attribute.
function ThemeToggle() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const toggle = () => {
    const next = dark ? "light" : "dark";
    const html = document.documentElement;
    html.setAttribute("data-theme", next);
    html.setAttribute("data-theme-choice", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore (private mode)
    }
  };
  return (
    <button
      className={styles.lnavToggle}
      onClick={toggle}
      aria-label={translate({ id: "home.nav.theme", message: "切换主题" })}
    >
      <span className={dark ? styles.lnavToggleOff : styles.lnavToggleOn}>
        <Icon icon="lucide:sun" width={16} height={16} />
      </span>
      <span className={dark ? styles.lnavToggleOn : styles.lnavToggleOff}>
        <Icon icon="lucide:moon" width={16} height={16} />
      </span>
    </button>
  );
}

// The locale list and its labels come straight from docusaurus.config.js
// (i18n.locales / i18n.localeConfigs), so adding a locale there is enough —
// nothing to update here. LandingNav only renders on the homepage, so each
// entry points at that locale's home rather than the translated current page.
function LangSwitch() {
  const { i18n, siteConfig } = useDocusaurusContext();
  const { currentLocale, defaultLocale, locales, localeConfigs } = i18n;
  // siteConfig.baseUrl already carries the active locale (e.g. "/ru/"); strip
  // that back off to recover the site root and build the other homes from it.
  const currentPath = localeConfigs[currentLocale].path;
  const siteRoot =
    currentLocale === defaultLocale
      ? siteConfig.baseUrl
      : siteConfig.baseUrl.slice(0, -(currentPath.length + 1));

  const items: DropdownItem[] = locales.map((locale) => ({
    key: locale,
    label: (
      <a
        className={styles.lnavLangItem}
        href={locale === defaultLocale ? siteRoot : `${siteRoot}${localeConfigs[locale].path}/`}
        lang={localeConfigs[locale].htmlLang}
      >
        {localeConfigs[locale].label}
      </a>
    ),
  }));

  return (
    <Dropdown items={items}>
      {(trigger) => (
        <button {...trigger} className={styles.lnavLang}>
          <Icon icon="lucide:globe" width={16} height={16} />
          <span>{localeConfigs[currentLocale].label}</span>
          <Icon icon="lucide:chevron-down" width={14} height={14} />
        </button>
      )}
    </Dropdown>
  );
}
