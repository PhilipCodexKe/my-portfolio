import { useState, useEffect } from "react";
import { useVideo } from "../context/VideoContext";
import { uploadToR2 } from "../utils/r2Upload";
import StudioVideoPlayer from "../components/StudioVideoPlayer";
import "./AdminVideoPage.css";

export default function AdminVideoPage({ navigate }) {
  const {
    heroVideo,
    heroBgVideo,
    portfolioProjects,
    updateHeroVideo,
    updateHeroBgVideo,
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

  // Active Tab: 'hero' | 'portfolio' | 'vault'
  const [activeTab, setActiveTab] = useState("hero");

  // Hero Foreground Video Form
  const [heroUrlInput, setHeroUrlInput] = useState(heroVideo.url || "");
  const [heroTitleInput, setHeroTitleInput] = useState(heroVideo.title || "");
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  // Hero Background Video Form (Replaces slide images)
  const [heroBgUrlInput, setHeroBgUrlInput] = useState(heroBgVideo?.url || "");
  const [heroBgTitleInput, setHeroBgTitleInput] = useState(heroBgVideo?.title || "");
  const [heroBgUploading, setHeroBgUploading] = useState(false);
  const [heroBgProgress, setHeroBgProgress] = useState(0);

  // Project Form
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Commercial");
  const [projectThumb, setProjectThumb] = useState("");
  const [projectVideoUrl, setProjectVideoUrl] = useState("");
  const [projVideoUploading, setProjVideoUploading] = useState(false);
  const [projVideoProgress, setProjVideoProgress] = useState(0);
  const [projThumbUploading, setProjThumbUploading] = useState(false);
  const [projThumbProgress, setProjThumbProgress] = useState(0);

  // Cloudflare R2 Vault
  const [r2Videos, setR2Videos] = useState([]);
  const [loadingVault, setLoadingVault] = useState(false);

  // Notification Banner
  const [notice, setNotice] = useState("");

  const triggerNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  // Fetch R2 uploaded videos
  const fetchR2Videos = async () => {
    setLoadingVault(true);
    try {
      const res = await fetch("/api/r2/videos");
      const data = await res.json();
      if (data.success) {
        setR2Videos(data.videos || []);
      }
    } catch (err) {
      console.error("Error fetching R2 videos:", err);
    } finally {
      setLoadingVault(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "vault") {
      fetchR2Videos();
    }
  }, [isAuthenticated, activeTab]);

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

  // ── Hero Video Upload to Cloudflare R2 ──
  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroProgress(0);
    try {
      const { publicUrl } = await uploadToR2(file, "videos", (pct) => {
        setHeroProgress(pct);
      });
      setHeroUrlInput(publicUrl);
      const autoTitle = heroTitleInput || file.name.replace(/\.[^/.]+$/, "");
      setHeroTitleInput(autoTitle);
      updateHeroVideo(publicUrl, autoTitle);
      triggerNotice("Video successfully uploaded directly to Cloudflare R2!");
      if (activeTab === "vault") fetchR2Videos();
    } catch (err) {
      alert(`Cloudflare R2 Upload Failed: ${err.message}`);
    } finally {
      setHeroUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveHeroVideo = (e) => {
    e.preventDefault();
    if (!heroUrlInput.trim()) return;
    updateHeroVideo(heroUrlInput, heroTitleInput);
    triggerNotice("Hero foreground video updated successfully!");
  };

  // ── Hero Background Video Upload to Cloudflare R2 ──
  const handleHeroBgFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBgUploading(true);
    setHeroBgProgress(0);
    try {
      const { publicUrl } = await uploadToR2(file, "videos", (pct) => {
        setHeroBgProgress(pct);
      });
      setHeroBgUrlInput(publicUrl);
      const autoTitle = heroBgTitleInput || `${file.name.replace(/\.[^/.]+$/, "")} (Ambient)`;
      setHeroBgTitleInput(autoTitle);
      updateHeroBgVideo(publicUrl, autoTitle);
      triggerNotice("Hero backdrop video uploaded directly to Cloudflare R2!");
      if (activeTab === "vault") fetchR2Videos();
    } catch (err) {
      alert(`Backdrop Video Upload Failed: ${err.message}`);
    } finally {
      setHeroBgUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveHeroBgVideo = (e) => {
    e.preventDefault();
    if (!heroBgUrlInput.trim()) return;
    updateHeroBgVideo(heroBgUrlInput, heroBgTitleInput);
    triggerNotice("Hero backdrop video updated successfully!");
  };

  // ── Project Video Upload to R2 ──
  const handleProjectVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjVideoUploading(true);
    setProjVideoProgress(0);
    try {
      const { publicUrl } = await uploadToR2(file, "videos", (pct) => {
        setProjVideoProgress(pct);
      });
      setProjectVideoUrl(publicUrl);
      if (!projectTitle.trim()) {
        setProjectTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      triggerNotice("Portfolio video uploaded to Cloudflare R2!");
    } catch (err) {
      alert(`Upload Failed: ${err.message}`);
    } finally {
      setProjVideoUploading(false);
      e.target.value = "";
    }
  };

  // ── Project Thumbnail Upload to R2 ──
  const handleProjectThumbFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjThumbUploading(true);
    setProjThumbProgress(0);
    try {
      const { publicUrl } = await uploadToR2(file, "thumbnails", (pct) => {
        setProjThumbProgress(pct);
      });
      setProjectThumb(publicUrl);
      triggerNotice("Cover image uploaded to Cloudflare R2!");
    } catch (err) {
      alert(`Cover upload failed: ${err.message}`);
    } finally {
      setProjThumbUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectVideoUrl.trim()) {
      alert("Please provide both a Title and a Video URL or upload a video.");
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

  const handleDeleteR2File = async (key) => {
    if (!window.confirm(`Delete "${key}" from Cloudflare R2 permanently?`)) return;
    try {
      const res = await fetch("/api/r2/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        triggerNotice("Deleted from Cloudflare R2.");
        fetchR2Videos();
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
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
      {/* ── Studio Header ── */}
      <header className="vid-admin-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="vid-admin-brand-tag">PHILIP WAFULA STUDIO</span>
            <span className="vid-admin-r2-badge">☁️ Cloudflare R2 Active</span>
          </div>
          <h1>Video Management Hub</h1>
        </div>

        <div className="vid-admin-header-actions">
          <a href="#video" className="vid-admin-btn-secondary">
            ← View Video Page
          </a>
          <button
            onClick={() => {
              if (window.confirm("Reset all videos to original portfolio defaults?")) {
                resetVideoDefaults();
                setHeroUrlInput(heroVideo.url);
                setHeroBgUrlInput(heroBgVideo?.url || "");
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
          📁 2. Portfolio Projects ({portfolioProjects.length})
        </button>
        <button
          className={`vid-admin-tab ${activeTab === "vault" ? "active" : ""}`}
          onClick={() => setActiveTab("vault")}
        >
          ☁️ 3. Cloudflare R2 Vault ({r2Videos.length})
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
                  Upload your video file directly to <strong>Cloudflare R2</strong> or paste an embed link (YouTube / Vimeo).
                </p>
              </div>

              {/* R2 Direct Upload Box */}
              <div className="vid-admin-upload-zone">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/mov"
                  onChange={handleHeroFileUpload}
                  disabled={heroUploading}
                  className="vid-admin-hidden-file"
                />
                <span className="vid-admin-upload-icon">{heroUploading ? "⏳" : "📤"}</span>
                <div className="vid-admin-upload-title">
                  {heroUploading ? "Uploading to Cloudflare R2..." : "Click or Drop Video Here (.mp4, .webm, .mov)"}
                </div>
                <div className="vid-admin-upload-sub">
                  Streams with zero latency via Cloudflare edge storage
                </div>
              </div>

              {heroUploading && (
                <div className="vid-admin-progress-box">
                  <div className="vid-admin-progress-head">
                    <span>Uploading direct to R2...</span>
                    <span>{heroProgress}%</span>
                  </div>
                  <div className="vid-admin-progress-track">
                    <div
                      className="vid-admin-progress-bar"
                      style={{ width: `${heroProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div style={{ margin: "16px 0 10px", textAlign: "center", fontSize: "0.8rem", color: "rgba(245,237,228,0.4)" }}>
                — OR ENTER URL MANUALLY —
              </div>

              <form onSubmit={handleSaveHeroVideo} className="vid-admin-form">
                <label className="vid-admin-label">
                  Video URL or Embed Link
                  <input
                    type="text"
                    value={heroUrlInput}
                    onChange={(e) => setHeroUrlInput(e.target.value)}
                    placeholder="https://pub-...r2.dev/videos/... or https://youtube.com/..."
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
                  <StudioVideoPlayer
                    src={heroVideo.url}
                    title="Live Hero Preview"
                    controls={true}
                    autoPlay={false}
                    muted={true}
                  />
                </div>
              </div>
            </div>

            {/* Right: Background Ambient Video (Replaces Image Slideshow) */}
            <div className="vid-admin-card">
              <div className="vid-admin-card-head">
                <span className="vid-admin-card-badge">BACK LAYER</span>
                <h3>Hero Background Video (Backdrop Reel)</h3>
                <p>
                  Upload an ambient video to <strong>Cloudflare R2</strong> to play silently in a cinematic loop behind the foreground showreel.
                </p>
              </div>

              {/* R2 Direct Upload Box for Background Video */}
              <div className="vid-admin-upload-zone">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/mov"
                  onChange={handleHeroBgFileUpload}
                  disabled={heroBgUploading}
                  className="vid-admin-hidden-file"
                />
                <span className="vid-admin-upload-icon">{heroBgUploading ? "⏳" : "🎬"}</span>
                <div className="vid-admin-upload-title">
                  {heroBgUploading ? "Uploading backdrop video to R2..." : "Click or Drop Background Video Here"}
                </div>
                <div className="vid-admin-upload-sub">
                  MP4 / WebM / MOV • Loops seamlessly behind the hero
                </div>
              </div>

              {heroBgUploading && (
                <div className="vid-admin-progress-box">
                  <div className="vid-admin-progress-head">
                    <span>Uploading direct to R2...</span>
                    <span>{heroBgProgress}%</span>
                  </div>
                  <div className="vid-admin-progress-track">
                    <div
                      className="vid-admin-progress-bar"
                      style={{ width: `${heroBgProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div style={{ margin: "16px 0 10px", textAlign: "center", fontSize: "0.8rem", color: "rgba(245,237,228,0.4)" }}>
                — OR ENTER URL MANUALLY —
              </div>

              <form onSubmit={handleSaveHeroBgVideo} className="vid-admin-form">
                <label className="vid-admin-label">
                  Backdrop Video URL
                  <input
                    type="text"
                    value={heroBgUrlInput}
                    onChange={(e) => setHeroBgUrlInput(e.target.value)}
                    placeholder="https://pub-...r2.dev/videos/... or https://youtube.com/..."
                    className="vid-admin-input"
                    required
                  />
                </label>

                <label className="vid-admin-label">
                  Backdrop Title (Optional)
                  <input
                    type="text"
                    value={heroBgTitleInput}
                    onChange={(e) => setHeroBgTitleInput(e.target.value)}
                    placeholder="Atmospheric Reel"
                    className="vid-admin-input"
                  />
                </label>

                <div className="vid-admin-form-actions">
                  <button type="submit" className="vid-admin-btn-primary">
                    Save Background Video
                  </button>
                  <button
                    type="button"
                    className="vid-admin-btn-secondary"
                    onClick={() => {
                      setHeroBgUrlInput(heroUrlInput);
                      updateHeroBgVideo(heroUrlInput, `${heroTitleInput || "Hero Video"} (Backdrop)`);
                      triggerNotice("Copied foreground video to backdrop!");
                    }}
                  >
                    Match Foreground
                  </button>
                </div>
              </form>

              {/* Current Background Preview */}
              <div className="vid-admin-preview-box" style={{ marginTop: "20px" }}>
                <span className="vid-admin-preview-title">Current Backdrop Preview</span>
                <div className="vid-admin-embed-ratio">
                  <StudioVideoPlayer
                    src={heroBgVideo?.url || heroVideo.url}
                    title="Live Hero Backdrop Preview"
                    controls={true}
                    autoPlay={false}
                    muted={true}
                  />
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
                <p>Upload a video or link from Cloudflare R2 / YouTube with a custom cover.</p>
              </div>

              <form onSubmit={handleSaveProject} className="vid-admin-form">
                <label className="vid-admin-label">
                  Project Title
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Cinematic Showreel 2026"
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

                {/* Video URL & Upload */}
                <label className="vid-admin-label">
                  Video Source
                  <div className="vid-admin-upload-zone" style={{ padding: "12px", margin: "6px 0 10px" }}>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/mov"
                      onChange={handleProjectVideoFileUpload}
                      disabled={projVideoUploading}
                      className="vid-admin-hidden-file"
                    />
                    <span className="vid-admin-upload-icon" style={{ fontSize: "1.3rem" }}>🎬</span>
                    <div className="vid-admin-upload-title" style={{ fontSize: "0.85rem" }}>
                      {projVideoUploading ? "Uploading to Cloudflare R2..." : "Upload Video File to Cloudflare R2"}
                    </div>
                  </div>

                  {projVideoUploading && (
                    <div className="vid-admin-progress-box">
                      <div className="vid-admin-progress-head">
                        <span>Uploading video...</span>
                        <span>{projVideoProgress}%</span>
                      </div>
                      <div className="vid-admin-progress-track">
                        <div
                          className="vid-admin-progress-bar"
                          style={{ width: `${projVideoProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={projectVideoUrl}
                    onChange={(e) => setProjectVideoUrl(e.target.value)}
                    placeholder="https://pub-...r2.dev/videos/... or https://youtube.com/..."
                    className="vid-admin-input"
                    required
                  />
                </label>

                {/* Thumbnail Image */}
                <label className="vid-admin-label">
                  Cover Thumbnail Image
                  <div className="vid-admin-upload-zone" style={{ padding: "10px", margin: "6px 0 10px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectThumbFileUpload}
                      disabled={projThumbUploading}
                      className="vid-admin-hidden-file"
                    />
                    <span className="vid-admin-upload-icon" style={{ fontSize: "1.2rem" }}>🖼️</span>
                    <div className="vid-admin-upload-title" style={{ fontSize: "0.85rem" }}>
                      {projThumbUploading ? "Uploading cover..." : "Upload Cover Image to R2"}
                    </div>
                  </div>

                  {projThumbUploading && (
                    <div className="vid-admin-progress-box">
                      <div className="vid-admin-progress-head">
                        <span>Uploading image...</span>
                        <span>{projThumbProgress}%</span>
                      </div>
                      <div className="vid-admin-progress-track">
                        <div
                          className="vid-admin-progress-bar"
                          style={{ width: `${projThumbProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

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

        {/* ── TAB 3: CLOUDFLARE R2 VAULT ── */}
        {activeTab === "vault" && (
          <div className="vid-admin-card">
            <div className="vid-admin-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="vid-admin-card-badge">STORAGE BUCKET</span>
                <h3>Cloudflare R2 Media Vault</h3>
                <p>All videos stored in your <strong>myportofoliovideos</strong> bucket.</p>
              </div>
              <button
                type="button"
                onClick={fetchR2Videos}
                className="vid-admin-btn-secondary"
                disabled={loadingVault}
              >
                {loadingVault ? "Refreshing..." : "🔄 Refresh Vault"}
              </button>
            </div>

            {loadingVault ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(245,237,228,0.6)" }}>
                Loading files from Cloudflare R2...
              </div>
            ) : r2Videos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(245,237,228,0.5)" }}>
                No videos uploaded to R2 yet. Upload your first video from Tab 1 or Tab 2 above!
              </div>
            ) : (
              <div className="vid-admin-vault-grid">
                {r2Videos.map((item) => (
                  <div key={item.key} className="vid-admin-vault-card">
                    <div className="vid-admin-vault-media">
                      <StudioVideoPlayer
                        src={item.url}
                        controls={true}
                        muted={true}
                        autoPlay={false}
                      />
                    </div>
                    <div className="vid-admin-vault-details">
                      <div className="vid-admin-vault-name" title={item.key}>
                        {item.key.replace(/^videos\/\d+-/, "")}
                      </div>
                      <div className="vid-admin-vault-meta">
                        <span>{(item.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="vid-admin-vault-actions" style={{ flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="vid-admin-btn-action"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            triggerNotice("Direct video URL copied to clipboard!");
                          }}
                        >
                          📋 Copy URL
                        </button>
                        <button
                          type="button"
                          className="vid-admin-btn-action"
                          onClick={() => {
                            updateHeroVideo(item.url, item.key.replace(/^videos\/\d+-/, ""));
                            setHeroUrlInput(item.url);
                            triggerNotice("Assigned as Hero Foreground Video!");
                          }}
                        >
                          🎬 As Foreground
                        </button>
                        <button
                          type="button"
                          className="vid-admin-btn-action"
                          onClick={() => {
                            updateHeroBgVideo(item.url, `${item.key.replace(/^videos\/\d+-/, "")} (Backdrop)`);
                            setHeroBgUrlInput(item.url);
                            triggerNotice("Assigned as Hero Background Video!");
                          }}
                        >
                          🌌 As Backdrop
                        </button>
                        <button
                          type="button"
                          className="vid-admin-btn-action"
                          style={{ color: "#ff6b6b", flex: "0 0 32px" }}
                          onClick={() => handleDeleteR2File(item.key)}
                          title="Delete from R2"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
