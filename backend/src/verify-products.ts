import dotenv from "dotenv";
dotenv.config();

import prisma from "./lib/prisma.js";

async function verifyProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });

    console.log(`\n📦 ${products.length} produit(s) trouvé(s) :\n`);

    products.forEach((product) => {
      console.log(`✅ ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Prix: ${product.price}€`);
      console.log(`   Catégorie: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Dimensions: ${product.dimensions}`);
      console.log("");
    });
  } catch (error: any) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts();


