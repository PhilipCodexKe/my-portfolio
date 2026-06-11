import { experience } from "../data";

function AboutPage({ navigate }) {
  return (
    <main>
      <section className="portfolio-hero">
        <img
          src="/assets/profile.jpg"
          alt="Philip Wafula"
          className="portfolio-avatar-large"
          style={{ border: "none", boxShadow: "none" }}
        />
        <span className="pill-badge">About Me</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 10vw, 6rem)" }}>Philip Wafula</h1>
        <p style={{ maxWidth: "700px", fontSize: "1.2rem" }}>
          I'm a Software Engineer based in Nairobi, Kenya — focused on crafting
          scalable, performant web architectures, immersive 3D browser
          experiences, and clean backend systems that just work.
        </p>
        <a
          className="primary-cta button-blue"
          href="#/projects"
          onClick={() => navigate("projects")}
          style={{ marginTop: "0.5rem" }}
        >
          View My Portfolio
        </a>
      </section>

      {/* Work History */}
      <section className="container">
        <h2 className="section-title">Work History</h2>
        <div className="work-history-grid">
          {experience.map((exp, i) => (
            <div key={i} className="work-history-card">
              <div className="work-history-header">
                <div className="work-history-logo">{exp.company.charAt(0)}</div>
                <div className="work-history-meta">
                  <h3>{exp.company}</h3>
                  <h4>{exp.role}</h4>
                  <span className="work-history-date">{exp.period}</span>
                </div>
              </div>
              <ul className="work-history-bullets">
                {exp.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="container">
        <h2 className="section-title">My Stack</h2>
        <div className="tools-grid">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Three.js",
            "Node.js",
            "Express",
            "Vite",
            "HTML5",
            "CSS3",
            "WebSockets",
            "Git",
            "Tailwind CSS",
          ].map((tool) => (
            <span className="tool-badge" key={tool}>
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="container">
        <h2 className="section-title">Skills</h2>
        <div className="skills-container">
          <div className="skills-column">
            <h3>Hard Skills</h3>
            <div className="skills-pill-grid">
              {[
                "Full-Stack Development",
                "3D Graphics / WebGL",
                "Real-Time Systems",
                "API Architecture",
                "Game Development",
                "Performance Optimization",
              ].map((s) => (
                <span className="skills-pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="skills-column">
            <h3>Soft Skills</h3>
            <div className="skills-pill-grid">
              {[
                "Problem Solving",
                "Clean Code Advocacy",
                "Self-Directed Learning",
                "Communication",
                "Agile Workflow",
                "Attention to Detail",
              ].map((s) => (
                <span className="skills-pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beyond the Screen */}
      <section className="container">
        <h2 className="section-title">Beyond the Screen</h2>
        <div className="photo-gallery">
          {[
            "/assets/1.jpeg",
            "/assets/2.jpeg",
            "/assets/3.jpeg",
            "/assets/4.jpeg",
            "/assets/5.jpeg",
            "/assets/6.jpeg",
            "/assets/7.jpeg",
            "/assets/8.jpeg",
          ].map((src, i) => (
            <div className="gallery-img-wrapper" key={i}>
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="gallery-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
