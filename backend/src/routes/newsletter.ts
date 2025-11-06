import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { sendEmail, sendNewsletterToSubscribers, generateProductNewsletterHTML } from "../services/emailService.js";

const router = express.Router();

/**
 * POST /api/newsletter/subscribe
 * S'abonner à la newsletter
 */
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email requis",
      });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Format d'email invalide",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'email existe déjà
    const existing = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.active) {
        return res.status(409).json({
          error: "Cet email est déjà inscrit à la newsletter",
        });
      } else {
        // Réactiver l'abonnement
        const reactivated = await prisma.newsletter.update({
          where: { email: normalizedEmail },
          data: { active: true },
        });
        return res.json({
          message: "Abonnement réactivé",
          subscriber: reactivated,
        });
      }
    }

    // Créer l'abonnement
    const subscriber = await prisma.newsletter.create({
      data: {
        email: normalizedEmail,
        active: true,
      },
    });

    res.status(201).json({
      message: "Inscription à la newsletter réussie",
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'inscription à la newsletter:", error);
    res.status(500).json({
      error: "Erreur lors de l'inscription",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/newsletter/unsubscribe/:email
 * Se désabonner de la newsletter
 */
router.delete("/unsubscribe/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return res.status(404).json({
        error: "Email non trouvé dans la newsletter",
      });
    }

    // Désactiver plutôt que supprimer (pour garder l'historique)
    await prisma.newsletter.update({
      where: { email },
      data: { active: false },
    });

    res.json({
      message: "Désabonnement réussi",
    });
  } catch (error: any) {
    console.error("Erreur lors du désabonnement:", error);
    res.status(500).json({
      error: "Erreur lors du désabonnement",
      message: error.message,
    });
  }
});

/**
 * GET /api/newsletter/subscribers
 * Liste tous les abonnés actifs (Admin uniquement)
 */
router.get("/subscribers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { active } = req.query;

    const where: any = {};
    if (active !== undefined) {
      where.active = active === "true";
    }

    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      count: subscribers.length,
      subscribers,
    });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des abonnés:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des abonnés",
      message: error.message,
    });
  }
});

/**
 * GET /api/newsletter/count
 * Obtenir le nombre d'abonnés actifs
 */
router.get("/count", async (req, res) => {
  try {
    const count = await prisma.newsletter.count({
      where: { active: true },
    });

    res.json({
      count,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Erreur lors du comptage",
      message: error.message,
    });
  }
});

/**
 * POST /api/newsletter/send
 * Envoyer une newsletter manuelle (Admin uniquement)
 */
router.post("/send", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        error: "Sujet et contenu requis",
      });
    }

    // Récupérer tous les abonnés actifs
    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return res.status(400).json({
        error: "Aucun abonné actif à qui envoyer la newsletter",
      });
    }

    const emails = subscribers.map((s) => s.email);

    // Envoyer la newsletter
    const result = await sendNewsletterToSubscribers(emails, subject, content);

    res.json({
      message: "Newsletter envoyée",
      total: subscribers.length,
      success: result.success,
      failed: result.failed,
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
    res.status(500).json({
      error: "Erreur lors de l'envoi de la newsletter",
      message: error.message,
    });
  }
});

export default router;


