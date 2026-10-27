import { useState, useEffect } from "react";
import { useVideo } from "../context/VideoContext";
import "./videoEditingPage.css";

/* ── Skills & Toolkit Data ── */
const TOOLS = [
  {
    name: "Adobe Premiere Pro",
    level: "96%",
    icon: "🎬",
    desc: "Master-level assembly, multicam sync, complex timeline organization, and seamless proxy workflows.",
  },
  {
    name: "DaVinci Resolve Studio",
    level: "92%",
    icon: "🎨",
    desc: "Industry-standard color grading, node-based LUT calibration, shot matching, and Fairlight audio mastering.",
  },
  {
    name: "Adobe After Effects",
    level: "88%",
    icon: "⚡",
    desc: "Motion graphics, kinetic title sequences, rotoscoping, camera tracking, and VFX compositing.",
  },
  {
    name: "Adobe Audition",
    level: "85%",
    icon: "🎧",
    desc: "Pristine audio cleanup, spectral frequency repair, dialog isolation, and rich multi-layered sound design.",
  },
  {
    name: "Final Cut Pro",
    level: "82%",
    icon: "✂️",
    desc: "Rapid turnaround cutting, magnetic timeline efficiency, and optimized Apple Silicon ProRes rendering.",
  },
  {
    name: "CapCut Pro / Mobile",
    level: "90%",
    icon: "📱",
    desc: "High-retention social media pacing, trending vertical formats, animated subtitles, and viral hooks.",
  },
  {
    name: "Adobe Photoshop",
    level: "86%",
    icon: "🖼️",
    desc: "High-CTR YouTube thumbnail design, storyboarding, poster creation, and graphic asset preparation.",
  },
  {
    name: "Sound FX & Foley",
    level: "89%",
    icon: "🔊",
    desc: "Custom whooshes, risers, ambient texture layering, and cinematic impact drops that pull viewers into the screen.",
  },
];

export default function VideoEditingPage() {
  const { heroVideo, heroSlides, portfolioProjects } = useVideo();

  const [showreelPlaying, setShowreelPlaying] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides]);

  /* ── Smooth scroll to section ── */
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <div className="vid-page">
      {/* ── Fixed Brand Name on Right (Rotated 90° Editorial Element) ── */}
      <div className="vid-sidebar-brand" aria-hidden="true">
        <span className="vid-sidebar-brand-text">PHILIP WAFULA</span>
        <div className="vid-sidebar-brand-dot" />
      </div>

      {/* ── Fixed Social Icons Strip on Right Edge ── */}
      <aside className="vid-social-sidebar" aria-label="Social Links">
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vid-social-sidebar-link"
          title="YouTube"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vid-social-sidebar-link"
          title="Instagram"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://vimeo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vid-social-sidebar-link"
          title="Vimeo"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.396 7.164c-.093 2.026-1.507 4.798-4.245 8.32C15.323 19.16 12.93 21 10.97 21c-1.214 0-2.24-1.12-3.079-3.359-.56-2.053-1.119-4.072-1.68-6.059-.62-2.207-1.28-3.31-1.98-3.31-.155 0-.698.326-1.629.977L1.4 7.697c1.243-1.09 2.47-2.181 3.682-3.272 1.677-1.432 2.923-2.19 3.738-2.274 1.926-.186 3.111 1.133 3.555 3.957.528 3.376.885 5.485 1.07 6.327.56 2.584 1.18 3.876 1.864 3.876.528 0 1.258-.823 2.19-2.468.932-1.646 1.43-2.89 1.492-3.734.124-1.432-.404-2.148-1.584-2.148-.56 0-1.134.124-1.724.373 1.15-3.765 3.344-5.568 6.582-5.41 2.394.093 3.523 1.554 3.388 4.385z" />
          </svg>
        </a>
        <a
          href="https://wa.me/254794554194"
          target="_blank"
          rel="noopener noreferrer"
          className="vid-social-sidebar-link"
          title="WhatsApp Direct"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.247-.565-.632-.26-1.04-.543-1.488-.992-.76-.764-1.155-1.683-1.226-1.782-.072-.099-.583-.775-.583-1.479 0-.703.369-1.05.501-1.194.132-.144.29-.18.387-.18.096 0 .193.001.277.005.088.004.207-.033.323.247.12.289.41 1.002.446 1.075.036.072.06.156.012.252-.048.096-.072.156-.144.24-.072.084-.153.188-.218.252-.072.072-.147.151-.063.295.084.144.373.616.801.997.551.49 1.015.642 1.159.714.144.072.229.06.313-.036.084-.096.361-.421.457-.565.096-.144.193-.12.325-.072.132.048.837.395.981.467.144.072.241.108.277.168.036.06.036.349-.108.754z" />
          </svg>
        </a>
        <div className="vid-social-sidebar-line" />
      </aside>

      {/* ── Top Editorial Navigation ── */}
      <header className="vid-nav-bar">
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, "hero")}
          className="vid-nav-brand"
        >
          <span className="vid-nav-brand-name">PHILIP</span>
          <span className="vid-nav-brand-title">/ VIDEO EDITOR</span>
        </a>
      </header>

      {/* ── 1. Hero Section (Massive Typography & Overlapping Media) ── */}
      <section className="vid-hero" id="hero">
        <div className="vid-hero-bg-glow" />

        <div className="vid-hero-content">
          <div className="vid-hero-header">
            <h1 className="vid-hero-heading">
              <span className="vid-hero-heading-line">Video Editor</span>
              <span className="vid-hero-heading-indented">Grapher .</span>
            </h1>
          </div>

          {/* Layered Media Stage: Slideshow Behind + Video In Front */}
          <div className="vid-hero-stage">
            {/* Background Slideshow (Bigger, Behind) */}
            <div className="vid-hero-slideshow">
              {heroSlides.map((slide, idx) => (
                <img
                  key={idx}
                  src={slide}
                  alt={`Hero slide ${idx + 1}`}
                  className={`vid-hero-slide-img ${idx === currentSlide ? "active" : ""}`}
                />
              ))}
              <div className="vid-hero-slideshow-overlay" />
            </div>

            {/* Foreground Video */}
            <div className="vid-hero-video-box">
              <iframe
                className="vid-hero-video-iframe"
                src={heroVideo.url}
                title={heroVideo.title || "Featured Reel"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Portfolio Grid (Curated Projects, 2-Column Editorial) ── */}
      <section className="vid-section vid-portfolio-section" id="portfolio">
        <div className="vid-container">
          <div className="vid-section-header">
            <span className="vid-section-tag">SELECTED WORKS</span>
            <h2 className="vid-section-title">PORTFOLIO</h2>
          </div>

          {/* 2-Column Seamless Editorial Grid (Zero Gap Between 2 Columns) */}
          <div className="vid-portfolio-grid">
            {portfolioProjects.map((proj) => (
              <article
                key={proj.id}
                className="vid-project-card"
                onClick={() => setActiveModalProject(proj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setActiveModalProject(proj)
                }
                aria-label={`Open project details for ${proj.title}`}
              >
                <div className="vid-project-thumb-wrapper">
                  <img
                    src={proj.thumb}
                    alt={proj.title}
                    className="vid-project-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/1.jpeg";
                    }}
                  />

                  <div className="vid-project-play-overlay">
                    <div className="vid-project-play-circle">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="vid-project-info">
                  <h3 className="vid-project-title">{proj.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. About Section (Peach Editorial Contrast from Template) ── */}
      <section className="vid-about-section" id="about">
        <div className="vid-container">
          <div className="vid-about-layout">
            <div className="vid-about-text">
              <span className="vid-about-tag">PHILOSOPHY & VISION</span>
              <h2 className="vid-about-statement">
                I AM A VISUAL STORYTELLER WHO TURNS RAW FOOTAGE INTO
                UNFORGETTABLE EXPERIENCES.
              </h2>
              <div className="vid-about-actions">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "contact")}
                  className="vid-about-btn"
                >
                  Start a Collaboration
                </a>
                <a
                  href="https://wa.me/254794554194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vid-about-link"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Overlapping Media Visual */}
            <div className="vid-about-media-stack">
              <div className="vid-about-frame-bg" />
              <div className="vid-about-frame-primary">
                <img
                  src="/assets/philip.png"
                  alt="Philip Wafula — Video Editor"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/profile.jpg";
                  }}
                />
              </div>
              <div className="vid-about-frame-overlay-card">
                <img
                  src="/assets/profile.jpg"
                  alt="Avatar"
                  className="vid-about-avatar"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/philip.png";
                  }}
                />
                <div>
                  <h4 className="vid-about-card-name">Philip Wafula</h4>
                  <p className="vid-about-card-sub">
                    Lead Video Editor & Colorist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Skills & Toolkit Section ── */}
      <section className="vid-section vid-skills-section" id="skills">
        <div className="vid-container">
          <div className="vid-section-header">
            <span className="vid-section-tag">TECHNICAL ARSENAL</span>
            <h2 className="vid-section-title">TOOLS & EXPERTISE</h2>
            <p className="vid-section-subtitle">
              Industry-standard non-linear suites, color grading pipelines, and
              motion toolkits.
            </p>
          </div>

          <div className="vid-tools-grid">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="vid-tool-card">
                <div className="vid-tool-header">
                  <span className="vid-tool-icon">{tool.icon}</span>
                  <span className="vid-tool-level">{tool.level}</span>
                </div>
                <h3 className="vid-tool-name">{tool.name}</h3>
                <p className="vid-tool-desc">{tool.desc}</p>
                <div className="vid-tool-meter">
                  <div
                    className="vid-tool-meter-fill"
                    style={{ width: tool.level }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="vid-specialties-strip">
            <span className="vid-specialties-label">Core Capabilities:</span>
            <div className="vid-specialties-chips">
              {[
                "Rhythm & Pacing",
                "Color Grading & Match",
                "Sound FX & Foley",
                "Kinetic Typography",
                "Drone Cinematography",
                "Multi-Cam Sync",
                "Viral Hook Retention",
                "LUT Creation",
              ].map((spec) => (
                <span key={spec} className="vid-specialty-chip">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Impact Counters & Stats ── */}
      <section className="vid-stats-section">
        <div className="vid-container">
          <div className="vid-stats-grid">
            <div className="vid-stat-box">
              <span className="vid-stat-number">10k+</span>
              <span className="vid-stat-label">Views Generated</span>
              <span className="vid-stat-sub">
                Across client YouTube, TikTok & TV spots
              </span>
            </div>
            <div className="vid-stat-box">
              <span className="vid-stat-number">20+</span>
              <span className="vid-stat-label">Delivered Projects</span>
              <span className="vid-stat-sub">
                Commercials, weddings, films & socials
              </span>
            </div>
            <div className="vid-stat-box">
              <span className="vid-stat-number">99%</span>
              <span className="vid-stat-label">Satisfaction Rate</span>
              <span className="vid-stat-sub">
                Repeat collaborations and 5-star reviews
              </span>
            </div>
            <div className="vid-stat-box">
              <span className="vid-stat-number">72hr</span>
              <span className="vid-stat-label">Turnaround</span>
              <span className="vid-stat-sub">
                Rapid delivery options for fast digital cycles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Editorial Footer & Contact ── */}
      <footer className="vid-footer" id="contact">
        <div className="vid-container">
          <div className="vid-footer-top">
            <div>
              <span className="vid-section-tag">INITIATE A PROJECT</span>
              <h2 className="vid-footer-heading">
                LET'S CREATE
                <br />
                TOGETHER.
              </h2>
              <p className="vid-footer-lead">
                Have a campaign, raw footage, or a creative project that needs
                cinematic execution? Reach out today and let's craft something
                unforgettable.
              </p>

              <div className="vid-footer-cta-row">
                <a
                  href="https://wa.me/254794554194?text=Hi%20Philip%2C%20I'd%20like%20to%20discuss%20a%20video%20editing%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vid-whatsapp-btn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.247-.565-.632-.26-1.04-.543-1.488-.992-.76-.764-1.155-1.683-1.226-1.782-.072-.099-.583-.775-.583-1.479 0-.703.369-1.05.501-1.194.132-.144.29-.18.387-.18.096 0 .193.001.277.005.088.004.207-.033.323.247.12.289.41 1.002.446 1.075.036.072.06.156.012.252-.048.096-.072.156-.144.24-.072.084-.153.188-.218.252-.072.072-.147.151-.063.295.084.144.373.616.801.997.551.49 1.015.642 1.159.714.144.072.229.06.313-.036.084-.096.361-.421.457-.565.096-.144.193-.12.325-.072.132.048.837.395.981.467.144.072.241.108.277.168.036.06.036.349-.108.754z" />
                  </svg>
                  Chat on WhatsApp
                </a>
                <a
                  href="mailto:philipwafula97@gmail.com?subject=Video%20Editing%20Inquiry"
                  className="vid-email-btn"
                >
                  Email Inquiry
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="vid-footer-form-card">
              <h3 className="vid-footer-form-title">Send a Quick Message</h3>
              <p className="vid-footer-form-sub">
                Drop your email and project details below for a quote within 24
                hours.
              </p>

              {newsletterSubscribed ? (
                <div
                  style={{
                    color: "#2ecc71",
                    padding: "16px 0",
                    fontWeight: 600,
                  }}
                >
                  ✓ Thank you! Philip will get back to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div className="vid-form-group">
                    <label className="vid-form-label" htmlFor="vid-email-input">
                      Your Email
                    </label>
                    <input
                      id="vid-email-input"
                      type="email"
                      required
                      placeholder="alex@domain.com"
                      className="vid-form-input"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="vid-form-submit">
                    Send Inquiry
                  </button>
                </form>
              )}

              <div className="vid-footer-contact-details">
                <div className="vid-contact-line">
                  <span>📍</span>
                  <span>Nairobi, Kenya • Available Worldwide (Remote)</span>
                </div>
                <div className="vid-contact-line">
                  <span>✉️</span>
                  <a href="mailto:philipwafula97@gmail.com">
                    philipwafula97@gmail.com
                  </a>
                </div>
                <div className="vid-contact-line">
                  <span>📞</span>
                  <a href="tel:+254794554194">+254 794 554 194</a>
                </div>
              </div>
            </div>
          </div>

          <div className="vid-footer-bottom">
            <p className="vid-footer-copyright">
              © {new Date().getFullYear()} Philip Wafula. All rights reserved.
              Video & Post-Production Portfolio.
            </p>

            <div className="vid-footer-socials">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vid-footer-social-link"
              >
                YouTube
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vid-footer-social-link"
              >
                Instagram
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vid-footer-social-link"
              >
                Vimeo
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vid-footer-social-link"
              >
                TikTok
              </a>
            </div>

            {/* Bottom Route Link to Studio Video Management Portal */}
            <div className="vid-footer-admin-portal">
              <a href="#video-admin" className="vid-footer-admin-link">
                <span className="vid-footer-admin-icon">⚙</span> STUDIO VIDEO PORTAL / ADMIN
              </a>
            </div>

            <button
              type="button"
              className="vid-back-to-top"
              onClick={(e) => scrollToSection(e, "hero")}
              title="Back to Top"
              aria-label="Back to top"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* ── 8. Project Preview Modal / Lightbox ── */}
      {activeModalProject && (
        <div
          className="vid-modal-overlay"
          onClick={() => setActiveModalProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div
            className="vid-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vid-modal-close-btn"
              onClick={() => setActiveModalProject(null)}
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="vid-modal-player-box">
              <iframe
                src={activeModalProject.videoUrl}
                title={activeModalProject.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="vid-modal-body">
              <div>
                <h3 id="modal-project-title" className="vid-modal-title">
                  {activeModalProject.title}
                </h3>
              </div>

              <div className="vid-modal-meta">
                <a
                  href={`https://wa.me/254794554194?text=Hi%20Philip%2C%20I'm%20interested%20in%20a%20project%20like%20${encodeURIComponent(activeModalProject.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vid-btn-primary"
                  style={{ padding: "10px 20px", fontSize: "0.85rem" }}
                >
                  Inquire
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
