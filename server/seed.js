import db from "./db.js";

const initialPosters = [
  {
    title: "Neo-Tokyo Night Series",
    category: "Posters",
    client: "Editorial Poster",
    year: "2025",
    img: "/assets/graphics/gfx-hero-poster.jpg",
    description: "High contrast cyberpunk aesthetics with experimental typography.",
    addToChoices: 1,
  },
  {
    title: "Obsidian Brand System",
    category: "Logos",
    client: "Studio Concept",
    year: "2025",
    img: "/assets/graphics/gfx-collection-1.jpg",
    description: "Dark luxury brand language with custom geometric logomarks.",
    addToChoices: 1,
  },
  {
    title: "Metropolis Soundwave Festival",
    category: "Posters",
    client: "Music Festival",
    year: "2024",
    img: "/assets/graphics/gfx-collection-2.jpg",
    description: "Dynamic typographic poster collection for electronic music showcase.",
    addToChoices: 1,
  },
  {
    title: "Vogue Streetwear Identity",
    category: "Logos",
    client: "Apparel Studio",
    year: "2024",
    img: "/assets/botique.png",
    description: "Minimalist fashion magazine layout and custom luxury emblem.",
    addToChoices: 1,
  },
  {
    title: "Infinite Motion Art Poster",
    category: "Posters",
    client: "Creative Lab",
    year: "2025",
    img: "/assets/infinite-format.png",
    description: "Geometric illusions and abstract fluid gradient compositions.",
    addToChoices: 1,
  },
  {
    title: "Elysium Game Crest & Logomark",
    category: "Logos",
    client: "Gaming Studio",
    year: "2024",
    img: "/assets/game.jpg",
    description: "Atmospheric concept key art and vector insignia branding.",
    addToChoices: 1,
  },
];

export function seedDatabaseIfEmpty() {
  const count = db.prepare("SELECT count(*) as count FROM posters").get().count;
  if (count === 0) {
    console.log("🌱 Seeding SQLite database with default artworks...");
    const insert = db.prepare(`
      INSERT INTO posters (title, category, client, year, description, img, addToChoices)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insert.run(
          item.title,
          item.category,
          item.client,
          item.year,
          item.description,
          item.img,
          item.addToChoices
        );
      }
    });

    insertMany(initialPosters);
    console.log("✅ Seeded initial posters into SQLite successfully!");
  }
}
