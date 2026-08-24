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

// Configure multer for file uploads
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for images and PDFs
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, WebP images and PDF files are allowed."
        )
      );
    }
  },
});

// Get all companies (public)
router.get("/", (req, res) => {
  try {
    const companies = db
      .prepare("SELECT * FROM companies ORDER BY sequence ASC, createdAt DESC")
      .all();

    // Parse JSON fields
    const formattedCompanies = companies.map((company) => ({
      ...company,
      features: JSON.parse(company.features),
      gallery: company.gallery ? JSON.parse(company.gallery) : [],
      socialLinks: company.socialLinks ? JSON.parse(company.socialLinks) : [],
    }));

    res.json(formattedCompanies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// Get single company (public)
router.get("/:id", (req, res) => {
  try {
    const company = db
      .prepare("SELECT * FROM companies WHERE id = ?")
      .get(req.params.id);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({
      ...company,
      features: JSON.parse(company.features),
      gallery: company.gallery ? JSON.parse(company.gallery) : [],
      socialLinks: company.socialLinks ? JSON.parse(company.socialLinks) : [],
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

// Create company (admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "catalogPdf", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const {
        id,
        name,
        shortName,
        description,
        fullDescription,
        industry,
        established,
        website,
        features,
        phone,
        hotline,
        email,
        faxNumber,
        sequence,
        socialLinks,
        googleMapsLink,
      } = req.body;

      if (
        !id ||
        !name ||
        !shortName ||
        !description ||
        !fullDescription ||
        !industry
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const imageUrl = req.files?.image
        ? `/uploads/${req.files.image[0].filename}`
        : null;
      const catalogPdf = req.files?.catalogPdf
        ? `/uploads/${req.files.catalogPdf[0].filename}`
        : null;

      // Handle gallery images
      const galleryUrls = req.files?.gallery
        ? req.files.gallery.map((file) => `/uploads/${file.filename}`)
        : [];
      const galleryJson = JSON.stringify(galleryUrls);

      const featuresJson =
        typeof features === "string" ? features : JSON.stringify(features);
      const socialLinksJson =
        typeof socialLinks === "string"
          ? socialLinks
          : JSON.stringify(socialLinks || []);

      const stmt = db.prepare(`
      INSERT INTO companies (id, name, shortName, description, fullDescription, industry, established, website, features, imageUrl, catalogPdf, phone, hotline, email, faxNumber, gallery, sequence, socialLinks, googleMapsLink)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

      stmt.run(
        id,
        name,
        shortName,
        description,
        fullDescription,
        industry,
        established,
        website,
        featuresJson,
        imageUrl,
        catalogPdf,
        phone || null,
        hotline || null,
        email || null,
        faxNumber || null,
        galleryJson,
        sequence || 0,
        socialLinksJson,
        googleMapsLink || null
      );

      const newCompany = db
        .prepare("SELECT * FROM companies WHERE id = ?")
        .get(id);

      res.status(201).json({
        ...newCompany,
        features: JSON.parse(newCompany.features),
        gallery: newCompany.gallery ? JSON.parse(newCompany.gallery) : [],
        socialLinks: newCompany.socialLinks
          ? JSON.parse(newCompany.socialLinks)
          : [],
      });
    } catch (error) {
      console.error("Create company error:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  }
);

// Update company (admin only)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "catalogPdf", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const {
        name,
        shortName,
        description,
        fullDescription,
        industry,
        established,
        website,
        features,
        phone,
        hotline,
        email,
        faxNumber,
        sequence,
        socialLinks,
        existingGallery,
        googleMapsLink,
      } = req.body;

      const existingCompany = db
        .prepare("SELECT * FROM companies WHERE id = ?")
        .get(req.params.id);

      if (!existingCompany) {
        return res.status(404).json({ error: "Company not found" });
      }

      const imageUrl = req.files?.image
        ? `/uploads/${req.files.image[0].filename}`
        : existingCompany.imageUrl;
      const catalogPdf = req.files?.catalogPdf
        ? `/uploads/${req.files.catalogPdf[0].filename}`
        : existingCompany.catalogPdf;

      // Handle gallery images
      let galleryUrls = [];

      // Parse existing gallery from database
      const currentGallery = existingCompany.gallery
        ? JSON.parse(existingCompany.gallery)
        : [];

      // Parse existing gallery from frontend (preserved images)
      const preservedGallery = existingGallery
        ? JSON.parse(existingGallery)
        : currentGallery;

      // Convert full URLs back to relative paths for preserved images
      const preservedPaths = preservedGallery.map((url) => {
        if (url.startsWith("http")) {
          const urlObj = new URL(url);
          return urlObj.pathname;
        }
        return url;
      });

      // Add new gallery images
      const newGalleryUrls = req.files?.gallery
        ? req.files.gallery.map((file) => `/uploads/${file.filename}`)
        : [];

      // Combine preserved and new images
      galleryUrls = [...preservedPaths, ...newGalleryUrls];
      const galleryJson = JSON.stringify(galleryUrls);

      const featuresJson =
        typeof features === "string" ? features : JSON.stringify(features);
      const socialLinksJson =
        typeof socialLinks === "string"
          ? socialLinks
          : JSON.stringify(socialLinks || []);

      const stmt = db.prepare(`
      UPDATE companies 
      SET name = ?, shortName = ?, description = ?, fullDescription = ?, industry = ?, 
          established = ?, website = ?, features = ?, imageUrl = ?, catalogPdf = ?, 
          phone = ?, hotline = ?, email = ?, faxNumber = ?, gallery = ?, sequence = ?, 
          socialLinks = ?, googleMapsLink = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

      stmt.run(
        name,
        shortName,
        description,
        fullDescription,
        industry,
        established,
        website,
        featuresJson,
        imageUrl,
        catalogPdf,
        phone || null,
        hotline || null,
        email || null,
        faxNumber || null,
        galleryJson,
        sequence || 0,
        socialLinksJson,
        googleMapsLink || null,
        req.params.id
      );

      const updatedCompany = db
        .prepare("SELECT * FROM companies WHERE id = ?")
        .get(req.params.id);

      res.json({
        ...updatedCompany,
        features: JSON.parse(updatedCompany.features),
        gallery: updatedCompany.gallery
          ? JSON.parse(updatedCompany.gallery)
          : [],
        socialLinks: updatedCompany.socialLinks
          ? JSON.parse(updatedCompany.socialLinks)
          : [],
      });
    } catch (error) {
      console.error("Update company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  }
);

// Delete company (admin only)
router.delete("/:id", authenticateToken, isAdmin, (req, res) => {
  try {
    const company = db
      .prepare("SELECT * FROM companies WHERE id = ?")
      .get(req.params.id);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    db.prepare("DELETE FROM companies WHERE id = ?").run(req.params.id);

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

export default router;
