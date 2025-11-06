import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "images");
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `impression-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Seules les images (JPEG, PNG, GIF, WebP) sont autorisées"));
    }
  },
});

/**
 * POST /api/upload/image
 * Uploader une image (Admin uniquement)
 */
router.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Aucun fichier fourni",
        });
      }

      // Retourner l'URL de l'image
      // En production, vous devriez utiliser un service cloud (AWS S3, Cloudinary, etc.)
      // Pour l'instant, on retourne une URL relative
      const imageUrl = `/uploads/images/${req.file.filename}`;
      
      // Si vous avez une URL de base configurée, utilisez-la
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const fullUrl = `${baseUrl}${imageUrl}`;

      res.json({
        message: "Image uploadée avec succès",
        imageUrl: fullUrl,
        filename: req.file.filename,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      res.status(500).json({
        error: "Erreur lors de l'upload de l'image",
        message: error.message,
      });
    }
  }
);

export default router;

