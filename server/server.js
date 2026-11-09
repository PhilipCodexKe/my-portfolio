import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import db from "./db.js";
import { seedDatabaseIfEmpty } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Cloudflare R2 Client Setup
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const app = express();
const PORT = process.env.PORT || 5000;

// Seed initial artworks if table is empty
seedDatabaseIfEmpty();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max per file
    fieldSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));
app.use("/uploads", express.static(uploadsDir));

// Detailed request logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  res.on("finish", () => {
    console.log(`✅ [${new Date().toLocaleTimeString()}] ${req.method} ${req.url} -> Status: ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// ─── 1. POST /api/upload (Upload single image file to server) ───
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      originalFilename: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 1B. POST /api/upload-bulk (Upload multiple images with duplicate skipping) ───
app.post("/api/upload-bulk", upload.array("images", 50), (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No image files provided." });
    }

    const {
      titlePrefix = "",
      category = "Posters",
      client = "Studio Project",
      year = new Date().getFullYear().toString(),
      description = "",
      addToChoices = 0,
    } = req.body;

    const inserted = [];
    const skipped = [];

    // Prepared statements for duplicate check and insertion
    const checkDuplicate = db.prepare(`
      SELECT id, title, originalFilename FROM posters 
      WHERE originalFilename = ?
    `);

    const insertStmt = db.prepare(`
      INSERT INTO posters (title, category, client, year, description, img, originalFilename, addToChoices)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const file of files) {
      const origName = file.originalname;
      const cleanBaseName = path.parse(origName).name;
      
      // Determine final title: strictly use user input titlePrefix if provided, otherwise fallback to clean filename
      const finalTitle = titlePrefix.trim()
        ? titlePrefix.trim()
        : cleanBaseName;

      // Duplicate checking: check if original filename already exists
      const existing = checkDuplicate.get(origName);

      if (existing) {
        // Delete the newly uploaded file to avoid disk waste
        const uploadedFilePath = path.join(uploadsDir, file.filename);
        if (fs.existsSync(uploadedFilePath)) {
          try {
            fs.unlinkSync(uploadedFilePath);
          } catch (e) {
            console.warn("Could not remove duplicate file:", e.message);
          }
        }
        skipped.push({
          originalFilename: origName,
          title: finalTitle,
          reason: "Artwork with this name/file already exists in database",
        });
      } else {
        // Insert new poster
        const imageUrl = `/uploads/${file.filename}`;
        const info = insertStmt.run(
          finalTitle,
          category,
          client,
          year,
          description,
          imageUrl,
          origName,
          addToChoices ? 1 : 0
        );

        const newRecord = db
          .prepare("SELECT * FROM posters WHERE id = ?")
          .get(info.lastInsertRowid);

        inserted.push(newRecord);
      }
    }

    res.json({
      success: true,
      totalReceived: files.length,
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 2. GET /api/posters (Fetch all posters from SQLite) ───
app.get("/api/posters", (req, res) => {
  try {
    const posters = db.prepare("SELECT * FROM posters ORDER BY id DESC").all();
    res.json(posters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 3. POST /api/posters (Create new poster in SQLite) ───
app.post("/api/posters", (req, res) => {
  try {
    const {
      title,
      category = "Posters",
      client = "Independent Project",
      year = new Date().getFullYear().toString(),
      description = "",
      img,
      addToChoices = 0,
    } = req.body;

    if (!title || !img) {
      return res.status(400).json({ error: "Title and Image are required." });
    }

    const stmt = db.prepare(`
      INSERT INTO posters (title, category, client, year, description, img, addToChoices)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      title,
      category,
      client,
      year,
      description,
      img,
      addToChoices ? 1 : 0
    );

    const newPoster = db
      .prepare("SELECT * FROM posters WHERE id = ?")
      .get(info.lastInsertRowid);

    res.status(201).json(newPoster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 4. PUT /api/posters/:id (Update poster) ───
app.put("/api/posters/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, client, year, description, img, addToChoices } =
      req.body;

    const stmt = db.prepare(`
      UPDATE posters
      SET title = COALESCE(?, title),
          category = COALESCE(?, category),
          client = COALESCE(?, client),
          year = COALESCE(?, year),
          description = COALESCE(?, description),
          img = COALESCE(?, img),
          addToChoices = COALESCE(?, addToChoices)
      WHERE id = ?
    `);

    stmt.run(
      title,
      category,
      client,
      year,
      description,
      img,
      addToChoices !== undefined ? (addToChoices ? 1 : 0) : null,
      id
    );

    const updated = db.prepare("SELECT * FROM posters WHERE id = ?").get(id);
    if (!updated) {
      return res.status(404).json({ error: "Poster not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 5. DELETE /api/posters/:id (Delete poster) ───
app.delete("/api/posters/:id", (req, res) => {
  try {
    const { id } = req.params;
    const poster = db.prepare("SELECT * FROM posters WHERE id = ?").get(id);

    if (!poster) {
      return res.status(404).json({ error: "Poster not found" });
    }

    // Optionally delete the local file if it was uploaded to /uploads/
    if (poster.img && poster.img.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, poster.img);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Could not delete image file:", e.message);
        }
      }
    }

    db.prepare("DELETE FROM posters WHERE id = ?").run(id);
    res.json({ success: true, deletedId: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 6. GET /api/settings/:key (Get setting like 'hero') ───
app.get("/api/settings/:key", (req, res) => {
  try {
    const { key } = req.params;
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
    if (!row) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json(JSON.parse(row.value));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 7. PUT /api/settings/:key (Save setting like 'hero' or 'featuredLook') ───
app.put("/api/settings/:key", (req, res) => {
  try {
    const { key } = req.params;
    const valueStr = JSON.stringify(req.body);
    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = CURRENT_TIMESTAMP
    `);
    stmt.run(key, valueStr);
    res.json({ success: true, key, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 8. CLOUDFLARE R2 ENDPOINTS ───

// POST /api/r2/upload-url (Generate presigned URL for direct browser-to-R2 upload)
app.post("/api/r2/upload-url", async (req, res) => {
  try {
    const { fileName, fileType, folder = "videos" } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required." });
    }

    if (!process.env.R2_BUCKET_NAME || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      return res.status(500).json({ error: "Cloudflare R2 configuration missing on server." });
    }

    // Clean safe filename
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${Date.now()}-${sanitized}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // URL valid for 60 minutes for large video uploads
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/$/, "");
    const publicUrl = `${publicDomain}/${key}`;

    res.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating R2 upload URL:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/r2/videos (List uploaded videos in bucket)
app.get("/api/r2/videos", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: "videos/",
      MaxKeys: 100,
    });
    const response = await r2Client.send(command);
    const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/$/, "");

    const videos = (response.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `${publicDomain}/${item.Key}`,
    }));

    res.json({ success: true, videos });
  } catch (error) {
    console.error("Error listing R2 videos:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/r2/file (Delete file from R2)
app.post("/api/r2/delete", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Object key is required." });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    res.json({ success: true, message: `Deleted ${key}` });
  } catch (error) {
    console.error("Error deleting R2 object:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── 9. Optional: Serve production build on VPS ───
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running with SQLite on http://localhost:${PORT} (and http://127.0.0.1:${PORT})`);
});

// Configure server timeouts to prevent ERR_CONNECTION_RESET during large uploads
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
server.requestTimeout = 300000; // 5 minutes max for big batches
