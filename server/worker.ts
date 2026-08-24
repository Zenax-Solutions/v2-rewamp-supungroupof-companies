import { Hono } from "hono";
import { cors } from "hono/cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  UPLOADS_BUCKET?: R2Bucket;
  JWT_SECRET?: string;
  ASSETS?: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

const DEFAULT_JWT_SECRET = "supun-group-secret-key-2026-production";

// Middleware
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Helper: JWT verification
const verifyAuth = async (c: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const secret = c.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret) as any;
    return decoded;
  } catch {
    return null;
  }
};

// Helper: Save file to R2 or return path
async function saveR2File(
  bucket: R2Bucket | undefined,
  file: File,
  prefix = "upload"
): Promise<string> {
  const extension = file.name.split(".").pop() || "bin";
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = `/uploads/${uniqueName}`;

  if (bucket) {
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(uniqueName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
    });
  }
  return path;
}

// ==========================================
// 1. FILE SERVING ROUTE (/uploads/*)
// ==========================================
app.get("/uploads/:filename", async (c) => {
  const filename = c.req.param("filename");
  const bucket = c.env.UPLOADS_BUCKET;

  if (!bucket) {
    return c.text("Storage bucket not bound", 404);
  }

  const object = await bucket.get(filename);
  if (!object) {
    return c.text("File not found", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
});

// ==========================================
// 2. HEALTH CHECK
// ==========================================
app.get("/api/health", (c) => {
  return c.json({ status: "ok", message: "Supun Group Serverless Worker is running" });
});

// ==========================================
// 3. AUTH ROUTES (/api/auth)
// ==========================================
app.post("/api/auth/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { username, password } = body;

  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }

  const user: any = await c.env.DB.prepare(
    "SELECT * FROM users WHERE username = ? OR email = ?"
  )
    .bind(username, username)
    .first();

  if (!user) {
    return c.json({ error: "Invalid username or password" }, 401);
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return c.json({ error: "Invalid username or password" }, 401);
  }

  const secret = c.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    secret,
    { expiresIn: "24h" }
  );

  return c.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

app.get("/api/auth/verify", async (c) => {
  const user = await verifyAuth(c);
  if (!user) {
    return c.json({ valid: false, message: "Invalid or expired token" }, 401);
  }

  const dbUser: any = await c.env.DB.prepare(
    "SELECT id, username, email, role FROM users WHERE id = ?"
  )
    .bind(user.id)
    .first();

  if (!dbUser) {
    return c.json({ valid: false, message: "User not found" }, 404);
  }

  return c.json({ valid: true, user: dbUser });
});

app.post("/api/auth/change-password", async (c) => {
  const user = await verifyAuth(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { currentPassword, newPassword } = await c.req.json().catch(() => ({}));
  if (!currentPassword || !newPassword) {
    return c.json({ error: "Current password and new password are required" }, 400);
  }

  const dbUser: any = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(user.id)
    .first();

  if (!dbUser || !bcrypt.compareSync(currentPassword, dbUser.password)) {
    return c.json({ error: "Incorrect current password" }, 400);
  }

  const hashedNew = bcrypt.hashSync(newPassword, 10);
  await c.env.DB.prepare("UPDATE users SET password = ? WHERE id = ?")
    .bind(hashedNew, user.id)
    .run();

  return c.json({ message: "Password updated successfully" });
});

// ==========================================
// 4. COMPANIES ROUTES (/api/companies)
// ==========================================
app.get("/api/companies", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM companies ORDER BY sequence ASC, name ASC"
  ).all();

  const formatted = (results || []).map((comp: any) => ({
    ...comp,
    features: comp.features ? JSON.parse(comp.features) : [],
    gallery: comp.gallery ? JSON.parse(comp.gallery) : [],
    socialLinks: comp.socialLinks ? JSON.parse(comp.socialLinks) : [],
  }));

  return c.json(formatted);
});

app.get("/api/companies/:id", async (c) => {
  const id = c.req.param("id");
  const comp: any = await c.env.DB.prepare("SELECT * FROM companies WHERE id = ?")
    .bind(id)
    .first();

  if (!comp) {
    return c.json({ error: "Company not found" }, 404);
  }

  return c.json({
    ...comp,
    features: comp.features ? JSON.parse(comp.features) : [],
    gallery: comp.gallery ? JSON.parse(comp.gallery) : [],
    socialLinks: comp.socialLinks ? JSON.parse(comp.socialLinks) : [],
  });
});

app.post("/api/companies", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === "image") {
          data.imageUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
        } else if (key === "catalogPdf") {
          data.catalogPdf = await saveR2File(c.env.UPLOADS_BUCKET, value);
        }
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

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
    imageUrl,
    catalogPdf,
    gallery,
  } = data;

  if (!id || !name || !shortName || !description || !fullDescription || !industry) {
    return c.json({ error: "Missing required company fields" }, 400);
  }

  const featuresJson = typeof features === "string" ? features : JSON.stringify(features || []);
  const galleryJson = typeof gallery === "string" ? gallery : JSON.stringify(gallery || []);
  const socialLinksJson = typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks || []);

  await c.env.DB.prepare(
    `INSERT INTO companies (
      id, name, shortName, description, fullDescription, industry,
      established, website, features, imageUrl, catalogPdf, phone,
      hotline, email, faxNumber, gallery, sequence, socialLinks, googleMapsLink
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      name,
      shortName,
      description,
      fullDescription,
      industry,
      established || "",
      website || "",
      featuresJson,
      imageUrl || null,
      catalogPdf || null,
      phone || "",
      hotline || "",
      email || "",
      faxNumber || "",
      galleryJson,
      Number(sequence) || 0,
      socialLinksJson,
      googleMapsLink || ""
    )
    .run();

  const created = await c.env.DB.prepare("SELECT * FROM companies WHERE id = ?").bind(id).first();
  return c.json(created, 201);
});

app.put("/api/companies/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const existing: any = await c.env.DB.prepare("SELECT * FROM companies WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Company not found" }, 404);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === "image") {
          data.imageUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
        } else if (key === "catalogPdf") {
          data.catalogPdf = await saveR2File(c.env.UPLOADS_BUCKET, value);
        }
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

  const name = data.name ?? existing.name;
  const shortName = data.shortName ?? existing.shortName;
  const description = data.description ?? existing.description;
  const fullDescription = data.fullDescription ?? existing.fullDescription;
  const industry = data.industry ?? existing.industry;
  const established = data.established ?? existing.established;
  const website = data.website ?? existing.website;
  const featuresJson = data.features ? (typeof data.features === "string" ? data.features : JSON.stringify(data.features)) : existing.features;
  const imageUrl = data.imageUrl ?? existing.imageUrl;
  const catalogPdf = data.catalogPdf ?? existing.catalogPdf;
  const phone = data.phone ?? existing.phone;
  const hotline = data.hotline ?? existing.hotline;
  const email = data.email ?? existing.email;
  const faxNumber = data.faxNumber ?? existing.faxNumber;
  const galleryJson = data.gallery ? (typeof data.gallery === "string" ? data.gallery : JSON.stringify(data.gallery)) : existing.gallery;
  const sequence = data.sequence !== undefined ? Number(data.sequence) : existing.sequence;
  const socialLinksJson = data.socialLinks ? (typeof data.socialLinks === "string" ? data.socialLinks : JSON.stringify(data.socialLinks)) : existing.socialLinks;
  const googleMapsLink = data.googleMapsLink ?? existing.googleMapsLink;

  await c.env.DB.prepare(
    `UPDATE companies SET
      name = ?, shortName = ?, description = ?, fullDescription = ?, industry = ?,
      established = ?, website = ?, features = ?, imageUrl = ?, catalogPdf = ?,
      phone = ?, hotline = ?, email = ?, faxNumber = ?, gallery = ?,
      sequence = ?, socialLinks = ?, googleMapsLink = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?`
  )
    .bind(
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
      phone,
      hotline,
      email,
      faxNumber,
      galleryJson,
      sequence,
      socialLinksJson,
      googleMapsLink,
      id
    )
    .run();

  const updated: any = await c.env.DB.prepare("SELECT * FROM companies WHERE id = ?").bind(id).first();
  return c.json({
    ...updated,
    features: updated.features ? JSON.parse(updated.features) : [],
    gallery: updated.gallery ? JSON.parse(updated.gallery) : [],
    socialLinks: updated.socialLinks ? JSON.parse(updated.socialLinks) : [],
  });
});

app.delete("/api/companies/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM companies WHERE id = ?").bind(id).run();
  return c.json({ message: "Company deleted successfully" });
});

// ==========================================
// 5. BRANDS ROUTES (/api/brands)
// ==========================================
app.get("/api/brands", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM brands ORDER BY displayOrder ASC, name ASC"
  ).all();
  return c.json(results || []);
});

app.get("/api/brands/:id", async (c) => {
  const id = c.req.param("id");
  const brand = await c.env.DB.prepare("SELECT * FROM brands WHERE id = ?").bind(id).first();
  if (!brand) return c.json({ error: "Brand not found" }, 404);
  return c.json(brand);
});

app.post("/api/brands", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === "logo") {
        data.logoUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

  const { name, logoUrl, website, displayOrder, isActive } = data;
  if (!name || !logoUrl) {
    return c.json({ error: "Brand name and logo are required" }, 400);
  }

  const res = await c.env.DB.prepare(
    "INSERT INTO brands (name, logoUrl, website, displayOrder, isActive) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(name, logoUrl, website || "", Number(displayOrder) || 0, isActive === false || isActive === 0 ? 0 : 1)
    .run();

  const created = await c.env.DB.prepare("SELECT * FROM brands WHERE id = ?").bind(res.meta.last_row_id).first();
  return c.json(created, 201);
});

app.put("/api/brands/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const existing: any = await c.env.DB.prepare("SELECT * FROM brands WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Brand not found" }, 404);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === "logo") {
        data.logoUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

  const name = data.name ?? existing.name;
  const logoUrl = data.logoUrl ?? existing.logoUrl;
  const website = data.website ?? existing.website;
  const displayOrder = data.displayOrder !== undefined ? Number(data.displayOrder) : existing.displayOrder;
  const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : existing.isActive;

  await c.env.DB.prepare(
    "UPDATE brands SET name = ?, logoUrl = ?, website = ?, displayOrder = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(name, logoUrl, website, displayOrder, isActive, id)
    .run();

  const updated = await c.env.DB.prepare("SELECT * FROM brands WHERE id = ?").bind(id).first();
  return c.json(updated);
});

app.delete("/api/brands/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM brands WHERE id = ?").bind(id).run();
  return c.json({ message: "Brand deleted successfully" });
});

// ==========================================
// 6. CATEGORIES ROUTES (/api/categories)
// ==========================================
app.get("/api/categories", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM categories ORDER BY name ASC"
  ).all();
  return c.json(results || []);
});

app.get("/api/categories/:id", async (c) => {
  const id = c.req.param("id");
  const category = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(id).first();
  if (!category) return c.json({ error: "Category not found" }, 404);
  return c.json(category);
});

app.post("/api/categories", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { name, slug, description, isActive } = await c.req.json().catch(() => ({}));
  if (!name || !slug) {
    return c.json({ error: "Name and slug are required" }, 400);
  }

  const res = await c.env.DB.prepare(
    "INSERT INTO categories (name, slug, description, isActive) VALUES (?, ?, ?, ?)"
  )
    .bind(name, slug, description || "", isActive === false || isActive === 0 ? 0 : 1)
    .run();

  const created = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(res.meta.last_row_id).first();
  return c.json(created, 201);
});

app.put("/api/categories/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const { name, slug, description, isActive } = await c.req.json().catch(() => ({}));

  await c.env.DB.prepare(
    "UPDATE categories SET name = ?, slug = ?, description = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(name, slug, description || "", isActive ? 1 : 0, id)
    .run();

  const updated = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(id).first();
  return c.json(updated);
});

app.delete("/api/categories/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  return c.json({ message: "Category deleted successfully" });
});

// ==========================================
// 7. PRODUCTS ROUTES (/api/products)
// ==========================================
app.get("/api/products", async (c) => {
  const { results: products } = await c.env.DB.prepare(
    `SELECT p.*, c.name as categoryName
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     ORDER BY p.title ASC`
  ).all();

  const { results: variations } = await c.env.DB.prepare(
    "SELECT * FROM product_variations ORDER BY id ASC"
  ).all();

  const variationsByProduct: Record<number, any[]> = {};
  (variations || []).forEach((v: any) => {
    if (!variationsByProduct[v.productId]) {
      variationsByProduct[v.productId] = [];
    }
    variationsByProduct[v.productId].push(v);
  });

  const fullProducts = (products || []).map((p: any) => ({
    ...p,
    variations: variationsByProduct[p.id] || [],
  }));

  return c.json(fullProducts);
});

app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const product: any = await c.env.DB.prepare(
    `SELECT p.*, c.name as categoryName
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     WHERE p.id = ?`
  )
    .bind(id)
    .first();

  if (!product) return c.json({ error: "Product not found" }, 404);

  const { results: variations } = await c.env.DB.prepare(
    "SELECT * FROM product_variations WHERE productId = ? ORDER BY id ASC"
  )
    .bind(id)
    .all();

  product.variations = variations || [];
  return c.json(product);
});

app.get("/api/products/slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  const product: any = await c.env.DB.prepare(
    `SELECT p.*, c.name as categoryName
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     WHERE p.slug = ?`
  )
    .bind(slug)
    .first();

  if (!product) return c.json({ error: "Product not found" }, 404);

  const { results: variations } = await c.env.DB.prepare(
    "SELECT * FROM product_variations WHERE productId = ? ORDER BY id ASC"
  )
    .bind(product.id)
    .all();

  product.variations = variations || [];
  return c.json(product);
});

app.post("/api/products", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === "image") {
        data.imageUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

  const {
    title,
    slug,
    shortDescription,
    longDescription,
    imageUrl,
    price,
    wholesalePrice,
    categoryId,
    isVariable,
    isActive,
    variations,
  } = data;

  if (!title || !slug) {
    return c.json({ error: "Title and slug are required" }, 400);
  }

  const res = await c.env.DB.prepare(
    `INSERT INTO products (
      title, slug, shortDescription, longDescription, imageUrl,
      price, wholesalePrice, categoryId, isVariable, isActive
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      title,
      slug,
      shortDescription || "",
      longDescription || "",
      imageUrl || null,
      Number(price) || 0,
      Number(wholesalePrice) || 0,
      categoryId ? Number(categoryId) : null,
      isVariable ? 1 : 0,
      isActive === false || isActive === 0 ? 0 : 1
    )
    .run();

  const productId = res.meta.last_row_id;

  // Insert variations if variable
  if (isVariable && variations) {
    const parsedVariations = typeof variations === "string" ? JSON.parse(variations) : variations;
    for (const v of parsedVariations) {
      await c.env.DB.prepare(
        `INSERT INTO product_variations (productId, name, color, size, imageUrl, price, wholesalePrice, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          productId,
          v.name || "Default Variation",
          v.color || "",
          v.size || "",
          v.imageUrl || null,
          Number(v.price) || 0,
          Number(v.wholesalePrice) || 0,
          v.isActive === false ? 0 : 1
        )
        .run();
    }
  }

  const created = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(productId).first();
  return c.json(created, 201);
});

app.put("/api/products/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const existing: any = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Product not found" }, 404);

  let data: any = {};
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === "image") {
        data.imageUrl = await saveR2File(c.env.UPLOADS_BUCKET, value);
      } else {
        data[key] = value;
      }
    }
  } else {
    data = await c.req.json().catch(() => ({}));
  }

  const title = data.title ?? existing.title;
  const slug = data.slug ?? existing.slug;
  const shortDescription = data.shortDescription ?? existing.shortDescription;
  const longDescription = data.longDescription ?? existing.longDescription;
  const imageUrl = data.imageUrl ?? existing.imageUrl;
  const price = data.price !== undefined ? Number(data.price) : existing.price;
  const wholesalePrice = data.wholesalePrice !== undefined ? Number(data.wholesalePrice) : existing.wholesalePrice;
  const categoryId = data.categoryId !== undefined ? (data.categoryId ? Number(data.categoryId) : null) : existing.categoryId;
  const isVariable = data.isVariable !== undefined ? (data.isVariable ? 1 : 0) : existing.isVariable;
  const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : existing.isActive;

  await c.env.DB.prepare(
    `UPDATE products SET
      title = ?, slug = ?, shortDescription = ?, longDescription = ?,
      imageUrl = ?, price = ?, wholesalePrice = ?, categoryId = ?,
      isVariable = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?`
  )
    .bind(
      title,
      slug,
      shortDescription,
      longDescription,
      imageUrl,
      price,
      wholesalePrice,
      categoryId,
      isVariable,
      isActive,
      id
    )
    .run();

  if (data.variations) {
    await c.env.DB.prepare("DELETE FROM product_variations WHERE productId = ?").bind(id).run();
    const parsedVariations = typeof data.variations === "string" ? JSON.parse(data.variations) : data.variations;
    for (const v of parsedVariations) {
      await c.env.DB.prepare(
        `INSERT INTO product_variations (productId, name, color, size, imageUrl, price, wholesalePrice, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          v.name || "Default",
          v.color || "",
          v.size || "",
          v.imageUrl || null,
          Number(v.price) || 0,
          Number(v.wholesalePrice) || 0,
          v.isActive === false ? 0 : 1
        )
        .run();
    }
  }

  const updated: any = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  return c.json(updated);
});

app.delete("/api/products/:id", async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM product_variations WHERE productId = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return c.json({ message: "Product deleted successfully" });
});

// Fallback to static assets (SPA)
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("Asset handler not found", 404);
});

export default app;
