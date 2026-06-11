import { useState } from "react";
import { projects } from "../data";

function ProjectsPage({ setCaseStudy }) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 6);

  return (
    <main>
      <section className="portfolio-hero">
        <span className="pill-badge">Portfolio</span>
        <h1>Crafted Experiences</h1>
        <p>
          A collection of design solutions crafted with purpose, creativity,
          and attention to detail.
        </p>
      </section>
      <section className="container" style={{ paddingTop: 0 }}>
        <div className="projects-grid">
          {visibleProjects.map((proj) => (
            <div
              key={proj.id}
              className="project-card"
              onClick={() => {
                setCaseStudy(proj.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="project-img-wrapper">
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="project-img"
                  loading="lazy"
                />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  <span className="project-tag">{proj.category}</span>
                  <span className="project-tag">{proj.industry}</span>
                </div>
                <h3>{proj.title}</h3>
                <p>{proj.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {!showAllProjects && projects.length > 6 && (
          <div className="load-more-container">
            <button
              className="primary-cta"
              onClick={() => setShowAllProjects(true)}
              style={{ cursor: "pointer" }}
            >
              Load More Projects
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProjectsPage;
