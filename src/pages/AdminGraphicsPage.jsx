import { useState, useRef, useEffect } from "react";
import { useGraphics } from "../context/GraphicsContext";

function AdminGraphicsPage({ navigate }) {
  const {
    posters,
    choices,
    heroData,
    isServerConnected,
    uploadImageFile,
    uploadBulkImages,
    addPoster,
    updatePoster,
    deletePoster,
    updateFeaturedLook,
    resetToDefaults,
    exportAllData,
    importData,
  } = useGraphics();

  // Mode tab: 'single' vs 'bulk' vs 'featured'
  const [uploadMode, setUploadMode] = useState("single");

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("philip_studio_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Single Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Posters");
  const [customCategory, setCustomCategory] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [addToShowcase, setAddToShowcase] = useState(true);
  const [addToChoices, setAddToChoices] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState("");

  // Bulk Upload Form State
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkTitlePrefix, setBulkTitlePrefix] = useState("");
  const [bulkCategory, setBulkCategory] = useState("Posters");
  const [bulkCustomCategory, setBulkCustomCategory] = useState("");
  const [bulkClient, setBulkClient] = useState("Studio Concept");
  const [bulkYear, setBulkYear] = useState(new Date().getFullYear().toString());
  const [bulkDescription, setBulkDescription] = useState("");
  const [bulkAddToChoices, setBulkAddToChoices] = useState(false);
  const [bulkReport, setBulkReport] = useState(null);

  // Featured Artwork Form State
  const [featBadge, setFeatBadge] = useState(
    () => heroData?.featuredLook?.badge || "Featured Work",
  );
  const [featTitle, setFeatTitle] = useState(
    () => heroData?.featuredLook?.title || "Cyberpunk Art Poster",
  );
  const [featCategory, setFeatCategory] = useState(
    () => heroData?.featuredLook?.category || "Visual Storytelling",
  );
  const [featImg, setFeatImg] = useState(
    () => heroData?.featuredLook?.img || "/assets/graphics/gfx-hero-poster.jpg",
  );
  const [featSelectedFile, setFeatSelectedFile] = useState(null);
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);
  const featFileInputRef = useRef(null);

  // Sync featured form state when heroData loads
  useEffect(() => {
    if (heroData?.featuredLook) {
      setFeatBadge(heroData.featuredLook.badge || "Featured Work");
      setFeatTitle(heroData.featuredLook.title || "");
      setFeatCategory(heroData.featuredLook.category || "Visual Storytelling");
      setFeatImg(heroData.featuredLook.img || "");
    }
  }, [heroData]);

  // JSON Import modal state
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");

  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  // Custom Modal Dialog State (replacing window.alert and window.confirm)
  const [modalDialog, setModalDialog] = useState(null); // { type: 'alert'|'confirm', title, message, onConfirm }

  const showAlert = (message, title = "Notice") => {
    console.log(`[Studio Modal] Alert shown: "${title}" - ${message}`);
    setModalDialog({ type: "alert", title, message });
  };

  const showConfirm = (message, onConfirm, title = "Please Confirm") => {
    console.log(`[Studio Modal] Confirm prompt: "${title}" - ${message}`);
    setModalDialog({ type: "confirm", title, message, onConfirm });
  };

  const closeModalDialog = () => {
    setModalDialog(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("[AdminAuth] Attempting login...");
    if (
      passcode.trim() === "1234" ||
      passcode.trim().toLowerCase() === "philip" ||
      passcode.trim().toLowerCase() === "admin"
    ) {
      console.log("[AdminAuth] Login successful.");
      setIsAuthenticated(true);
      sessionStorage.setItem("philip_studio_auth", "true");
      setAuthError(false);
    } else {
      console.warn("[AdminAuth] Invalid passcode entered.");
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    console.log("[AdminAuth] Logging out.");
    setIsAuthenticated(false);
    sessionStorage.removeItem("philip_studio_auth");
  };

  const showToast = (msg) => {
    console.log(`[Studio Toast] ${msg}`);
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  // Image file selection handler (Single)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(
      `[Studio FilePicker] Single file chosen: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    );
    if (file.size > 50 * 1024 * 1024) {
      showAlert(
        "Image is larger than 50MB. Please choose a smaller file.",
        "File Too Large",
      );
      return;
    }

    setSelectedFile(file);

    // Show instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImgUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Bulk Image files handler
  const handleBulkFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    console.log(
      `[Studio BulkPicker] ${files.length} file(s) selected:`,
      files.map((f) => f.name),
    );
    setBulkFiles(files);
    setBulkReport(null);
  };

  const resetForm = () => {
    console.log("[Studio Form] Resetting single form.");
    setTitle("");
    setCategory("Posters");
    setCustomCategory("");
    setClient("");
    setYear(new Date().getFullYear().toString());
    setDescription("");
    setImgUrl("");
    setSelectedFile(null);
    setAddToShowcase(true);
    setAddToChoices(true);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (item) => {
    console.log(
      `[Studio Form] Starting edit for artwork id=${item.id} "${item.title}"`,
    );
    setUploadMode("single");
    setEditingId(item.id);
    setTitle(item.title || "");
    setCategory(
      [
        "Posters",
        "Logos",
        "Art & Illustration",
        "Typography",
        "3D / Visual",
      ].includes(item.category)
        ? item.category
        : "Other",
    );
    if (
      ![
        "Posters",
        "Logos",
        "Art & Illustration",
        "Typography",
        "3D / Visual",
      ].includes(item.category)
    ) {
      setCustomCategory(item.category || "");
    }
    setClient(item.client || "");
    setYear(item.year || "");
    setDescription(item.description || "");
    setImgUrl(item.img || "");
    setSelectedFile(null);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  // Single Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`[Studio Form] Submitting single artwork "${title}"...`);
    if (!title.trim()) {
      showAlert("Please provide a title for the art.", "Missing Title");
      return;
    }
    if (!imgUrl.trim() && !selectedFile) {
      showAlert(
        "Please choose an image file or paste an image URL.",
        "Missing Image",
      );
      return;
    }

    setIsUploading(true);
    let finalImageUrl = imgUrl;

    try {
      if (selectedFile) {
        finalImageUrl = await uploadImageFile(selectedFile);
      }

      const finalCategory =
        category === "Other" && customCategory.trim()
          ? customCategory.trim()
          : category;

      if (editingId) {
        await updatePoster(editingId, {
          title: title.trim(),
          category: finalCategory,
          client: client.trim() || "Independent Artwork",
          year: year.trim() || new Date().getFullYear().toString(),
          description: description.trim() || "Creative visual project.",
          img: finalImageUrl,
        });
        showToast("✨ Artwork updated in SQLite database!");
        resetForm();
      } else {
        await addPoster(
          {
            title: title.trim(),
            category: finalCategory,
            client: client.trim() || "Independent Artwork",
            year: year.trim() || new Date().getFullYear().toString(),
            description: description.trim() || "Creative visual project.",
            img: finalImageUrl,
          },
          {
            addToShowcase,
            addToChoices,
          },
        );
        showToast("🎉 New poster published to SQLite database!");
        resetForm();
      }
    } catch (err) {
      console.error("[Studio Form] Error saving poster:", err);
      showAlert("Error saving poster: " + err.message, "Upload Error");
    } finally {
      setIsUploading(false);
    }
  };

  // Bulk Upload Submit
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    console.log(
      `[Studio Bulk] Submitting batch of ${bulkFiles.length} files...`,
    );
    if (bulkFiles.length === 0) {
      showAlert(
        "Please select one or more image files to upload.",
        "No Files Selected",
      );
      return;
    }

    setIsUploading(true);
    setBulkReport(null);

    const finalCategory =
      bulkCategory === "Other" && bulkCustomCategory.trim()
        ? bulkCustomCategory.trim()
        : bulkCategory;

    try {
      const result = await uploadBulkImages(bulkFiles, {
        titlePrefix: bulkTitlePrefix.trim(),
        category: finalCategory,
        client: bulkClient.trim() || "Studio Collection",
        year: bulkYear.trim() || new Date().getFullYear().toString(),
        description: bulkDescription.trim() || "Part of creative collection.",
        addToChoices: bulkAddToChoices,
      });

      console.log("[Studio Bulk] Result received:", result);
      setBulkReport(result);
      if (result.insertedCount > 0) {
        showToast(
          `🎉 ${result.insertedCount} artwork(s) added! (${result.skippedCount} duplicate(s) skipped)`,
        );
      } else {
        showToast(
          `⚠️ All ${result.skippedCount} images already existed in database (skipped).`,
        );
      }

      // Reset bulk file input
      setBulkFiles([]);
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
    } catch (err) {
      console.error("[Studio Bulk] Bulk upload failed:", err);
      showAlert("Bulk upload failed: " + err.message, "Bulk Upload Error");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle featured image file picker
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      showAlert(
        "Image is larger than 50MB. Please choose a smaller file.",
        "File Too Large",
      );
      return;
    }
    setFeatSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setFeatImg(event.target.result);
    reader.readAsDataURL(file);
  };

  // Quick select an existing poster to populate featured artwork
  const handleSelectPosterAsFeatured = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const item = posters.find((p) => String(p.id) === String(selectedId));
    if (item) {
      setFeatTitle(item.title);
      setFeatCategory(item.category || "Visual Storytelling");
      setFeatImg(item.img);
      setFeatSelectedFile(null);
    }
  };

  // Submit Featured Artwork changes
  const handleSaveFeatured = async (e) => {
    e.preventDefault();
    if (!featTitle.trim()) {
      showAlert(
        "Please enter a title for the featured artwork.",
        "Missing Title",
      );
      return;
    }
    if (!featImg.trim() && !featSelectedFile) {
      showAlert(
        "Please choose an image or enter an image URL.",
        "Missing Image",
      );
      return;
    }

    setIsSavingFeatured(true);
    try {
      let finalImg = featImg;
      if (featSelectedFile) {
        finalImg = await uploadImageFile(featSelectedFile);
      }

      await updateFeaturedLook({
        badge: featBadge.trim() || "Featured Work",
        title: featTitle.trim(),
        category: featCategory.trim() || "Visual Storytelling",
        img: finalImg,
      });

      showToast("🌟 Hero Featured Artwork updated successfully!");
    } catch (err) {
      console.error(
        "[Studio Featured] Failed to update featured artwork:",
        err,
      );
      showAlert(
        "Failed to update featured artwork: " + err.message,
        "Update Error",
      );
    } finally {
      setIsSavingFeatured(false);
    }
  };

  // Quick feature button directly on gallery poster cards
  const handleQuickFeature = async (item) => {
    try {
      await updateFeaturedLook({
        badge: featBadge || "Featured Work",
        title: item.title,
        category: item.category || "Visual Storytelling",
        img: item.img,
      });
      setFeatTitle(item.title);
      setFeatCategory(item.category || "Visual Storytelling");
      setFeatImg(item.img);
      setFeatSelectedFile(null);
      showToast(`⭐ "${item.title}" is now set as the Hero Featured Artwork!`);
    } catch (err) {
      showAlert("Error setting featured artwork: " + err.message, "Error");
    }
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    console.log("[Studio JSON] Importing raw JSON configuration...");
    const result = importData(rawJsonText);
    if (result.success) {
      showToast("✅ Collection imported successfully!");
      setShowJsonModal(false);
      setRawJsonText("");
    } else {
      showAlert("Import error: " + result.error, "JSON Import Error");
    }
  };

  // ── PASSCODE LOCK SCREEN ──
  if (!isAuthenticated) {
    return (
      <main className="studio-admin-wrapper">
        <div className="studio-lock-card">
          <h2 className="studio-lock-title">Philip Studio Manager</h2>
          <p className="studio-lock-subtitle">
            Enter your access code to manage your posters & graphics portfolio.
          </p>

          <form onSubmit={handleLogin} className="studio-lock-form">
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setAuthError(false);
              }}
              className={`studio-input ${authError ? "studio-input-error" : ""}`}
              autoFocus
            />
            {authError && (
              <span className="studio-error-msg">
                Incorrect passcode. Try <strong>1234</strong> or{" "}
                <strong>philip</strong>.
              </span>
            )}
            <button type="submit" className="studio-btn-primary">
              Unlock Studio
            </button>
          </form>

          <div className="studio-lock-footer">
            <button
              type="button"
              className="studio-text-link"
              onClick={() => navigate("blog")}
            >
              ← Back to Graphics Page
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── AUTHENTICATED STUDIO DASHBOARD ──
  return (
    <main className="studio-admin-wrapper">
      {/* Toast Notification */}
      {notification && (
        <div className="studio-toast-banner">{notification}</div>
      )}

      {/* Studio Header Bar */}
      <section className="studio-topbar">
        <div className="studio-topbar-left">
          <div className="studio-badge">STUDIO CMS</div>
          <h1 className="studio-header-title">Poster & Art Manager</h1>
          <p className="studio-header-desc">
            Upload new posters, manage showcase items, and reorder artwork
            instantly.
          </p>
        </div>

        <div className="studio-topbar-actions">
          <button
            type="button"
            className="studio-btn-outline"
            onClick={() => navigate("blog")}
          >
            👁️ View Live Gallery
          </button>
          <button
            type="button"
            className="studio-btn-outline"
            onClick={exportAllData}
            title="Download JSON backup"
          >
            💾 Export JSON
          </button>
          <button
            type="button"
            className="studio-btn-outline"
            onClick={() => setShowJsonModal(true)}
            title="Import JSON backup"
          >
            📥 Import JSON
          </button>
          <button
            type="button"
            className="studio-btn-logout"
            onClick={handleLogout}
          >
            Lock 🔒
          </button>
        </div>
      </section>

      {/* Main Grid: Form Left, Active Posters List Right */}
      <div className="studio-grid-layout">
        {/* ── LEFT: ADD / EDIT POSTER FORM (SINGLE & BULK TABS) ── */}
        <section className="studio-form-card">
          {/* Tab Switcher */}
          {!editingId && (
            <div className="studio-tab-row">
              <button
                type="button"
                className={`studio-tab-btn ${uploadMode === "single" ? "active" : ""}`}
                onClick={() => setUploadMode("single")}
              >
                ✨ Single Upload
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${uploadMode === "bulk" ? "active" : ""}`}
                onClick={() => setUploadMode("bulk")}
              >
                📦 Bulk Upload (
                {bulkFiles.length > 0 ? `${bulkFiles.length} files` : "Batch"})
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${uploadMode === "featured" ? "active" : ""}`}
                onClick={() => setUploadMode("featured")}
              >
                ⭐ Featured Art
              </button>
            </div>
          )}

          {/* 1. SINGLE UPLOAD FORM */}
          {uploadMode === "single" && (
            <>
              <div className="studio-form-header">
                <h3>
                  {editingId ? "✏️ Edit Artwork" : "✨ Add New Poster / Art"}
                </h3>
                {editingId && (
                  <button
                    type="button"
                    className="studio-cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel Edit ✕
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="studio-form">
                {/* Title */}
                <div className="studio-field">
                  <label className="studio-label">Artwork Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Neo Tokyo Nights Poster"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="studio-input"
                    required
                  />
                </div>

                {/* Category & Year Row */}
                <div className="studio-row-2">
                  <div className="studio-field">
                    <label className="studio-label">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="studio-input studio-select"
                    >
                      <option value="Posters">Posters</option>
                      <option value="Logos">Logos</option>
                      <option value="Art & Illustration">
                        Art & Illustration
                      </option>
                      <option value="Typography">Typography</option>
                      <option value="3D / Visual">3D / Visual</option>
                      <option value="Other">Other / Custom</option>
                    </select>
                  </div>

                  <div className="studio-field">
                    <label className="studio-label">Year</label>
                    <input
                      type="text"
                      placeholder="2025"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="studio-input"
                    />
                  </div>
                </div>

                {category === "Other" && (
                  <div className="studio-field">
                    <label className="studio-label">Custom Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Packaging, Banner, 3D Render"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="studio-input"
                    />
                  </div>
                )}

                {/* Client / Project Tag */}
                <div className="studio-field">
                  <label className="studio-label">
                    Client / Context / Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Editorial Poster, Studio Concept, Self Project"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="studio-input"
                  />
                </div>

                {/* Description */}
                <div className="studio-field">
                  <label className="studio-label">Brief Description</label>
                  <textarea
                    placeholder="Describe typography, style, lighting, or inspiration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="studio-input studio-textarea"
                    rows={3}
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="studio-field">
                  <label className="studio-label">Artwork Image *</label>
                  <div className="studio-image-source-box">
                    <div className="studio-file-picker-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageFileChange}
                        className="studio-file-input"
                        id="poster-file-upload"
                      />
                      <label
                        htmlFor="poster-file-upload"
                        className="studio-file-label"
                      >
                        📁{" "}
                        {selectedFile
                          ? selectedFile.name
                          : "Choose Image from Computer"}
                      </label>
                    </div>

                    <div className="studio-or-divider">
                      OR paste image URL / path:
                    </div>

                    <input
                      type="text"
                      placeholder="/assets/my-poster.jpg or https://..."
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                      className="studio-input"
                    />
                  </div>

                  {imgUrl && (
                    <div className="studio-img-preview-card">
                      <span className="studio-preview-tag">Preview:</span>
                      <div className="studio-preview-frame">
                        <img
                          src={imgUrl}
                          alt="Preview"
                          className="studio-preview-img"
                          onError={(e) => {
                            if (!e.target.dataset.errorHandled) {
                              e.target.dataset.errorHandled = "true";
                              e.target.style.opacity = "0.5";
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!editingId && (
                  <div className="studio-placement-box">
                    <label className="studio-checkbox-label">
                      <input
                        type="checkbox"
                        checked={addToShowcase}
                        onChange={(e) => setAddToShowcase(e.target.checked)}
                      />
                      <span>Include in Visual Showcase Grid</span>
                    </label>

                    <label className="studio-checkbox-label">
                      <input
                        type="checkbox"
                        checked={addToChoices}
                        onChange={(e) => setAddToChoices(e.target.checked)}
                      />
                      <span>Include in "A Few Choices" Marquee Carousel</span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="studio-btn-submit"
                  disabled={isUploading}
                >
                  {isUploading
                    ? "⏳ Saving..."
                    : editingId
                      ? "💾 Save Artwork Changes"
                      : "🚀 Publish Poster to Gallery"}
                </button>
              </form>
            </>
          )}

          {/* 2. BULK BATCH UPLOAD FORM */}
          {uploadMode === "bulk" && !editingId && (
            <>
              <div className="studio-form-header">
                <div>
                  <h3>📦 Bulk Batch Upload</h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Select multiple pictures at once. Existing pictures with
                    identical names will be skipped automatically!
                  </p>
                </div>
              </div>

              <form onSubmit={handleBulkSubmit} className="studio-form">
                {/* File picker for multiple pictures */}
                <div className="studio-field">
                  <label className="studio-label">
                    Select Multiple Images *
                  </label>
                  <div className="studio-file-picker-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={bulkFileInputRef}
                      onChange={handleBulkFilesChange}
                      className="studio-file-input"
                      id="bulk-poster-upload"
                      required
                    />
                    <label
                      htmlFor="bulk-poster-upload"
                      className="studio-file-label"
                      style={{
                        padding: "20px 16px",
                        background: "rgba(229, 9, 20, 0.05)",
                        borderColor: "rgba(229, 9, 20, 0.3)",
                      }}
                    >
                      {bulkFiles.length > 0
                        ? `📁 ${bulkFiles.length} file(s) selected (Click to change)`
                        : "📁 Click to select multiple images (or drag them here)"}
                    </label>
                  </div>
                </div>

                {/* Common Title/Name Prefix */}
                <div className="studio-field">
                  <label className="studio-label">
                    Name / Title to Re-use (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brand Poster Series (or leave empty to use file names)"
                    value={bulkTitlePrefix}
                    onChange={(e) => setBulkTitlePrefix(e.target.value)}
                    className="studio-input"
                  />
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    If provided, all artworks in this batch will cleanly use
                    this title.
                  </span>
                </div>

                {/* Shared Category & Year */}
                <div className="studio-row-2">
                  <div className="studio-field">
                    <label className="studio-label">Category to Re-use</label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="studio-input studio-select"
                    >
                      <option value="Posters">Posters</option>
                      <option value="Logos">Logos</option>
                      <option value="Art & Illustration">
                        Art & Illustration
                      </option>
                      <option value="Typography">Typography</option>
                      <option value="3D / Visual">3D / Visual</option>
                      <option value="Other">Other / Custom</option>
                    </select>
                  </div>

                  <div className="studio-field">
                    <label className="studio-label">Year</label>
                    <input
                      type="text"
                      placeholder="2025"
                      value={bulkYear}
                      onChange={(e) => setBulkYear(e.target.value)}
                      className="studio-input"
                    />
                  </div>
                </div>

                {bulkCategory === "Other" && (
                  <div className="studio-field">
                    <label className="studio-label">Custom Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Streetwear, 3D Art"
                      value={bulkCustomCategory}
                      onChange={(e) => setBulkCustomCategory(e.target.value)}
                      className="studio-input"
                    />
                  </div>
                )}

                {/* Shared Context / Client */}
                <div className="studio-field">
                  <label className="studio-label">
                    Context / Client to Re-use
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Studio Concept / Art Collection"
                    value={bulkClient}
                    onChange={(e) => setBulkClient(e.target.value)}
                    className="studio-input"
                  />
                </div>

                {/* Shared Description */}
                <div className="studio-field">
                  <label className="studio-label">
                    Shared Description (Optional)
                  </label>
                  <textarea
                    placeholder="Shared note or description for this entire batch..."
                    value={bulkDescription}
                    onChange={(e) => setBulkDescription(e.target.value)}
                    className="studio-input studio-textarea"
                    rows={2}
                  />
                </div>

                {/* Checkbox for Marquee */}
                <div className="studio-placement-box">
                  <label className="studio-checkbox-label">
                    <input
                      type="checkbox"
                      checked={bulkAddToChoices}
                      onChange={(e) => setBulkAddToChoices(e.target.checked)}
                    />
                    <span>
                      Include batch in "A Few Choices" Marquee Carousel
                    </span>
                  </label>
                </div>

                {/* Bulk Report Summary Box */}
                {bulkReport && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "var(--bg-card-hover)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <strong>Batch Result:</strong> {bulkReport.insertedCount}{" "}
                      added, {bulkReport.skippedCount} skipped (duplicates).
                    </div>
                    {bulkReport.skippedCount > 0 && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: "0.75rem",
                          color: "#ff9500",
                        }}
                      >
                        ⚠️ Skipped files already in database:{" "}
                        {bulkReport.skipped
                          .map((s) => s.originalFilename)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="studio-btn-submit"
                  disabled={isUploading || bulkFiles.length === 0}
                >
                  {isUploading
                    ? `⏳ Uploading & Checking ${bulkFiles.length} images...`
                    : `🚀 Upload ${bulkFiles.length || ""} Pictures (Skip Duplicates)`}
                </button>
              </form>
            </>
          )}

          {/* 3. FEATURED ARTWORK HERO FORM */}
          {uploadMode === "featured" && !editingId && (
            <>
              <div className="studio-form-header">
                <div>
                  <h3>⭐ Hero Featured Artwork</h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Customize the spotlight piece shown prominently in your Hero
                    banner card.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveFeatured} className="studio-form">
                {/* Pick existing poster shortcut */}
                {posters.length > 0 && (
                  <div
                    className="studio-field"
                    style={{
                      background: "rgba(255, 149, 0, 0.08)",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(255, 149, 0, 0.25)",
                    }}
                  >
                    <label
                      className="studio-label"
                      style={{ color: "#ff9500", fontWeight: 700 }}
                    >
                      ⚡ Quick Pick from Existing Gallery Art
                    </label>
                    <select
                      onChange={handleSelectPosterAsFeatured}
                      defaultValue=""
                      className="studio-input studio-select"
                    >
                      <option value="" disabled>
                        -- Select an artwork from gallery to auto-fill --
                      </option>
                      {posters.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Badge Label */}
                <div className="studio-field">
                  <label className="studio-label">Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Featured Work, Spotlight ✦, Pro Series"
                    value={featBadge}
                    onChange={(e) => setFeatBadge(e.target.value)}
                    className="studio-input"
                  />
                </div>

                {/* Title */}
                <div className="studio-field">
                  <label className="studio-label">Artwork Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cyberpunk Art Poster"
                    value={featTitle}
                    onChange={(e) => setFeatTitle(e.target.value)}
                    className="studio-input"
                    required
                  />
                </div>

                {/* Category */}
                <div className="studio-field">
                  <label className="studio-label">Category / Subheading</label>
                  <input
                    type="text"
                    placeholder="e.g. Visual Storytelling, 3D Render"
                    value={featCategory}
                    onChange={(e) => setFeatCategory(e.target.value)}
                    className="studio-input"
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="studio-field">
                  <label className="studio-label">
                    Featured Artwork Image *
                  </label>
                  <div className="studio-image-source-box">
                    <div className="studio-file-picker-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        ref={featFileInputRef}
                        onChange={handleFeaturedImageChange}
                        className="studio-file-input"
                        id="feat-file-upload"
                      />
                      <label
                        htmlFor="feat-file-upload"
                        className="studio-file-label"
                      >
                        📁{" "}
                        {featSelectedFile
                          ? featSelectedFile.name
                          : "Choose New Image from Computer"}
                      </label>
                    </div>

                    <div className="studio-or-divider">
                      OR paste image URL / path:
                    </div>

                    <input
                      type="text"
                      placeholder="/assets/graphics/... or https://..."
                      value={featImg}
                      onChange={(e) => setFeatImg(e.target.value)}
                      className="studio-input"
                    />
                  </div>

                  {featImg && (
                    <div
                      className="studio-img-preview-card"
                      style={{ marginTop: 14 }}
                    >
                      <span className="studio-preview-tag">
                        Hero Card Live Preview:
                      </span>
                      <div
                        style={{
                          background:
                            "linear-gradient(145deg, #450810, #220307)",
                          padding: "16px",
                          borderRadius: "18px",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          marginTop: "8px",
                          maxWidth: "320px",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 9999,
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {featBadge || "FEATURED WORK"}
                        </div>
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "4/3",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "rgba(0,0,0,0.3)",
                          }}
                        >
                          <img
                            src={featImg}
                            alt="Featured Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              if (!e.target.dataset.errorHandled) {
                                e.target.dataset.errorHandled = "true";
                                e.target.style.opacity = "0.5";
                              }
                            }}
                          />
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.7)",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            {featCategory || "Visual Storytelling"}
                          </span>
                          <h4
                            style={{
                              color: "#fff",
                              margin: "3px 0 0 0",
                              fontSize: "1rem",
                              fontWeight: 800,
                            }}
                          >
                            {featTitle || "Untitled Artwork"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="studio-btn-submit"
                  disabled={isSavingFeatured}
                  style={{
                    background:
                      "linear-gradient(135deg, #ff9500 0%, #e50914 100%)",
                  }}
                >
                  {isSavingFeatured
                    ? "⏳ Saving Hero..."
                    : "🌟 Save as Hero Featured Artwork"}
                </button>
              </form>
            </>
          )}
        </section>

        {/* ── RIGHT: EXISTING POSTERS LIST ── */}
        <section className="studio-posters-list-card">
          <div className="studio-list-header">
            <div>
              <h3>Active Gallery Artworks</h3>
              <p className="studio-list-count">
                {posters.length} {posters.length === 1 ? "piece" : "pieces"}{" "}
                published
              </p>
            </div>
            <button
              type="button"
              className="studio-btn-danger-outline"
              onClick={() => {
                showConfirm(
                  "Are you sure you want to reset all gallery items to the original default collection? Any new artworks will be cleared.",
                  () => {
                    resetToDefaults();
                    showToast("Defaults restored.");
                  },
                  "Reset Gallery",
                );
              }}
            >
              Reset to Defaults
            </button>
          </div>

          <div className="studio-items-grid">
            {posters.map((item) => (
              <div key={item.id} className="studio-item-card">
                <div className="studio-item-thumbnail">
                  <img
                    src={item.img}
                    alt={item.title}
                    onError={(e) => {
                      if (!e.target.dataset.errorHandled) {
                        e.target.dataset.errorHandled = "true";
                        e.target.style.opacity = "0.5";
                      }
                    }}
                  />
                  <span className="studio-item-cat">{item.category}</span>
                </div>

                <div className="studio-item-details">
                  <h4 className="studio-item-title">{item.title}</h4>
                  <p className="studio-item-sub">
                    {item.client} • {item.year}
                  </p>
                  <p className="studio-item-desc">{item.description}</p>

                  <div className="studio-item-actions">
                    <button
                      type="button"
                      className="studio-action-btn feature"
                      onClick={() => handleQuickFeature(item)}
                      title="Set as Hero Featured Art"
                    >
                      ⭐ Feature
                    </button>
                    <button
                      type="button"
                      className="studio-action-btn edit"
                      onClick={() => startEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      className="studio-action-btn delete"
                      onClick={() => {
                        showConfirm(
                          `Are you sure you want to delete "${item.title}"?`,
                          async () => {
                            await deletePoster(item.id);
                            showToast("🗑️ Item deleted.");
                          },
                          "Delete Artwork",
                        );
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CUSTOM ALERT / CONFIRM MODAL DIALOG ── */}
      {modalDialog && (
        <div className="studio-modal-overlay" onClick={closeModalDialog}>
          <div
            className="studio-modal-content studio-dialog-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="studio-modal-header">
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {modalDialog.title}
              </h3>
              <button
                type="button"
                className="studio-modal-close"
                onClick={closeModalDialog}
              >
                ✕
              </button>
            </div>
            <p
              style={{
                margin: "1.2rem 0 1.8rem 0",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "var(--color-text-muted)",
              }}
            >
              {modalDialog.message}
            </p>
            <div className="studio-modal-actions">
              {modalDialog.type === "confirm" && (
                <button
                  type="button"
                  className="studio-btn-outline"
                  onClick={closeModalDialog}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                className="studio-btn-primary"
                style={{ width: "auto", padding: "10px 24px" }}
                onClick={() => {
                  if (modalDialog.onConfirm) {
                    modalDialog.onConfirm();
                  }
                  closeModalDialog();
                }}
              >
                {modalDialog.type === "confirm" ? "Confirm" : "Okay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT JSON MODAL ── */}
      {showJsonModal && (
        <div
          className="studio-modal-overlay"
          onClick={() => setShowJsonModal(false)}
        >
          <div
            className="studio-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="studio-modal-header">
              <h3>📥 Import Posters JSON Backup</h3>
              <button
                type="button"
                className="studio-modal-close"
                onClick={() => setShowJsonModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="studio-modal-sub">
              Paste the exported JSON data below to restore or replace your
              gallery collection.
            </p>
            <form onSubmit={handleImportSubmit}>
              <textarea
                className="studio-json-textarea"
                rows={10}
                placeholder="Paste JSON configuration here..."
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                required
              />
              <div className="studio-modal-actions">
                <button
                  type="button"
                  className="studio-btn-outline"
                  onClick={() => setShowJsonModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="studio-btn-primary">
                  Import & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminGraphicsPage;
