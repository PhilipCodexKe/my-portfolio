function FloatingNav({ activeView, navigate }) {
  return (
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
  );
}

export default FloatingNav;
