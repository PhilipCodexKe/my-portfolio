import { createContext, useContext, useState, useEffect } from "react";

const VideoContext = createContext();

const DEFAULT_HERO_VIDEO = {
  url: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794227792047-1109.mp4",
  title: "Featured Showreel",
};

const DEFAULT_HERO_BG_VIDEO = {
  url: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794225671627-wedddiiiing.mp4",
  title: "Hero Ambient Backdrop Reel",
};

const DEFAULT_HERO_SLIDES = [];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Apex Horizon",
    category: "Commercial",
    thumb: "/assets/avengers.jpeg",
    videoUrl: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794227792047-1109.mp4",
  },
  {
    id: "proj-2",
    title: "Wedding Story",
    category: "Wedding",
    thumb: "/assets/2.jpeg",
    videoUrl: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794225671627-wedddiiiing.mp4",
  },
  {
    id: "proj-3",
    title: "Coast to Summit",
    category: "Travel",
    thumb: "/assets/1.jpeg",
    videoUrl: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794227792047-1109.mp4",
  },
  {
    id: "proj-4",
    title: "Kinetic Momentum",
    category: "Fashion",
    thumb: "/assets/3.jpeg",
    videoUrl: "https://pub-4b3987be45504b49850b4bff3f8b2cb7.r2.dev/videos/1794225671627-wedddiiiing.mp4",
  },
];

const STORAGE_KEYS = {
  HERO_VIDEO: "philip_video_hero_video",
  HERO_BG_VIDEO: "philip_video_hero_bg_video",
  HERO_SLIDES: "philip_video_hero_slides",
  PROJECTS: "philip_video_projects",
};

// Helper: Normalize YouTube/Vimeo URLs into embed links
export function formatVideoEmbedUrl(url) {
  if (!url) return "";
  let clean = url.trim();

  // If already embed URL, ensure proper query params
  if (clean.includes("youtube.com/embed/")) {
    return clean;
  }

  // YouTube watch link (https://www.youtube.com/watch?v=ID)
  const ytWatchMatch = clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const id = ytWatchMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0`;
  }

  // Vimeo link (https://vimeo.com/ID)
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&loop=1&autopause=0`;
  }

  return clean;
}

export function VideoProvider({ children }) {
  const [heroVideo, setHeroVideo] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_VIDEO);
      return stored ? JSON.parse(stored) : DEFAULT_HERO_VIDEO;
    } catch {
      return DEFAULT_HERO_VIDEO;
    }
  });

  const [heroBgVideo, setHeroBgVideo] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_BG_VIDEO);
      return stored ? JSON.parse(stored) : DEFAULT_HERO_BG_VIDEO;
    } catch {
      return DEFAULT_HERO_BG_VIDEO;
    }
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      return stored ? JSON.parse(stored) : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  });

  const [portfolioProjects, setPortfolioProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  // 1. Fetch persistent video configuration from database on mount
  useEffect(() => {
    const fetchServerSettings = async () => {
      try {
        const res = await fetch("/api/settings/video_config");
        if (res.ok) {
          const config = await res.json();
          if (config && typeof config === "object") {
            if (config.heroVideo && config.heroVideo.url) {
              setHeroVideo(config.heroVideo);
            }
            if (config.heroBgVideo && config.heroBgVideo.url) {
              setHeroBgVideo(config.heroBgVideo);
            }
            if (Array.isArray(config.portfolioProjects) && config.portfolioProjects.length > 0) {
              setPortfolioProjects(config.portfolioProjects);
            }
          }
        }
      } catch (err) {
        console.warn("Could not sync video settings from database:", err);
      }
    };
    fetchServerSettings();
  }, []);

  // Helper to persist current state to SQLite database via /api/settings/video_config
  const syncToDatabase = async (overrides = {}) => {
    try {
      const payload = {
        heroVideo: overrides.heroVideo || heroVideo,
        heroBgVideo: overrides.heroBgVideo || heroBgVideo,
        portfolioProjects: overrides.portfolioProjects || portfolioProjects,
      };
      await fetch("/api/settings/video_config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Failed to save video settings to database:", err);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_VIDEO, JSON.stringify(heroVideo));
    } catch (e) {
      console.warn("Failed to persist hero video", e);
    }
  }, [heroVideo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_BG_VIDEO, JSON.stringify(heroBgVideo));
    } catch (e) {
      console.warn("Failed to persist hero bg video", e);
    }
  }, [heroBgVideo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
    } catch (e) {
      console.warn("Failed to persist hero slides", e);
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(portfolioProjects));
    } catch (e) {
      console.warn("Failed to persist portfolio projects", e);
    }
  }, [portfolioProjects]);

  // Actions
  const updateHeroVideo = (rawUrl, title) => {
    const embedUrl = formatVideoEmbedUrl(rawUrl);
    const updated = {
      url: embedUrl || rawUrl,
      title: title || heroVideo.title,
    };
    setHeroVideo(updated);
    syncToDatabase({ heroVideo: updated });
  };

  const updateHeroBgVideo = (rawUrl, title) => {
    const embedUrl = formatVideoEmbedUrl(rawUrl);
    const updated = {
      url: embedUrl || rawUrl,
      title: title || heroBgVideo.title,
    };
    setHeroBgVideo(updated);
    syncToDatabase({ heroBgVideo: updated });
  };

  const addHeroSlide = (imageUrl) => {
    if (!imageUrl) return;
    setHeroSlides((prev) => [...prev, imageUrl.trim()]);
  };

  const removeHeroSlide = (index) => {
    setHeroSlides((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addPortfolioProject = (project) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: project.title || "Untitled Project",
      category: project.category || "Commercial",
      thumb: project.thumb || "/assets/1.jpeg",
      videoUrl: formatVideoEmbedUrl(project.videoUrl) || project.videoUrl,
    };
    const updatedList = [newProject, ...portfolioProjects];
    setPortfolioProjects(updatedList);
    syncToDatabase({ portfolioProjects: updatedList });
  };

  const updatePortfolioProject = (id, updatedFields) => {
    const updatedList = portfolioProjects.map((item) => {
      if (item.id === id) {
        const videoUrl = updatedFields.videoUrl
          ? formatVideoEmbedUrl(updatedFields.videoUrl)
          : item.videoUrl;
        return { ...item, ...updatedFields, videoUrl };
      }
      return item;
    });
    setPortfolioProjects(updatedList);
    syncToDatabase({ portfolioProjects: updatedList });
  };

  const deletePortfolioProject = (id) => {
    const updatedList = portfolioProjects.filter((item) => item.id !== id);
    setPortfolioProjects(updatedList);
    syncToDatabase({ portfolioProjects: updatedList });
  };

  const resetVideoDefaults = () => {
    setHeroVideo(DEFAULT_HERO_VIDEO);
    setHeroBgVideo(DEFAULT_HERO_BG_VIDEO);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setPortfolioProjects(DEFAULT_PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.HERO_VIDEO);
    localStorage.removeItem(STORAGE_KEYS.HERO_BG_VIDEO);
    localStorage.removeItem(STORAGE_KEYS.HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    syncToDatabase({
      heroVideo: DEFAULT_HERO_VIDEO,
      heroBgVideo: DEFAULT_HERO_BG_VIDEO,
      portfolioProjects: DEFAULT_PROJECTS,
    });
  };

  return (
    <VideoContext.Provider
      value={{
        heroVideo,
        heroBgVideo,
        heroSlides,
        portfolioProjects,
        updateHeroVideo,
        updateHeroBgVideo,
        addHeroSlide,
        removeHeroSlide,
        addPortfolioProject,
        updatePortfolioProject,
        deletePortfolioProject,
        resetVideoDefaults,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}
