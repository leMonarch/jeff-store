import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...\n');

  // Mettre à jour Louis en admin
  console.log('👤 Mise à jour de Louis en admin...\n');
  
  const adminEmail = 'lemirelouisetienne@gmail.com';

  // Vérifier si l'utilisateur existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Utilisateur trouvé: ${adminEmail}`);
    console.log(`   Nom actuel: ${existingAdmin.name || 'Non défini'}`);
    console.log(`   Rôle actuel: ${existingAdmin.role}`);
    
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        name: 'Louis',
        role: 'admin',
      },
    });
    console.log(`\n✅ Utilisateur ${adminEmail} mis à jour:`);
    console.log(`   Nom: Louis`);
    console.log(`   Rôle: admin\n`);
  } else {
    console.log(`⚠️  L'utilisateur ${adminEmail} n'existe pas dans la base de données.`);
    console.log(`   Création de l'utilisateur admin...`);
    
    const adminPassword = 'admin123'; // Changez ce mot de passe en production !
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Louis',
        role: 'admin',
      },
    });
    console.log(`✅ Utilisateur admin créé:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nom: ${admin.name}`);
    console.log(`   Rôle: ${admin.role}`);
    console.log(`   Mot de passe: ${adminPassword} (à changer en production !)\n`);
  }

  // Supprimer les produits existants (optionnel, pour réinitialiser)
  // await prisma.product.deleteMany({});
  
  // Créer 6 impressions numériques
  const impressions = [
    {
      name: 'Aurore Boréale Digitale',
      description: 'Une magnifique impression numérique représentant des aurores boréales dansantes. Cette œuvre capte la beauté éthérée des lumières du Nord avec des couleurs vibrantes et des nuances subtiles.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
      category: 'Art Numérique',
      stock: 15,
      active: true,
      medium: 'Impression numérique sur toile',
      dimensions: '60x40 cm',
      sendNewsletter: false,
    },
    {
      name: 'Architecture Urbaine Moderne',
      description: 'Une série de bâtiments futuristes capturés sous un angle unique. Cette impression numérique met en valeur les lignes géométriques et les contrastes de lumière de l\'architecture contemporaine.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
      category: 'Architecture',
      stock: 12,
      active: true,
      medium: 'Impression numérique haute qualité',
      dimensions: '50x70 cm',
      sendNewsletter: true,
    },
    {
      name: 'Nature Abstraite',
      description: 'Une interprétation abstraite et colorée de paysages naturels. Cette œuvre fusionne réalité et imagination pour créer une expérience visuelle unique et apaisante.',
      price: 95.99,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      category: 'Art Numérique',
      stock: 10,
      active: true,
      medium: 'Impression numérique sur papier premium',
      dimensions: '70x50 cm',
      sendNewsletter: false,
    },
    {
      name: 'Portrait Minimaliste',
      description: 'Un portrait stylisé avec un traitement numérique minimaliste. Cette œuvre explore les formes essentielles et les contrastes forts pour révéler l\'émotion pure.',
      price: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      category: 'Portrait',
      stock: 8,
      active: true,
      medium: 'Impression numérique sur toile',
      dimensions: '40x40 cm',
      sendNewsletter: true,
    },
    {
      name: 'Paysage Montagneux',
      description: 'Une vue spectaculaire de montagnes enneigées au coucher du soleil. Cette impression numérique capture la majesté et la sérénité des paysages alpins avec des détails impressionnants.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      category: 'Paysage',
      stock: 20,
      active: true,
      medium: 'Impression numérique sur toile',
      dimensions: '80x60 cm',
      sendNewsletter: false,
    },
    {
      name: 'Abstraction Géométrique',
      description: 'Une composition géométrique moderne avec des formes et des couleurs audacieuses. Cette œuvre numérique crée un équilibre parfait entre structure et fluidité, idéale pour les espaces contemporains.',
      price: 85.99,
      imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
      category: 'Art Abstrait',
      stock: 14,
      active: true,
      medium: 'Impression numérique premium',
      dimensions: '60x60 cm',
      sendNewsletter: true,
    },
  ];

  console.log('📦 Création des impressions numériques...\n');

  let created = 0;
  let skipped = 0;

  for (const impression of impressions) {
    // Vérifier si le produit existe déjà (par nom)
    const existing = await prisma.product.findFirst({
      where: {
        name: impression.name,
      },
    });

    if (existing) {
      console.log(`⏭️  "${impression.name}" existe déjà (ID: ${existing.id}) - ignoré`);
      skipped++;
    } else {
      const product = await prisma.product.create({
        data: impression,
      });
      console.log(`✅ "${product.name}" créé (ID: ${product.id})`);
      created++;
    }
  }

  console.log(`\n✨ Résumé:`);
  console.log(`   ${created} impression(s) créée(s)`);
  if (skipped > 0) {
    console.log(`   ${skipped} impression(s) déjà existante(s) - ignorée(s)`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


