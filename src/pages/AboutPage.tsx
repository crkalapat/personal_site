import { useMemo } from "react";
import { marked } from "marked";
// Edit this file to change the About section. Standard Markdown: paragraphs,
// **bold**, *italic*, [links](https://…), lists, and ## headings all work.
import aboutMarkdown from "../content/about.md?raw";
import "./AboutPage.css";

export function AboutPage() {
  // The Markdown is our own file bundled at build time, so rendering it as HTML is safe.
  const html = useMemo(() => marked.parse(aboutMarkdown, { async: false }), []);

  return <section className="about" aria-label="About" dangerouslySetInnerHTML={{ __html: html }} />;
}
