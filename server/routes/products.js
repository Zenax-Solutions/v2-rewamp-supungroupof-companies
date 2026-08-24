import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import db from "../database/init.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "..", "uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and WebP images are allowed."));
    }
  },
});

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseVariations(raw) {
  if (!raw) return [];

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  return [];
}

function mapUploadedFiles(files = []) {
  const fileMap = new Map();

  for (const file of files) {
    fileMap.set(file.fieldname, `/uploads/${file.filename}`);
  }

  return fileMap;
}

function mapProductRow(product) {
  return {
    ...product,
    isVariable: Number(product.isVariable) === 1,
    isActive: Number(product.isActive) === 1,
  };
}

function getProductWithRelations(id) {
  const product = db
    .prepare(
      `SELECT p.*, c.name as categoryName
       FROM products p
       LEFT JOIN categories c ON p.categoryId = c.id
       WHERE p.id = ?`
    )
    .get(id);

  if (!product) return null;

  const variations = db
    .prepare(
      `SELECT * FROM product_variations
       WHERE productId = ?
       ORDER BY id ASC`
    )
    .all(id)
    .map((variation) => ({
      ...variation,
      isActive: Number(variation.isActive) === 1,
    }));

  return {
    ...mapProductRow(product),
    variations,
  };
}

// Get public products
router.get("/", (req, res) => {
  try {
    const { categoryId } = req.query;

    const baseQuery = `
      SELECT p.*, c.name as categoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.isActive = 1
    `;

    const products = categoryId
      ? db
          .prepare(`${baseQuery} AND p.categoryId = ? ORDER BY p.createdAt DESC`)
          .all(categoryId)
      : db.prepare(`${baseQuery} ORDER BY p.createdAt DESC`).all();

    const formatted = products.map((product) => {
      const details = getProductWithRelations(product.id);
      return details;
    });

    res.json(formatted);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get all products for admin
router.get("/all", authenticateToken, isAdmin, (req, res) => {
  try {
    const products = db
      .prepare(
        `SELECT p.*, c.name as categoryName
         FROM products p
         LEFT JOIN categories c ON p.categoryId = c.id
         ORDER BY p.createdAt DESC`
      )
      .all();

    const formatted = products.map((product) => getProductWithRelations(product.id));

    res.json(formatted);
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get single product
router.get("/:id", (req, res) => {
  try {
    const product = getProductWithRelations(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
router.post("/", authenticateToken, isAdmin, upload.any(), (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      price,
      wholesalePrice,
      categoryId,
      isVariable,
      isActive,
      variations,
    } = req.body;

    const uploadedFiles = mapUploadedFiles(req.files || []);

    if (!title) {
      return res.status(400).json({ error: "Product title is required" });
    }

    if (!price) {
      return res.status(400).json({ error: "Product price is required" });
    }

    const normalizedSlug = slugify(slug || title);
    if (!normalizedSlug) {
      return res.status(400).json({ error: "Invalid product slug" });
    }

    const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(normalizedSlug);
    const finalSlug = existing ? `${normalizedSlug}-${Date.now()}` : normalizedSlug;

    const imageUrl = uploadedFiles.get("image") || null;

    const result = db
      .prepare(
        `INSERT INTO products (
          title, slug, shortDescription, longDescription, imageUrl,
          price, wholesalePrice, categoryId, isVariable, isActive
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        title,
        finalSlug,
        shortDescription || null,
        longDescription || null,
        imageUrl,
        Number(price),
        wholesalePrice !== undefined && wholesalePrice !== "" ? Number(wholesalePrice) : 0,
        categoryId ? Number(categoryId) : null,
        isVariable === "true" || isVariable === true ? 1 : 0,
        isActive === "false" || isActive === false ? 0 : 1
      );

    const productId = result.lastInsertRowid;

    const parsedVariations = parseVariations(variations);
    if (parsedVariations.length > 0) {
      const variationInsert = db.prepare(
        `INSERT INTO product_variations (
          productId, name, color, size, imageUrl, price, wholesalePrice, isActive
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      const insertMany = db.transaction((items) => {
        for (const item of items) {
          if (!item?.name) continue;

          const variationImageUrl =
            uploadedFiles.get(item?.imageField) || item?.imageUrl || null;

          variationInsert.run(
            productId,
            item.name,
            item.color || null,
            item.size || null,
            variationImageUrl,
            item.price !== undefined && item.price !== "" ? Number(item.price) : Number(price),
            item.wholesalePrice !== undefined && item.wholesalePrice !== ""
              ? Number(item.wholesalePrice)
              : wholesalePrice !== undefined && wholesalePrice !== ""
              ? Number(wholesalePrice)
              : 0,
            item.isActive === false || item.isActive === "false" ? 0 : 1
          );
        }
      });

      insertMany(parsedVariations);
    }

    const created = getProductWithRelations(productId);
    res.status(201).json(created);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.put("/:id", authenticateToken, isAdmin, upload.any(), (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      price,
      wholesalePrice,
      categoryId,
      isVariable,
      isActive,
      variations,
    } = req.body;

    const uploadedFiles = mapUploadedFiles(req.files || []);

    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const nextTitle = title || existing.title;
    const nextSlugBase = slugify(slug || nextTitle);
    const duplicate = db
      .prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
      .get(nextSlugBase, id);
    const nextSlug = duplicate ? `${nextSlugBase}-${Date.now()}` : nextSlugBase;

    const imageUrl = uploadedFiles.get("image") || existing.imageUrl;

    db.prepare(
      `UPDATE products
       SET title = ?, slug = ?, shortDescription = ?, longDescription = ?, imageUrl = ?,
           price = ?, wholesalePrice = ?, categoryId = ?, isVariable = ?, isActive = ?,
           updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      nextTitle,
      nextSlug,
      shortDescription !== undefined ? shortDescription : existing.shortDescription,
      longDescription !== undefined ? longDescription : existing.longDescription,
      imageUrl,
      price !== undefined && price !== "" ? Number(price) : existing.price,
      wholesalePrice !== undefined && wholesalePrice !== ""
        ? Number(wholesalePrice)
        : existing.wholesalePrice,
      categoryId !== undefined && categoryId !== "" ? Number(categoryId) : null,
      isVariable !== undefined
        ? isVariable === "true" || isVariable === true
          ? 1
          : 0
        : existing.isVariable,
      isActive !== undefined
        ? isActive === "false" || isActive === false
          ? 0
          : 1
        : existing.isActive,
      id
    );

    if (variations !== undefined) {
      const parsedVariations = parseVariations(variations);

      db.prepare("DELETE FROM product_variations WHERE productId = ?").run(id);

      if (parsedVariations.length > 0) {
        const variationInsert = db.prepare(
          `INSERT INTO product_variations (
            productId, name, color, size, imageUrl, price, wholesalePrice, isActive
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );

        const insertMany = db.transaction((items) => {
          for (const item of items) {
            if (!item?.name) continue;

            const variationImageUrl =
              uploadedFiles.get(item?.imageField) || item?.imageUrl || null;

            variationInsert.run(
              id,
              item.name,
              item.color || null,
              item.size || null,
              variationImageUrl,
              item.price !== undefined && item.price !== ""
                ? Number(item.price)
                : price !== undefined && price !== ""
                ? Number(price)
                : existing.price,
              item.wholesalePrice !== undefined && item.wholesalePrice !== ""
                ? Number(item.wholesalePrice)
                : wholesalePrice !== undefined && wholesalePrice !== ""
                ? Number(wholesalePrice)
                : existing.wholesalePrice,
              item.isActive === false || item.isActive === "false" ? 0 : 1
            );
          }
        });

        insertMany(parsedVariations);
      }
    }

    const updated = getProductWithRelations(id);
    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    db.prepare("DELETE FROM product_variations WHERE productId = ?").run(id);
    db.prepare("DELETE FROM products WHERE id = ?").run(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;