import React, { createContext, useContext, useState, useEffect } from "react";
import {
  gfxHeroData as defaultHeroData,
  gfxChoices as defaultChoices,
  gfxPosterShowcase as defaultPosterShowcase,
  gfxTrustBadges as defaultTrustBadges,
} from "../data/graphicsDesigns";

const STORAGE_KEY_POSTERS = "philip_gfx_posters_v1";
const STORAGE_KEY_CHOICES = "philip_gfx_choices_v1";
const STORAGE_KEY_HERO = "philip_gfx_hero_v1";

const GraphicsContext = createContext(null);

export function GraphicsProvider({ children }) {
  const [posters, setPosters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTERS);
      return saved ? JSON.parse(saved) : defaultPosterShowcase;
    } catch {
      return defaultPosterShowcase;
    }
  });

  const [choices, setChoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHOICES);
      return saved ? JSON.parse(saved) : defaultChoices;
    } catch {
      return defaultChoices;
    }
  });

  const [heroData, setHeroData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      return saved ? JSON.parse(saved) : defaultHeroData;
    } catch {
      return defaultHeroData;
    }
  });

  const [isServerConnected, setIsServerConnected] = useState(false);

  // Fetch initial posters and hero settings from SQLite API on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/posters");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosters(data);
            setIsServerConnected(true);
            // Also generate choices from posters marked addToChoices
            const choiceItems = data
              .filter((p) => p.addToChoices === 1 || p.addToChoices === true)
              .map((p) => ({
                id: `choice-${p.id}`,
                title: (p.title || "ART").toUpperCase(),
                tag: (p.category || "CONCEPT").toUpperCase(),
                img: p.img,
              }));
            if (choiceItems.length > 0) {
              setChoices(choiceItems);
            }
          }
        }
      } catch (err) {
        console.warn("Backend SQLite server offline, using local storage fallback:", err.message);
      }

      try {
        const heroRes = await fetch("/api/settings/hero");
        if (heroRes.ok) {
          const heroDbData = await heroRes.json();
          if (heroDbData && typeof heroDbData === "object") {
            setHeroData((prev) => ({ ...prev, ...heroDbData }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch hero settings:", err.message);
      }
    };
    fetchInitialData();
  }, []);

  // Persist to localStorage for instant client fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTERS, JSON.stringify(posters));
    } catch (err) {
      console.error("Failed to save posters to localStorage:", err);
    }
  }, [posters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHOICES, JSON.stringify(choices));
    } catch (err) {
      console.error("Failed to save choices to localStorage:", err);
    }
  }, [choices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(heroData));
    } catch (err) {
      console.error("Failed to save hero data to localStorage:", err);
    }
  }, [heroData]);

  // Upload an image file to server /uploads folder
  const uploadImageFile = async (file) => {
    console.log(`[GraphicsContext] Starting single upload for: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(`[GraphicsContext] Upload response status: ${res.status}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed on server (Status ${res.status}): ${errorText}`);
      }
      const data = await res.json();
      console.log(`[GraphicsContext] Single upload successful:`, data);
      return data.url; // Returns '/uploads/filename.ext'
    } catch (err) {
      console.warn("[GraphicsContext] Server upload failed, falling back to base64 DataURL:", err.message);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  // Upload multiple image files to server with duplicate detection
  const uploadBulkImages = async (files, options = {}) => {
    console.log(`[GraphicsContext] Starting bulk upload for ${files.length} file(s)...`);
    const totalBytes = Array.from(files).reduce((acc, f) => acc + f.size, 0);
    console.log(`[GraphicsContext] Total batch size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    if (options.titlePrefix) formData.append("titlePrefix", options.titlePrefix);
    if (options.category) formData.append("category", options.category);
    if (options.client) formData.append("client", options.client);
    if (options.year) formData.append("year", options.year);
    if (options.description) formData.append("description", options.description);
    if (options.addToChoices) formData.append("addToChoices", options.addToChoices ? "1" : "0");

    try {
      console.log(`[GraphicsContext] Sending POST to /api/upload-bulk...`);
      const res = await fetch("/api/upload-bulk", {
        method: "POST",
        body: formData,
      });

      console.log(`[GraphicsContext] Bulk upload response received with status: ${res.status}`);
      if (!res.ok) {
        const errText = await res.text();
        console.error(`[GraphicsContext] Bulk upload error response body:`, errText);
        throw new Error(`Bulk upload failed on server (Status ${res.status}): ${errText}`);
      }

      const result = await res.json();
      console.log(`[GraphicsContext] Bulk upload processed successfully:`, result);

      if (result.inserted && result.inserted.length > 0) {
        setPosters((prev) => [...result.inserted, ...prev]);

        if (options.addToChoices) {
          const newChoices = result.inserted.map((p) => ({
            id: `choice-${p.id}`,
            title: (p.title || "ART PIECE").toUpperCase(),
            tag: (p.category || "CONCEPT").toUpperCase(),
            img: p.img,
          }));
          setChoices((prev) => [...newChoices, ...prev]);
        }
      }

      return result;
    } catch (err) {
      console.error("[GraphicsContext] Bulk upload server error:", err);
      throw err;
    }
  };

  // Add new poster item
  const addPoster = async (newItem, options = { addToShowcase: true, addToChoices: false }) => {
    const payload = {
      ...newItem,
      year: newItem.year || new Date().getFullYear().toString(),
      client: newItem.client || "Self Project / Art",
      addToChoices: options.addToChoices ? 1 : 0,
    };

    try {
      const res = await fetch("/api/posters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedItem = await res.json();
        setPosters((prev) => [savedItem, ...prev]);

        if (options.addToChoices) {
          const choiceItem = {
            id: `choice-${savedItem.id}`,
            title: (savedItem.title || "ART PIECE").toUpperCase(),
            tag: (savedItem.category || "CONCEPT").toUpperCase(),
            img: savedItem.img,
          };
          setChoices((prev) => [choiceItem, ...prev]);
        }
        return savedItem;
      }
    } catch (err) {
      console.warn("SQLite POST failed, saving locally:", err.message);
    }

    // Local fallback
    const id = Date.now();
    const fallbackItem = { id, ...payload };
    if (options.addToShowcase !== false) {
      setPosters((prev) => [fallbackItem, ...prev]);
    }
    if (options.addToChoices) {
      const choiceItem = {
        id: `choice-${id}`,
        title: (fallbackItem.title || "ART PIECE").toUpperCase(),
        tag: (fallbackItem.category || "CONCEPT").toUpperCase(),
        img: fallbackItem.img,
      };
      setChoices((prev) => [choiceItem, ...prev]);
    }
    return fallbackItem;
  };

  // Update existing poster
  const updatePoster = async (id, updatedFields) => {
    try {
      await fetch(`/api/posters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.warn("SQLite PUT failed, updating locally:", err.message);
    }

    setPosters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  // Delete poster
  const deletePoster = async (id) => {
    try {
      await fetch(`/api/posters/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("SQLite DELETE failed, deleting locally:", err.message);
    }

    setPosters((prev) => prev.filter((item) => item.id !== id));
  };

  // Update entire hero configuration or specific fields
  const updateHeroData = async (newHeroFields) => {
    const updated = {
      ...heroData,
      ...newHeroFields,
      featuredLook: {
        ...heroData.featuredLook,
        ...(newHeroFields.featuredLook || {}),
      },
    };
    setHeroData(updated);

    try {
      await fetch("/api/settings/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn("Could not sync heroData with SQLite:", err.message);
    }
    return updated;
  };

  // Update only the featured look artwork (badge, title, category, img, tag)
  const updateFeaturedLook = async (featuredFields) => {
    const updatedLook = {
      ...heroData.featuredLook,
      ...featuredFields,
    };
    const updatedHero = {
      ...heroData,
      featuredLook: updatedLook,
    };
    setHeroData(updatedHero);

    try {
      await fetch("/api/settings/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHero),
      });
    } catch (err) {
      console.warn("Could not sync featuredLook with SQLite:", err.message);
    }
    return updatedHero;
  };

  // Reset to original built-in collection
  const resetToDefaults = () => {
    setPosters(defaultPosterShowcase);
    setChoices(defaultChoices);
    setHeroData(defaultHeroData);
    localStorage.removeItem(STORAGE_KEY_POSTERS);
    localStorage.removeItem(STORAGE_KEY_CHOICES);
    localStorage.removeItem(STORAGE_KEY_HERO);
  };

  // Export full JSON config
  const exportAllData = () => {
    const data = {
      heroData,
      choices,
      posters,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `graphics_collection_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON config
  const importData = (jsonData) => {
    try {
      const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      if (parsed.posters && Array.isArray(parsed.posters)) {
        setPosters(parsed.posters);
      }
      if (parsed.choices && Array.isArray(parsed.choices)) {
        setChoices(parsed.choices);
      }
      if (parsed.heroData) {
        setHeroData(parsed.heroData);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <GraphicsContext.Provider
      value={{
        posters,
        choices,
        heroData,
        isServerConnected,
        trustBadges: defaultTrustBadges,
        uploadImageFile,
        uploadBulkImages,
        addPoster,
        updatePoster,
        deletePoster,
        updateHeroData,
        updateFeaturedLook,
        resetToDefaults,
        exportAllData,
        importData,
      }}
    >
      {children}
    </GraphicsContext.Provider>
  );
}

export function useGraphics() {
  const ctx = useContext(GraphicsContext);
  if (!ctx) {
    throw new Error("useGraphics must be used within a GraphicsProvider");
  }
  return ctx;
}
