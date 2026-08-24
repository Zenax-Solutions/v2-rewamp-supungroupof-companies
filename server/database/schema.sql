-- Cloudflare D1 Database Schema for Supun Group of Companies

-- 1. Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies table
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
  googleMapsLink TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Brands table for logo showcase
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logoUrl TEXT NOT NULL,
  website TEXT,
  displayOrder INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products table
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
);

-- 6. Product Variations table
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
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Default Admin User (Password: admin123)
INSERT OR IGNORE INTO users (id, username, password, email, role)
VALUES (1, 'admin', '$2a$10$7795q7Lly7z5l77x4Kiq7u1v9Q59R0v1b7l0kX9/J4O1Jt4wZ1xVy', 'admin@supungroup.lk', 'admin');
