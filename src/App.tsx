import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResumePage } from "./pages/ResumePage";
import { useHashRoute } from "./useHashRoute";

const TITLES = { about: "About", projects: "Projects", resume: "Resume" } as const;

export default function App() {
  const route = useHashRoute();

  useEffect(() => {
    document.title = `${TITLES[route]} · Charlie Kalapati`;
  }, [route]);

  return (
    <div className="page">
      <Header route={route} />
      <main className="page__main" key={route}>
        {route === "about" && <AboutPage />}
        {route === "projects" && <ProjectsPage />}
        {route === "resume" && <ResumePage />}
      </main>
      <Footer />
    </div>
  );
}
