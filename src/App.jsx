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
import { GraphicsProvider } from "./context/GraphicsContext";

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

  // Hash-based navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      let newView = "home";
      if (hash === "projects") newView = "projects";
      else if (hash === "about") newView = "about";
      else if (hash === "blog") newView = "blog";
      else if (hash === "admin" || hash === "studio") newView = "admin";

      setActiveView(newView);
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
    // Save current scroll position before leaving
    scrollPositions.current[activeView] = window.scrollY;

    window.location.hash = `#/${view === "home" ? "" : view}`;

    // Restore saved position for target view, or scroll to top if first visit
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

  // ── Case study view ───────────────────────────────────
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

  // ── Main views ────────────────────────────────────────
  return (
    <GraphicsProvider>
      <div className="app-container">
        <Header navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
        <FloatingNav activeView={activeView} navigate={navigate} />

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

        {/* Footer / Contact */}
        <Footer
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />

        <WhatsAppFloat />
      </div>
    </GraphicsProvider>
  );
}

export default App;
