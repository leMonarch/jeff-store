import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

// Extension de l'interface Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token JWT et ajoute les infos utilisateur à req.user
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupérer le token depuis l'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token d'authentification manquant",
        message: "Utilisez le format: Authorization: Bearer <token>",
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    const decoded = verifyToken(token);

    // Ajouter les infos utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      error: "Token invalide ou expiré",
      message: error.message,
    });
  }
}

/**
 * Middleware pour vérifier le rôle admin
 */
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentification requise",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Accès refusé",
      message: "Réservé aux administrateurs",
    });
  }

  next();
}


