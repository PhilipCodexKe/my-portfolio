function Header({ navigate, theme, toggleTheme }) {
  return (
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
            <img
              src="/assets/moon.png"
              alt="Dark Mode"
              style={{ width: "24px", height: "24px" }}
            />
          ) : (
            <img
              src="/assets/sun.png"
              alt="Light Mode"
              style={{ width: "24px", height: "24px" }}
            />
          )}
        </button>
        <a className="connect-btn" href="#contact">
          Connect
        </a>
      </div>
    </header>
  );
}

export default Header;
