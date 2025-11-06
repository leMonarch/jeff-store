// IMPORTANT : Charger dotenv AVANT d'importer prisma
import dotenv from "dotenv";
dotenv.config();

import prisma from "./lib/prisma.js";

async function testConnection() {
  try {
    console.log("🔍 Test de connexion à la base de données...\n");

    // Test 1: Compter les utilisateurs
    const userCount = await prisma.user.count();
    console.log(`✅ Table User: ${userCount} utilisateur(s)`);

    // Test 2: Compter les produits
    const productCount = await prisma.product.count();
    console.log(`✅ Table Product: ${productCount} produit(s)`);

    // Test 3: Compter les favoris
    const favoriteCount = await prisma.favorite.count();
    console.log(`✅ Table Favorite: ${favoriteCount} favori(s)`);

    // Test 4: Compter les abonnés newsletter
    const newsletterCount = await prisma.newsletter.count();
    console.log(`✅ Table Newsletter: ${newsletterCount} abonné(s)`);

    console.log("\n✅ Connexion à la base de données réussie !");
    console.log(`📊 Base de données: jeffstore`);
    console.log(`🔗 DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Erreur de connexion à la base de données:");
    console.error(error.message);
    
    if (error.message.includes("Unknown database")) {
      console.error("\n💡 Solution: Assurez-vous que la base de données 'jeffstore' existe dans MySQL");
    } else if (error.message.includes("Access denied")) {
      console.error("\n💡 Solution: Vérifiez vos identifiants MySQL dans DATABASE_URL");
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();

