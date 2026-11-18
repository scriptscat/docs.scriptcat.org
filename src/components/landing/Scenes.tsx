import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  animate as animateValue,
  m,
  useAnimate,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Translate, { translate } from "@docusaurus/Translate";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import s from "./scenes.module.css";
import { Eyebrow, LINKS, Logo } from "./shared";
import { EASE, Reveal } from "./motion";

/* =========================================================================
   SCENARIOS — a sticky browser "stage" beside a column of five scenario
   blurbs. Scrolling a blurb to the middle of the viewport makes it active and
   plays its little story on the stage. Plain CSS sticky, no scroll-jacking:
   the page scrolls at its natural speed and every blurb is ordinary content.
   ========================================================================= */

type Step = {
  tag: ReactNode;
  script: ReactNode;
  icon: string;
  title: ReactNode;
  desc: ReactNode;
  link: ReactNode;
  kw: string;
  color: string;
  soft: string;
  glow: string;
  addr: string;
};

export function Scenes() {
  const steps: Step[] = [
    {
      tag: <Translate id="home.sc.adblock.t">去广告 · 净化</Translate>,
      script: <Translate id="home.hero.mock.adblock">自动跳过广告</Translate>,
      icon: "lucide:shield-check",
      title: <Translate id="home.sc.adblock.h">广告和弹窗，一扫而空</Translate>,
      desc: <Translate id="home.sc.adblock.d">屏蔽广告与弹窗，还网页一个清爽干净。</Translate>,
      link: <Translate id="home.sc.adblock.l">去广告脚本</Translate>,
      kw: translate({ id: "home.search.kw.adblock", message: "去广告" }),
      color: "var(--lp-accent-deep)",
      soft: "var(--lp-accent-soft)",
      glow: "rgba(255, 122, 61, 0.35)",
      addr: "news.example.com/article",
    },
    {
      tag: <Translate id="home.sc.video.t">视频 · 增强</Translate>,
      script: <Translate id="home.hero.mock.speed">视频倍速控制</Translate>,
      icon: "lucide:play",
      title: <Translate id="home.sc.featured.t">视频体验，全面增强</Translate>,
      desc: (
        <Translate id="home.sc.featured.d">
          倍速播放、自动跳广告、一键下载、画中画 —— 让 Bilibili / YouTube / Netflix 更好用。
        </Translate>
      ),
      link: <Translate id="home.sc.featured.btn">浏览视频脚本</Translate>,
      kw: translate({ id: "home.search.kw.video", message: "视频" }),
      color: "var(--lp-brand-deep)",
      soft: "var(--lp-brand-soft)",
      glow: "rgba(18, 150, 219, 0.35)",
      addr: "video.example.com/watch",
    },
    {
      tag: <Translate id="home.sc.shop.t">网购 · 比价</Translate>,
      script: <Translate id="home.sc.shop.l">购物助手</Translate>,
      icon: "lucide:shopping-cart",
      title: <Translate id="home.sc.shop.h">历史低价，一眼看穿</Translate>,
      desc: <Translate id="home.sc.shop.d">全网比价、历史价格曲线、优惠券一键领。</Translate>,
      link: <Translate id="home.sc.shop.l">购物助手</Translate>,
      kw: translate({ id: "home.search.kw.shopping", message: "购物" }),
      color: "var(--lp-amber-deep)",
      soft: "var(--lp-amber-soft)",
      glow: "rgba(239, 163, 29, 0.35)",
      addr: "shop.example.com/item",
    },
    {
      tag: <Translate id="home.sc.auto.t">效率 · 自动化</Translate>,
      script: <Translate id="home.dev.mock.name">每日自动签到</Translate>,
      icon: "lucide:wand-sparkles",
      title: <Translate id="home.sc.auto.h">重复的事，交给脚本</Translate>,
      desc: <Translate id="home.sc.auto.d">自动签到、批量操作、贴心的快捷工具箱。</Translate>,
      link: <Translate id="home.sc.auto.l">效率脚本</Translate>,
      kw: translate({ id: "home.search.kw.automation", message: "自动化" }),
      color: "var(--lp-mint)",
      soft: "var(--lp-mint-soft)",
      glow: "rgba(18, 178, 140, 0.32)",
      addr: "club.example.com/daily",
    },
    {
      tag: <Translate id="home.sc.read.t">阅读 · 翻译</Translate>,
      script: <Translate id="home.sc.stage.read">沉浸式翻译</Translate>,
      icon: "lucide:book-open",
      title: <Translate id="home.sc.read.h">外文长文，读得舒服</Translate>,
      desc: <Translate id="home.sc.read.d">夜间模式、网页翻译、沉浸式阅读体验。</Translate>,
      link: <Translate id="home.sc.read.l">阅读增强</Translate>,
      kw: translate({ id: "home.search.kw.translation", message: "翻译" }),
      color: "var(--lp-violet)",
      soft: "var(--lp-violet-soft)",
      glow: "rgba(108, 92, 231, 0.35)",
      addr: "read.example.com/post",
    },
  ];
  const scenes = [AdblockScene, VideoScene, ShopScene, AutoScene, ReadScene];

  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start center", "end center"],
  });
  const cur = steps[active];

  return (
    <section className={clsx(styles.section, s.scenes)} id="scenarios">
      <div className={styles.sectionHeader}>
        <Reveal>
          <Eyebrow icon="lucide:users">
            <Translate id="home.sc.eyebrow">人人可用 · 无需编程</Translate>
          </Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.06} className={styles.h2}>
          <Translate id="home.sc.title1">不用写代码，</Translate>
          <span className={styles.hl}>
            <Translate id="home.sc.title2">一键</Translate>
          </span>
          <Translate id="home.sc.title3">解决日常烦恼</Translate>
        </Reveal>
        <Reveal as="p" delay={0.12} className={styles.sub}>
          <Translate id="home.sc.sub">
            从脚本商店挑一个装上，广告、视频、购物、效率，统统交给脚本。
          </Translate>
        </Reveal>
      </div>

      <div className={s.track}>
        <div className={s.stageWrap}>
          <div className={s.glow} style={{ background: cur.glow }} aria-hidden />
          <div className={s.stage} aria-hidden>
            <div className={s.bar}>
              <div className={s.dots}>
                <i style={{ background: "#ff5f57" }} />
                <i style={{ background: "#febc2e" }} />
                <i style={{ background: "#28c840" }} />
              </div>
              <div className={s.addr}>
                <Icon icon="lucide:lock" />
                <span dir="ltr">{cur.addr}</span>
              </div>
              <div className={s.ext}>
                <Logo size={16} />
              </div>
            </div>
            {scenes.map((Scene, i) => (
              <m.div
                key={i}
                className={s.scene}
                animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 12 }}
                transition={{ duration: 0.4, delay: active === i ? 0.1 : 0, ease: EASE }}
                style={{ pointerEvents: active === i ? "auto" : "none" }}
              >
                <span className={s.runPill} style={{ background: steps[i].soft, color: steps[i].color }}>
                  <span className={s.led} />
                  <Translate id="home.sc.stage.running" values={{ name: steps[i].script }}>
                    {"{name} · 运行中"}
                  </Translate>
                </span>
                <Scene active={active === i} />
              </m.div>
            ))}
          </div>
        </div>

        <div className={s.listCol} ref={list}>
          <div className={s.rail} aria-hidden>
            <m.div className={s.railFill} style={{ scaleY: scrollYProgress }} />
          </div>
          <ol className={s.list}>
            {steps.map((st, i) => (
              <StepItem
                key={i}
                index={i}
                total={steps.length}
                step={st}
                active={active === i}
                onActive={() => setActive(i)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  index,
  total,
  step,
  active,
  onActive,
}: {
  index: number;
  total: number;
  step: Step;
  active: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // A thin band across the viewport: whichever blurb crosses it is the active
  // one, whichever direction the visitor scrolls. Mid-screen on desktop; on
  // narrow screens the stage is pinned over the top ~45%, so the band drops
  // to ~70% to activate the blurb that is actually readable below it.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1000px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const inBand = useInView(ref, {
    margin: narrow ? "-68% 0px -28% 0px" : "-48% 0px -48% 0px",
  });
  useEffect(() => {
    if (inBand) onActive();
  }, [inBand, onActive]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <li ref={ref} className={clsx(s.item, active && s.itemOn)}>
      <span className={s.no} dir="ltr">
        {pad(index + 1)} / {pad(total)}
      </span>
      <span className={s.tag} style={{ background: step.soft, color: step.color }}>
        <Icon icon={step.icon} />
        {step.tag}
      </span>
      <h3 className={s.itemTitle}>{step.title}</h3>
      <p className={s.itemDesc}>{step.desc}</p>
      <a className={s.more} style={{ color: step.color }} href={LINKS.search(step.kw)} target="_blank" rel="noreferrer">
        {step.link}
        <Icon icon="lucide:arrow-right" />
      </a>
    </li>
  );
}

/* ---- the five stage scenes ---------------------------------------------
   Each one resets when it goes inactive and replays its story on becoming
   active. Reduced motion lands straight on the final frame. */

type SceneProps = { active: boolean };

function useScene(active: boolean, play: (ctx: SceneCtx) => void | (() => void), reset: (root: HTMLDivElement) => void) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = !!useReducedMotion();
  useEffect(() => {
    const root = scope.current;
    reset(root);
    if (!active) return;
    const stops: Array<() => void> = [];
    const timers: number[] = [];
    const cleanup = play({
      root,
      reduce,
      animate: ((...args: Parameters<typeof animate>) => {
        const c = animate(...args);
        stops.push(() => c.stop());
        return c;
      }) as typeof animate,
      after: (ms, fn) => {
        timers.push(window.setTimeout(fn, ms));
      },
      count: (el, to, opts) => {
        if (reduce) {
          el.textContent = String(to);
          return;
        }
        const c = animateValue(0, to, { duration: 1.2, ease: "easeOut", ...opts, onUpdate: (v) => (el.textContent = String(Math.round(v))) });
        stops.push(() => c.stop());
      },
    });
    return () => {
      stops.forEach((f) => f());
      timers.forEach((t) => clearTimeout(t));
      if (cleanup) cleanup();
    };
    // play/reset are module-level per scene; only `active` drives replays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce]);
  return scope;
}

type SceneCtx = {
  root: HTMLDivElement;
  reduce: boolean;
  animate: ReturnType<typeof useAnimate>[1];
  after: (ms: number, fn: () => void) => void;
  count: (el: HTMLElement, to: number, opts?: { delay?: number; duration?: number }) => void;
};

const all = (root: HTMLElement, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
const one = (root: HTMLElement, sel: string) => root.querySelector<HTMLElement>(sel)!;
const clear = (els: HTMLElement[], ...props: string[]) =>
  els.forEach((el) => props.forEach((p) => el.style.removeProperty(p)));

/* 1 — ad blocker: the ads get flagged, then fold away while a counter runs */
function AdblockScene({ active }: SceneProps) {
  const scope = useScene(
    active,
    ({ root, reduce, animate, after, count }) => {
      const ads = all(root, "[data-ad]");
      const counter = one(root, "[data-blocked]");
      if (reduce) {
        ads.forEach((a) => Object.assign(a.style, { height: "0px", marginTop: "0px", opacity: "0" }));
        counter.textContent = "12";
        return;
      }
      after(450, () => ads.forEach((a) => a.classList.add(s.flag)));
      ads.forEach((a, i) =>
        animate(a, { height: [a.offsetHeight, 0], marginTop: ["12px", "0px"], opacity: [1, 0] }, { duration: 0.55, delay: 0.85 + i * 0.18, ease: EASE }),
      );
      count(counter, 12, { delay: 0.85 });
    },
    (root) => {
      const ads = all(root, "[data-ad]");
      ads.forEach((a) => a.classList.remove(s.flag));
      clear(ads, "height", "margin-top", "opacity");
      one(root, "[data-blocked]").textContent = "0";
    },
  );
  return (
    <div ref={scope} className={s.body}>
      <div className={s.counter}>
        <Translate id="home.sc.stage.blocked" values={{ count: <b data-blocked>0</b> }}>
          {"已拦截 {count} 个"}
        </Translate>
      </div>
      <div className={s.col}>
        <i className={s.lnT} />
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "88%" }} />
      </div>
      <div className={s.ad} data-ad style={{ height: 70 }}>AD · 728×90</div>
      <div className={s.col}>
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "92%" }} />
        <i className={s.ln} style={{ width: "70%" }} />
      </div>
      <div className={s.ad} data-ad style={{ height: 56 }}>AD</div>
      <div className={s.col}>
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "80%" }} />
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "60%" }} />
      </div>
      <div className={s.ad} data-ad style={{ height: 48 }}>AD</div>
      <div className={s.col}>
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "86%" }} />
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "74%" }} />
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "52%" }} />
      </div>
    </div>
  );
}

/* 2 — video: the pre-roll is skipped, playback speeds up, PiP pops out */
function VideoScene({ active }: SceneProps) {
  const scope = useScene(
    active,
    ({ root, reduce, animate, after }) => {
      const spans = all(root, "[data-rate]");
      const hi = one(root, "[data-hi]");
      const pos = (el: HTMLElement) => ({ x: el.offsetLeft, width: el.offsetWidth });
      const target = pos(spans[3]);
      if (reduce) {
        Object.assign(hi.style, { transform: `translateX(${target.x}px)`, width: `${target.width}px` });
        one(root, "[data-pre]").style.opacity = "0";
        one(root, "[data-pip]").style.opacity = "1";
        return;
      }
      const first = pos(spans[0]);
      Object.assign(hi.style, { transform: `translateX(${first.x}px)`, width: `${first.width}px` });
      const fill = animate(one(root, "[data-fill]"), { scaleX: [0, 1] }, { duration: 9, repeat: Infinity, ease: "linear" });
      animate(one(root, "[data-pre]"), { opacity: [1, 0] }, { duration: 0.4, delay: 0.6 });
      animate(one(root, "[data-skip]"), { opacity: [0, 1, 1, 0], x: [10, 0, 0, 0] }, { duration: 1.8, delay: 0.55, times: [0, 0.15, 0.8, 1] });
      animate(hi, { x: target.x, width: target.width }, { type: "spring", stiffness: 260, damping: 24, delay: 1.2 });
      after(1300, () => (fill.speed = 3));
      animate(one(root, "[data-pip]"), { opacity: [0, 1], x: [-120, 0], y: [-60, 0], scale: [0.6, 1] }, { type: "spring", stiffness: 200, damping: 22, delay: 2 });
    },
    (root) => {
      clear([one(root, "[data-pre]"), one(root, "[data-skip]"), one(root, "[data-pip]")], "opacity", "transform");
    },
  );
  return (
    <div ref={scope} className={s.body}>
      <div className={s.video}>
        <span className={s.play}>
          <Icon icon="lucide:play" />
        </span>
        <div className={s.vbar}>
          <div className={s.vfill} data-fill />
        </div>
        <div className={s.preroll} data-pre>
          <Translate id="home.hero.demo.ad">贴片广告</Translate>
        </div>
        <div className={s.skip} data-skip>
          <Icon icon="lucide:skip-forward" />
          <Translate id="home.sc.stage.skipped">已自动跳过</Translate>
        </div>
      </div>
      <div className={s.rates} dir="ltr">
        <i className={s.rateHi} data-hi />
        {["1.0×", "1.25×", "1.5×", "2.0×", "3.0×"].map((r) => (
          <span key={r} data-rate>
            {r}
          </span>
        ))}
      </div>
      <div className={s.pip} data-pip>
        <Icon icon="lucide:picture-in-picture-2" />
        <Translate id="home.sc.featured.c4">画中画</Translate>
      </div>
    </div>
  );
}

/* 3 — shopping: the price history draws itself, the low is pinned, a coupon drops */
function ShopScene({ active }: SceneProps) {
  const scope = useScene(
    active,
    ({ root, reduce, animate }) => {
      const path = one(root, "[data-path]");
      const dot = one(root, "[data-dot]");
      const low = one(root, "[data-low]");
      const coupon = one(root, "[data-coupon]");
      if (reduce) {
        path.style.strokeDashoffset = "0";
        [dot, low, coupon].forEach((el) => (el.style.opacity = "1"));
        return;
      }
      animate(path, { strokeDashoffset: [1, 0] }, { duration: 1.4, delay: 0.3, ease: "easeInOut" });
      animate(dot, { opacity: [0, 1], scale: [0, 1.4, 1] }, { duration: 0.5, delay: 1.3 });
      animate(low, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4, delay: 1.45 });
      animate(coupon, { opacity: [0, 1], y: [-40, 0], rotate: [-8, 0] }, { type: "spring", stiffness: 300, damping: 14, delay: 1.9 });
    },
    (root) => {
      one(root, "[data-path]").style.strokeDashoffset = "1";
      clear([one(root, "[data-dot]"), one(root, "[data-low]"), one(root, "[data-coupon]")], "opacity", "transform");
    },
  );
  return (
    <div ref={scope} className={s.body}>
      <div className={s.shop}>
        <div>
          <div className={s.prod}>
            <Icon icon="lucide:shopping-cart" />
          </div>
          <div className={s.price} dir="ltr">
            ¥279<s>¥299</s>
          </div>
        </div>
        <div>
          <div className={s.col} style={{ marginTop: 0, marginBottom: 10 }}>
            <i className={s.lnT} style={{ width: "80%" }} />
            <i className={s.ln} style={{ width: "50%" }} />
          </div>
          <div className={s.chart} dir="ltr">
            <svg viewBox="0 0 300 120" preserveAspectRatio="none">
              <path d="M0 110 H300" stroke="var(--lp-border)" strokeWidth="1" fill="none" />
              <path
                data-path
                pathLength={1}
                d="M0 50 L40 42 L80 58 L120 30 L160 72 L200 96 L240 60 L270 48 L300 52"
                fill="none"
                stroke="var(--lp-accent)"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              />
            </svg>
            <i className={s.lowDot} data-dot />
            <span className={s.lowest} data-low>
              <Translate id="home.sc.stage.lowest" values={{ price: "¥259" }}>
                {"历史最低 {price}"}
              </Translate>
            </span>
          </div>
        </div>
      </div>
      <div className={s.coupon} data-coupon>
        <Icon icon="lucide:tag" />
        <Translate id="home.sc.stage.coupon" values={{ amount: "¥20" }}>
          {"已领券 · 立减 {amount}"}
        </Translate>
      </div>
    </div>
  );
}

/* 4 — automation: the daily tasks tick themselves off, then check-in succeeds */
function AutoScene({ active }: SceneProps) {
  const scope = useScene(
    active,
    ({ root, reduce, animate, after }) => {
      const rows = all(root, "[data-task]");
      const bar = one(root, "[data-progress]");
      const done = one(root, "[data-done]");
      if (reduce) {
        rows.forEach((r) => r.classList.add(s.taskDone));
        bar.style.transform = "scaleX(1)";
        done.style.opacity = "1";
        return;
      }
      rows.forEach((r, i) => after(700 + i * 520, () => r.classList.add(s.taskDone)));
      animate(bar, { scaleX: [0, 1] }, { duration: 1.6, delay: 0.7, ease: "easeInOut" });
      animate(done, { opacity: [0, 1], scale: [0.7, 1], y: [12, 0] }, { type: "spring", stiffness: 320, damping: 16, delay: 2.4 });
    },
    (root) => {
      all(root, "[data-task]").forEach((r) => r.classList.remove(s.taskDone));
      one(root, "[data-progress]").style.transform = "scaleX(0)";
      clear([one(root, "[data-done]")], "opacity", "transform");
    },
  );
  const tasks = [
    <Translate id="home.sc.stage.task1" key="1">每日签到</Translate>,
    <Translate id="home.sc.stage.task2" key="2">领取积分</Translate>,
    <Translate id="home.sc.stage.task3" key="3">完成浏览任务</Translate>,
  ];
  return (
    <div ref={scope} className={s.body}>
      <div className={s.taskCard}>
        <div className={s.taskHead}>
          <Icon icon="lucide:list-checks" />
          <Translate id="home.sc.stage.tasks">每日任务</Translate>
          <span className={s.cron} dir="ltr">
            <Icon icon="lucide:clock" />
            09:00
          </span>
        </div>
        {tasks.map((t, i) => (
          <div className={s.task} data-task key={i}>
            <span className={s.check}>
              <Icon icon="lucide:check" />
            </span>
            {t}
          </div>
        ))}
        <div className={s.progress}>
          <i data-progress />
        </div>
      </div>
      <div className={s.done} data-done>
        <span className={s.doneOk}>
          <Icon icon="lucide:check" />
        </span>
        <Translate id="home.dev.mock.toast">签到成功</Translate>
        <b dir="ltr">+5</b>
      </div>
    </div>
  );
}

/* 5 — reading: a sweep translates the paragraph, then reading mode kicks in */
function ReadScene({ active }: SceneProps) {
  const scope = useScene(
    active,
    ({ root, reduce, animate, after }) => {
      const src = one(root, "[data-src]");
      const dst = one(root, "[data-dst]");
      const chip = one(root, "[data-chip]");
      if (reduce) {
        root.classList.add(s.reading);
        src.style.opacity = "0";
        dst.style.opacity = "1";
        chip.style.opacity = "1";
        return;
      }
      const sweep = one(root, "[data-sweep]");
      animate(sweep, { x: [0, one(root, "[data-para]").offsetWidth + 160] }, { duration: 1.1, delay: 0.4, ease: "easeInOut" });
      animate(src, { opacity: 0, filter: ["blur(0px)", "blur(4px)"] }, { duration: 0.45, delay: 0.85 });
      animate(dst, { opacity: [0, 1], filter: ["blur(4px)", "blur(0px)"] }, { duration: 0.5, delay: 1.05 });
      after(1700, () => root.classList.add(s.reading));
      animate(chip, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: 1.9 });
    },
    (root) => {
      root.classList.remove(s.reading);
      clear([one(root, "[data-src]"), one(root, "[data-dst]"), one(root, "[data-chip]"), one(root, "[data-sweep]")], "opacity", "transform", "filter");
    },
  );
  return (
    <div ref={scope} className={clsx(s.body, s.read)}>
      <div className={s.col}>
        <i className={s.lnT} style={{ width: "70%" }} />
      </div>
      <div className={s.para} data-para>
        <span className={s.src} data-src>
          <Translate id="home.sc.stage.readSrc">
            Userscripts let you reshape any website to fit the way you read, watch and shop. Install one, and the page changes instantly — no extension to build, no code to write.
          </Translate>
        </span>
        <span className={s.dst} data-dst>
          <Translate id="home.sc.stage.readDst">
            用户脚本让你按自己的习惯，重塑任何网站的阅读、观看与购物体验。装上一个，页面立刻改变 —— 无需开发扩展，也不用写一行代码。
          </Translate>
        </span>
        <span className={s.sweep} data-sweep />
      </div>
      <div className={s.col}>
        <i className={s.ln} />
        <i className={s.ln} style={{ width: "94%" }} />
        <i className={s.ln} style={{ width: "62%" }} />
      </div>
      <span className={s.trChip} data-chip>
        <Icon icon="lucide:languages" />
        <Translate id="home.sc.stage.readChip">已翻译 · 阅读模式已开启</Translate>
      </span>
    </div>
  );
}
