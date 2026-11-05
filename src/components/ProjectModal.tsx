import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const closingRef = useRef(false);
  const firstIdRef = useRef(project.id);
  const [phase, setPhase] = useState<Phase>("opening");
  const titleId = `project-title-${project.id}`;

  // Open: show the dialog, then fly the card from its grid slot to the center ("pick it up").
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const flyer = flyerRef.current;
    if (!dialog || !flyer) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("scroll-locked");

    // Measure the card's resting spot without any in-flight animation applied
    // (React StrictMode runs this effect twice in development).
    flyer.getAnimations().forEach((a) => a.cancel());
    const slot = getOrigin(project.id);
    if (slot && !prefersReducedMotion()) {
      const from = slot.getBoundingClientRect();
      const to = flyer.getBoundingClientRect();
      // If the card was mid-hover (lifted + tilted), start from that pose so there's no jump.
      const hovered = slot.querySelector(".card:hover");
      const tilt = hovered ? `translateY(-6px) rotate(${slot.matches(":nth-child(even)") ? 1 : -1}deg)` : "";
      flyer.animate(
        [
          { transform: placeOver(from, to, tilt), boxShadow: "0 0 0 rgba(0,0,0,0)" },
          { transform: "none" },
        ],
        { duration: FLY_OUT_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      );
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
    flyer.getAnimations().forEach((a) => a.cancel());
    const to = flyer.getBoundingClientRect();
    const from = slot.getBoundingClientRect();
    const anim = flyer.animate([{ transform: "none" }, { transform: placeOver(from, to) }], {
      duration: FLY_BACK_MS,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    });
    anim.onfinish = onClosed;
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

  const { demo, github } = project.links;

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
        <div className="modal__content">
          <button type="button" className="modal__close modal__chrome" onClick={close} aria-label="Close">
            <img src={closeIcon} alt="" />
          </button>

          <div ref={flyerRef} className="modal__flyer">
            <ProjectCard project={project} size="lg" titleId={titleId} />
          </div>

          <div className="modal__actions modal__chrome">
            <ActionButton label="Demo" href={demo} />
            <ActionButton label="GitHub" href={github} />
          </div>
        </div>
      </div>
    </dialog>
  );
}

function ActionButton({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <a className="pill-button" href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }
  // No link yet: keep the button in the layout, but make it clearly inactive.
  return (
    <span className="pill-button pill-button--disabled" aria-disabled="true" title="Link coming soon">
      {label}
    </span>
  );
}
