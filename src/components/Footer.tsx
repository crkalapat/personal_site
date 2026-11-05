import type { ReactNode } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { EMAIL, GITHUB_PROFILE, LINKEDIN_PROFILE, NAME } from "../data/site";
import "./Footer.css";

const LINKS: { label: string; href: string; icon: ReactNode; external: boolean }[] = [
  { label: "Email", href: `mailto:${EMAIL}`, icon: <FaEnvelope aria-hidden="true" />, external: false },
  { label: "LinkedIn", href: LINKEDIN_PROFILE, icon: <FaLinkedin aria-hidden="true" />, external: true },
  { label: "GitHub", href: GITHUB_PROFILE, icon: <FaGithub aria-hidden="true" />, external: true },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__copy">
        © {new Date().getFullYear()} {NAME}
      </p>
      <ul className="site-social" aria-label="Contact and profiles">
        {LINKS.map(({ label, href, icon, external }) => (
          <li key={label}>
            <a
              className="site-social__link"
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
