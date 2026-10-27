import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import FloatingNav from "./components/FloatingNav";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import PageShell from "./components/PageShell";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import GraphicsDesignPage from "./pages/GraphicsDesignPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import AdminGraphicsPage from "./pages/AdminGraphicsPage";
import AdminVideoPage from "./pages/AdminVideoPage";
import VideoEditingPage from "./pages/videoEditingPage";
import { GraphicsProvider } from "./context/GraphicsContext";
import { VideoProvider } from "./context/VideoContext";

function App() {
  const [activeView, setActiveView] = useState("home");
  const [caseStudy, setCaseStudy] = useState(null);
  const [mountedViews, setMountedViews] = useState(() => new Set(["home"]));
  const scrollPositions = useRef({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [theme, setTheme] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [showNavOverlay, setShowNavOverlay] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      let newView = "home";
      if (hash === "projects") newView = "projects";
      else if (hash === "about") newView = "about";
      else if (hash === "blog") newView = "blog";
      else if (hash === "admin" || hash === "studio") newView = "admin";
      else if (hash === "video") newView = "video";
      else if (hash === "video-admin" || hash === "admin-video") newView = "video-admin";

      setActiveView(newView);
      setShowNavOverlay(false);
      setMountedViews((prev) => {
        if (prev.has(newView)) return prev;
        return new Set(prev).add(newView);
      });
      setCaseStudy(null);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigate = (view) => {
    scrollPositions.current[activeView] = window.scrollY;

    setShowNavOverlay(false);
    window.location.hash = `#/${view === "home" ? "" : view}`;

    requestAnimationFrame(() => {
      const saved = scrollPositions.current[view];
      window.scrollTo({ top: saved ?? 0, behavior: "instant" });
    });
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

  if (caseStudy) {
    return (
      <GraphicsProvider>
        <CaseStudyPage
          caseStudyId={caseStudy}
          setCaseStudy={setCaseStudy}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />
      </GraphicsProvider>
    );
  }

  const isVideoPage = activeView === "video";
  const isVideoAdmin = activeView === "video-admin";
  const showNav = (!isVideoPage && !isVideoAdmin) || showNavOverlay;

  return (
    <VideoProvider>
      <GraphicsProvider>
        <div className={`app-container ${isVideoPage ? "page-video-active" : ""}`}>
          {/* Floating Menu Shortcut on Video Page */}
          {isVideoPage && (
            <button
              type="button"
              className={`video-nav-toggle-btn ${showNavOverlay ? "active" : ""}`}
              onClick={() => setShowNavOverlay((prev) => !prev)}
              aria-label={showNavOverlay ? "Close Navigation Menu" : "Open Navigation Menu"}
              title={showNavOverlay ? "Close Menu" : "Menu"}
            >
              {showNavOverlay ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          )}

          {showNav && (
            <>
              <Header navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
              <FloatingNav activeView={activeView} navigate={navigate} />
            </>
          )}

          <PageShell active={activeView === "home"}>
            <HomePage navigate={navigate} setCaseStudy={setCaseStudy} />
          </PageShell>

          <PageShell active={activeView === "projects"}>
            <ProjectsPage setCaseStudy={setCaseStudy} />
          </PageShell>

          <PageShell active={activeView === "about"}>
            <AboutPage navigate={navigate} />
          </PageShell>

          <PageShell active={activeView === "blog"}>
            <GraphicsDesignPage navigate={navigate} />
          </PageShell>

          <PageShell active={activeView === "admin"}>
            {mountedViews.has("admin") && (
              <AdminGraphicsPage navigate={navigate} />
            )}
          </PageShell>

          <PageShell active={activeView === "video"}>
            <VideoEditingPage />
          </PageShell>

          <PageShell active={activeView === "video-admin"}>
            {mountedViews.has("video-admin") && (
              <AdminVideoPage navigate={navigate} />
            )}
          </PageShell>

          {!isVideoAdmin && (
            <Footer
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              navigate={navigate}
            />
          )}

          {!isVideoAdmin && <WhatsAppFloat />}
        </div>
      </GraphicsProvider>
    </VideoProvider>
  );
}

export default App;
