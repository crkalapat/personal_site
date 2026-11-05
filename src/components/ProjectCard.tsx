import type { CSSProperties } from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";
import { gradientCss, type Project } from "../data/projects";
import "./ProjectCard.css";

type Props = {
  project: Project;
  size?: "sm" | "lg";
  /** When provided, the card renders as a button (grid). Otherwise a static panel (modal). */
  onOpen?: () => void;
  /** When provided (and no onOpen), the card renders as a link that opens in a new tab (modal). */
  href?: string;
  titleId?: string;
};

export function ProjectCard({ project, size = "sm", onOpen, href, titleId }: Props) {
  const { imageFit } = project;
  const imgStyle: CSSProperties =
    typeof imageFit === "string"
      ? { inset: 0, width: "100%", height: "100%", objectFit: imageFit }
      : {
          width: `${imageFit.width}%`,
          height: `${imageFit.height}%`,
          left: `${imageFit.left}%`,
          top: `${imageFit.top}%`,
        };

  const body = (
    <>
      <span className="card__header">
        <span className="card__title" id={titleId}>
          {project.title}
        </span>
        <span className="card__date">{project.date}</span>
        <span className="card__badge" title={project.iconLabel}>
          <img className="card__badge-bg" src={project.badge} alt="" />
          <img className="card__badge-icon" src={project.icon} alt={project.iconLabel} />
        </span>
      </span>
      <span className="card__frame">
        <span className="card__media">
          <img
            src={project.image}
            alt={project.imageAlt}
            width={project.imageSize[0]}
            height={project.imageSize[1]}
            // Grid cards lazy-load; the modal copy reuses the already-cached file.
            loading={size === "sm" ? "lazy" : "eager"}
            decoding="async"
            style={imgStyle}
            draggable={false}
          />
        </span>
        {project.award && (
          <span className="card__award">
            {project.award.icon === "trophy" ? (
              <FaTrophy className="card__award-icon card__award-icon--gold" aria-hidden="true" />
            ) : (
              <FaMedal className="card__award-icon card__award-icon--silver" aria-hidden="true" />
            )}
            {project.award.label}
          </span>
        )}
      </span>
      <span className="card__desc">{project.description}</span>
    </>
  );

  const className = `card card--${size}`;
  const style = { backgroundImage: gradientCss(project.gradient) };

  if (onOpen) {
    return (
      <button
        type="button"
        className={`${className} card--interactive`}
        style={style}
        onClick={onOpen}
        aria-label={[project.title, project.date, project.award?.label, "Open details"].filter(Boolean).join(". ")}
        aria-haspopup="dialog"
      >
        {body}
      </button>
    );
  }

  if (href) {
    return (
      <a
        className={`${className} card--link`}
        style={style}
        href={href}
        target="_blank"
        rel="noreferrer"
        draggable={false}
        // Mouse/touch shortcut only: the modal's "Demo" button is the keyboard path to the same link.
        tabIndex={-1}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={className} style={style}>
      {body}
    </div>
  );
}
