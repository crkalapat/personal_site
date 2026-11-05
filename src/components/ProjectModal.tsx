import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "../data/projects";
import { ProjectCard } from "./ProjectCard";
import closeIcon from "../assets/icons/close.svg";
import "./ProjectModal.css";

type Props = {
  project: Project;
  /** The grid slot the card lives in — the card flies out of / back into this element. */
  getOrigin: (id: string) => HTMLElement | null;
  /** Step to the previous (-1) / next (+1) project with the arrow keys. */
  onStep: (delta: -1 | 1) => void;
  /** Called once the "put back" animation has finished. */
  onClosed: () => void;
};

type Phase = "opening" | "open" | "closing";

const FLY_OUT_MS = 820;
const FLY_BACK_MS = 680;
const LAND_FADE_MS = 140;
const NO_SHADOW = "0 0 0 0 rgba(0, 0, 0, 0)";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Nudge the modal content by a sub-pixel amount so the flyer sits at the same fractional pixel
 * offset as the grid slot. Then the fly-back moves by whole pixels and lands exactly on the
 * grid card's pixels (no half-pixel shimmer when they swap).
 */
function alignToSlot(content: HTMLElement, flyer: HTMLElement, slot: HTMLElement) {
  const frac = (n: number) => n - Math.floor(n);
  content.style.left = "0px";
  content.style.top = "0px";
  const f = flyer.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  content.style.left = `${frac(s.left) - frac(f.left)}px`;
  content.style.top = `${frac(s.top) - frac(f.top)}px`;
}

/** How much to enlarge the card: ×1.54 (the Figma modal), shrunk to fit small or short screens. */
function modalScale() {
  const cardH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-h")) || 390;
  return Math.min(1.54, (window.innerWidth - 48) / 250, (window.innerHeight - 210) / cardH);
}

/**
 * Transform that makes `el` (at its natural position `to`) appear exactly over `from`.
 * Uses the centers, so it composes with transform-origin: center.
 */
function placeOver(from: DOMRect, to: DOMRect, extra = "") {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const s = from.width / to.width;
  return `translate(${dx}px, ${dy}px) ${extra} scale(${s})`;
}

export function ProjectModal({ project, getOrigin, onStep, onClosed }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const firstIdRef = useRef(project.id);
  const [phase, setPhase] = useState<Phase>("opening");
  const [scale, setScale] = useState(modalScale);
  const titleId = `project-title-${project.id}`;

  useEffect(() => {
    const onResize = () => setScale(modalScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Open: show the dialog, then fly the card from its grid slot to the center ("pick it up").
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const flyer = flyerRef.current;
    if (!dialog || !flyer) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("scroll-locked");

    // Measure the card's resting spot without any in-flight animation applied
    // (React StrictMode runs this effect twice in development).
    const card = flyer.querySelector<HTMLElement>(".card");
    flyer.getAnimations().forEach((a) => a.cancel());
    card?.getAnimations().forEach((a) => a.cancel());
    const slot = getOrigin(project.id);
    if (slot && !prefersReducedMotion()) {
      if (contentRef.current) alignToSlot(contentRef.current, flyer, slot);
      const from = slot.getBoundingClientRect();
      const to = flyer.getBoundingClientRect();
      // If the card was mid-hover (lifted + tilted), start from that pose so there's no jump.
      const hovered = slot.querySelector(".card:hover");
      const tilt = hovered ? `translateY(-6px) rotate(${slot.matches(":nth-child(even)") ? 1 : -1}deg)` : "";
      const timing = { duration: FLY_OUT_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };
      flyer.animate([{ transform: placeOver(from, to, tilt) }, { transform: "none" }], timing);
      // The drop shadow grows in as the card lifts off the grid.
      if (card) card.animate([{ boxShadow: NO_SHADOW }, { boxShadow: getComputedStyle(card).boxShadow }], timing);
    }
    const raf = requestAnimationFrame(() => setPhase("open"));

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("scroll-locked");
      if (dialog.open) dialog.close();
    };
    // Run once on mount only: later project changes (arrow keys) don't re-fly the card.
  }, []);

  // Close: fade the scrim/buttons and fly the card back into its slot ("put it down").
  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setPhase("closing");

    const flyer = flyerRef.current;
    const slot = getOrigin(project.id);
    if (!flyer || !slot || prefersReducedMotion()) {
      window.setTimeout(onClosed, 150);
      return;
    }
    const card = flyer.querySelector<HTMLElement>(".card");
    flyer.getAnimations().forEach((a) => a.cancel());
    card?.getAnimations().forEach((a) => a.cancel());
    if (contentRef.current) alignToSlot(contentRef.current, flyer, slot);
    const to = flyer.getBoundingClientRect();
    const from = slot.getBoundingClientRect();
    const timing = { duration: FLY_BACK_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" as const };
    const anim = flyer.animate([{ transform: "none" }, { transform: placeOver(from, to) }], timing);
    // Shadow fades as it's set down, so nothing extra is left around the edges on landing.
    if (card) card.animate([{ boxShadow: getComputedStyle(card).boxShadow }, { boxShadow: NO_SHADOW }], timing);
    anim.onfinish = () => {
      // Landed: reveal the real grid card underneath and cross-fade the flyer away, so tiny
      // rasterization differences (thin borders, the award sticker) blend instead of snapping.
      slot.style.visibility = "visible";
      flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: LAND_FADE_MS, fill: "forwards" }).onfinish = onClosed;
    };
  }, [getOrigin, onClosed, project.id]);

  // Arrow keys flip through projects; give the new card a little pop.
  useEffect(() => {
    if (project.id === firstIdRef.current) return;
    firstIdRef.current = project.id;
    if (prefersReducedMotion()) return;
    flyerRef.current?.animate(
      [{ opacity: 0.4, transform: "scale(0.94) rotate(-1deg)" }, { opacity: 1, transform: "none" }],
      { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    );
  }, [project.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (closingRef.current) return;
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStep]);

  // Only links that exist get a button — no greyed-out placeholders.
  const actions = [
    { label: "Demo", href: project.demoUrl },
    { label: "GitHub", href: project.repoUrl },
    { label: "Write-up", href: project.writeupUrl },
  ].filter((a): a is { label: string; href: string } => Boolean(a.href));

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      data-phase={phase}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        // Clicks on the dim background (not the card or buttons) close the modal.
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.classList.contains("modal__stage") || t.classList.contains("modal__scrim")) {
          close();
        }
      }}
    >
      <div className="modal__scrim" />
      <div className="modal__stage">
        <div ref={contentRef} className="modal__content">
          <button type="button" className="modal__close modal__chrome" onClick={close} aria-label="Close">
            <img src={closeIcon} alt="" />
          </button>

          <div ref={flyerRef} className="modal__flyer" style={{ "--s": scale } as CSSProperties}>
            <ProjectCard project={project} size="lg" titleId={titleId} />
          </div>

          {actions.length > 0 && (
            <div className="modal__actions modal__chrome">
              {actions.map(({ label, href }) => (
                <a key={label} className="pill-button" href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

