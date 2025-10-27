const themeToggle = document.getElementById("themeToggle");
let light = false;
themeToggle.addEventListener("click", () => {
  light = !light;
  if (light) {
    document.documentElement.style.setProperty("--bg", "#f7fbff");
    document.documentElement.style.setProperty("--card", "#ffffff");
    document.documentElement.style.setProperty("--muted", "#475569");
    document.documentElement.style.setProperty("--accent1", "#60a5fa");
    document.documentElement.style.setProperty("--accent2", "#7dd3fc");
    document.documentElement.style.setProperty("color", "#071124");
  } else {
    document.documentElement.style.removeProperty("--bg");
    document.documentElement.style.removeProperty("--card");
    document.documentElement.style.removeProperty("--muted");
    document.documentElement.style.removeProperty("--accent1");
    document.documentElement.style.removeProperty("--accent2");
    document.documentElement.style.removeProperty("color");
  }
});

// fake contact submit
const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Thanks — message simulated (no backend). Replace with your email or API.)"
  );
  form.reset();
});
