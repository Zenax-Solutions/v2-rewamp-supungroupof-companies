import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "../database/init.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Get all active brands (public)
router.get("/", (req, res) => {
  try {
    const brands = db
      .prepare(
        "SELECT * FROM brands WHERE isActive = 1 ORDER BY displayOrder ASC, createdAt DESC"
      )
      .all();
    res.json(brands);
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// Get all brands including inactive (admin only)
router.get("/all", authenticateToken, isAdmin, (req, res) => {
  try {
    const brands = db
      .prepare("SELECT * FROM brands ORDER BY displayOrder ASC, createdAt DESC")
      .all();
    res.json(brands);
  } catch (error) {
    console.error("Get all brands error:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// Get single brand by ID
router.get("/:id", (req, res) => {
  try {
    const brand = db
      .prepare("SELECT * FROM brands WHERE id = ?")
      .get(req.params.id);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(brand);
  } catch (error) {
    console.error("Get brand error:", error);
    res.status(500).json({ error: "Failed to fetch brand" });
  }
});

// Create new brand (admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("logo"),
  (req, res) => {
    try {
      const { name, website, displayOrder, isActive } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Brand name is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Logo image is required" });
      }

      const logoUrl = `/uploads/${req.file.filename}`;

      const result = db
        .prepare(
          `INSERT INTO brands (name, logoUrl, website, displayOrder, isActive) 
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(
          name,
          logoUrl,
          website || null,
          displayOrder ? parseInt(displayOrder) : 0,
          isActive === "false" || isActive === false ? 0 : 1
        );

      const newBrand = db
        .prepare("SELECT * FROM brands WHERE id = ?")
        .get(result.lastInsertRowid);

      res.status(201).json(newBrand);
    } catch (error) {
      console.error("Create brand error:", error);
      res.status(500).json({ error: "Failed to create brand" });
    }
  }
);

// Update brand (admin only)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.single("logo"),
  (req, res) => {
    try {
      const { id } = req.params;
      const { name, website, displayOrder, isActive } = req.body;

      const existingBrand = db
        .prepare("SELECT * FROM brands WHERE id = ?")
        .get(id);

      if (!existingBrand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      const logoUrl = req.file
        ? `/uploads/${req.file.filename}`
        : existingBrand.logoUrl;

      db.prepare(
        `UPDATE brands 
         SET name = ?, logoUrl = ?, website = ?, displayOrder = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).run(
        name || existingBrand.name,
        logoUrl,
        website !== undefined ? website : existingBrand.website,
        displayOrder !== undefined
          ? parseInt(displayOrder)
          : existingBrand.displayOrder,
        isActive !== undefined
          ? isActive === "false" || isActive === false
            ? 0
            : 1
          : existingBrand.isActive,
        id
      );

      const updatedBrand = db
        .prepare("SELECT * FROM brands WHERE id = ?")
        .get(id);

      res.json(updatedBrand);
    } catch (error) {
      console.error("Update brand error:", error);
      res.status(500).json({ error: "Failed to update brand" });
    }
  }
);

// Delete brand (admin only)
router.delete("/:id", authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const existingBrand = db
      .prepare("SELECT * FROM brands WHERE id = ?")
      .get(id);

    if (!existingBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    db.prepare("DELETE FROM brands WHERE id = ?").run(id);

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Delete brand error:", error);
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

export default router;
