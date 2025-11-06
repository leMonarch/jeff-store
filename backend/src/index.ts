import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";

// Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import favoriteRoutes from "./routes/favorites.js";
import newsletterRoutes from "./routes/newsletter.js";
import uploadRoutes from "./routes/upload.js";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use("/uploads", express.static("uploads"));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/upload", uploadRoutes);

// Routes de test
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// Route de test pour vérifier la connexion Prisma/MySQL
app.get("/api/test-db", async (req, res) => {
  try {
    // Test simple : compter les utilisateurs
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    res.json({
      status: "OK",
      message: "Connexion à la base de données réussie !",
      database: "jeffstore",
      tables: {
        users: userCount,
        products: productCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "ERROR",
      message: "Erreur de connexion à la base de données",
      error: error.message,
    });
  }
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
