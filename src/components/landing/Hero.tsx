import { useEffect, useRef, useState, type PointerEvent } from "react";
import clsx from "clsx";
import {
  m,
  useAnimate,
  useInView,
  useReducedMotion,
  useSpring,
} from "motion/react";
import Translate from "@docusaurus/Translate";
import stats from "@site/src/data/landing-stats.json";
import { Icon } from "../Icon";
import styles from "./landing.module.css";
import h from "./hero.module.css";
import { InstallButton, LINKS, Logo } from "./shared";
import { CANCELLED, CountUp, EASE, sleep, waitWhile } from "./motion";

export function Hero() {
  const reduce = useReducedMotion();
  // Pointer tilt for the demo browser. Springs, so it eases toward the pointer
  // instead of snapping; mouse only — touch would tilt on every scroll.
  const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18 });
  const visual = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !visual.current) return;
    const r = visual.current.getBoundingClientRect();
    rotateY.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 7);
    rotateX.set(-((e.clientY - (r.top + r.height / 2)) / r.height) * 7);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const statItems = [
    { value: stats.users, cls: h.statBrand, label: <Translate id="home.trust.users">装机用户</Translate> },
    { value: stats.scripts, cls: h.statAccent, label: <Translate id="home.trust.scripts">社区脚本</Translate> },
    { value: stats.stars, cls: "", label: <Translate id="home.trust.stars">GitHub Stars</Translate> },
    { value: stats.contributors.count, cls: h.statMint, label: <Translate id="home.trust.contributors">开源贡献者</Translate> },
  ];

  return (
    <header className={h.hero} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className={h.bg} aria-hidden>
        <div className={h.grid} />
        <div className={clsx(h.blob, h.blob1)} />
        <div className={clsx(h.blob, h.blob2)} />
        <div className={clsx(h.blob, h.blob3)} />
      </div>

      <div className={h.inner}>
        <div className={h.copy}>
          <span className={clsx(styles.eyebrow, h.rise)} style={{ ["--i" as string]: 0 }}>
            <Icon icon="lucide:sparkles" />
            <Translate id="home.hero.eyebrow">开源用户脚本引擎 · 兼容 Tampermonkey</Translate>
          </span>
          <h1 className={h.h1}>
            <span className={clsx(h.line, h.rise)} style={{ ["--i" as string]: 1 }}>
              <Translate id="home.hero.title1">给浏览器</Translate>
            </span>
            <span className={clsx(h.line, h.rise)} style={{ ["--i" as string]: 2 }}>
              <Translate id="home.hero.title2">装上</Translate>
              <span className={h.grad}>
                <Translate id="home.hero.title3">超能力</Translate>
              </span>
            </span>
          </h1>
          <div className={clsx(h.en, h.rise)} style={{ ["--i" as string]: 3 }}>
            Superpowers for your browser.
          </div>
          <p className={clsx(h.lead, h.rise)} style={{ ["--i" as string]: 4 }}>
            <Translate id="home.hero.lead">
              去广告、增强视频、自动化操作 —— 从脚本商店一键安装社区脚本。兼容
              Tampermonkey，还为开发者准备了后台脚本、丰富 API 与 AI 接入。
            </Translate>
          </p>
          <div className={clsx(h.ctas, h.rise)} style={{ ["--i" as string]: 5 }}>
            <InstallButton />
            <a className={styles.ctaSecondary} href={LINKS.store} target="_blank" rel="noreferrer">
              <Icon icon="lucide:compass" width={19} height={19} />
              <Translate id="home.hero.browse">浏览脚本库</Translate>
            </a>
          </div>
          <dl className={clsx(h.stats, h.rise)} style={{ ["--i" as string]: 6 }}>
            {statItems.map((s, i) => (
              <div className={h.stat} key={i}>
                <dt className={h.statLabel}>{s.label}</dt>
                <dd className={clsx(h.statNum, s.cls)}>
                  <CountUp value={s.value} delay={0.5 + i * 0.08} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={clsx(h.visual, h.rise)} style={{ ["--i" as string]: 3 }} ref={visual}>
          <m.div className={h.tilt} style={{ rotateX, rotateY }}>
            <HeroDemo />
            <div className={clsx(h.float, h.float1)} aria-hidden>
              <span className={h.floatRing} style={{ background: "var(--lp-mint)", color: "#fff" }}>
                <Icon icon="lucide:check" />
              </span>
              <span>
                <Translate id="home.hero.chip.installed">脚本已安装</Translate>
                <small>
                  <Translate id="home.hero.chip.installedSub">视频体验增强 v2.1</Translate>
                </small>
              </span>
            </div>
            <div className={clsx(h.float, h.float2)} aria-hidden>
              <span className={h.floatRing} style={{ background: "var(--lp-accent-soft)", color: "var(--lp-accent-deep)" }}>
                <Icon icon="lucide:zap" />
              </span>
              <span>
                <Translate id="home.hero.chip.background">3 个脚本正在后台运行</Translate>
              </span>
            </div>
          </m.div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   The live browser: a cluttered video page that a pointer cleans up by
   switching on three scripts in the ScriptCat popup — ads collapse, a speed
   badge appears, the page goes dark. Loops while on screen; pauses when it
   scrolls away or the tab is hidden; reduced-motion shows the end state.
   ------------------------------------------------------------------------- */
const ROWS = [
  { icon: "lucide:ban", bg: "var(--lp-accent-soft)", color: "var(--lp-accent-deep)", name: <Translate id="home.hero.mock.adblock">自动跳过广告</Translate> },
  { icon: "lucide:gauge", bg: "var(--lp-brand-soft)", color: "var(--lp-brand-deep)", name: <Translate id="home.hero.mock.speed">视频倍速控制</Translate> },
  { icon: "lucide:moon", bg: "var(--lp-violet-soft)", color: "var(--lp-violet)", name: <Translate id="home.hero.mock.dark">网页夜间模式</Translate> },
];

function HeroDemo() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotion();
  const inView = useInView(scope, { amount: 0.2 });
  const visible = useRef(inView);
  visible.current = inView;
  // How many of the three scripts are switched on; drives toggles, the badge
  // count and night mode.
  const [on, setOn] = useState(0);

  useEffect(() => {
    if (reduce) {
      setOn(3);
      return;
    }
    let dead = false;
    const root = scope.current;
    const q = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector(sel) as unknown as T;
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
    const wait = (ms: number) =>
      waitWhile(ms, () => !visible.current || document.hidden, () => dead);

    const cursor = q("[data-cursor]");
    const ripple = q("[data-ripple]");
    const panel = q("[data-panel]");
    const toast = q("[data-toast]");
    const ads = qa("[data-side-ad]");
    const overlay = q("[data-overlay]");
    const popup = q("[data-popup]");
    const speed = q("[data-speed]");
    const vfill = animate(q("[data-vfill]"), { scaleX: [0, 1] }, { duration: 10, repeat: Infinity, ease: "linear" });

    // Centre of `el` in the browser frame's own (untilted) coordinates —
    // offsetLeft/Top ignore the 3D tilt that getBoundingClientRect would bake
    // in. Physical px either way, so RTL needs nothing special.
    const at = (el: HTMLElement) => {
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      let n: HTMLElement | null = el;
      while (n && n !== root) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const moveTo = async (el: HTMLElement) => {
      const p = at(el);
      await animate(cursor, { x: p.x - 4, y: p.y - 2 }, { duration: 0.75, ease: [0.45, 0, 0.2, 1] });
    };
    const click = async (el: HTMLElement) => {
      const p = at(el);
      ripple.style.left = `${p.x}px`;
      ripple.style.top = `${p.y}px`;
      animate(ripple, { scale: [0.3, 1.6], opacity: [0.9, 0] }, { duration: 0.5, ease: "easeOut" });
      await animate(cursor, { scale: [1, 0.82, 1] }, { duration: 0.25 });
    };
    const bump = () =>
      animate(q("[data-count]"), { scale: [1.5, 1] }, { type: "spring", stiffness: 500, damping: 15 });
    const reset = () => {
      setOn(0);
      for (const el of [...ads, overlay, popup]) {
        el.style.height = "";
        el.style.opacity = "";
        el.style.transform = "";
      }
      speed.style.opacity = "0";
      panel.style.opacity = "0";
      cursor.style.opacity = "0";
      vfill.speed = 1;
    };

    const run = async () => {
      await wait(1400);
      for (;;) {
        reset();
        const start = at(q("[data-vfill]"));
        animate(cursor, { opacity: [0, 1], x: [start.x + 60, start.x], y: [start.y + 30, start.y] }, { duration: 0.4 });
        await wait(500);

        const ext = q("[data-ext]");
        await moveTo(ext);
        await click(ext);
        animate(panel, { opacity: [0, 1], scale: [0.92, 1], y: [-8, 0] }, { type: "spring", stiffness: 380, damping: 26 });
        await wait(450);

        const toggles = qa("[data-toggle]");
        // 1 — ad blocker: overlay, popup and both side banners go away
        await moveTo(toggles[0]);
        await click(toggles[0]);
        setOn(1);
        bump();
        animate(overlay, { opacity: 0, scale: 1.04 }, { duration: 0.35 });
        animate(popup, { opacity: 0, scale: 0.8, y: 10 }, { duration: 0.35, delay: 0.1 });
        ads.forEach((a, i) =>
          animate(a, { height: [a.offsetHeight, 0], opacity: [1, 0] }, { duration: 0.5, delay: 0.15 + i * 0.12, ease: EASE }),
        );
        animate(toast, { opacity: [0, 1, 1, 0], y: [12, 0, 0, -6] }, { duration: 2.2, times: [0, 0.12, 0.85, 1] });
        await wait(1100);

        // 2 — speed control
        await moveTo(toggles[1]);
        await click(toggles[1]);
        setOn(2);
        bump();
        animate(speed, { opacity: [0, 1], scale: [0.6, 1] }, { type: "spring", stiffness: 420, damping: 18 });
        vfill.speed = 3;
        await wait(1100);

        // 3 — night mode
        await moveTo(toggles[2]);
        await click(toggles[2]);
        setOn(3);
        bump();
        await wait(900);

        animate(panel, { opacity: 0, scale: 0.96, y: -6 }, { duration: 0.3 });
        animate(cursor, { opacity: 0 }, { duration: 0.3 });
        await wait(3200);
        animate(q("[data-site]"), { opacity: [1, 0.2, 1] }, { duration: 0.6 });
        await sleep(300);
      }
    };
    run().catch((e) => {
      if (e !== CANCELLED) throw e;
    });
    return () => {
      dead = true;
    };
  }, [reduce, animate, scope]);

  return (
    <div className={clsx(h.bw, reduce && h.bwStatic)} ref={scope} aria-hidden>
      <div className={h.bar}>
        <div className={h.dots}>
          <i style={{ background: "#ff5f57" }} />
          <i style={{ background: "#febc2e" }} />
          <i style={{ background: "#28c840" }} />
        </div>
        <div className={h.addr}>
          <Icon icon="lucide:lock" />
          <span dir="ltr">video.example.com/watch</span>
        </div>
        <div className={h.ext} data-ext>
          <Logo size={17} />
          <span className={h.extCount} data-count>
            {on}
          </span>
        </div>
      </div>

      <div className={clsx(h.site, on >= 3 && h.night)} data-site>
        <div className={h.siteHead}>
          <span className={h.siteLogo} />
          <span className={h.siteNav} />
          <span className={h.siteNav} />
          <span className={h.siteNav} style={{ width: 30 }} />
        </div>
        <div className={h.siteMain}>
          <div className={h.video}>
            <span className={h.play}>
              <Icon icon="lucide:play" />
            </span>
            <div className={h.vbar}>
              <div className={h.vfill} data-vfill />
            </div>
            <div className={h.speed} data-speed>
              <Icon icon="lucide:gauge" />
              2.0×
            </div>
            <div className={h.overlay} data-overlay>
              <div>
                <Translate id="home.hero.demo.ad">贴片广告</Translate>
                <small>
                  <Translate id="home.hero.demo.adWait">15 秒后可关闭</Translate>
                </small>
              </div>
            </div>
          </div>
          <div className={h.lines}>
            <i />
            <i />
            <i style={{ width: "80%" }} />
          </div>
        </div>
        <div className={h.side}>
          <div className={h.adbox} data-side-ad>AD</div>
          <div className={h.adbox} data-side-ad>AD</div>
          {[0, 1, 2].map((i) => (
            <div className={h.rel} key={i}>
              <b />
              <i />
            </div>
          ))}
        </div>
        <div className={h.popup} data-popup>
          <span className={h.popupX}>✕</span>
          <Translate id="home.hero.demo.popup">限时特惠！</Translate>
          <small>
            <Translate id="home.hero.demo.popupSub">点我领取神秘大礼</Translate>
          </small>
        </div>
      </div>

      <div className={h.panel} data-panel>
        <div className={h.panelHead}>
          <span className={h.panelBadge}>
            <Logo size={18} white />
          </span>
          <div>
            <b>ScriptCat</b>
            <span>
              <Translate id="home.hero.mock.running">本页 3 个脚本运行中</Translate>
            </span>
          </div>
        </div>
        {ROWS.map((r, i) => (
          <div className={h.row} key={i}>
            <span className={h.rowChip} style={{ background: r.bg, color: r.color }}>
              <Icon icon={r.icon} />
            </span>
            <span className={h.rowName}>{r.name}</span>
            <span className={clsx(h.sw, on > i && h.swOn)} data-toggle />
          </div>
        ))}
      </div>

      <div className={h.toast} data-toast>
        <span className={h.toastOk}>
          <Icon icon="lucide:check" />
        </span>
        <Translate id="home.hero.demo.blocked">已拦截 3 处广告</Translate>
      </div>
      <div className={h.ripple} data-ripple />
      <svg className={h.cursor} data-cursor viewBox="0 0 24 24">
        <path
          d="M4 2l15 11-6.5 1 3.6 7.2-2.6 1.3-3.6-7.3L4 20z"
          fill="#0e2233"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
