import type { JSX } from "react";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

// 文档页头部的直投横幅（970×90 的 2 倍图）。
// 路径、类名、文件名都刻意避开 ad/banner/尺寸 这类字样，否则会被常见的广告过滤规则整块隐藏。
export default function Showcase(): JSX.Element {
  const src = useBaseUrl("/img/paperbuddy/cover.png");
  return (
    <div className={styles.showcase}>
      <span className={styles.label}>
        <Translate id="ad.label" description="Label shown above an advertisement slot">
          广告
        </Translate>
      </span>
      <a
        href="https://paperbuddy.cn/?ch=HYAZVXXA"
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        <img
          src={src}
          alt="PaperBuddy：论文一键生成，AIGC 轻松过"
          width={970}
          height={90}
          className={styles.image}
        />
      </a>
    </div>
  );
}
