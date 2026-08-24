import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", "database.sqlite");
const db = new Database(dbPath);

export function initDatabase() {
  console.log("🗄️  Initializing database...");

  // Create companies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      shortName TEXT NOT NULL,
      description TEXT NOT NULL,
      fullDescription TEXT NOT NULL,
      industry TEXT NOT NULL,
      established TEXT,
      website TEXT,
      features TEXT NOT NULL,
      imageUrl TEXT,
      catalogPdf TEXT,
      phone TEXT,
      hotline TEXT,
      email TEXT,
      faxNumber TEXT,
      gallery TEXT,
      sequence INTEGER DEFAULT 0,
      socialLinks TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: Add catalogPdf column if it doesn't exist
  try {
    const tableInfo = db.prepare("PRAGMA table_info(companies)").all();
    const hasCatalogPdf = tableInfo.some((col) => col.name === "catalogPdf");

    if (!hasCatalogPdf) {
      console.log("📦 Running migration: Adding catalogPdf column...");
      db.exec(`ALTER TABLE companies ADD COLUMN catalogPdf TEXT`);
      console.log("✅ Migration completed: catalogPdf column added");
    }

    // Add new columns for contact and social information
    const hasPhone = tableInfo.some((col) => col.name === "phone");
    const hasHotline = tableInfo.some((col) => col.name === "hotline");
    const hasEmail = tableInfo.some((col) => col.name === "email");
    const hasFaxNumber = tableInfo.some((col) => col.name === "faxNumber");
    const hasGallery = tableInfo.some((col) => col.name === "gallery");
    const hasSequence = tableInfo.some((col) => col.name === "sequence");
    const hasSocialLinks = tableInfo.some((col) => col.name === "socialLinks");

    if (!hasPhone) {
      console.log("📦 Running migration: Adding phone column...");
      db.exec(`ALTER TABLE companies ADD COLUMN phone TEXT`);
      console.log("✅ Migration completed: phone column added");
    }

    if (!hasHotline) {
      console.log("📦 Running migration: Adding hotline column...");
      db.exec(`ALTER TABLE companies ADD COLUMN hotline TEXT`);
      console.log("✅ Migration completed: hotline column added");
    }

    if (!hasEmail) {
      console.log("📦 Running migration: Adding email column...");
      db.exec(`ALTER TABLE companies ADD COLUMN email TEXT`);
      console.log("✅ Migration completed: email column added");
    }

    if (!hasFaxNumber) {
      console.log("📦 Running migration: Adding faxNumber column...");
      db.exec(`ALTER TABLE companies ADD COLUMN faxNumber TEXT`);
      console.log("✅ Migration completed: faxNumber column added");
    }

    if (!hasGallery) {
      console.log("📦 Running migration: Adding gallery column...");
      db.exec(`ALTER TABLE companies ADD COLUMN gallery TEXT`);
      console.log("✅ Migration completed: gallery column added");
    }

    if (!hasSequence) {
      console.log("📦 Running migration: Adding sequence column...");
      db.exec(`ALTER TABLE companies ADD COLUMN sequence INTEGER DEFAULT 0`);
      console.log("✅ Migration completed: sequence column added");
    }

    if (!hasSocialLinks) {
      console.log("📦 Running migration: Adding socialLinks column...");
      db.exec(`ALTER TABLE companies ADD COLUMN socialLinks TEXT`);
      console.log("✅ Migration completed: socialLinks column added");
    }

    const hasGoogleMapsLink = tableInfo.some(
      (col) => col.name === "googleMapsLink"
    );
    if (!hasGoogleMapsLink) {
      console.log("📦 Running migration: Adding googleMapsLink column...");
      db.exec(`ALTER TABLE companies ADD COLUMN googleMapsLink TEXT`);
      console.log("✅ Migration completed: googleMapsLink column added");
    }
  } catch (error) {
    console.error("⚠️  Migration error:", error.message);
  }

  // Create users table for admin authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'admin',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create brands table for logo showcase
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logoUrl TEXT NOT NULL,
      website TEXT,
      displayOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create product categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      shortDescription TEXT,
      longDescription TEXT,
      imageUrl TEXT,
      price REAL NOT NULL DEFAULT 0,
      wholesalePrice REAL NOT NULL DEFAULT 0,
      categoryId INTEGER,
      isVariable INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    )
  `);

  // Create product variations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      size TEXT,
      imageUrl TEXT,
      price REAL NOT NULL DEFAULT 0,
      wholesalePrice REAL NOT NULL DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

  // Migration: Ensure categories schema has expected columns
  try {
    const categoriesInfo = db.prepare("PRAGMA table_info(categories)").all();
    const hasIsActive = categoriesInfo.some((col) => col.name === "isActive");

    if (!hasIsActive) {
      console.log("📦 Running migration: Adding isActive to categories...");
      db.exec(`ALTER TABLE categories ADD COLUMN isActive INTEGER DEFAULT 1`);
      console.log("✅ Migration completed: categories.isActive column added");
    }
  } catch (error) {
    console.error("⚠️  Categories migration error:", error.message);
  }

  // Migration: Ensure products schema has expected columns
  try {
    const productsInfo = db.prepare("PRAGMA table_info(products)").all();

    const hasShortDescription = productsInfo.some(
      (col) => col.name === "shortDescription"
    );
    const hasLongDescription = productsInfo.some(
      (col) => col.name === "longDescription"
    );
    const hasImageUrl = productsInfo.some((col) => col.name === "imageUrl");
    const hasWholesalePrice = productsInfo.some(
      (col) => col.name === "wholesalePrice"
    );
    const hasCategoryId = productsInfo.some((col) => col.name === "categoryId");
    const hasIsVariable = productsInfo.some((col) => col.name === "isVariable");
    const hasIsActive = productsInfo.some((col) => col.name === "isActive");

    if (!hasShortDescription) {
      console.log("📦 Running migration: Adding shortDescription to products...");
      db.exec(`ALTER TABLE products ADD COLUMN shortDescription TEXT`);
      console.log("✅ Migration completed: products.shortDescription column added");
    }

    if (!hasLongDescription) {
      console.log("📦 Running migration: Adding longDescription to products...");
      db.exec(`ALTER TABLE products ADD COLUMN longDescription TEXT`);
      console.log("✅ Migration completed: products.longDescription column added");
    }

    if (!hasImageUrl) {
      console.log("📦 Running migration: Adding imageUrl to products...");
      db.exec(`ALTER TABLE products ADD COLUMN imageUrl TEXT`);
      console.log("✅ Migration completed: products.imageUrl column added");
    }

    if (!hasWholesalePrice) {
      console.log("📦 Running migration: Adding wholesalePrice to products...");
      db.exec(`ALTER TABLE products ADD COLUMN wholesalePrice REAL DEFAULT 0`);
      console.log("✅ Migration completed: products.wholesalePrice column added");
    }

    if (!hasCategoryId) {
      console.log("📦 Running migration: Adding categoryId to products...");
      db.exec(`ALTER TABLE products ADD COLUMN categoryId INTEGER`);
      console.log("✅ Migration completed: products.categoryId column added");
    }

    if (!hasIsVariable) {
      console.log("📦 Running migration: Adding isVariable to products...");
      db.exec(`ALTER TABLE products ADD COLUMN isVariable INTEGER DEFAULT 0`);
      console.log("✅ Migration completed: products.isVariable column added");
    }

    if (!hasIsActive) {
      console.log("📦 Running migration: Adding isActive to products...");
      db.exec(`ALTER TABLE products ADD COLUMN isActive INTEGER DEFAULT 1`);
      console.log("✅ Migration completed: products.isActive column added");
    }
  } catch (error) {
    console.error("⚠️  Products migration error:", error.message);
  }

  // Migration: Ensure product variations schema has expected columns
  try {
    const productVariationsInfo = db
      .prepare("PRAGMA table_info(product_variations)")
      .all();
    const hasVariationImageUrl = productVariationsInfo.some(
      (col) => col.name === "imageUrl"
    );

    if (!hasVariationImageUrl) {
      console.log(
        "📦 Running migration: Adding imageUrl to product_variations..."
      );
      db.exec(`ALTER TABLE product_variations ADD COLUMN imageUrl TEXT`);
      console.log(
        "✅ Migration completed: product_variations.imageUrl column added"
      );
    }
  } catch (error) {
    console.error("⚠️  Product variations migration error:", error.message);
  }

  // Create default admin user if none exists
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();

  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    db.prepare(
      `
      INSERT INTO users (username, password, email, role)
      VALUES (?, ?, ?, ?)
    `
    ).run("admin", hashedPassword, "admin@supungroup.lk", "admin");

    console.log("✅ Default admin user created");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   ⚠️  Please change this password after first login!");
  }

  console.log("✅ Database initialized successfully");
}

export default db;
