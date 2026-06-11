import { useState, useEffect } from "react";

function App() {
  const [activeView, setActiveView] = useState("home");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [caseStudy, setCaseStudy] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [theme, setTheme] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Hash-based navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      if (hash === "projects") setActiveView("projects");
      else if (hash === "about") setActiveView("about");
      else if (hash === "blog") setActiveView("blog");
      else setActiveView("home");
      setCaseStudy(null);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigate = (view) => {
    window.location.hash = `#/${view === "home" ? "" : view}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNu = "254794554194";
    const lines = [
      "New message from portfolio website",
      "",
      `*Name:* ${formData.name}`,
      `*Email:* ${formData.email}`,
      `*Subject:* ${formData.subject}`,
      `*Message:* ${formData.message}`,
    ];
    const text = lines.join("\n");
    const url = `https://api.whatsapp.com/send?phone=${phoneNu}&text=${encodeURIComponent(text)}`;
    const win = window.open(url, "_blank");
    if (!win) window.location.href = url;
  };

  // ── Data ──────────────────────────────────────────────
  const projects = [
    {
      id: "pikistreams",
      title: "PikiStreams Movies",
      desc: "Sleek movie review and torrent download platform with real-time data.",
      tech: ["JavaScript", "Node.js", "WebSockets"],
      category: "Web App",
      industry: "Entertainment",
      img: "/assets/avengers.jpeg",
      link: "https://pikistreams.vercel.app/",
    },
    {
      id: "chrome-dino",
      title: "3D Chrome Dino Runner",
      desc: "A rich 3D remake of the classic Chrome offline dino runner game.",
      tech: ["JavaScript", "Three.js", "Node.js"],
      category: "Game Dev",
      industry: "Gaming",
      img: "/assets/chrome-dino.jpg",
      link: null,
    },
    {
      id: "boutique",
      title: "Online Clothes Store",
      desc: "Modern e-commerce boutique with a secure and seamless checkout flow.",
      tech: ["JavaScript", "Node.js", "WebSockets"],
      category: "E-Commerce",
      industry: "Fashion",
      img: "/assets/botique.png",
      link: "https://pikistyles-botique.vercel.app/",
    },
    {
      id: "knight-rpg",
      title: "Web Knight RPG",
      desc: "An interactive medieval Knight 3D browser adventure with AI enemies.",
      tech: ["JavaScript", "Three.js", "Yuka AI"],
      category: "Game Dev",
      industry: "Gaming",
      img: "/assets/game-rpg.jpg",
      link: null,
    },
    {
      id: "restaurant",
      title: "Restaurant Manager",
      desc: "Fully customized scalable business catalog and management system.",
      tech: ["JavaScript", "HTML5", "Three.js"],
      category: "Web App",
      industry: "Hospitality",
      img: "https://lesroches.edu/wp-content/uploads/2022/08/Restaurant_business_plan_main.jpg",
      link: "https://resort-pikival.vercel.app/",
    },
    {
      id: "wachikart",
      title: "Wachikart.co.ke",
      desc: "Multi-purpose Kenyan e-commerce landing and services platform.",
      tech: ["JavaScript", "HTML5", "Tailwind"],
      category: "E-Commerce",
      industry: "Retail",
      img: "https://wachika-co-ke-landing-page.vercel.app/assets/wachi-black.jpg",
      link: "https://wachika-co-ke-landing-page.vercel.app/",
    },
    {
      id: "endless-runner",
      title: "Three.js Endless Runner",
      desc: "Fast-paced endless runner utilising Yuka steering AI behaviours.",
      tech: ["JavaScript", "Three.js", "React"],
      category: "Game Dev",
      industry: "Gaming",
      img: "/assets/frontend.webp",
      link: null,
    },
    {
      id: "node-apis",
      title: "Node.js Server APIs",
      desc: "Robust, optimized and high-scalability backend engines.",
      tech: ["Node.js", "WebSockets", "CORS"],
      category: "Backend",
      industry: "Infrastructure",
      img: "/assets/backend.webp",
      link: null,
    },
    {
      id: "game-engines",
      title: "Web Game Engines",
      desc: "Optimal browser gaming systems built with Three.js and physics.",
      tech: ["Three.js", "Node.js", "Vite"],
      category: "Game Dev",
      industry: "Gaming",
      img: "/assets/game.jpg",
      link: null,
    },
  ];

  const featuredProjects = projects.slice(0, 4);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 6);

  const faqs = [
    {
      q: "What technologies do you specialize in?",
      a: "I specialize in JavaScript/TypeScript, React, Three.js for 3D web experiences, Node.js for backend services, and WebSocket-based real-time systems. I'm also deeply experienced with Vite, HTML5 Canvas, and modern CSS.",
    },
    {
      q: "What is your development process?",
      a: "I follow a structured process: deep-dive into requirements, architecture planning, iterative development with continuous testing, and polished delivery. I prioritize clean code, performance, and scalable patterns throughout.",
    },
    {
      q: "Do you work on game development projects?",
      a: "Yes! I build browser-based games using Three.js, WebGL, and AI steering behaviours (Yuka). From endless runners to 3D RPGs, I create immersive gaming experiences that run natively in the browser.",
    },
    {
      q: "Can you build full-stack applications?",
      a: "Absolutely. I design and implement both frontend interfaces (React, Three.js) and backend systems (Node.js, Express, WebSockets). I architect end-to-end solutions with real-time capabilities and clean API layers.",
    },
    {
      q: "Are you available for freelance or contract work?",
      a: "Yes, I'm open to freelance projects, contract engagements, and full-time collaboration. Feel free to reach out via the contact form below or directly on WhatsApp.",
    },
  ];

  const blogPosts = [
    {
      title: "Building Immersive 3D Web Experiences with Three.js",
      category: "Development",
      date: "May 2025",
      excerpt:
        "How I approach creating performant, visually rich 3D browser games and interactive experiences.",
    },
    {
      title: "Real-Time Architecture: WebSockets at Scale",
      category: "Backend",
      date: "Apr 2025",
      excerpt:
        "Patterns and lessons learned from building WebSocket-driven real-time applications.",
    },
    {
      title: "The Art of Clean Code in JavaScript",
      category: "Process",
      date: "Mar 2025",
      excerpt:
        "My approach to writing maintainable, scalable, and beautiful JavaScript codebases.",
    },
  ];

  const experience = [
    {
      company: "Freelance / Independent",
      role: "Full-Stack Developer & Creative Coder",
      period: "2023 — Present",
      bullets: [
        "Deliver end-to-end web applications, 3D games, and e-commerce platforms for clients across Kenya and globally.",
        "Architect real-time WebSocket systems and scalable Node.js API backends.",
        "Build immersive Three.js/WebGL browser games with AI-driven behaviours.",
      ],
    },
    {
      company: "Personal Projects",
      role: "Software Engineer",
      period: "2021 — 2023",
      bullets: [
        "Developed PikiStreams, a movie review platform serving thousands of users.",
        "Built multiple e-commerce stores with secure payment and checkout flows.",
        "Created browser-based RPG and runner games using Three.js and Yuka AI.",
      ],
    },
    {
      company: "Open Source & Learning",
      role: "Developer",
      period: "2019 — 2021",
      bullets: [
        "Contributed to open-source projects and deepened expertise in JavaScript ecosystem.",
        "Studied computer graphics, interactive simulations, and real-time rendering.",
        "Built foundational skills in Node.js, React, and modern web tooling.",
      ],
    },
  ];

  // ── Case study view ───────────────────────────────────
  if (caseStudy) {
    const proj = projects.find((p) => p.id === caseStudy);
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
        <FooterSection
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />
        <WhatsAppFloat />
      </div>
    );
  }

  // ── Main views ────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Header */}
      <header className="site-header">
        <a className="brand-wrapper" href="#/" onClick={() => navigate("home")}>
          <img
            src="/assets/profile.jpg"
            alt="Philip Wafula"
            className="brand-avatar"
          />
          <span className="brand-name">Philip Wafula</span>
        </a>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? (
              <img src="/assets/moon.png" alt="Dark Mode" style={{ width: "24px", height: "24px" }} />
            ) : (
              <img src="/assets/sun.png" alt="Light Mode" style={{ width: "24px", height: "24px" }} />
            )}
          </button>
          <a className="connect-btn" href="#contact">
            Connect
          </a>
        </div>
      </header>

      {/* Floating Bottom Nav */}
      <nav className="floating-nav">
        <a
          className={`nav-item ${activeView === "home" ? "active" : ""}`}
          href="#/"
          onClick={() => navigate("home")}
        >
          Home
        </a>
        <a
          className={`nav-item ${activeView === "projects" ? "active" : ""}`}
          href="#/projects"
          onClick={() => navigate("projects")}
        >
          Portfolio
        </a>
        <a
          className={`nav-item ${activeView === "about" ? "active" : ""}`}
          href="#/about"
          onClick={() => navigate("about")}
        >
          About
        </a>
        <a
          className={`nav-item ${activeView === "blog" ? "active" : ""}`}
          href="#/blog"
          onClick={() => navigate("blog")}
        >
          Blog
        </a>
      </nav>

      {activeView === "home" && (
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
                  <div
                    className="blog-img-wrapper"
                    style={{
                      background: `hsl(${200 + i * 40}, 20%, 15%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "3rem", opacity: 0.2 }}>✦</span>
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
      )}

      {/* ─── PROJECTS VIEW ─── */}
      {activeView === "projects" && (
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
      )}

      {/* ─── ABOUT VIEW ─── */}
      {activeView === "about" && (
        <main>
          <section className="portfolio-hero">
            <img
              src="/assets/profile.jpg"
              alt="Philip Wafula"
              className="portfolio-avatar-large"
              style={{ border: "none", boxShadow: "none" }}
            />
            <span className="pill-badge">About Me</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 10vw, 6rem)" }}>
              Philip Wafula
            </h1>
            <p style={{ maxWidth: "700px", fontSize: "1.2rem" }}>
              I'm a Software Engineer based in Nairobi, Kenya — focused on
              crafting scalable, performant web architectures, immersive 3D
              browser experiences, and clean backend systems that just work.
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
                    <div className="work-history-logo">
                      {exp.company.charAt(0)}
                    </div>
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
                "/assets/game-rpg.jpg",
                "/assets/chrome-dino.jpg",
                "/assets/about.png",
                "/assets/game.jpg",
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
      )}

      {/* ─── BLOG VIEW ─── */}
      {activeView === "blog" && (
        <main>
          <section className="portfolio-hero">
            <span className="pill-badge">Blog</span>
            <h1>Design Journal</h1>
            <p>
              Insights, ideas, and stories from the journey of crafting
              thoughtful digital experiences
            </p>
          </section>
          <section className="container" style={{ paddingTop: 0 }}>
            <div className="blog-grid-new">
              {blogPosts.map((post, i) => {
                const img =
                  post.img ||
                  (i === 0
                    ? "/assets/chrome-dino.jpg"
                    : i === 1
                      ? "/assets/game.jpg"
                      : "/assets/backend.webp");
                return (
                  <div key={i} className="blog-card-new">
                    <div className="blog-card-img-wrapper">
                      <img
                        src={img}
                        alt={post.title}
                        className="blog-card-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <span className="blog-category-pill">
                          {post.category}
                        </span>
                        <span className="blog-date">{post.date}</span>
                      </div>
                      <h3 className="blog-card-title">{post.title}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* Footer / Contact */}
      <FooterSection
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />

      <WhatsAppFloat />
    </div>
  );
}

/* ─── Extracted Footer Component ─── */
function FooterSection({ formData, handleChange, handleSubmit, navigate }) {
  return (
    <footer>
      <div className="connect-cta-wrapper" id="contact">
        <h2>Let's Connect</h2>
        <p>
          Ready to collaborate on outstanding digital projects and custom
          codebases.
        </p>

        <div
          className="contact-section-inner"
          style={{ maxWidth: 1000, margin: "0 auto", textAlign: "left" }}
        >
          <div className="contact-methods">
            <div className="contact-method-item">
              <img
                src="/assets/email.png"
                alt="Email"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Email</h4>
                <a href="mailto:philipwafula97@gmail.com">
                  philipwafula97@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-method-item">
              <img
                src="/assets/phone.png"
                alt="Phone"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Phone</h4>
                <p>+254 794 554 194</p>
              </div>
            </div>
            <div className="contact-method-item">
              <img
                src="/assets/location.png"
                alt="Location"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Location</h4>
                <p>Remote — Nairobi, Kenya</p>
              </div>
            </div>
            <div className="contact-method-item">
              <a
                href="https://api.whatsapp.com/send/?phone=254794554194&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  textDecoration: "none",
                }}
              >
                <img
                  src="/assets/whatsapp.png"
                  alt="WhatsApp"
                  className="contact-icon"
                />
                <div className="contact-method-detail">
                  <h4>WhatsApp</h4>
                  <p style={{ color: "#25d366" }}>Chat with me</p>
                </div>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Write your message…"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <button
              className="primary-cta"
              type="submit"
              style={{ cursor: "pointer", border: "1px solid #fff" }}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer-new">
        <div className="footer-content-new">
          <div className="footer-left-new">
            <h2 className="footer-brand-new">Philip Wafula</h2>
            <div className="social-links-new">
              <a href="#" aria-label="LinkedIn" className="social-link-new">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-link-new">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" aria-label="X" className="social-link-new">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="social-link-new">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-right-new">
            <div className="footer-col-new">
              <h3>Pages</h3>
              <ul>
                <li>
                  <a href="#/" onClick={() => navigate("home")}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#/projects" onClick={() => navigate("projects")}>
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#/about" onClick={() => navigate("about")}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#/blog" onClick={() => navigate("blog")}>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col-new">
              <h3>Info.</h3>
              <ul>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">404</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom-new">
          Created by Philip Wafula © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

/* ─── WhatsApp Floating Button ─── */
function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-floating"
      href="https://api.whatsapp.com/send/?phone=254794554194&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/assets/whatsapp.png" alt="WhatsApp" />
    </a>
  );
}

export default App;
