import { Icon } from "../Icon";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./landing.module.css";
import stats from "@site/src/data/landing-stats.json";
import {
  Eyebrow,
  InstallButton,
  LINKS,
  Logo,
  abbr,
  usePrimaryInstall,
} from "./shared";

/* =====================================================================
   HERO
   ===================================================================== */
export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBlobBlue} />
      <div className={styles.heroBlobOrange} />
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <Eyebrow icon="lucide:sparkles">
            <Translate id="home.hero.eyebrow">
              开源用户脚本引擎 · 兼容 Tampermonkey
            </Translate>
          </Eyebrow>
          <h1 className={styles.heroH1}>
            <span>
              <Translate id="home.hero.title1">给浏览器</Translate>
            </span>
            <span>
              <Translate id="home.hero.title2">装上</Translate>
              <span className={styles.grad}>
                <Translate id="home.hero.title3">超能力</Translate>
              </span>
            </span>
          </h1>
          <div className={styles.heroEn}>Superpowers for your browser.</div>
          <p className={styles.heroSubhead}>
            <Translate id="home.hero.subhead">
              去广告、增强视频、自动化操作 ——
              从脚本商店一键安装社区脚本，也能为开发者提供后台脚本与强大 API。兼容
              Tampermonkey，现有脚本零成本迁移。
            </Translate>
          </p>
          <div className={styles.heroCtaRow}>
            <InstallButton />
            <a
              className={styles.ctaSecondary}
              href={LINKS.store}
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon="lucide:compass" width={19} height={19} />
              <Translate id="home.hero.browse">浏览脚本库</Translate>
            </a>
          </div>
          <div className={styles.heroTrust}>
            <Icon icon="lucide:badge-check" />
            <span>
              <Translate id="home.hero.trust">
                支持 Chrome · Edge · Firefox，完全免费开源
              </Translate>
            </span>
          </div>
        </div>
        <HeroVisual />
      </div>
    </header>
  );
}

function HeroVisual() {
  const rows = [
    { icon: "lucide:gauge", bg: "var(--lp-brand-soft)", color: "var(--lp-brand-deep)", name: <Translate id="home.hero.mock.speed">视频倍速控制</Translate> },
    { icon: "lucide:ban", bg: "var(--lp-accent-soft)", color: "var(--lp-accent-deep)", name: <Translate id="home.hero.mock.adblock">自动跳过广告</Translate> },
    { icon: "lucide:moon", bg: "var(--lp-violet-soft)", color: "var(--lp-violet)", name: <Translate id="home.hero.mock.dark">网页夜间模式</Translate> },
  ];
  return (
    <div className={styles.heroVisual}>
      <div className={styles.browserMock}>
        <div className={styles.mockTopbar}>
          <div className={styles.mockDots}>
            <span className={styles.mockDot} style={{ background: "#FF5F57" }} />
            <span className={styles.mockDot} style={{ background: "#FEBC2E" }} />
            <span className={styles.mockDot} style={{ background: "#28C840" }} />
          </div>
          <div className={styles.mockAddress}>
            <Icon icon="lucide:lock" />
            <span>www.example.com</span>
          </div>
          <div className={styles.mockScBadge}>
            <Logo size={14} />3
          </div>
        </div>
        <div className={styles.mockBody}>
          <div className={styles.mockContent}>
            <div className={styles.mockVideo}>
              <div className={styles.mockPlay}>
                <Icon icon="lucide:play" />
              </div>
              <div className={styles.mockSpeed}>
                <Icon icon="lucide:gauge" />
                2.0×
              </div>
              <div className={styles.mockSkip}>
                <Icon icon="lucide:skip-forward" />
                <Translate id="home.hero.mock.skip">自动跳广告</Translate>
              </div>
            </div>
            <div className={styles.mockLines}>
              <div className={styles.mockLineTitle} />
              <div className={styles.mockLine} />
              <div className={styles.mockLine} />
              <div className={styles.mockLine} style={{ width: "56%" }} />
            </div>
          </div>
          <div className={styles.mockPanel}>
            <div className={styles.mockPanelHead}>
              <div className={styles.mockPanelBadge}>
                <Logo size={16} white />
              </div>
              <div>
                <div className={styles.mockPanelName}>ScriptCat</div>
                <div className={styles.mockPanelSub}>
                  <Translate id="home.hero.mock.running">本页 3 个脚本运行中</Translate>
                </div>
              </div>
            </div>
            {rows.map((r, i) => (
              <div className={styles.mockRow} key={i}>
                <div
                  className={styles.mockRowChip}
                  style={{ background: r.bg, color: r.color }}
                >
                  <Icon icon={r.icon} />
                </div>
                <div className={styles.mockRowName}>{r.name}</div>
                <div className={styles.mockSwitch}>
                  <div className={styles.mockSwitchKnob} />
                </div>
              </div>
            ))}
            <div className={styles.mockPanelFoot}>
              <Icon icon="lucide:plus" />
              <Translate id="home.hero.mock.add">从脚本商店添加</Translate>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroMascot}>
        <Logo size={34} white />
      </div>
      <div className={`${styles.heroChip} ${styles.heroChipInstalled}`}>
        <div className={styles.heroChipRing} style={{ background: "var(--lp-mint)" }}>
          <Icon icon="lucide:check" />
        </div>
        <div>
          <div className={styles.heroChipT1}>
            <Translate id="home.hero.chip.installed">脚本已安装</Translate>
          </div>
          <div className={styles.heroChipT2}>
            <Translate id="home.hero.chip.installedSub">视频体验增强 v2.1</Translate>
          </div>
        </div>
      </div>
      <div className={`${styles.heroChip} ${styles.heroChipBackground}`}>
        <div className={styles.heroChipRing} style={{ background: "var(--lp-accent-soft)", color: "var(--lp-accent-deep)" }}>
          <Icon icon="lucide:zap" />
        </div>
        <div className={styles.heroChipT1}>
          <Translate id="home.hero.chip.background">3 个脚本正在后台运行</Translate>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   TRUST BAR
   ===================================================================== */
export function TrustBar() {
  const items = [
    { num: abbr(stats.users), cls: styles.trustNumBrand, label: <Translate id="home.trust.users">装机用户</Translate> },
    { num: abbr(stats.scripts), cls: styles.trustNumAccent, label: <Translate id="home.trust.scripts">社区脚本</Translate> },
    { num: abbr(stats.stars), cls: "", label: <Translate id="home.trust.stars">GitHub Stars</Translate> },
    { num: abbr(stats.contributors.count), cls: styles.trustNumMint, label: <Translate id="home.trust.contributors">开源贡献者</Translate> },
  ];
  return (
    <section className={styles.trust}>
      <div className={styles.trustEyebrow}>
        <Translate id="home.trust.eyebrow">
          深受全球用户与开发者信赖 · TRUSTED WORLDWIDE
        </Translate>
      </div>
      <div className={styles.trustRow}>
        {items.map((it, i) => (
          <div style={{ display: "contents" }} key={i}>
            {i > 0 && <div className={styles.trustDivider} />}
            <div className={styles.trustStat}>
              <div className={`${styles.trustNum} ${it.cls}`}>{it.num}</div>
              <div className={styles.trustLabel}>{it.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   SCENARIOS
   ===================================================================== */
export function Scenarios() {
  const cards = [
    {
      icon: "lucide:shield-check",
      bg: "var(--lp-accent-soft)",
      color: "#c94a0d",
      title: <Translate id="home.sc.adblock.t">去广告 · 净化</Translate>,
      desc: <Translate id="home.sc.adblock.d">屏蔽广告与弹窗，还网页一个清爽干净。</Translate>,
      link: <Translate id="home.sc.adblock.l">去广告脚本</Translate>,
      href: LINKS.search(translate({ id: "home.search.kw.adblock", message: "去广告" })),
    },
    {
      icon: "lucide:shopping-cart",
      bg: "var(--lp-amber-soft)",
      color: "#8c5c0f",
      title: <Translate id="home.sc.shop.t">网购 · 比价</Translate>,
      desc: <Translate id="home.sc.shop.d">全网比价、历史价格曲线、优惠券一键领。</Translate>,
      link: <Translate id="home.sc.shop.l">购物助手</Translate>,
      href: LINKS.search(translate({ id: "home.search.kw.shopping", message: "购物" })),
    },
    {
      icon: "lucide:wand-sparkles",
      bg: "var(--lp-mint-soft)",
      color: "#0b8264",
      title: <Translate id="home.sc.auto.t">效率 · 自动化</Translate>,
      desc: <Translate id="home.sc.auto.d">自动签到、批量操作、贴心的快捷工具箱。</Translate>,
      link: <Translate id="home.sc.auto.l">效率脚本</Translate>,
      href: LINKS.search(translate({ id: "home.search.kw.automation", message: "自动化" })),
    },
    {
      icon: "lucide:book-open",
      bg: "var(--lp-violet-soft)",
      color: "#5646C9",
      title: <Translate id="home.sc.read.t">阅读 · 翻译</Translate>,
      desc: <Translate id="home.sc.read.d">夜间模式、网页翻译、沉浸式阅读体验。</Translate>,
      link: <Translate id="home.sc.read.l">阅读增强</Translate>,
      href: LINKS.search(translate({ id: "home.search.kw.translation", message: "翻译" })),
    },
  ];
  return (
    <section className={`${styles.section} ${styles.scenarios}`}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <Eyebrow icon="lucide:users">
            <Translate id="home.sc.eyebrow">人人可用 · 无需编程</Translate>
          </Eyebrow>
          <h2 className={styles.h2}>
            <Translate id="home.sc.title1">不用写代码，</Translate>
            <span className={styles.hl}>
              <Translate id="home.sc.title2">一键</Translate>
            </span>
            <Translate id="home.sc.title3">解决日常烦恼</Translate>
          </h2>
          <p className={styles.sub}>
            <Translate id="home.sc.sub">
              从脚本商店挑一个装上，广告、视频、购物、效率，统统交给脚本。
            </Translate>
          </p>
        </div>

        <div className={styles.scenariosBody}>
          <div className={styles.featured}>
            <div className={styles.featuredIcon}>
              <Icon icon="lucide:play" />
            </div>
            <div className={styles.featuredMid}>
              <div className={styles.tagHot}>
                <Icon icon="lucide:flame" />
                <Translate id="home.sc.featured.tag">最受欢迎</Translate>
              </div>
              <h3 className={styles.featuredTitle}>
                <Translate id="home.sc.featured.t">视频体验，全面增强</Translate>
              </h3>
              <p className={styles.featuredDesc}>
                <Translate id="home.sc.featured.d">
                  倍速播放、自动跳广告、一键下载、画中画 —— 让 Bilibili / YouTube /
                  Netflix 更好用。
                </Translate>
              </p>
              <div className={styles.chipRow}>
                <span className={styles.miniChip}>
                  <Icon icon="lucide:gauge" />
                  <Translate id="home.sc.featured.c1">倍速播放</Translate>
                </span>
                <span className={styles.miniChip}>
                  <Icon icon="lucide:ban" />
                  <Translate id="home.sc.featured.c2">去广告</Translate>
                </span>
                <span className={styles.miniChip}>
                  <Icon icon="lucide:download" />
                  <Translate id="home.sc.featured.c3">视频下载</Translate>
                </span>
                <span className={styles.miniChip}>
                  <Icon icon="lucide:picture-in-picture-2" />
                  <Translate id="home.sc.featured.c4">画中画</Translate>
                </span>
              </div>
            </div>
            <div className={styles.featuredRight}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={LINKS.search(translate({ id: "home.search.kw.video", message: "视频" }))}
                target="_blank"
                rel="noreferrer"
              >
                <Translate id="home.sc.featured.btn">浏览视频脚本</Translate>
                <Icon icon="lucide:arrow-right" width={16} height={16} />
              </a>
              <div className={styles.featuredSites}>
                <Translate id="home.sc.featured.sites">支持 20+ 视频网站</Translate>
              </div>
            </div>
          </div>

          <div className={styles.scenarioGrid}>
            {cards.map((c, i) => (
              <div className={styles.scenarioCard} key={i}>
                <div
                  className={styles.cardChip}
                  style={{ background: c.bg, color: c.color }}
                >
                  <Icon icon={c.icon} />
                </div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc}</p>
                <div className={styles.cardDiv} />
                <a
                  className={styles.cardLink}
                  style={{ color: c.color }}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.link}
                  <Icon icon="lucide:arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   HOW IT WORKS
   ===================================================================== */
export function Steps() {
  const steps = [
    {
      no: "01",
      soft: "var(--lp-brand-soft)",
      color: "var(--lp-brand)",
      icon: "lucide:puzzle",
      title: <Translate id="home.step1.t">安装扩展</Translate>,
      desc: <Translate id="home.step1.d">从 Chrome / Edge / Firefox 商店一键添加，或手动安装。</Translate>,
      pIcon: "lucide:globe",
      preview: <Translate id="home.step1.p">添加到浏览器</Translate>,
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
    },
  ];
  return (
    <section className={`${styles.section} ${styles.howItWorks}`}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <Eyebrow icon="lucide:rocket">
            <Translate id="home.step.eyebrow">三步上手 · GET STARTED</Translate>
          </Eyebrow>
          <h2 className={styles.h2}>
            <span className={styles.hl}>
              <Translate id="home.step.title1">30 秒</Translate>
            </span>
            <Translate id="home.step.title2">，用上你的第一个脚本</Translate>
          </h2>
          <p className={styles.sub}>
            <Translate id="home.step.sub">没有复杂配置，跟着三步走即可，即装即用。</Translate>
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div style={{ display: "contents" }} key={s.no}>
              {i > 0 && (
                <div className={styles.stepArrow}>
                  <Icon icon="lucide:arrow-right" />
                </div>
              )}
              <div className={styles.stepCard}>
                <div className={styles.stepHead}>
                  <div className={styles.stepNo} style={{ color: s.color }}>
                    {s.no}
                  </div>
                  <div
                    className={styles.stepChip}
                    style={{ background: s.soft, color: s.color }}
                  >
                    <Icon icon={s.icon} />
                  </div>
                </div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                <div className={styles.stepPreview}>
                  <Icon icon={s.pIcon} />
                  {s.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   FEATURES
   ===================================================================== */
export function Features() {
  const small = [
    {
      icon: "lucide:shield-check",
      bg: "var(--lp-mint-soft)",
      color: "var(--lp-mint)",
      title: <Translate id="home.feat.secure.t">安全可靠</Translate>,
      desc: <Translate id="home.feat.secure.d">权限透明可控，脚本行为可见，从源头拒绝恶意脚本。</Translate>,
      dev: false,
    },
    {
      icon: "lucide:refresh-cw",
      bg: "var(--lp-brand-soft)",
      color: "var(--lp-brand)",
      title: <Translate id="home.feat.sync.t">云端同步</Translate>,
      desc: <Translate id="home.feat.sync.d">脚本与配置多端云同步，换设备、重装也不丢失。</Translate>,
      dev: false,
    },
    {
      icon: "lucide:cpu",
      bg: "var(--lp-violet-soft)",
      color: "var(--lp-violet)",
      title: <Translate id="home.feat.bg.t">后台脚本</Translate>,
      desc: <Translate id="home.feat.bg.d">独有能力：无需开着标签页，脚本也能后台常驻运行。</Translate>,
      dev: true,
    },
    {
      icon: "lucide:plug",
      bg: "var(--lp-accent-soft)",
      color: "var(--lp-accent-deep)",
      title: <Translate id="home.feat.api.t">强大 API</Translate>,
      desc: <Translate id="home.feat.api.d">比 GM 更丰富：文件存储、定时任务、跨域请求随手可用。</Translate>,
      dev: true,
    },
  ];
  return (
    <section className={`${styles.section} ${styles.features}`} id="features">
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <Eyebrow icon="lucide:boxes">
            <Translate id="home.feat.eyebrow">核心能力 · WHY SCRIPTCAT</Translate>
          </Eyebrow>
          <h2 className={styles.h2}>
            <Translate id="home.feat.title1">强大内核，</Translate>
            <span className={styles.hl}>
              <Translate id="home.feat.title2">安心之选</Translate>
            </span>
          </h2>
          <p className={styles.sub}>
            <Translate id="home.feat.sub">
              从兼容性到安全性，从普通用户到开发者，ScriptCat 都替你想到了。
            </Translate>
          </p>
        </div>

        <div className={styles.featuresBody}>
          <div className={styles.featRow1}>
            <div className={styles.compatCard}>
              <div className={styles.compatLeft}>
                <div
                  className={styles.featIcon}
                  style={{ background: "var(--lp-brand-soft)", color: "var(--lp-brand)" }}
                >
                  <Icon icon="lucide:replace" />
                </div>
                <h3 className={styles.featTitle}>
                  <Translate id="home.feat.compat.t">兼容 Tampermonkey</Translate>
                </h3>
                <p className={styles.featDesc}>
                  <Translate id="home.feat.compat.d">
                    完全兼容 Tampermonkey 脚本格式与 GM API，现有脚本零改动直接迁移，切换毫无成本。
                  </Translate>
                </p>
                <span className={styles.featBullet}>
                  <Icon icon="lucide:circle-check-big" />
                  <Translate id="home.feat.compat.b">支持 GM_* API · 元数据头完全一致</Translate>
                </span>
              </div>
              <div className={styles.codeCard}>
                <div className={styles.codeBar}>
                  <span className={styles.dot} style={{ background: "#FF5F57" }} />
                  <span className={styles.dot} style={{ background: "#FEBC2E" }} />
                  <span className={styles.dot} style={{ background: "#28C840" }} />
                  <span className={styles.codeFile}>userscript.js</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeComment}>{"// ==UserScript=="}</div>
                  <div className={styles.codeMeta}>
                    {`// @name    ${translate({ id: "home.hero.mock.speed", message: "视频倍速控制" })}`}
                  </div>
                  <div className={styles.codeMeta}>{"// @match   *://*.bilibili.com/*"}</div>
                  <div className={styles.codeGrant}>{"// @grant   GM_setValue"}</div>
                  <div className={styles.codeComment}>{"// ==/UserScript=="}</div>
                </div>
              </div>
            </div>

            <div className={styles.storeCard}>
              <div className={styles.storeIcon}>
                <Icon icon="lucide:store" />
              </div>
              <h3 className={styles.featTitle}>
                <Translate id="home.feat.store.t">脚本商店</Translate>
              </h3>
              <p className={styles.featDesc}>
                <Translate id="home.feat.store.d">
                  上万款社区脚本一键安装，也能发布你的作品，与社区共建生态。
                </Translate>
              </p>
            </div>
          </div>

          <div className={styles.featRow2}>
            {small.map((f, i) => (
              <div className={styles.featSmall} key={i}>
                <div className={styles.featSmallHead}>
                  <div
                    className={styles.featSmallChip}
                    style={{ background: f.bg, color: f.color }}
                  >
                    <Icon icon={f.icon} />
                  </div>
                  {f.dev && (
                    <span className={styles.devTag}>
                      <Icon icon="lucide:code" />
                      <Translate id="home.feat.devTag">开发者</Translate>
                    </span>
                  )}
                </div>
                <h3 className={styles.featTitle} style={{ fontSize: 18 }}>
                  {f.title}
                </h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   FOR DEVELOPERS
   ===================================================================== */
export function Developers() {
  const feats = [
    { icon: "lucide:cpu", t: <Translate id="home.dev.bg.t">后台脚本</Translate>, d: <Translate id="home.dev.bg.d">无需常驻标签页，脚本可在后台持续运行。</Translate> },
    { icon: "lucide:plug-zap", t: <Translate id="home.dev.api.t">强大 API</Translate>, d: <Translate id="home.dev.api.d">文件存储、定时任务 cron、跨域请求一应俱全。</Translate> },
    { icon: "lucide:file-code", t: <Translate id="home.dev.editor.t">内置编辑器</Translate>, d: <Translate id="home.dev.editor.d">语法高亮、智能补全、错误提示，写脚本更顺手。</Translate> },
    { icon: "lucide:bug", t: <Translate id="home.dev.debug.t">实时调试</Translate>, d: <Translate id="home.dev.debug.d">日志、运行记录、错误追踪，问题一目了然。</Translate> },
  ];
  return (
    <section className={styles.developers}>
      <div className={styles.devGlow} />
      <div className={styles.sectionHeader}>
        <Eyebrow icon="lucide:terminal">
          <Translate id="home.dev.eyebrow">为开发者而生 · FOR DEVELOPERS</Translate>
        </Eyebrow>
        <h2 className={styles.h2}>
          <Translate id="home.dev.title1">把浏览器，变成你的</Translate>
          <span className={styles.hl}>
            <Translate id="home.dev.title2">代码运行时</Translate>
          </span>
        </h2>
        <p className={styles.sub}>
          <Translate id="home.dev.sub">
            后台脚本、丰富 API、内置编辑器与调试工具 —— 从写下第一行到上线运行，一站式搞定。
          </Translate>
        </p>
      </div>

      <div className={styles.devBody}>
        <div className={styles.devLeft}>
          {feats.map((f, i) => (
            <div className={styles.devFeature} key={i}>
              <div className={styles.devFeatureChip}>
                <Icon icon={f.icon} />
              </div>
              <div>
                <h3 className={styles.devFeatureTitle}>{f.t}</h3>
                <p className={styles.devFeatureDesc}>{f.d}</p>
              </div>
            </div>
          ))}
          <div className={styles.devCta}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to={LINKS.dev}>
              <Icon icon="lucide:book-open" width={16} height={16} />
              <Translate id="home.dev.docsBtn">阅读开发文档</Translate>
            </Link>
            <Link className={styles.devApiBtn} to={LINKS.api}>
              <Translate id="home.dev.apiBtn">API 参考</Translate>
              <Icon icon="lucide:arrow-right" />
            </Link>
          </div>
        </div>

        <div className={styles.editor}>
          <div className={styles.editorBar}>
            <div className={styles.mockDots}>
              <span className={styles.mockDot} style={{ background: "#FF5F57", width: 10, height: 10 }} />
              <span className={styles.mockDot} style={{ background: "#FEBC2E", width: 10, height: 10 }} />
              <span className={styles.mockDot} style={{ background: "#28C840", width: 10, height: 10 }} />
            </div>
            <span className={styles.cat}>
              <Logo size={16} />
            </span>
            <span className={styles.editorFile}>checkin.user.js</span>
            <span className={styles.editorRun}>
              <Icon icon="lucide:play" />
              <Translate id="home.dev.run">运行</Translate>
            </span>
          </div>
          <div className={styles.editorArea}>
            <div className={styles.editorGutter}>
              {Array.from({ length: 11 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <div className={styles.editorCode}>
              <div className={styles.cComment}>{"// ==UserScript=="}</div>
              <div className={styles.cMeta}>
                {`// @name  ${translate({ id: "home.dev.mock.name", message: "每日自动签到" })}`}
              </div>
              <div className={styles.cMeta}>{"// @cron  0 9 * * *"}</div>
              <div className={styles.cComment}>{"// ==/UserScript=="}</div>
              <div>&nbsp;</div>
              <div>
                <span className={styles.cKw}>async function </span>
                <span className={styles.cFn}>checkIn</span>
                <span className={styles.cPlain}>() {"{"}</span>
              </div>
              <div>
                &nbsp;&nbsp;<span className={styles.cKw}>const </span>
                <span className={styles.cPlain}>r = </span>
                <span className={styles.cKw}>await </span>
                <span className={styles.cApi}>GM.fetch</span>
                <span className={styles.cPlain}>(api)</span>
              </div>
              <div>
                &nbsp;&nbsp;<span className={styles.cApi}>GM_notification</span>
                <span className={styles.cStr}>
                  {`('${translate({ id: "home.dev.mock.toast", message: "签到成功" })}')`}
                </span>
              </div>
              <div className={styles.cPlain}>{"}"}</div>
              <div>&nbsp;</div>
              <div>
                <span className={styles.cFn}>checkIn</span>
                <span className={styles.cPlain}>()</span>
              </div>
            </div>
          </div>
          <div className={styles.editorConsole}>
            <Logo size={15} />
            <span>
              {`ScriptCat › ${translate({ id: "home.dev.mock.toast", message: "签到成功" })} · 200 OK`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   COMMUNITY
   ===================================================================== */
const FALLBACK_COLORS = [
  "#1296DB", "#FF7A3D", "#12B28C", "#6C5CE7", "#EFA31D", "#42B4F5",
  "#F05E1C", "#0E8A6C", "#7C6CF5", "#E4899B", "#3AACEF", "#F4A825",
  "#5FC7A8", "#8E7CF0", "#FF9A5A", "#4FB0E5", "#2FB89A", "#B07CF0",
];

export function Community() {
  const list = stats.contributors.list || [];
  const SHOWN = 39;
  const shown = list.slice(0, SHOWN);
  const remaining = stats.contributors.count - shown.length;
  return (
    <section className={`${styles.section} ${styles.community}`}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <Eyebrow icon="lucide:heart-handshake">
            <Translate id="home.comm.eyebrow">开源社区 · OPEN SOURCE</Translate>
          </Eyebrow>
          <h2 className={styles.h2}>
            <Translate id="home.comm.title1">由社区，</Translate>
            <span className={styles.hl}>
              <Translate id="home.comm.title2">共同打造</Translate>
            </span>
          </h2>
          <p className={styles.sub}>
            <Translate id="home.comm.sub">
              完全开源、透明、免费。每一行代码都可审阅，每一位贡献者都被看见。
            </Translate>
          </p>
        </div>

        <div className={styles.communityBody}>
          <div className={styles.wall}>
            {shown.length > 0
              ? shown.map((c) => (
                  <a
                    key={c.login}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    title={c.login}
                  >
                    <img className={styles.avatar} src={c.avatar} alt={c.login} loading="lazy" />
                  </a>
                ))
              : FALLBACK_COLORS.map((color, i) => (
                  <span key={i} className={styles.avatar} style={{ background: color }} />
                ))}
            {remaining > 0 && (
              <a className={styles.avatarMore} href={LINKS.contributors} target="_blank" rel="noreferrer">
                +{remaining}
              </a>
            )}
          </div>
          <a className={styles.contributeBtn} href={LINKS.github} target="_blank" rel="noreferrer">
            <Icon icon="lucide:github" />
            <Translate id="home.comm.btn">在 GitHub 上参与贡献</Translate>
            <Icon icon="lucide:arrow-right" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   FINAL CTA
   ===================================================================== */
export function FinalCTA() {
  const { store, href, external } = usePrimaryInstall();
  return (
    <section className={styles.finalCta}>
      <div className={styles.ctaCard}>
        <div className={styles.ctaGlow1} />
        <div className={styles.ctaGlow2} />
        <div className={styles.ctaLeft}>
          <span className={styles.ctaEyebrow}>
            <Icon icon="lucide:badge-check" />
            <Translate id="home.cta.eyebrow">完全免费 · 开源 · 无广告</Translate>
          </span>
          <h2 className={styles.ctaHeadline}>
            <Translate id="home.cta.h1">准备好给浏览器</Translate>
            <br />
            <span className={styles.hl}>
              <Translate id="home.cta.h2">开挂</Translate>
            </span>
            <Translate id="home.cta.h3">了吗？</Translate>
          </h2>
          <p className={styles.ctaSub}>
            <Translate id="home.cta.sub">
              从应用商店一键安装，或下载安装包手动安装。30 秒，解锁网页超能力。
            </Translate>
          </p>
          <div className={styles.ctaBtns}>
            <a
              className={styles.ctaPrimary}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Icon
                icon={store ? store.icon : "lucide:book-open"}
                width={20}
                height={20}
              />
              {store ? (
                <Translate id="home.cta.primary" values={{ browser: store.label }}>
                  {"免费安装到 {browser}"}
                </Translate>
              ) : (
                <Translate id="home.install.guide">查看安装指南</Translate>
              )}
            </a>
            <a className={styles.ctaSecondaryBtn} href={LINKS.store} target="_blank" rel="noreferrer">
              <Icon icon="lucide:compass" />
              <Translate id="home.cta.secondary">浏览脚本库</Translate>
            </a>
          </div>
          <div className={styles.ctaStores}>
            <Translate id="home.cta.stores">支持 Edge · Chrome · Firefox · 手动安装包</Translate>
          </div>
        </div>
        <div className={styles.ctaMascot}>
          <div className={styles.ctaMascotCircle}>
            <Logo size={96} white />
            <div className={styles.ctaMascotSpark}>
              <Icon icon="lucide:sparkles" />
            </div>
          </div>
          <div className={styles.ctaMascotChip}>
            <Icon icon="lucide:check" />
            <Translate id="home.cta.chip">已安装并运行</Translate>
          </div>
        </div>
      </div>
    </section>
  );
}
