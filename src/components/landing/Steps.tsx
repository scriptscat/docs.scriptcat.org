import clsx from "clsx";
import { m } from "motion/react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import st from "./steps.module.css";
import { Eyebrow, LINKS } from "./shared";
import { EASE, Reveal } from "./motion";

/* =========================================================================
   GET STARTED — three cards on a track that draws itself left to right as
   the row scrolls in. Each card's preview pill carries a small looping
   hint of the step (a progress bar, a typing caret, a check pulse).
   ========================================================================= */
export function Steps() {
  const steps = [
    {
      no: "01",
      soft: "var(--lp-brand-soft)",
      color: "var(--lp-brand-deep)",
      icon: "lucide:puzzle",
      title: <Translate id="home.step1.t">安装扩展</Translate>,
      desc: <Translate id="home.step1.d">从 Chrome / Edge / Firefox 商店一键添加，或手动安装。</Translate>,
      pIcon: "lucide:globe",
      preview: <Translate id="home.step1.p">添加到浏览器</Translate>,
      link: <Translate id="home.install.guide">查看安装指南</Translate>,
      to: LINKS.quickstart,
      fx: st.fxProgress,
    },
    {
      no: "02",
      soft: "var(--lp-accent-soft)",
      color: "var(--lp-accent-deep)",
      icon: "lucide:store",
      title: <Translate id="home.step2.t">逛脚本商店</Translate>,
      desc: <Translate id="home.step2.d">在脚本猫社区浏览上万款脚本，挑一个心仪的。</Translate>,
      pIcon: "lucide:search",
      preview: <Translate id="home.step2.p">搜索：视频倍速</Translate>,
      link: <Translate id="home.link.store">去脚本商店</Translate>,
      to: LINKS.store,
      fx: st.fxCaret,
    },
    {
      no: "03",
      soft: "var(--lp-mint-soft)",
      color: "var(--lp-mint)",
      icon: "lucide:mouse-pointer-click",
      title: <Translate id="home.step3.t">一键安装</Translate>,
      desc: <Translate id="home.step3.d">点击安装，脚本立刻在对应网页生效，即装即用。</Translate>,
      pIcon: "lucide:circle-check",
      preview: <Translate id="home.step3.p">已安装 · 立即生效</Translate>,
      link: <Translate id="home.step3.l">如何安装脚本</Translate>,
      to: LINKS.installScript,
      fx: st.fxPulse,
    },
  ];
  return (
    <section className={clsx(styles.section, st.steps)}>
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:rocket">
            <Translate id="home.step.eyebrow">三步上手 · GET STARTED</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <span className={styles.hl}>
            <Translate id="home.step.title1">30 秒</Translate>
          </span>
          <Translate id="home.step.title2">，用上你的第一个脚本</Translate>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.step.sub">没有复杂配置，跟着三步走即可，即装即用。</Translate>
        </Reveal>
      </div>

      <div className={st.row}>
        <div className={st.track} aria-hidden>
          <m.div
            className={st.trackFill}
            whileInView={{ scaleX: [0, 1] }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          />
        </div>
        {steps.map((s, i) => (
          <Reveal key={s.no} className={st.card} delay={0.15 + i * 0.18} y={32}>
            <div className={st.head}>
              <span className={st.node} style={{ background: s.color }}>
                {s.no}
              </span>
              <span className={st.chip} style={{ background: s.soft, color: s.color }}>
                <Icon icon={s.icon} />
              </span>
            </div>
            <h3 className={st.title}>{s.title}</h3>
            <p className={st.desc}>{s.desc}</p>
            <Link className={st.more} to={s.to} style={{ color: s.color }}>
              {s.link}
              <Icon icon="lucide:arrow-right" />
            </Link>
            <div className={clsx(st.preview, s.fx)} style={{ color: s.color }}>
              <Icon icon={s.pIcon} />
              <span className={st.previewText}>{s.preview}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
