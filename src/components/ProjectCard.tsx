import type { CSSProperties } from "react";
import { gradientCss, type Project } from "../data/projects";
import "./ProjectCard.css";

type Props = {
  project: Project;
  size?: "sm" | "lg";
  /** When provided, the card renders as a button (grid). Otherwise a static panel (modal). */
  onOpen?: () => void;
  titleId?: string;
};

export function ProjectCard({ project, size = "sm", onOpen, titleId }: Props) {
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
          <img src={project.image} alt={project.imageAlt} style={imgStyle} draggable={false} />
        </span>
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
        aria-label={`${project.title}, ${project.date}. Open details`}
        aria-haspopup="dialog"
      >
        {body}
      </button>
    );
  }

  return (
    <div className={className} style={style}>
      {body}
    </div>
  );
}
