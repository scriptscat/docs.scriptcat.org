import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { useInView, useReducedMotion } from "motion/react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import a from "./ai.module.css";
import { Eyebrow } from "./shared";
import { CANCELLED, Reveal, spotlight, waitWhile } from "./motion";

/* =========================================================================
   AI — an AI coding agent writes a userscript, installs it with sctl and
   checks it in the real browser, typed out in a terminal; beside it, the
   three ways ScriptCat meets AI, each linking into the docs.
   ========================================================================= */

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "agent"; text: string }
  | { kind: "cmd"; text: string }
  | { kind: "ok"; text: string };

export function AI() {
  const cards = [
    {
      icon: "lucide:bot",
      color: "var(--lp-violet)",
      soft: "var(--lp-violet-soft)",
      title: <Translate id="home.ai.agents.t">AI 编码代理</Translate>,
      desc: (
        <Translate id="home.ai.agents.d">
          给 Claude Code、Codex 装上 scriptcat-userscript 与 sctl 两个 skill，它就懂脚本猫的写法，还能在你的浏览器里验证效果、自己修复。
        </Translate>
      ),
      link: <Translate id="home.ai.agents.l">用 AI 开发脚本</Translate>,
      to: "/docs/dev/ai/",
    },
    {
      icon: "lucide:square-terminal",
      color: "var(--lp-brand-deep)",
      soft: "var(--lp-brand-soft)",
      title: <Translate id="home.ai.sctl.t">sctl 命令行</Translate>,
      desc: (
        <Translate id="home.ai.sctl.d">
          在终端里列出、安装、运行脚本并读取日志；也能操作标签页与页面，或把 CDP 交给 Playwright。
        </Translate>
      ),
      link: <Translate id="home.ai.sctl.l">sctl 入门</Translate>,
      to: "/docs/use/sctl/",
    },
  ];

  return (
    <section className={clsx(styles.section, a.ai)} id="ai">
      <div className={a.aurora} aria-hidden />
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:sparkles">
            <Translate id="home.ai.eyebrow">AI 接入 · AI READY</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <Translate id="home.ai.title1">让 AI 帮你</Translate>
          <span className={a.hl}>
            <Translate id="home.ai.title2">写脚本、跑脚本</Translate>
          </span>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.ai.sub">
            通过 sctl 命令行，Claude Code、Codex 等 AI 编码代理可以直接为脚本猫编写脚本，装进你的浏览器验证效果，发现问题自己改完再试。
          </Translate>
        </Reveal>
      </div>

      <div className={a.body}>
        <Reveal className={a.termWrap} y={32}>
          <Terminal />
        </Reveal>
        <div className={a.cards}>
          {cards.map((c, i) => (
            <Reveal key={i} delay={0.1 + i * 0.12} y={24}>
              <Link className={a.card} to={c.to} onPointerMove={spotlight}>
                <span className={a.cardIcon} style={{ background: c.soft, color: c.color }}>
                  <Icon icon={c.icon} />
                </span>
                <span className={a.cardText}>
                  <span className={a.cardTitle}>
                    {c.title}
                  </span>
                  <span className={a.cardDesc}>{c.desc}</span>
                  <span className={a.cardLink} style={{ color: c.color }}>
                    {c.link}
                    <Icon icon="lucide:arrow-right" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lines appear one at a time: prompts and commands type character by
// character, agent/tool output lands whole after a beat. SSR (and reduced
// motion) render every line; after hydration the lines are hidden until
// typed, holding their space so the terminal never changes height.
function Terminal() {
  const lines: Line[] = [
    { kind: "prompt", text: translate({ id: "home.ai.term.prompt", message: "帮我写个脚本：B 站视频默认切到 1080P，然后装到浏览器里试试" }) },
    { kind: "agent", text: translate({ id: "home.ai.term.wrote", message: "已编写 {file}" }, { file: "bili-1080p.user.js" }) },
    { kind: "cmd", text: "sctl install ./bili-1080p.user.js" },
    { kind: "ok", text: translate({ id: "home.ai.term.installed", message: "已安装到脚本猫" }) },
    { kind: "cmd", text: "sctl tabs open https://www.bilibili.com/video/BV1xx411c7mD" },
    { kind: "cmd", text: "sctl debug console --tab 3 --level error" },
    { kind: "ok", text: translate({ id: "home.ai.term.verified", message: "没有报错，画质已切换为 1080P" }) },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // `shown` lines are complete; line `shown` is typed up to `chars`.
  const [shown, setShown] = useState(lines.length);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!reduce) setShown(0);
  }, [reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    let dead = false;
    const wait = (ms: number) => waitWhile(ms, () => document.hidden, () => dead);
    (async () => {
      await wait(300);
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.kind === "prompt" || l.kind === "cmd") {
          for (let c = 1; c <= l.text.length; c++) {
            setChars(c);
            await wait(l.kind === "prompt" ? 34 : 22);
          }
          await wait(260);
        } else {
          await wait(l.kind === "agent" ? 700 : 420);
        }
        setShown(i + 1);
        setChars(0);
      }
    })().catch((e) => {
      if (e !== CANCELLED) throw e;
    });
    return () => {
      dead = true;
    };
    // lines are derived from translate() and stable for the page's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const done = shown >= lines.length;
  return (
    <div className={a.term} ref={ref} aria-label={lines.map((l) => l.text).join("\n")} role="img">
      <div className={a.termBar}>
        <i style={{ background: "#ff5f57" }} />
        <i style={{ background: "#febc2e" }} />
        <i style={{ background: "#28c840" }} />
        <span>~/scripts — claude</span>
      </div>
      <div className={a.termBody} aria-hidden>
        {lines.map((l, i) => {
          const typing = i === shown;
          const visible = i < shown || (typing && (l.kind === "prompt" || l.kind === "cmd") && chars > 0);
          const text = typing ? l.text.slice(0, chars) : l.text;
          return (
            <TermLine key={i} kind={l.kind} hidden={!visible}>
              {text}
              {typing && visible && <span className={a.caret} />}
            </TermLine>
          );
        })}
        {done && (
          <TermLine kind="prompt">
            <span className={a.caret} />
          </TermLine>
        )}
      </div>
    </div>
  );
}

function TermLine({ kind, hidden, children }: { kind: Line["kind"]; hidden?: boolean; children: ReactNode }) {
  const mark = { prompt: ">", agent: "⏺", cmd: "$", ok: "✓" }[kind];
  return (
    <div className={clsx(a.line, a[kind], hidden && a.lineHidden)}>
      <span className={a.mark}>{mark}</span>
      <span className={a.lineText}>{children}</span>
    </div>
  );
}
