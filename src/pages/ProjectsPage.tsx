import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { GITHUB_PROFILE, projects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import "./ProjectsPage.css";

export function ProjectsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const slots = useRef(new Map<string, HTMLDivElement>());

  const step = useCallback((delta: -1 | 1) => {
    setOpenIndex((i) => (i === null ? i : (i + delta + projects.length) % projects.length));
  }, []);

  const getOrigin = useCallback((id: string) => slots.current.get(id) ?? null, []);

  const handleClosed = useCallback(() => {
    const id = openIndex === null ? null : projects[openIndex].id;
    // Unmount the modal and reveal the grid card in the same frame the fly-back ends.
    flushSync(() => setOpenIndex(null));
    if (id) slots.current.get(id)?.querySelector<HTMLElement>(".card")?.focus({ preventScroll: true });
  }, [openIndex]);

  return (
    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-title">
        Featured Projects
      </h2>

      <div className="projects__grid">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="projects__slot"
            ref={(el) => {
              if (el) slots.current.set(project.id, el);
              else slots.current.delete(project.id);
            }}
            // The card is "picked up" while its modal is open, leaving an empty spot in the grid.
            style={openIndex === i ? { visibility: "hidden" } : undefined}
          >
            <ProjectCard project={project} onOpen={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>

      <div className="projects__more">
        <a
          // Fade to gray behind the modal so it doesn't blend with the modal's black buttons.
          className={`pill-button pill-button--small${openIndex !== null ? " pill-button--receded" : ""}`}
          href={GITHUB_PROFILE}
          target="_blank"
          rel="noreferrer"
        >
          View All Projects on GitHub
          <span aria-hidden="true" className="pill-button__arrow">
            ↗
          </span>
        </a>
      </div>

      {openIndex !== null && (
        <ProjectModal
          project={projects[openIndex]}
          getOrigin={getOrigin}
          onStep={step}
          onClosed={handleClosed}
        />
      )}
    </section>
  );
}
