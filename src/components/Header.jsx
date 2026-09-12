import { useState, useEffect } from "react";

function Header({ navigate, theme, toggleTheme }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture standard PWA install prompt (Chrome / Android / Edge / Desktop)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // If native prompt captured
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    // If iOS Safari
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      setShowIOSPrompt(true);
      setTimeout(() => setShowIOSPrompt(false), 5000);
      return;
    }

    // Fallback notice
    alert("To install the app:\n• On Chrome/Android: Tap the browser menu (⋮) -> 'Install App' or 'Add to Home screen'.\n• On Safari/iOS: Tap Share -> 'Add to Home Screen'.");
  };

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

      {/* Middle Download / Install App Button */}
      {!isInstalled && (
        <div className="header-center">
          <button
            className="pwa-download-btn"
            onClick={handleInstallClick}
            title="Install App to Home Screen"
          >
            <svg
              className="pwa-download-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="pwa-download-text">Get App</span>
          </button>
          {showIOSPrompt && (
            <div className="pwa-ios-tooltip">
              Tap <strong>Share</strong> <span style={{ fontSize: "1.1rem" }}>⎋</span> then <strong>&ldquo;Add to Home Screen&rdquo;</strong>
            </div>
          )}
        </div>
      )}

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

