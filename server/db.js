import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/data folder exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "database.sqlite");
const db = new Database(dbPath);

// Enable WAL mode for high performance concurrent access
db.pragma("journal_mode = WAL");

// Initialize Posters and Artworks table
db.exec(`
  CREATE TABLE IF NOT EXISTS posters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Posters',
    client TEXT,
    year TEXT,
    description TEXT,
    img TEXT NOT NULL,
    originalFilename TEXT,
    addToChoices INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Check and add originalFilename column if missing from existing SQLite file
const tableInfo = db.prepare("PRAGMA table_info(posters)").all();
const hasOriginalFilename = tableInfo.some((col) => col.name === "originalFilename");

if (!hasOriginalFilename) {
  try {
    db.exec("ALTER TABLE posters ADD COLUMN originalFilename TEXT");
    console.log("✅ Added 'originalFilename' column to SQLite posters table.");
  } catch (err) {
    console.warn("Migration notice:", err.message);
  }
}

// Initialize Settings table (for hero data, featured artwork, etc.)
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
