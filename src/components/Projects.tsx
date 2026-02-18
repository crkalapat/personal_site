import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce application with React, TypeScript, and Node.js. Features include user authentication, product management, and payment integration.",
      imageUrl: "https://placehold.co/600x400/6366f1/ffffff?text=E-commerce",
      githubUrl: "https://github.com/example/ecommerce",
      liveUrl: "https://example.com/ecommerce"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management tool built with React and Firebase. Real-time updates, drag-and-drop functionality, and team collaboration features.",
      imageUrl: "https://placehold.co/600x400/8b5cf6/ffffff?text=Task+Manager",
      githubUrl: "https://github.com/example/task-manager"
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather dashboard using React and OpenWeather API. Features include location search, 5-day forecast, and beautiful data visualizations.",
      imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Weather+App",
      githubUrl: "https://github.com/example/weather-dashboard",
      liveUrl: "https://example.com/weather"
    }
  ];

  return (
    <section id="projects" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
