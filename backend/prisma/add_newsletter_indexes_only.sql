-- ==========================================
-- Script SQL pour créer uniquement les index Newsletter
-- (À utiliser si la table Newsletter existe déjà mais pas les index)
-- ==========================================

USE `jeffstore`;

-- Créer les index (si ils n'existent pas déjà)
-- Si vous obtenez une erreur "Duplicate key name", c'est normal, les index existent déjà
CREATE INDEX `Newsletter_email_idx` ON `Newsletter` (`email`);
CREATE INDEX `Newsletter_active_idx` ON `Newsletter` (`active`);

-- Vérification
SHOW INDEX FROM `Newsletter`;


