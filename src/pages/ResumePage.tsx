import { FaDownload } from "react-icons/fa";
import resumeImg from "../assets/resume.webp";
import "./ResumePage.css";

// The Resume tab (#resume; charliekalapati.com/resume also opens it). To update the resume, replace public/resume.pdf
// and re-render src/assets/resume.webp from it (page 1, 1700px wide).
const RESUME_PDF = "/resume.pdf";

export function ResumePage() {
  return (
    <section className="resume" aria-labelledby="resume-doc">
      <div className="resume__heading">
        <h2 id="resume-doc" className="section-title">
          Resume
        </h2>
        <a
          className="pill-button pill-button--small"
          href={RESUME_PDF}
          download="Charlie_Kalapati_Resume.pdf"
        >
          <FaDownload aria-hidden="true" />
          PDF
        </a>
      </div>
      <a
        className="resume__sheet"
        href={RESUME_PDF}
        target="_blank"
        rel="noreferrer"
        aria-label="Open resume PDF"
      >
        <img
          src={resumeImg}
          width={1700}
          height={2200}
          alt="Charlie Kalapati's resume: Texas A&M Computer Science; experience with TAMU Datathon, FIRST Robotics Team 418, and LASA CS Club; projects including Tesseract, Keystroke, Spellboard, Fuse, and Smart Knob."
        />
      </a>
    </section>
  );
}
