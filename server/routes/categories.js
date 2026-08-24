import express from "express";
import db from "../database/init.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Get active categories (public)
router.get("/", (req, res) => {
  try {
    const categories = db
      .prepare(
        "SELECT * FROM categories WHERE isActive = 1 ORDER BY name ASC, createdAt DESC"
      )
      .all();

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get all categories (admin)
router.get("/all", authenticateToken, isAdmin, (req, res) => {
  try {
    const categories = db
      .prepare("SELECT * FROM categories ORDER BY name ASC, createdAt DESC")
      .all();

    res.json(categories);
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get single category
router.get("/:id", (req, res) => {
  try {
    const category = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Create category (admin)
router.post("/", authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const normalizedSlug = slugify(slug || name);

    if (!normalizedSlug) {
      return res.status(400).json({ error: "Invalid category slug" });
    }

    const existing = db
      .prepare("SELECT id FROM categories WHERE name = ? OR slug = ?")
      .get(name, normalizedSlug);

    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const result = db
      .prepare(
        `INSERT INTO categories (name, slug, description, isActive)
         VALUES (?, ?, ?, ?)`
      )
      .run(
        name,
        normalizedSlug,
        description || null,
        isActive === "false" || isActive === false ? 0 : 1
      );

    const newCategory = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Update category (admin)
router.put("/:id", authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive } = req.body;

    const existingCategory = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id);

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const nextName = name || existingCategory.name;
    const nextSlug = slugify(slug || nextName);

    const duplicate = db
      .prepare("SELECT id FROM categories WHERE (name = ? OR slug = ?) AND id != ?")
      .get(nextName, nextSlug, id);

    if (duplicate) {
      return res.status(409).json({ error: "Category with this name or slug already exists" });
    }

    db.prepare(
      `UPDATE categories
       SET name = ?, slug = ?, description = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      nextName,
      nextSlug,
      description !== undefined ? description : existingCategory.description,
      isActive !== undefined
        ? isActive === "false" || isActive === false
          ? 0
          : 1
        : existingCategory.isActive,
      id
    );

    const updatedCategory = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id);

    res.json(updatedCategory);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete category (admin)
router.delete("/:id", authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id);

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const productCount = db
      .prepare("SELECT COUNT(*) as count FROM products WHERE categoryId = ?")
      .get(id);

    if (productCount.count > 0) {
      return res.status(400).json({
        error: "Cannot delete category that has products. Move or delete products first.",
      });
    }

    db.prepare("DELETE FROM categories WHERE id = ?").run(id);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
