import type { ReactNode } from "react";
import clsx from "clsx";
import { m, useReducedMotion } from "motion/react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import f from "./features.module.css";
import { Eyebrow, LINKS } from "./shared";
import { Reveal, spotlight } from "./motion";

/* =========================================================================
   WHY SCRIPTCAT — a bento grid. Each tile animates its own idea: the
   Tampermonkey header types itself in and the "runs on" badge flips between
   the two managers; the store tile is an endless column of scripts; the
   security tile scans; the sync tile streams dots between devices.
   ========================================================================= */
export function Features() {
  return (
    <section className={clsx(styles.section, f.features)} id="features">
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:boxes">
            <Translate id="home.feat.eyebrow">核心能力 · WHY SCRIPTCAT</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <Translate id="home.feat.title1">强大内核，</Translate>
          <span className={styles.hl}>
            <Translate id="home.feat.title2">安心之选</Translate>
          </span>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.feat.sub">
            从兼容性到安全性，从普通用户到开发者，ScriptCat 都替你想到了。
          </Translate>
        </Reveal>
      </div>

      <div className={f.bento}>
        <Tile className={f.compat} delay={0} to={LINKS.migrate}>
          <div className={f.compatText}>
            <span className={f.icon} style={{ background: "var(--lp-brand-soft)", color: "var(--lp-brand)" }}>
              <Icon icon="lucide:replace" />
            </span>
            <h3 className={f.title}>
              <Translate id="home.feat.compat.t">兼容 Tampermonkey</Translate>
            </h3>
            <p className={f.desc}>
              <Translate id="home.feat.compat.d">
                完全兼容 Tampermonkey 脚本格式与 GM API，现有脚本零改动直接迁移，切换毫无成本。
              </Translate>
            </p>
            <span className={f.bullet}>
              <Icon icon="lucide:circle-check-big" />
              <Translate id="home.feat.compat.b">支持 GM_* API · 元数据头完全一致</Translate>
            </span>
            <More color="var(--lp-brand-deep)">
              <Translate id="home.feat.compat.l">了解迁移</Translate>
            </More>
          </div>
          <CompatCode />
        </Tile>

        <Tile className={f.store} delay={0.1} to={LINKS.store}>
          <span className={f.icon} style={{ background: "linear-gradient(135deg, #ff9a5a, #f05e1c)", color: "#fff" }}>
            <Icon icon="lucide:store" />
          </span>
          <h3 className={f.title}>
            <Translate id="home.feat.store.t">脚本商店</Translate>
          </h3>
          <p className={f.desc}>
            <Translate id="home.feat.store.d">
              上万款社区脚本一键安装，也能发布你的作品，与社区共建生态。
            </Translate>
          </p>
          <More color="var(--lp-accent-deep)">
            <Translate id="home.link.store">去脚本商店</Translate>
          </More>
          <StoreMarquee />
        </Tile>

        <Tile className={f.secure} delay={0.15} to={LINKS.meta}>
          <div className={f.scan} aria-hidden>
            <span className={f.scanBeam} />
            <span className={f.shield}>
              <Icon icon="lucide:shield-check" />
            </span>
            <span className={clsx(f.perm, f.perm1)} dir="ltr">@connect</span>
            <span className={clsx(f.perm, f.perm2)} dir="ltr">@grant</span>
            <span className={clsx(f.perm, f.perm3)} dir="ltr">@match</span>
          </div>
          <h3 className={f.title}>
            <Translate id="home.feat.secure.t">安全可靠</Translate>
          </h3>
          <p className={f.desc}>
            <Translate id="home.feat.secure.d">权限透明可控，脚本行为可见，从源头拒绝恶意脚本。</Translate>
          </p>
          <More color="var(--lp-mint)">
            <Translate id="home.feat.secure.l">了解权限声明</Translate>
          </More>
        </Tile>

        <Tile className={f.sync} delay={0.2} to={LINKS.sync}>
          <div className={f.devices} aria-hidden>
            <span className={f.device}>
              <Icon icon="lucide:laptop" />
            </span>
            <span className={f.wire}>
              <i />
            </span>
            <span className={clsx(f.device, f.cloud)}>
              <Icon icon="lucide:cloud" />
            </span>
            <span className={clsx(f.wire, f.wireRev)}>
              <i />
            </span>
            <span className={f.device}>
              <Icon icon="lucide:smartphone" />
            </span>
          </div>
          <h3 className={f.title}>
            <Translate id="home.feat.sync.t">云端同步</Translate>
          </h3>
          <p className={f.desc}>
            <Translate id="home.feat.sync.d">脚本与配置多端云同步，换设备、重装也不丢失。</Translate>
          </p>
          <More color="var(--lp-brand-deep)">
            <Translate id="home.feat.sync.l">了解同步</Translate>
          </More>
        </Tile>
      </div>
    </section>
  );
}

// The whole tile is the link (as with the AI cards); <Link> opens external
// URLs such as the store in a new tab on its own.
function Tile({ className, delay, to, children }: { className: string; delay: number; to: string; children: ReactNode }) {
  return (
    <Reveal className={clsx(f.tile, className)} delay={delay} y={32}>
      <Link className={f.tileInner} to={to} onPointerMove={spotlight}>
        {children}
      </Link>
    </Reveal>
  );
}

// The tile's visible call to action; the arrow nudges when the tile is hovered.
function More({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className={f.more} style={{ color }}>
      {children}
      <Icon icon="lucide:arrow-right" />
    </span>
  );
}

// The metadata block types in line by line once the tile scrolls into view;
// below it the "runs on" badge alternates between the two managers.
function CompatCode() {
  const reduce = useReducedMotion();
  const lines = [
    { cls: f.cComment, text: "// ==UserScript==" },
    { cls: f.cMeta, text: `// @name    ${translate({ id: "home.hero.mock.speed", message: "视频倍速控制" })}` },
    { cls: f.cMeta, text: "// @match   *://*.bilibili.com/*" },
    { cls: f.cGrant, text: "// @grant   GM_setValue" },
    { cls: f.cComment, text: "// ==/UserScript==" },
  ];
  return (
    <div className={f.code} dir="ltr" aria-hidden>
      <div className={f.codeBar}>
        <i style={{ background: "#ff5f57" }} />
        <i style={{ background: "#febc2e" }} />
        <i style={{ background: "#28c840" }} />
        <span>userscript.js</span>
      </div>
      <m.div className={f.codeBody} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
        {lines.map((l, i) => (
          <m.div
            key={i}
            className={clsx(f.codeLine, l.cls)}
            variants={{
              show: {
                clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
                transition: reduce ? { duration: 0 } : { duration: 0.5, delay: 0.3 + i * 0.28, ease: "linear" },
              },
            }}
          >
            {l.text}
          </m.div>
        ))}
      </m.div>
      <div className={f.runsOn}>
        <span className={f.runsLabel}>
          <Translate id="home.feat.compat.run">同一脚本，直接运行</Translate>
        </span>
        <span className={f.flip}>
          <span>
            <Icon icon="lucide:check" /> Tampermonkey
          </span>
          <span>
            <Icon icon="lucide:check" /> ScriptCat
          </span>
        </span>
      </div>
    </div>
  );
}

function StoreMarquee() {
  const items = [
    { icon: "lucide:gauge", bg: "var(--lp-brand-soft)", color: "var(--lp-brand-deep)", name: <Translate id="home.hero.mock.speed">视频倍速控制</Translate>, n: "12.4k" },
    { icon: "lucide:ban", bg: "var(--lp-accent-soft)", color: "var(--lp-accent-deep)", name: <Translate id="home.hero.mock.adblock">自动跳过广告</Translate>, n: "9.8k" },
    { icon: "lucide:moon", bg: "var(--lp-violet-soft)", color: "var(--lp-violet)", name: <Translate id="home.hero.mock.dark">网页夜间模式</Translate>, n: "7.1k" },
    { icon: "lucide:calendar-check", bg: "var(--lp-mint-soft)", color: "var(--lp-mint)", name: <Translate id="home.dev.mock.name">每日自动签到</Translate>, n: "5.6k" },
    { icon: "lucide:shopping-cart", bg: "var(--lp-amber-soft)", color: "var(--lp-amber-deep)", name: <Translate id="home.sc.shop.l">购物助手</Translate>, n: "4.3k" },
    { icon: "lucide:languages", bg: "var(--lp-violet-soft)", color: "var(--lp-violet)", name: <Translate id="home.sc.stage.read">沉浸式翻译</Translate>, n: "3.9k" },
  ];
  // Rendered twice back to back; the column scrolls by exactly one copy and
  // loops, so the seam never shows.
  const list = (copy: number) =>
    items.map((it, i) => (
      <div className={f.script} key={`${copy}-${i}`}>
        <span className={f.scriptChip} style={{ background: it.bg, color: it.color }}>
          <Icon icon={it.icon} />
        </span>
        <span className={f.scriptName}>{it.name}</span>
        <span className={f.scriptN} dir="ltr">
          <Icon icon="lucide:download" />
          {it.n}
        </span>
      </div>
    ));
  return (
    <div className={f.marquee} aria-hidden>
      <div className={f.marqueeTrack}>
        {list(0)}
        {list(1)}
      </div>
    </div>
  );
}

