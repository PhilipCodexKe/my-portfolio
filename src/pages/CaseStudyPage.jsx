import { projects } from "../data";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

function CaseStudyPage({ caseStudyId, setCaseStudy, formData, handleChange, handleSubmit, navigate }) {
  const proj = projects.find((p) => p.id === caseStudyId);
  if (!proj) return null;

  return (
    <div className="app-container">
      <div className="case-study-header">
        <button className="back-btn" onClick={() => setCaseStudy(null)}>
          ← Back to Projects
        </button>
        <h1>{proj.title}</h1>
        <div className="project-tags" style={{ marginTop: "1rem" }}>
          <span className="project-tag">{proj.category}</span>
          <span className="project-tag">{proj.industry}</span>
          {proj.tech.map((t, i) => (
            <span className="project-tag" key={i}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <img
        src={proj.img}
        alt={proj.title}
        className="case-study-hero-img"
        style={{ margin: "0 4vw", width: "calc(100% - 8vw)" }}
      />
      <div className="case-study-content">
        <div className="case-study-section">
          <h2>Overview</h2>
          <p>
            {proj.desc} This project was designed and developed to solve real
            problems with thoughtful engineering and polished user interfaces.
          </p>
        </div>
        <div className="case-study-section">
          <h2>The Problem</h2>
          <p>
            Users needed a seamless, modern experience that traditional
            solutions weren't providing. The challenge was to build something
            that felt premium while remaining lightning-fast and accessible
            across all devices.
          </p>
        </div>
        <div className="case-study-section">
          <h2>Design Decisions</h2>
          <p>
            I chose {proj.tech.join(", ")} for this stack because they provide
            the right balance of performance, developer experience, and
            scalability. Every technical decision was made with the end user
            in mind.
          </p>
        </div>
        <div className="case-study-section">
          <h2>Key Challenges</h2>
          <p>
            Performance optimization was critical, especially for real-time
            features. I implemented lazy loading, code splitting, and
            efficient state management to ensure the application remained
            responsive under load.
          </p>
        </div>
        <div className="case-study-section">
          <h2>Outcomes & Reflections</h2>
          <p>
            The project successfully delivered a polished, high-performance
            solution. Key learnings included the importance of early
            prototyping, iterative testing, and maintaining clean architecture
            throughout the build.
          </p>
        </div>
        {proj.link && (
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-cta"
            style={{ alignSelf: "flex-start" }}
          >
            View Live Project →
          </a>
        )}
      </div>
      <Footer
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />
      <WhatsAppFloat />
    </div>
  );
}

export default CaseStudyPage;
