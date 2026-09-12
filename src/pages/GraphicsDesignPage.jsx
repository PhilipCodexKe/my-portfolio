import { useState, useRef } from "react";
import { useGraphics } from "../context/GraphicsContext";

// Helper to clean display title (removes bracketed text/filenames like "(ChatGPT...)" or "(Your paragraph text...)")
const formatDisplayTitle = (rawTitle) => {
  if (!rawTitle) return "";
  const cleaned = rawTitle
    .replace(/\s*\([^)]*\)+/g, "")
    .replace(/[()]/g, "")
    .trim();
  return cleaned || rawTitle;
};

function GraphicsDesignPage({ navigate }) {
  const {
    posters: gfxPosterShowcase,
    choices: gfxChoices,
    heroData: gfxHeroData,
    trustBadges: gfxTrustBadges,
  } = useGraphics();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalImg, setActiveModalImg] = useState(null);
  const slantedTrackRef = useRef(null);

  const scrollSlanted = (direction) => {
    if (slantedTrackRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      slantedTrackRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Derive unique categories dynamically based on active posters
  const dynamicCategories = Array.from(
    new Set(gfxPosterShowcase.map((item) => item.category).filter(Boolean)),
  );
  const categories = [
    { id: "all", label: "All" },
    ...dynamicCategories.map((cat) => ({ id: cat, label: cat })),
  ];

  const filteredPosters =
    selectedCategory === "all"
      ? gfxPosterShowcase
      : gfxPosterShowcase.filter((item) => item.category === selectedCategory);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="gfx-page-wrapper">
      {/* ─── 1. HERO SECTION (Editorial Reference Layout) ─── */}
      <section className="gfx-hero-container">
        <div className="gfx-hero-canvas">
          {/* Top Split Typography */}
          <div className="gfx-hero-top-row">
            <div className="gfx-hero-title-left">
              <span className="gfx-script-sub">
                {gfxHeroData.titleLeftScript}
              </span>
              <h1 className="gfx-huge-word">{gfxHeroData.titleLeftMain}</h1>
            </div>

            <div className="gfx-hero-title-right">
              <span className="gfx-script-sub">
                {gfxHeroData.titleRightScript}
              </span>
              <h1 className="gfx-huge-word">
                {gfxHeroData.titleRightMain}{" "}
                <span className="gfx-star-sparkle">✦</span>
              </h1>
            </div>
          </div>

          {/* Centered Philip Cutout Photo */}
          <div className="gfx-person-center-wrap">
            <img
              src="/assets/philip.png"
              alt="Philip Graphic Designer"
              className="gfx-person-img"
              loading="eager"
            />
          </div>

          {/* Lower Curved Dark Red Container */}
          <div className="gfx-hero-curved-card">
            {/* Left Column */}
            <div className="gfx-hero-card-left">
              <div className="gfx-hero-tag-badge">
                <span>{gfxHeroData.tagline}</span>
              </div>
              <h2 className="gfx-hero-card-title">
                {gfxHeroData.bottomHeading}
              </h2>
              <p className="gfx-hero-card-desc">
                {gfxHeroData.bottomDescription}
              </p>

              <div className="gfx-hero-cta-group">
                <button
                  type="button"
                  className="gfx-cta-btn"
                  onClick={() => scrollToSection("gfx-showcase")}
                >
                  <span>{gfxHeroData.ctaText}</span>
                  <span className="gfx-btn-arrow">→</span>
                </button>

                <div className="gfx-social-proof-pill">
                  <div className="gfx-avatar-cluster">
                    <span className="gfx-avatar-dot dot-1">P</span>
                    <span className="gfx-avatar-dot dot-2">D</span>
                    <span className="gfx-avatar-dot dot-3">✦</span>
                  </div>
                  <span className="gfx-social-proof-label">
                    {gfxHeroData.socialProofText} ❤️
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="gfx-hero-card-right">
              {/* Featured Look Card */}
              <div
                className="gfx-featured-card"
                onClick={() => setActiveModalImg(gfxHeroData.featuredLook.img)}
              >
                <div className="gfx-featured-card-badge">
                  {gfxHeroData.featuredLook.badge}
                </div>
                <div className="gfx-featured-img-container">
                  <img
                    src={gfxHeroData.featuredLook.img}
                    alt={gfxHeroData.featuredLook.title}
                    className="gfx-featured-img"
                  />
                  <div className="gfx-featured-overlay">
                    <span className="gfx-preview-btn">View Art 👁️</span>
                  </div>
                </div>
                <div className="gfx-featured-info">
                  <span className="gfx-featured-cat">
                    {gfxHeroData.featuredLook.category}
                  </span>
                  <h4 className="gfx-featured-title">
                    {gfxHeroData.featuredLook.title}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. "A FEW CHOICES" SLANTED POSTER SLIDESHOW ─── */}
      <section className="gfx-choices-section">
        <div className="gfx-choices-container">
          {/* Left Title Panel (Sticky / Overlapping with solid mask) */}
          <div className="gfx-choices-title-panel">
            <h2 className="gfx-choices-title">
              A FEW
              <br />
              CHOICES
            </h2>
            <span className="gfx-choices-subtag">POSTER SERIES 2025</span>

            <div className="gfx-choices-actions">
              <button
                type="button"
                className="gfx-choices-explore-btn"
                onClick={() => scrollToSection("gfx-showcase")}
              >
                EXPLORE ALL <span>→</span>
              </button>

              <div className="gfx-carousel-arrows">
                <button
                  type="button"
                  className="gfx-arrow-btn"
                  onClick={() => scrollSlanted("left")}
                  aria-label="Previous posters"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="gfx-arrow-btn"
                  onClick={() => scrollSlanted("right")}
                  aria-label="Next posters"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Slanted Slideshow Track (Flows seamlessly behind the title panel) */}
          <div className="gfx-slanted-track-wrapper">
            <div className="gfx-slanted-marquee">
              {[...gfxChoices, ...gfxChoices].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="gfx-slanted-card"
                  onClick={() => setActiveModalImg(item.img)}
                >
                  <div className="gfx-slanted-img-frame">
                    <img
                      src={item.img}
                      alt={formatDisplayTitle(item.title)}
                      className="gfx-slanted-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="gfx-slanted-badge">
                    <span className="gfx-badge-text">
                      {formatDisplayTitle(item.title)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. SHOWCASE BANNER & FILTERABLE POSTER GRID ─── */}
      <section id="gfx-showcase" className="gfx-showcase-section">
        <div className="gfx-showcase-banner">
          <div className="gfx-banner-content">
            <span className="gfx-banner-pill">PORTFOLIO ARCHIVE</span>
            <h2 className="gfx-banner-title">
              VISUAL SHOWCASE <span>2026</span>
            </h2>
            <p className="gfx-banner-sub">
              Carefully curated selection of poster art, typography experiments,
              and brand identity projects.
            </p>
          </div>

          {/* Filter Pills and Studio Button */}
          <div className="gfx-filter-pills-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`gfx-filter-pill ${
                  selectedCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
            {navigate && (
              <button
                type="button"
                className="gfx-filter-pill gfx-admin-shortcut-pill"
                onClick={() => navigate("admin")}
                title="Open Studio Admin to upload new posters"
              >
                + Add / Manage Art
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Poster Grid */}
        <div className="gfx-posters-grid">
          {filteredPosters.map((item) => (
            <div
              key={item.id}
              className="gfx-poster-card"
              onClick={() => setActiveModalImg(item.img)}
            >
              <div className="gfx-poster-img-wrap">
                <img
                  src={item.img}
                  alt={formatDisplayTitle(item.title)}
                  className="gfx-poster-img"
                  loading="lazy"
                />
                <div className="gfx-poster-hover-overlay">
                  <span className="gfx-poster-tag">{item.category}</span>
                  <h3 className="gfx-poster-overlay-title">
                    {formatDisplayTitle(item.title)}
                  </h3>
                  <p className="gfx-poster-overlay-desc">{item.description}</p>
                  <span className="gfx-poster-click-hint">
                    Click to enlarge
                  </span>
                </div>
              </div>
              <div className="gfx-poster-meta-bottom">
                <div className="gfx-poster-meta-text">
                  <h4 className="gfx-poster-name">
                    {formatDisplayTitle(item.title)}
                  </h4>
                  <span className="gfx-poster-client">
                    {item.client} • {item.year}
                  </span>
                </div>
                <span className="gfx-poster-cat-badge">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. TRUST & VALUE PROPOSITIONS STRIP ─── */}
      <section className="gfx-trust-section">
        <div className="gfx-trust-grid">
          {gfxTrustBadges.map((badge, idx) => (
            <div key={idx} className="gfx-trust-card">
              <span className="gfx-trust-icon">{badge.icon}</span>
              <div className="gfx-trust-content">
                <h4 className="gfx-trust-title">{badge.title}</h4>
                <p className="gfx-trust-desc">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. FULL RESOLUTION LIGHTBOX MODAL ─── */}
      {activeModalImg && (
        <div
          className="gfx-lightbox-overlay"
          onClick={() => setActiveModalImg(null)}
        >
          <div
            className="gfx-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gfx-lightbox-close"
              onClick={() => setActiveModalImg(null)}
            >
              ✕
            </button>
            <img
              src={activeModalImg}
              alt="Artwork Preview"
              className="gfx-lightbox-img"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default GraphicsDesignPage;
