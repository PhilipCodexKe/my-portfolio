import { createContext, useContext, useState, useEffect } from "react";

const VideoContext = createContext();

const DEFAULT_HERO_VIDEO = {
  url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=1&rel=0&modestbranding=1",
  title: "Featured Showreel",
};

const DEFAULT_HERO_SLIDES = [
  "/assets/1.jpeg",
  "/assets/infinite-format.png",
  "/assets/2.jpeg",
  "/assets/avengers.jpeg",
  "/assets/3.jpeg",
];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Midnight Pulse",
    category: "Commercial",
    thumb: "/assets/avengers.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-2",
    title: "Apex Horizon",
    category: "Documentary",
    thumb: "/assets/infinite-format.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-3",
    title: "Coast to Summit",
    category: "Travel",
    thumb: "/assets/1.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-4",
    title: "Elegance & Vows",
    category: "Wedding",
    thumb: "/assets/2.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-5",
    title: "Kinetic Momentum",
    category: "Fashion",
    thumb: "/assets/3.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-6",
    title: "The Quiet Hours",
    category: "Narrative",
    thumb: "/assets/4.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-7",
    title: "Skyline Sanctuary",
    category: "Architectural",
    thumb: "/assets/5.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "proj-8",
    title: "Viral Retention",
    category: "Shorts & Reels",
    thumb: "/assets/6.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
];

const STORAGE_KEYS = {
  HERO_VIDEO: "philip_video_hero_video",
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
    setHeroVideo({
      url: embedUrl || rawUrl,
      title: title || heroVideo.title,
    });
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
    setPortfolioProjects((prev) => [newProject, ...prev]);
  };

  const updatePortfolioProject = (id, updatedFields) => {
    setPortfolioProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const videoUrl = updatedFields.videoUrl
            ? formatVideoEmbedUrl(updatedFields.videoUrl)
            : item.videoUrl;
          return { ...item, ...updatedFields, videoUrl };
        }
        return item;
      })
    );
  };

  const deletePortfolioProject = (id) => {
    setPortfolioProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const resetVideoDefaults = () => {
    setHeroVideo(DEFAULT_HERO_VIDEO);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setPortfolioProjects(DEFAULT_PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.HERO_VIDEO);
    localStorage.removeItem(STORAGE_KEYS.HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  };

  return (
    <VideoContext.Provider
      value={{
        heroVideo,
        heroSlides,
        portfolioProjects,
        updateHeroVideo,
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
