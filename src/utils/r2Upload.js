/**
 * Direct Browser-to-Cloudflare R2 Upload via Presigned URL
 * Allows uploading large video or image files directly to Cloudflare without overloading Express.
 */
export async function uploadToR2(file, folder = "videos", onProgress = null) {
  if (!file) throw new Error("No file selected.");

  // 1. Request presigned PUT URL from Express backend
  const response = await fetch("/api/r2/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "video/mp4",
      folder,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server responded with ${response.status}`);
  }

  const { uploadUrl, publicUrl, key } = await response.json();

  // 2. Upload file directly to Cloudflare R2 with progress tracking
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    if (file.type) {
      xhr.setRequestHeader("Content-Type", file.type);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Cloudflare R2 upload failed with HTTP status ${xhr.status}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error while uploading directly to Cloudflare R2. Please ensure R2 bucket CORS allows PUT from this origin.",
        ),
      );
    };

    xhr.send(file);
  });

  return { publicUrl, key, fileName: file.name };
}
