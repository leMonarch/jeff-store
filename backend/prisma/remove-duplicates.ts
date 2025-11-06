import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des doublons...\n');

  // Récupérer tous les produits
  const allProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc', // Plus récents en premier
    },
  });

  console.log(`📦 Total de produits dans la DB: ${allProducts.length}\n`);

  // Grouper par nom pour trouver les doublons
  const productsByName = new Map<string, typeof allProducts>();

  for (const product of allProducts) {
    const name = product.name;
    if (!productsByName.has(name)) {
      productsByName.set(name, []);
    }
    productsByName.get(name)!.push(product);
  }

  // Trouver les doublons (noms qui apparaissent plus d'une fois)
  const duplicates: Array<{ name: string; products: typeof allProducts }> = [];

  for (const [name, products] of productsByName.entries()) {
    if (products.length > 1) {
      duplicates.push({ name, products });
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ Aucun doublon trouvé !\n');
    return;
  }

  console.log(`⚠️  ${duplicates.length} produit(s) avec des doublons trouvés:\n`);

  let totalToDelete = 0;
  const idsToDelete: number[] = [];

  for (const { name, products } of duplicates) {
    console.log(`📋 "${name}" - ${products.length} exemplaire(s)`);
    
    // Garder le plus récent (premier dans la liste car trié par createdAt desc)
    const toKeep = products[0];
    const toDelete = products.slice(1);

    console.log(`   ✅ Garder: ID ${toKeep.id} (créé le ${toKeep.createdAt.toLocaleString()})`);
    
    for (const product of toDelete) {
      console.log(`   ❌ Supprimer: ID ${product.id} (créé le ${product.createdAt.toLocaleString()})`);
      idsToDelete.push(product.id);
      totalToDelete++;
    }
    console.log('');
  }

  if (idsToDelete.length === 0) {
    console.log('✅ Aucun doublon à supprimer.\n');
    return;
  }

  console.log(`\n🗑️  Suppression de ${totalToDelete} doublon(s)...\n`);

  // Supprimer les doublons
  const deleteResult = await prisma.product.deleteMany({
    where: {
      id: {
        in: idsToDelete,
      },
    },
  });

  console.log(`✅ ${deleteResult.count} doublon(s) supprimé(s) avec succès !\n`);

  // Afficher le résultat final
  const remainingProducts = await prisma.product.findMany();
  console.log(`📊 Total de produits restants: ${remainingProducts.length}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la suppression des doublons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

