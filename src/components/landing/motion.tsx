import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import {
  LazyMotion,
  MotionConfig,
  animate,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
} from "motion/react";
import styles from "./landing.module.css";
import { abbr } from "./shared";

// Shared motion vocabulary for the landing page. Everything here is only ever
// imported from src/pages/index.tsx's tree, so motion lands in the homepage
// chunk rather than in main.js (see "Bundle budget" in AGENTS.md).

export const EASE = [0.22, 1, 0.36, 1] as const;

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// LazyMotion + `m` keeps the feature bundle to domAnimation; `strict` makes a
// stray full `motion.div` fail loudly instead of silently pulling it all in.
// reducedMotion="user" drops transform/layout animation for visitors who ask
// for less motion; the imperative demos check useReducedMotion() themselves
// and jump straight to their final frame.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

type RevealTag = "div" | "li" | "p" | "span" | "h2" | "h3" | "a";

// Fades + lifts its children in the first time they scroll into view.
// whileInView with explicit keyframes (rather than `initial`) keeps the SSR
// markup fully visible — the hidden start state comes from the .reveal CSS
// rule, which only applies once the page has hydrated.
export function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  amount = 0.25,
  className,
  style,
  children,
}: {
  as?: RevealTag;
  delay?: number;
  y?: number;
  amount?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag
      className={clsx(styles.reveal, className)}
      style={style}
      whileInView={{ opacity: [0, 1], y: [y, 0] }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

// Renders the final abbreviated figure (so SSR and no-JS show the real number)
// and counts up to it the first time it scrolls into view.
export function CountUp({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;
    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = abbr(Math.max(1, v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, delay]);
  return <span ref={ref}>{abbr(value)}</span>;
}

// Pointer-following highlight for cards: writes the pointer position into
// --mx/--my, which the card's ::before radial gradient reads. No React state,
// so moving the mouse never re-renders.
export function spotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// Resolves after `ms`, then keeps waiting while `paused()` is true. Throws
// CANCELLED once `dead()` flips, which unwinds a demo's async script when its
// component unmounts or restarts.
export const CANCELLED = Symbol("cancelled");
export async function waitWhile(
  ms: number,
  paused: () => boolean,
  dead: () => boolean,
) {
  await sleep(ms);
  while (!dead() && paused()) await sleep(200);
  if (dead()) throw CANCELLED;
}
