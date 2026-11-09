import React from "react";

/**
 * Checks whether a URL is a direct video file (MP4, WebM, MOV, Cloudflare R2)
 * versus an embed URL (YouTube, Vimeo)
 */
export function isDirectVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".m4v") ||
    url.includes(".r2.dev/") ||
    url.includes(".cloudflarestorage.com/")
  );
}

/**
 * Universal video player component that seamlessly handles:
 * 1. Direct Cloudflare R2 uploaded videos (HTML5 <video> with custom controls)
 * 2. YouTube & Vimeo embed iframes
 */
export default function StudioVideoPlayer({
  src,
  title = "Video Player",
  className = "",
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  poster = "",
}) {
  if (!src) {
    return (
      <div className={`studio-video-empty ${className}`}>
        <span>No video source provided</span>
      </div>
    );
  }

  if (isDirectVideoUrl(src)) {
    return (
      <video
        src={src}
        title={title}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        poster={poster}
        controlsList={!controls ? "nodownload nofullscreen noremoteplayback" : undefined}
        disablePictureInPicture={!controls}
        onContextMenu={!controls ? (e) => e.preventDefault() : undefined}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: controls ? "auto" : "none",
        }}
      />
    );
  }

  // Handle Embeds (YouTube / Vimeo) without controls if controls={false}
  let embedUrl = src;
  if (!controls) {
    if (embedUrl.includes("youtube.com/embed/")) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      embedUrl = `${embedUrl}${separator}controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&modestbranding=1`;
    } else if (embedUrl.includes("player.vimeo.com/video/")) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      embedUrl = `${embedUrl}${separator}background=1&controls=0`;
    }
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen={controls}
      style={{
        border: "none",
        width: "100%",
        height: "100%",
        pointerEvents: controls ? "auto" : "none",
      }}
    />
  );
}
