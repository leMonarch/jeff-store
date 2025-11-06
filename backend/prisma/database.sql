-- ==========================================
-- Script SQL pour créer la base de données
-- Jeff Store dans MySQL (WAMP)
-- ==========================================
-- Instructions :
-- 1. Ouvrez phpMyAdmin (via WAMP)
-- 2. Sélectionnez votre serveur MySQL
-- 3. Allez dans l'onglet "SQL"
-- 4. Copiez-collez tout ce fichier
-- 5. Cliquez sur "Exécuter"
-- ==========================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `jeffstore` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE `jeffstore`;

-- ==========================================
-- Table : User (Utilisateurs)
-- ==========================================
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Table : Product (Produits)
-- ==========================================
CREATE TABLE IF NOT EXISTS `Product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `imageUrl` VARCHAR(500) NULL,
  `category` VARCHAR(255) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `medium` VARCHAR(255) NULL,
  `dimensions` VARCHAR(255) NULL,
  `sendNewsletter` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Table : Favorite (Favoris)
-- ==========================================
CREATE TABLE IF NOT EXISTS `Favorite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `productId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Favorite_userId_productId_key` (`userId`, `productId`),
  CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) 
    REFERENCES `User` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `Favorite_productId_fkey` FOREIGN KEY (`productId`) 
    REFERENCES `Product` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Table : Newsletter (Abonnés à la newsletter)
-- ==========================================
CREATE TABLE IF NOT EXISTS `Newsletter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Newsletter_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Index pour améliorer les performances
-- ==========================================
CREATE INDEX `Favorite_userId_idx` ON `Favorite` (`userId`);
CREATE INDEX `Favorite_productId_idx` ON `Favorite` (`productId`);
CREATE INDEX `Product_category_idx` ON `Product` (`category`);
CREATE INDEX `Product_active_idx` ON `Product` (`active`);
-- Index pour Newsletter (créer seulement si la table Newsletter existe)
CREATE INDEX `Newsletter_email_idx` ON `Newsletter` (`email`);
CREATE INDEX `Newsletter_active_idx` ON `Newsletter` (`active`);

-- ==========================================
-- Vérification : Afficher les tables créées
-- ==========================================
SHOW TABLES;

-- ==========================================
-- Optionnel : Insérer un utilisateur admin de test
-- ==========================================
-- Mot de passe : "admin123" (hash bcrypt)
-- Vous pouvez générer un nouveau hash avec : npm run bcrypt "votre-mot-de-passe"
-- INSERT INTO `User` (`email`, `password`, `name`, `role`) 
-- VALUES ('admin@jeffstore.com', '$2b$10$votreHashBcryptIci', 'Admin', 'admin');

