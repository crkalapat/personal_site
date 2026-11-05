import { useLayoutEffect, useRef, useState } from "react";
import { NAME } from "../data/site";
import type { Route } from "../useHashRoute";
import "./Header.css";

const NAV: { route: Route; label: string }[] = [
  { route: "about", label: "About" },
  { route: "projects", label: "Projects" },
];

export function Header({ route }: { route: Route }) {
  const navRef = useRef<HTMLElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);

  // Slide the underline under the active link; re-measure when fonts load or the nav resizes.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-route="${route}"]`);
      if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [route]);

  return (
    <header className="site-header">
      <h1 className="site-header__name">
        <a href="#about">{NAME}</a>
      </h1>
      <nav ref={navRef} className="site-nav" aria-label="Primary">
        {NAV.map(({ route: r, label }) => (
          <a
            key={r}
            href={`#${r}`}
            data-route={r}
            className="site-nav__link"
            aria-current={r === route ? "page" : undefined}
          >
            {label}
          </a>
        ))}
        {bar && (
          <span
            className="site-nav__underline"
            style={{ transform: `translateX(${bar.left}px)`, width: bar.width }}
            aria-hidden="true"
          />
        )}
      </nav>
    </header>
  );
}
