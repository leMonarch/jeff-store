-- Script de migration des données existantes vers ProductTranslation
-- À exécuter AVANT la migration Prisma

-- 1. Créer la table ProductTranslation si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS `ProductTranslation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `language` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(191) NOT NULL,
  `medium` VARCHAR(191),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductTranslation_productId_language_key` (`productId`, `language`),
  KEY `ProductTranslation_productId_idx` (`productId`),
  KEY `ProductTranslation_language_idx` (`language`),
  CONSTRAINT `ProductTranslation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Migrer les données existantes de Product vers ProductTranslation
-- Créer des entrées FR et EN avec les mêmes valeurs pour chaque produit existant
INSERT INTO `ProductTranslation` (`productId`, `language`, `name`, `description`, `category`, `medium`)
SELECT 
  `id` as `productId`,
  'fr' as `language`,
  `name`,
  `description`,
  `category`,
  `medium`
FROM `Product`
WHERE `name` IS NOT NULL AND `name` != '';

INSERT INTO `ProductTranslation` (`productId`, `language`, `name`, `description`, `category`, `medium`)
SELECT 
  `id` as `productId`,
  'en' as `language`,
  `name`,
  `description`,
  `category`,
  `medium`
FROM `Product`
WHERE `name` IS NOT NULL AND `name` != '';

-- Note: Après avoir exécuté ce script, vous pouvez exécuter la migration Prisma
-- qui supprimera les colonnes name, description, category, medium de la table Product

