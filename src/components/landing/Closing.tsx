import { useRef, type PointerEvent } from "react";
import clsx from "clsx";
import { m, useReducedMotion, useSpring, useTransform } from "motion/react";
import Translate from "@docusaurus/Translate";
import stats from "@site/src/data/landing-stats.json";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import c from "./closing.module.css";
import { Eyebrow, LINKS, Logo, abbr, usePrimaryInstall } from "./shared";
import { EASE, Reveal } from "./motion";

/* =========================================================================
   COMMUNITY — contributor avatars ripple in from the centre outwards.
   ========================================================================= */
const FALLBACK_COLORS = [
  "#1296DB", "#FF7A3D", "#12B28C", "#6C5CE7", "#EFA31D", "#42B4F5",
  "#F05E1C", "#0E8A6C", "#7C6CF5", "#E4899B", "#3AACEF", "#F4A825",
  "#5FC7A8", "#8E7CF0", "#FF9A5A", "#4FB0E5", "#2FB89A", "#B07CF0",
];
const SHOWN = 39;

export function Community() {
  const list = (stats.contributors.list || []).slice(0, SHOWN);
  const remaining = stats.contributors.count - list.length;
  const cols = 13;
  // delay grows with distance from the middle of the wall
  const delay = (i: number) => {
    const x = (i % cols) - (cols - 1) / 2;
    const y = Math.floor(i / cols) - 1;
    return 0.1 + Math.hypot(x, y * 1.4) * 0.045;
  };
  const pop = (i: number) => ({
    show: {
      opacity: [0, 1],
      scale: [0.4, 1],
      transition: { type: "spring" as const, stiffness: 320, damping: 18, delay: delay(i) },
    },
  });

  return (
    <section className={clsx(styles.section, c.community)}>
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:heart-handshake">
            <Translate id="home.comm.eyebrow">开源社区 · OPEN SOURCE</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <Translate id="home.comm.title1">由社区，</Translate>
          <span className={styles.hl}>
            <Translate id="home.comm.title2">共同打造</Translate>
          </span>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.comm.sub">
            完全开源、透明、免费。每一行代码都可审阅，每一位贡献者都被看见。
          </Translate>
        </Reveal>
      </div>

      <m.div className={c.wall} whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        {list.length > 0
          ? list.map((u, i) => (
              <m.a
                key={u.login}
                className={c.avatarLink}
                href={u.url}
                target="_blank"
                rel="noreferrer"
                title={u.login}
                variants={pop(i)}
              >
                <img className={c.avatar} src={u.avatar} alt={u.login} width={46} height={46} loading="lazy" />
              </m.a>
            ))
          : FALLBACK_COLORS.map((color, i) => (
              <m.span key={i} className={clsx(c.avatarLink, c.avatar)} style={{ background: color }} variants={pop(i)} />
            ))}
        {remaining > 0 && (
          <m.a className={clsx(c.avatarLink, c.more)} href={LINKS.contributors} target="_blank" rel="noreferrer" variants={pop(list.length)}>
            +{remaining}
          </m.a>
        )}
      </m.div>

      <Reveal className={c.actions} delay={0.2}>
        <a className={c.ghBtn} href={LINKS.github} target="_blank" rel="noreferrer">
          <Icon icon="lucide:github" />
          <Translate id="home.comm.btn">在 GitHub 上参与贡献</Translate>
          <Icon icon="lucide:arrow-right" />
        </a>
        <a className={c.starBtn} href={LINKS.github} target="_blank" rel="noreferrer">
          <Icon icon="lucide:star" />
          <span dir="ltr">{abbr(stats.stars)}</span>
        </a>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   FINAL CTA — a glow follows the pointer across the card; the mascot bobs.
   ========================================================================= */
export function FinalCTA() {
  const { store, href, external } = usePrimaryInstall();
  const reduce = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const gx = useSpring(0.75, { stiffness: 80, damping: 20 });
  const gy = useSpring(0.4, { stiffness: 80, damping: 20 });
  const left = useTransform(gx, (n) => `${n * 100}%`);
  const top = useTransform(gy, (n) => `${n * 100}%`);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !card.current) return;
    const r = card.current.getBoundingClientRect();
    gx.set((e.clientX - r.left) / r.width);
    gy.set((e.clientY - r.top) / r.height);
  };
  return (
    <section className={c.finalCta}>
      <Reveal className={c.cardWrap} y={40}>
        <div className={c.card} ref={card} onPointerMove={onMove}>
          <m.div
            className={c.follow}
            aria-hidden
            style={{ left, top }}
          />
          <div className={c.cardGlow} aria-hidden />
          <div className={c.left}>
            <span className={c.eyebrow}>
              <Icon icon="lucide:badge-check" />
              <Translate id="home.cta.eyebrow">完全免费 · 开源 · 无广告</Translate>
            </span>
            <h2 className={c.headline}>
              <Translate id="home.cta.h1">准备好给浏览器</Translate>
              <br />
              <span className={c.hl}>
                <Translate id="home.cta.h2">开挂</Translate>
              </span>
              <Translate id="home.cta.h3">了吗？</Translate>
            </h2>
            <p className={c.sub}>
              <Translate id="home.cta.sub">
                从应用商店一键安装，或下载安装包手动安装。30 秒，解锁网页超能力。
              </Translate>
            </p>
            <div className={c.btns}>
              <a className={c.primary} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                <Icon icon={store ? store.icon : "lucide:book-open"} width={20} height={20} />
                {store ? (
                  <Translate id="home.cta.primary" values={{ browser: store.label }}>
                    {"免费安装到 {browser}"}
                  </Translate>
                ) : (
                  <Translate id="home.install.guide">查看安装指南</Translate>
                )}
              </a>
              <a className={c.secondary} href={LINKS.store} target="_blank" rel="noreferrer">
                <Icon icon="lucide:compass" />
                <Translate id="home.cta.secondary">浏览脚本库</Translate>
              </a>
            </div>
            <div className={c.stores}>
              <Translate id="home.cta.stores">支持 Edge · Chrome · Firefox · 手动安装包</Translate>
            </div>
          </div>
          <div className={c.mascot} aria-hidden>
            <span className={c.orbit}>
              <i />
              <i />
              <i />
            </span>
            <m.div
              className={c.mascotCircle}
              whileHover={{ scale: 1.06, rotate: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >
              <Logo size={96} white />
              <span className={c.spark}>
                <Icon icon="lucide:sparkles" />
              </span>
            </m.div>
            <m.div
              className={c.mascotChip}
              whileInView={{ opacity: [0, 1], y: [12, 0], scale: [0.9, 1] }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
            >
              <Icon icon="lucide:check" />
              <Translate id="home.cta.chip">已安装并运行</Translate>
            </m.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
