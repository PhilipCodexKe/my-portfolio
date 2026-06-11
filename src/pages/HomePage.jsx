import { useState } from "react";
import { projects, faqs, blogPosts } from "../data";

function HomePage({ navigate, setCaseStudy }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const featuredProjects = projects.slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-title-group">
            <h1 className="hero-hello">Hello! I'm</h1>
            <h1 className="hero-name-highlight">Philip Wafula</h1>
          </div>
          <p className="hero-subtitle">
            I'm a <strong>Software Engineer</strong> crafting scalable web
            architectures and impactful digital products.
          </p>
          <a
            className="primary-cta button-blue"
            href="#/projects"
            onClick={() => navigate("projects")}
          >
            View portfolio
          </a>
        </div>
        <div className="hero-visual">
          <div className="hero-profile-circle">
            <img src="/assets/profile.jpg" alt="Philip Wafula" />
          </div>
        </div>
      </section>

      {/* Behind the Screens */}
      <section className="container">
        <h2 className="section-title">Behind the Screens</h2>
        <div className="grid-3">
          <div className="grid-item">
            <span className="badge-mono">Who am I?</span>
            <h3>Software Engineer</h3>
            <p>
              A detail-driven developer based in Nairobi, Kenya, building
              polished web applications, 3D browser games, and scalable
              backend systems.
            </p>
          </div>
          <div className="grid-item">
            <span className="badge-mono">My Philosophy</span>
            <h3>Precision & Craft</h3>
            <p>
              Every line of code should serve a purpose. I prioritize clean
              execution, accessibility, and organic user feedback in
              everything I build.
            </p>
          </div>
          <div className="grid-item">
            <span className="badge-mono">My Distinct Edge</span>
            <h3>Full-Stack + 3D</h3>
            <p>
              I bridge robust backend engineering with immersive frontend
              experiences — from WebSocket APIs to Three.js game worlds, all
              in one stack.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Me (Stats) */}
      <section className="container">
        <h2 className="section-title">Why Work With Me</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">9+</div>
            <div className="stat-label">Successful Projects Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3+</div>
            <div className="stat-label">
              Years of Development Experience
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3D</div>
            <div className="stat-label">
              WebGL / Three.js Game Specialist
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num">∞</div>
            <div className="stat-label">
              Passion for Clean, Scalable Code
            </div>
          </div>
        </div>
        <div className="tools-grid">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Three.js",
            "Node.js",
            "Vite",
            "HTML5",
            "CSS3",
            "WebSockets",
            "Git",
          ].map((tool) => (
            <span className="tool-badge" key={tool}>
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Work Carousel */}
      <section className="container">
        <h2 className="section-title">Featured Work</h2>
        <div className="carousel-container">
          <div className="carousel-slide">
            <div className="carousel-content">
              <span className="carousel-tagline">
                {featuredProjects[carouselIndex].category} ·{" "}
                {featuredProjects[carouselIndex].industry}
              </span>
              <h2 className="carousel-title">
                {featuredProjects[carouselIndex].title}
              </h2>
              <p className="carousel-desc">
                {featuredProjects[carouselIndex].desc}
              </p>
              <div className="project-tags">
                {featuredProjects[carouselIndex].tech.map((t, i) => (
                  <span className="project-tag" key={i}>
                    {t}
                  </span>
                ))}
              </div>
              <button
                className="primary-cta"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCaseStudy(featuredProjects[carouselIndex].id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                View Case Study →
              </button>
            </div>
            <div className="carousel-img-wrapper">
              <img
                src={featuredProjects[carouselIndex].img}
                alt={featuredProjects[carouselIndex].title}
              />
            </div>
          </div>
          <div className="carousel-controls">
            <div className="carousel-indicators">
              {featuredProjects.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-indicator ${i === carouselIndex ? "active" : ""}`}
                  onClick={() => setCarouselIndex(i)}
                />
              ))}
            </div>
            <div className="carousel-arrows">
              <button
                className="carousel-arrow-btn"
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === 0 ? featuredProjects.length - 1 : prev - 1,
                  )
                }
              >
                ←
              </button>
              <button
                className="carousel-arrow-btn"
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === featuredProjects.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? "open" : ""}`}
            >
              <button
                className="faq-trigger"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="container">
        <h2 className="section-title">From the Blog</h2>
        <div className="blog-grid">
          {blogPosts.map((post, i) => (
            <div
              key={i}
              className="blog-card"
              onClick={() => navigate("blog")}
              style={{ cursor: "pointer" }}
            >
              <div className="blog-img-wrapper">
                <img
                  src={post.img}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </div>
              <div className="blog-info">
                <div className="blog-meta">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3>{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
