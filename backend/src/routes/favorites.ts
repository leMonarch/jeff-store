import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/**
 * GET /api/favorites
 * Liste tous les favoris de l'utilisateur connecté
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user!.userId;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true, // Inclure les détails du produit
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(favorites);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des favoris:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des favoris",
      message: error.message,
    });
  }
});

/**
 * GET /api/favorites/check/:productId
 * Vérifier si un produit est en favori
 */
router.get("/check/:productId", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    res.json({
      isFavorite: !!favorite,
    });
  } catch (error: any) {
    console.error("Erreur lors de la vérification:", error);
    res.status(500).json({
      error: "Erreur lors de la vérification",
      message: error.message,
    });
  }
});

/**
 * POST /api/favorites
 * Ajouter un produit aux favoris
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "ID de produit requis",
      });
    }

    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productIdNum },
    });

    if (!product) {
      return res.status(404).json({
        error: "Produit non trouvé",
      });
    }

    // Créer le favori (ou récupérer s'il existe déjà)
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId,
          productId: productIdNum,
        },
      },
      create: {
        userId,
        productId: productIdNum,
      },
      update: {},
      include: {
        product: true,
      },
    });

    res.status(201).json(favorite);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Ce produit est déjà dans vos favoris",
      });
    }
    console.error("Erreur lors de l'ajout aux favoris:", error);
    res.status(500).json({
      error: "Erreur lors de l'ajout aux favoris",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/favorites/:productId
 * Retirer un produit des favoris
 */
router.delete("/:productId", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du favori",
      message: error.message,
    });
  }
});

export default router;


