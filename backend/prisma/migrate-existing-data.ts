import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migration des données existantes vers ProductTranslation...\n');

  // Récupérer tous les produits existants avec leurs anciennes colonnes
  // Note: On utilise $queryRawUnsafe car les colonnes n'existent plus dans le schéma Prisma
  const products = await prisma.$queryRawUnsafe<Array<{
    id: number;
    name: string | null;
    description: string | null;
    category: string | null;
    medium: string | null;
  }>>(`
    SELECT id, name, description, category, medium
    FROM Product
    WHERE name IS NOT NULL
  `);

  console.log(`📦 ${products.length} produit(s) trouvé(s)\n`);

  let migrated = 0;
  let skipped = 0;

  for (const product of products) {
    // Vérifier si des traductions existent déjà
    const existingTranslations = await prisma.productTranslation.findMany({
      where: { productId: product.id },
    });

    if (existingTranslations.length > 0) {
      console.log(`⏭️  Produit ID ${product.id} a déjà des traductions - ignoré`);
      skipped++;
      continue;
    }

    // Créer les traductions FR et EN avec les mêmes valeurs
    try {
      await prisma.productTranslation.createMany({
        data: [
          {
            productId: product.id,
            language: 'fr',
            name: product.name || '',
            description: product.description || null,
            category: product.category || '',
            medium: product.medium || null,
          },
          {
            productId: product.id,
            language: 'en',
            name: product.name || '',
            description: product.description || null,
            category: product.category || '',
            medium: product.medium || null,
          },
        ],
      });
      console.log(`✅ Produit ID ${product.id} migré (FR + EN)`);
      migrated++;
    } catch (error: any) {
      console.error(`❌ Erreur pour le produit ID ${product.id}:`, error.message);
    }
  }

  console.log(`\n✨ Résumé:`);
  console.log(`   ${migrated} produit(s) migré(s)`);
  if (skipped > 0) {
    console.log(`   ${skipped} produit(s) déjà migré(s) - ignoré(s)`);
  }
  console.log(`\n✅ Migration terminée ! Vous pouvez maintenant exécuter la migration Prisma.`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

