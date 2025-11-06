-- ==========================================
-- Script SQL pour ajouter la table Newsletter
-- (Si les autres tables existent déjà)
-- ==========================================
-- Instructions :
-- 1. Ouvrez phpMyAdmin (via WAMP)
-- 2. Sélectionnez la base de données `jeffstore`
-- 3. Allez dans l'onglet "SQL"
-- 4. Copiez-collez ce fichier
-- 5. Cliquez sur "Exécuter"
-- ==========================================

USE `jeffstore`;

-- Créer la table Newsletter si elle n'existe pas
CREATE TABLE IF NOT EXISTS `Newsletter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Newsletter_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour améliorer les performances
-- Note: MySQL ne supporte pas IF NOT EXISTS pour les index
-- Si les index existent déjà, vous aurez une erreur mais ce n'est pas grave
CREATE INDEX `Newsletter_email_idx` ON `Newsletter` (`email`);
CREATE INDEX `Newsletter_active_idx` ON `Newsletter` (`active`);

-- Vérification
SHOW TABLES;

