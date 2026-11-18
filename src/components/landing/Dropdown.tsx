import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./landing.module.css";

// The landing page's link menus (browser picker, language switcher): a list of
// anchors that opens on hover or click.
//
// It renders in place rather than in a portal, so it inherits the lp-* design
// tokens from `.page` and needs no theme-aware overrides of its own. The flip
// side is that an ancestor's `overflow` clips it — see `.install` and
// `.lnavPanel` in landing.module.css, both of which handle that.

export type DropdownItem = {
  key: string;
  label: ReactNode;
};

export function Dropdown({
  items,
  align = "right",
  children,
}: {
  items: DropdownItem[];
  /** Which edge of the menu lines up with the trigger. */
  align?: "left" | "right";
  /** The trigger. Gets `aria-haspopup`/`aria-expanded` wired up by the caller. */
  children: (props: {
    onClick: () => void;
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
  }) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Hover closes on mouseleave, but a click-opened menu also has to close when
  // the pointer never entered it (tap elsewhere) or on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={styles.dd}
      // Hover is mouse-only. A tap fires an emulated mouseenter right before
      // its click, so listening to mouse events would open the menu and the
      // click would toggle it shut again — on touch it would never open.
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      {children({
        onClick: () => setOpen((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": menuId,
      })}
      {open && (
        // The padding on the positioner bridges the visual gap to the menu, so
        // moving the pointer down into it never leaves the hover area.
        <div className={align === "right" ? styles.ddPopRight : styles.ddPopLeft}>
          <ul className={styles.ddMenu} id={menuId} role="menu">
            {items.map((item) => (
              <li
                key={item.key}
                role="menuitem"
                className={styles.ddItem}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
