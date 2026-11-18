import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { m, useInView, useReducedMotion } from "motion/react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import d from "./developers.module.css";
import { Eyebrow, LINKS, Logo } from "./shared";
import { CANCELLED, Reveal, waitWhile } from "./motion";

/* =========================================================================
   FOR DEVELOPERS — always dark. The editor types out a scheduled background
   script line by line, the Run button fires, and the console reports each
   step. The feature list on the other side folds in what used to be the
   "background scripts / powerful API" tiles of the features grid.
   ========================================================================= */
export function Developers() {
  const feats = [
    { icon: "lucide:cpu", t: <Translate id="home.dev.bg.t">后台脚本</Translate>, d: <Translate id="home.dev.bg.d">无需常驻标签页，脚本可在后台持续运行。</Translate> },
    { icon: "lucide:plug-zap", t: <Translate id="home.dev.api.t">强大 API</Translate>, d: <Translate id="home.dev.api.d">文件存储、定时任务 cron、跨域请求一应俱全。</Translate> },
    { icon: "lucide:file-code", t: <Translate id="home.dev.editor.t">内置编辑器</Translate>, d: <Translate id="home.dev.editor.d">语法高亮、智能补全、错误提示，写脚本更顺手。</Translate> },
    { icon: "lucide:bug", t: <Translate id="home.dev.debug.t">实时调试</Translate>, d: <Translate id="home.dev.debug.d">日志、运行记录、错误追踪，问题一目了然。</Translate> },
  ];
  return (
    <section className={clsx(styles.section, d.dev)}>
      <div className={d.glow} aria-hidden />
      <div className={d.gridBg} aria-hidden />
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:terminal">
            <Translate id="home.dev.eyebrow">为开发者而生 · FOR DEVELOPERS</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <Translate id="home.dev.title1">把浏览器，变成你的</Translate>
          <span className={styles.hl}>
            <Translate id="home.dev.title2">代码运行时</Translate>
          </span>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.dev.sub">
            后台脚本、丰富 API、内置编辑器与调试工具 —— 从写下第一行到上线运行，一站式搞定。
          </Translate>
        </Reveal>
      </div>

      <div className={d.body}>
        <div className={d.left}>
          {feats.map((f, i) => (
            <Reveal key={i} className={d.feature} delay={i * 0.08} y={18}>
              <span className={d.featureChip}>
                <Icon icon={f.icon} />
              </span>
              <span>
                <h3 className={d.featureTitle}>{f.t}</h3>
                <p className={d.featureDesc}>{f.d}</p>
              </span>
            </Reveal>
          ))}
          <Reveal className={d.ctas} delay={0.35} y={18}>
            <Link className={clsx(styles.btn, styles.btnPrimary)} to={LINKS.dev}>
              <Icon icon="lucide:book-open" width={16} height={16} />
              <Translate id="home.dev.docsBtn">阅读开发文档</Translate>
            </Link>
            <Link className={d.apiBtn} to={LINKS.api}>
              <Translate id="home.dev.apiBtn">API 参考</Translate>
              <Icon icon="lucide:arrow-right" />
            </Link>
          </Reveal>
        </div>
        <Reveal className={d.editorWrap} y={32} delay={0.1}>
          <Editor />
        </Reveal>
      </div>
    </section>
  );
}

const toast = () => translate({ id: "home.dev.mock.toast", message: "签到成功" });

// Fixed 11 lines: the gutter numbers are hardcoded, so no line may wrap
// (see agents/i18n.md §5 on translated copy inside code mocks).
function codeLines() {
  return [
    <span className={d.cComment}>{"// ==UserScript=="}</span>,
    <span className={d.cMeta}>{`// @name  ${translate({ id: "home.dev.mock.name", message: "每日自动签到" })}`}</span>,
    <span className={d.cMeta}>{"// @crontab  0 9 * * *"}</span>,
    <span className={d.cComment}>{"// ==/UserScript=="}</span>,
    <>&nbsp;</>,
    <>
      <span className={d.cKw}>async function </span>
      <span className={d.cFn}>checkIn</span>
      <span>() {"{"}</span>
    </>,
    <>
      {"  "}
      <span className={d.cKw}>const </span>r = <span className={d.cKw}>await </span>
      <span className={d.cApi}>GM.fetch</span>(api)
    </>,
    <>
      {"  "}
      <span className={d.cApi}>GM_notification</span>
      <span className={d.cStr}>{`('${toast()}')`}</span>
    </>,
    <>{"}"}</>,
    <>&nbsp;</>,
    <>
      <span className={d.cFn}>checkIn</span>()
    </>,
  ];
}

function Editor() {
  const lines = codeLines();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const logs = [
    { tone: d.logInfo, text: `cron 0 9 * * * · ${translate({ id: "home.dev.log.trigger", message: "定时触发" })}` },
    { tone: d.logInfo, text: "GM.fetch(api) → 200 OK" },
    { tone: d.logOk, text: `ScriptCat › ${toast()} · 200 OK` },
  ];
  const [logCount, setLogCount] = useState(logs.length);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!reduce) setLogCount(0);
  }, [reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    let dead = false;
    const wait = (ms: number) => waitWhile(ms, () => document.hidden, () => dead);
    (async () => {
      // typing (driven by the line variants below) takes ~2.6s
      await wait(2800);
      setRunning(true);
      for (let i = 1; i <= logs.length; i++) {
        await wait(i === 1 ? 500 : 650);
        setLogCount(i);
      }
      await wait(600);
      setRunning(false);
    })().catch((e) => {
      if (e !== CANCELLED) throw e;
    });
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  return (
    <div className={d.editor} ref={ref} dir="ltr" aria-hidden>
      <div className={d.editorBar}>
        <span className={d.dots}>
          <i style={{ background: "#ff5f57" }} />
          <i style={{ background: "#febc2e" }} />
          <i style={{ background: "#28c840" }} />
        </span>
        <span className={d.file}>
          <Logo size={15} />
          checkin.user.js
        </span>
        <span className={d.bgChip}>
          <i />
          <Translate id="home.dev.bgRunning">后台运行中</Translate>
        </span>
        <span className={clsx(d.run, running && d.runActive)}>
          <Icon icon="lucide:play" />
          <Translate id="home.dev.run">运行</Translate>
        </span>
      </div>
      <m.div className={d.area} whileInView="show" viewport={{ once: true, amount: 0.45 }}>
        <div className={d.gutter}>
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className={d.code}>
          {lines.map((l, i) => (
            <m.div
              key={i}
              className={d.codeLine}
              variants={{
                show: {
                  clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
                  transition: reduce ? { duration: 0 } : { duration: 0.32, delay: 0.2 + i * 0.22, ease: "linear" },
                },
              }}
            >
              {l}
            </m.div>
          ))}
        </div>
      </m.div>
      <div className={d.console}>
        {logs.map((l, i) => (
          <div key={i} className={clsx(d.log, l.tone, i >= logCount && d.logHidden)}>
            <span className={d.logTime}>09:00:0{i}</span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
