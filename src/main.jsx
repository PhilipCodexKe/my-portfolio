import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./dark-theme.css";
import App from "./App.jsx";

// Register Service Worker for PWA / offline support
if ("serviceWorker" in navigator && !window.location.host.includes("localhost:5173")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(" Service Worker registered successfully: ", registration.scope);
      })
      .catch((error) => {
        console.error(" Service Worker registration failed: ", error);
      });
  });
} else if ("serviceWorker" in navigator) {
  // In development, also register so it can be tested
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log(" [DEV] Service Worker registered: ", reg.scope))
      .catch((err) => console.warn(" [DEV] SW registration error: ", err));
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

