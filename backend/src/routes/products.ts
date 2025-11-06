import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { sendNewsletterToSubscribers, generateProductNewsletterHTML } from "../services/emailService.js";

const router = express.Router();

/**
 * GET /api/products
 * Liste tous les produits (actifs uniquement par défaut)
 * Query params: ?all=true pour voir tous les produits, ?category=<nom> pour filtrer
 */
router.get("/", async (req, res) => {
  try {
    const { all, category } = req.query;

    const where: any = {};

    // Si ?all=true n'est pas spécifié, ne montrer que les produits actifs
    if (all !== "true") {
      where.active = true;
    }

    // Filtrer par catégorie si spécifié
    if (category) {
      where.category = category as string;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des produits",
      message: error.message,
    });
  }
});

/**
 * GET /api/products/:id
 * Récupérer un produit par son ID
 */
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        error: "Produit non trouvé",
      });
    }

    res.json(product);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du produit",
      message: error.message,
    });
  }
});

/**
 * POST /api/products
 * Créer un nouveau produit (Admin uniquement)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      // Traductions françaises
      nameFr,
      descriptionFr,
      categoryFr,
      mediumFr,
      // Traductions anglaises
      nameEn,
      descriptionEn,
      categoryEn,
      mediumEn,
      // Champs communs
      price,
      imageUrl,
      stock,
      active,
      dimensions,
      sendNewsletter,
    } = req.body;

    // Validation
    if (!nameFr || !nameEn || !price || !categoryFr || !categoryEn) {
      return res.status(400).json({
        error: "Nom (FR et EN), prix et catégorie (FR et EN) sont requis",
      });
    }

    // Créer le produit avec ses traductions
    const product = await prisma.product.create({
      data: {
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        stock: parseInt(stock) || 0,
        active: active !== undefined ? active : true,
        dimensions: dimensions || null,
        sendNewsletter: sendNewsletter || false,
        translations: {
          create: [
            {
              language: "fr",
              name: nameFr,
              description: descriptionFr || null,
              category: categoryFr,
              medium: mediumFr || null,
            },
            {
              language: "en",
              name: nameEn,
              description: descriptionEn || null,
              category: categoryEn,
              medium: mediumEn || null,
            },
          ],
        },
      },
      include: {
        translations: true,
      },
    });

    // Si sendNewsletter est true, envoyer une newsletter automatique
    if (sendNewsletter) {
      try {
        // Récupérer tous les abonnés actifs
        const subscribers = await prisma.newsletter.findMany({
          where: { active: true },
          select: { email: true },
        });

        if (subscribers.length > 0) {
          const emails = subscribers.map((s) => s.email);
          // Utiliser la traduction française pour la newsletter
          const frTranslation = product.translations.find((t) => t.language === "fr");
          if (frTranslation) {
            const htmlContent = generateProductNewsletterHTML({
              name: frTranslation.name,
              description: frTranslation.description,
              price: product.price.toString(),
              imageUrl: product.imageUrl,
              category: frTranslation.category,
            });

            // Envoyer la newsletter en arrière-plan (ne pas bloquer la réponse)
            sendNewsletterToSubscribers(
              emails,
              `Nouvelle impression disponible : ${frTranslation.name}`,
              htmlContent
            ).then((result) => {
              console.log(`✅ Newsletter envoyée pour le produit "${frTranslation.name}": ${result.success} succès, ${result.failed} échecs`);
            }).catch((error) => {
              console.error(`❌ Erreur lors de l'envoi de la newsletter pour "${frTranslation.name}":`, error);
            });
          }
        } else {
          const frTranslation = product.translations.find((t) => t.language === "fr");
          const productName = frTranslation?.name || "produit";
          console.log(`⚠️  Aucun abonné actif pour envoyer la newsletter du produit "${productName}"`);
        }
      } catch (error: any) {
        // Ne pas faire échouer la création du produit si l'envoi de newsletter échoue
        console.error("Erreur lors de l'envoi automatique de la newsletter:", error);
      }
    }

    res.status(201).json(product);
  } catch (error: any) {
    console.error("Erreur lors de la création du produit:", error);
    res.status(500).json({
      error: "Erreur lors de la création du produit",
      message: error.message,
    });
  }
});

/**
 * PUT /api/products/:id
 * Mettre à jour un produit (Admin uniquement)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    const updateData: any = {};

    // Permettre de mettre à jour uniquement les champs fournis
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.price !== undefined)
      updateData.price = parseFloat(req.body.price);
    if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.stock !== undefined)
      updateData.stock = parseInt(req.body.stock);
    if (req.body.active !== undefined) updateData.active = req.body.active;
    if (req.body.medium !== undefined) updateData.medium = req.body.medium;
    if (req.body.dimensions !== undefined)
      updateData.dimensions = req.body.dimensions;
    if (req.body.sendNewsletter !== undefined)
      updateData.sendNewsletter = req.body.sendNewsletter;

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    res.json(product);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Produit non trouvé",
      });
    }
    console.error("Erreur lors de la mise à jour du produit:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour du produit",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/products/:id
 * Supprimer un produit (Admin uniquement)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: "ID de produit invalide",
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Produit non trouvé",
      });
    }
    console.error("Erreur lors de la suppression du produit:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du produit",
      message: error.message,
    });
  }
});

export default router;

