import { useEffect, useState, type JSX } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import { Hero } from "../components/landing/Hero";
import { Scenes } from "../components/landing/Scenes";
import { Steps } from "../components/landing/Steps";
import { Features } from "../components/landing/Features";
import { AI } from "../components/landing/AI";
import { Developers } from "../components/landing/Developers";
import { Community, FinalCTA } from "../components/landing/Closing";
import { LandingNav } from "../components/landing/LandingNav";
import { MotionProvider } from "../components/landing/motion";
import styles from "../components/landing/landing.module.css";

export default function Home(): JSX.Element {
  // Scroll-reveal content is hidden only after hydration (see .reveal in
  // landing.module.css), so the static HTML is complete without JS.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <>
      <Head>
        {/* Hide the global Docusaurus navbar on the homepage; LandingNav replaces it */}
        <body className="landing-page" />
        <meta
          name="keywords"
          content={translate({
            id: "homepage.meta.keywords",
            message:
              "ScriptCat,脚本猫,用户脚本,浏览器扩展,userscript,tampermonkey,violentmonkey,后台脚本,自动化,广告屏蔽,脚本商店",
          })}
        />
      </Head>
      <Layout
        title={translate({ id: "homepage.meta.title", message: "首页" })}
        description={translate({
          id: "homepage.meta.description",
          message:
            "脚本猫（ScriptCat）是强大的开源用户脚本引擎，兼容 Tampermonkey。一键安装社区脚本去广告、增强视频、自动化操作，也为开发者提供后台脚本与丰富 API，激活浏览器的无限可能。",
        })}
      >
        <MotionProvider>
          <main className={styles.page} data-lp-motion={hydrated ? "" : undefined}>
            <LandingNav />
            <Hero />
            <Scenes />
            <Steps />
            <Features />
            <AI />
            <Developers />
            <Community />
            <FinalCTA />
          </main>
        </MotionProvider>
      </Layout>
    </>
  );
}
