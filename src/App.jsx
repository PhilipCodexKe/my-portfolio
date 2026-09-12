import { useState, useEffect } from "react";
import Header from "./components/Header";
import FloatingNav from "./components/FloatingNav";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
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
      if (hash === "projects") setActiveView("projects");
      else if (hash === "about") setActiveView("about");
      else if (hash === "blog") setActiveView("blog");
      else if (hash === "admin" || hash === "studio") setActiveView("admin");
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

        {activeView === "home" && (
          <HomePage navigate={navigate} setCaseStudy={setCaseStudy} />
        )}

        {activeView === "projects" && (
          <ProjectsPage setCaseStudy={setCaseStudy} />
        )}

        {activeView === "about" && <AboutPage navigate={navigate} />}

        {activeView === "blog" && <GraphicsDesignPage navigate={navigate} />}

        {activeView === "admin" && <AdminGraphicsPage navigate={navigate} />}

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
