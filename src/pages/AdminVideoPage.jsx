import { useState } from "react";
import { useVideo } from "../context/VideoContext";
import "./AdminVideoPage.css";

export default function AdminVideoPage({ navigate }) {
  const {
    heroVideo,
    heroSlides,
    portfolioProjects,
    updateHeroVideo,
    addHeroSlide,
    removeHeroSlide,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    resetVideoDefaults,
  } = useVideo();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("philip_studio_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("hero"); // 'hero' | 'portfolio' | 'presets'

  // Hero Video Form
  const [heroUrlInput, setHeroUrlInput] = useState(heroVideo.url || "");
  const [heroTitleInput, setHeroTitleInput] = useState(heroVideo.title || "");

  // Hero Slide Form
  const [newSlideUrl, setNewSlideUrl] = useState("");

  // Project Form
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Commercial");
  const [projectThumb, setProjectThumb] = useState("");
  const [projectVideoUrl, setProjectVideoUrl] = useState("");

  // Notification Banner
  const [notice, setNotice] = useState("");

  const triggerNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === "2024" || passcode.trim() === "admin") {
      sessionStorage.setItem("philip_studio_auth", "true");
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("philip_studio_auth");
    setIsAuthenticated(false);
  };

  const handleSaveHeroVideo = (e) => {
    e.preventDefault();
    if (!heroUrlInput.trim()) return;
    updateHeroVideo(heroUrlInput, heroTitleInput);
    triggerNotice("Hero foreground video updated successfully!");
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newSlideUrl.trim()) return;
    addHeroSlide(newSlideUrl);
    setNewSlideUrl("");
    triggerNotice("New backdrop slideshow image added!");
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectVideoUrl.trim()) {
      alert("Please provide both a Title and a Video URL.");
      return;
    }

    if (editingProjectId) {
      updatePortfolioProject(editingProjectId, {
        title: projectTitle,
        category: projectCategory,
        thumb: projectThumb || "/assets/1.jpeg",
        videoUrl: projectVideoUrl,
      });
      triggerNotice("Project updated successfully!");
      setEditingProjectId(null);
    } else {
      addPortfolioProject({
        title: projectTitle,
        category: projectCategory,
        thumb: projectThumb || "/assets/1.jpeg",
        videoUrl: projectVideoUrl,
      });
      triggerNotice("New portfolio project added!");
    }

    // Reset form
    setProjectTitle("");
    setProjectCategory("Commercial");
    setProjectThumb("");
    setProjectVideoUrl("");
  };

  const startEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectTitle(proj.title);
    setProjectCategory(proj.category || "Commercial");
    setProjectThumb(proj.thumb);
    setProjectVideoUrl(proj.videoUrl);
    setActiveTab("portfolio");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectCategory("Commercial");
    setProjectThumb("");
    setProjectVideoUrl("");
  };

  // If Not Logged In, Render Secure Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="vid-admin-auth-screen">
        <div className="vid-admin-auth-card">
          <div className="vid-admin-auth-badge">STUDIO AUTHENTICATION</div>
          <h2>Video Management Portal</h2>
          <p>Enter the studio security passcode to configure site videos and media.</p>

          <form onSubmit={handleLogin} className="vid-admin-auth-form">
            <input
              type="password"
              placeholder="Enter passcode..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="vid-admin-input"
              autoFocus
            />
            {authError && <div className="vid-admin-error">Incorrect passcode. Try again.</div>}

            <div className="vid-admin-auth-btns">
              <button type="submit" className="vid-admin-btn-primary">
                Unlock Dashboard
              </button>
              <a href="#video" className="vid-admin-btn-link">
                Return to Video Site
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="vid-admin-page">
      {/* ── Top Bar ── */}
      <header className="vid-admin-header">
        <div className="vid-admin-header-brand">
          <span className="vid-admin-brand-tag">PHILIP WAFULA / STUDIO</span>
          <h1>Video Content Manager</h1>
        </div>

        <div className="vid-admin-header-actions">
          <a href="#video" className="vid-admin-btn-outline">
            ← View Video Site
          </a>
          <button
            onClick={() => {
              if (window.confirm("Reset all videos and slides to original portfolio defaults?")) {
                resetVideoDefaults();
                setHeroUrlInput(heroVideo.url);
                triggerNotice("Reset to defaults!");
              }
            }}
            className="vid-admin-btn-danger"
          >
            Reset Defaults
          </button>
          <button onClick={handleLogout} className="vid-admin-btn-secondary">
            Lock Studio
          </button>
        </div>
      </header>

      {/* ── Notification Banner ── */}
      {notice && <div className="vid-admin-toast">{notice}</div>}

      {/* ── Navigation Tabs ── */}
      <div className="vid-admin-tabs">
        <button
          className={`vid-admin-tab ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => setActiveTab("hero")}
        >
          🎬 1. Hero Stage (Video & Slideshow)
        </button>
        <button
          className={`vid-admin-tab ${activeTab === "portfolio" ? "active" : ""}`}
          onClick={() => setActiveTab("portfolio")}
        >
          📁 2. Portfolio Project Showcase ({portfolioProjects.length})
        </button>
      </div>

      <div className="vid-admin-container">
        {/* ── TAB 1: HERO STAGE CONFIG ── */}
        {activeTab === "hero" && (
          <div className="vid-admin-section-grid">
            {/* Left: Foreground Video */}
            <div className="vid-admin-card">
              <div className="vid-admin-card-head">
                <span className="vid-admin-card-badge">FRONT LAYER</span>
                <h3>Hero Foreground Video</h3>
                <p>
                  Paste any YouTube URL, Vimeo link, or embed code. This will play in the centered box overlapping the background.
                </p>
              </div>

              <form onSubmit={handleSaveHeroVideo} className="vid-admin-form">
                <label className="vid-admin-label">
                  Video Embed / Watch Link
                  <input
                    type="text"
                    value={heroUrlInput}
                    onChange={(e) => setHeroUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    className="vid-admin-input"
                    required
                  />
                </label>

                <label className="vid-admin-label">
                  Display Title (Optional)
                  <input
                    type="text"
                    value={heroTitleInput}
                    onChange={(e) => setHeroTitleInput(e.target.value)}
                    placeholder="Featured Showreel"
                    className="vid-admin-input"
                  />
                </label>

                <button type="submit" className="vid-admin-btn-primary">
                  Save Hero Video
                </button>
              </form>

              {/* Current Preview */}
              <div className="vid-admin-preview-box">
                <span className="vid-admin-preview-title">Current Live Preview</span>
                <div className="vid-admin-embed-ratio">
                  <iframe
                    src={heroVideo.url}
                    title="Live Hero Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  />
                </div>
              </div>
            </div>

            {/* Right: Background Slideshow Images */}
            <div className="vid-admin-card">
              <div className="vid-admin-card-head">
                <span className="vid-admin-card-badge">BACK LAYER</span>
                <h3>Hero Background Slideshow</h3>
                <p>
                  These images automatically crossfade in the background behind the video.
                </p>
              </div>

              {/* Add New Slide Form */}
              <form onSubmit={handleAddSlide} className="vid-admin-form-inline">
                <input
                  type="text"
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  placeholder="Image URL or project path (e.g. /assets/1.jpeg)"
                  className="vid-admin-input"
                />
                <button type="submit" className="vid-admin-btn-primary">
                  Add Slide
                </button>
              </form>

              {/* Quick Presets */}
              <div className="vid-admin-quick-picks">
                <span>Quick Assets:</span>
                {["/assets/1.jpeg", "/assets/2.jpeg", "/assets/3.jpeg", "/assets/avengers.jpeg", "/assets/infinite-format.png"].map(
                  (path) => (
                    <button
                      key={path}
                      type="button"
                      className="vid-admin-chip"
                      onClick={() => setNewSlideUrl(path)}
                    >
                      +{path.split("/").pop()}
                    </button>
                  )
                )}
              </div>

              {/* Existing Slides List */}
              <div className="vid-admin-slides-list">
                <span className="vid-admin-preview-title">
                  Active Slides ({heroSlides.length})
                </span>
                <div className="vid-admin-slides-grid">
                  {heroSlides.map((slide, idx) => (
                    <div key={idx} className="vid-admin-slide-item">
                      <img src={slide} alt={`Slide ${idx + 1}`} />
                      <div className="vid-admin-slide-meta">
                        <span>Slide #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeHeroSlide(idx)}
                          className="vid-admin-btn-remove"
                          title="Remove Slide"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PORTFOLIO PROJECTS ── */}
        {activeTab === "portfolio" && (
          <div className="vid-admin-section-grid">
            {/* Form */}
            <div className="vid-admin-card">
              <div className="vid-admin-card-head">
                <span className="vid-admin-card-badge">
                  {editingProjectId ? "EDIT PROJECT" : "NEW PROJECT"}
                </span>
                <h3>{editingProjectId ? "Edit Portfolio Video" : "Add New Video Project"}</h3>
                <p>Link a video to the portfolio grid with custom thumbnail and category.</p>
              </div>

              <form onSubmit={handleSaveProject} className="vid-admin-form">
                <label className="vid-admin-label">
                  Project Title
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Apex Horizon"
                    className="vid-admin-input"
                    required
                  />
                </label>

                <label className="vid-admin-label">
                  Category
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="vid-admin-input"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Music Video">Music Video</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Travel">Travel</option>
                    <option value="Shorts & Reels">Shorts & Reels</option>
                    <option value="Cinematic">Cinematic</option>
                  </select>
                </label>

                <label className="vid-admin-label">
                  Video URL (YouTube or Vimeo)
                  <input
                    type="text"
                    value={projectVideoUrl}
                    onChange={(e) => setProjectVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="vid-admin-input"
                    required
                  />
                </label>

                <label className="vid-admin-label">
                  Cover Thumbnail Image URL
                  <input
                    type="text"
                    value={projectThumb}
                    onChange={(e) => setProjectThumb(e.target.value)}
                    placeholder="/assets/1.jpeg or https://..."
                    className="vid-admin-input"
                  />
                </label>

                <div className="vid-admin-form-actions">
                  <button type="submit" className="vid-admin-btn-primary">
                    {editingProjectId ? "Save Changes" : "Add to Portfolio"}
                  </button>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={cancelEditProject}
                      className="vid-admin-btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of Projects */}
            <div className="vid-admin-card">
              <div className="vid-admin-card-head">
                <span className="vid-admin-card-badge">LIVE ITEMS</span>
                <h3>Active Portfolio Grid ({portfolioProjects.length})</h3>
                <p>Manage and delete existing projects from the video page.</p>
              </div>

              <div className="vid-admin-project-list">
                {portfolioProjects.map((proj) => (
                  <div key={proj.id} className="vid-admin-project-item">
                    <img
                      src={proj.thumb}
                      alt={proj.title}
                      className="vid-admin-proj-thumb"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/1.jpeg";
                      }}
                    />
                    <div className="vid-admin-proj-info">
                      <h4>{proj.title}</h4>
                      <span className="vid-admin-proj-cat">{proj.category}</span>
                      <a
                        href={proj.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="vid-admin-proj-link"
                      >
                        Watch Video ↗
                      </a>
                    </div>
                    <div className="vid-admin-proj-actions">
                      <button
                        type="button"
                        onClick={() => startEditProject(proj)}
                        className="vid-admin-btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${proj.title}"?`)) {
                            deletePortfolioProject(proj.id);
                            triggerNotice("Project deleted.");
                          }
                        }}
                        className="vid-admin-btn-del"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
