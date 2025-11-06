import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

/**
 * Middleware pour extraire la langue depuis l'URL
 * Les routes seront montées sur /api/fr ou /api/en
 * La langue est extraite du chemin de base du routeur
 */
const getLanguageFromPath = (req: express.Request): string => {
  // Le chemin de base sera /fr ou /en selon comment le routeur est monté
  // req.baseUrl contient /api/fr ou /api/en
  const baseUrl = req.baseUrl || "";
  if (baseUrl.includes("/fr")) return "fr";
  if (baseUrl.includes("/en")) return "en";
  return "fr"; // Par défaut
};

/**
 * Middleware pour ajouter la langue à la requête
 */
router.use((req, res, next) => {
  const lang = getLanguageFromPath(req);
  (req as any).language = lang;
  next();
});

/**
 * GET /api/:lang/products
 * Liste tous les produits dans la langue spécifiée
 * Query params: ?all=true pour voir tous les produits, ?category=<nom> pour filtrer
 */
router.get("/products", async (req, res) => {
  try {
    const lang = (req as any).language;
    const { all, category } = req.query;

    const where: any = {};

    // Si ?all=true n'est pas spécifié, ne montrer que les produits actifs
    if (all !== "true") {
      where.active = true;
    }

    // Récupérer les produits avec leurs traductions
    const products = await prisma.product.findMany({
      where,
      include: {
        translations: {
          where: { language: lang },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformer les produits pour avoir les traductions intégrées
    const productsWithTranslations = products
      .filter((p) => p.translations.length > 0) // Filtrer les produits sans traduction
      .map((product) => {
        const translation = product.translations[0];
        return {
          id: product.id,
          name: translation.name,
          description: translation.description,
          category: translation.category,
          medium: translation.medium,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          active: product.active,
          dimensions: product.dimensions,
          sendNewsletter: product.sendNewsletter,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      });

    // Filtrer par catégorie si spécifié
    let filteredProducts = productsWithTranslations;
    if (category) {
      filteredProducts = productsWithTranslations.filter(
        (p) => p.category === category
      );
    }

    res.json(filteredProducts);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des produits",
      message: error.message,
    });
  }
});

/**
 * GET /api/:lang/products/:id
 * Récupérer un produit par son ID dans la langue spécifiée
 */
router.get("/products/:id", async (req, res) => {
  try {
    const lang = (req as any).language;
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        translations: {
          where: { language: lang },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Produit non trouvé",
      });
    }

    if (product.translations.length === 0) {
      return res.status(404).json({
        error: "Traduction non disponible pour cette langue",
      });
    }

    const translation = product.translations[0];

    // Retourner le produit avec la traduction intégrée
    res.json({
      id: product.id,
      name: translation.name,
      description: translation.description,
      category: translation.category,
      medium: translation.medium,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      active: product.active,
      dimensions: product.dimensions,
      sendNewsletter: product.sendNewsletter,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du produit",
      message: error.message,
    });
  }
});

export default router;

