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
  
  // Créer 6 impressions numériques avec traductions FR et EN
  const impressions = [
    {
      nameFr: 'Aurore Boréale Digitale',
      nameEn: 'Digital Aurora',
      descriptionFr: 'Une magnifique impression numérique représentant des aurores boréales dansantes. Cette œuvre capte la beauté éthérée des lumières du Nord avec des couleurs vibrantes et des nuances subtiles.',
      descriptionEn: 'A magnificent digital print depicting dancing aurora borealis. This work captures the ethereal beauty of the Northern Lights with vibrant colors and subtle nuances.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
      categoryFr: 'Art Numérique',
      categoryEn: 'Digital Art',
      stock: 15,
      active: true,
      mediumFr: 'Impression numérique sur toile',
      mediumEn: 'Digital print on canvas',
      dimensions: '60x40 cm',
      sendNewsletter: false,
    },
    {
      nameFr: 'Architecture Urbaine Moderne',
      nameEn: 'Modern Urban Architecture',
      descriptionFr: 'Une série de bâtiments futuristes capturés sous un angle unique. Cette impression numérique met en valeur les lignes géométriques et les contrastes de lumière de l\'architecture contemporaine.',
      descriptionEn: 'A series of futuristic buildings captured from a unique angle. This digital print highlights the geometric lines and light contrasts of contemporary architecture.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
      categoryFr: 'Architecture',
      categoryEn: 'Architecture',
      stock: 12,
      active: true,
      mediumFr: 'Impression numérique haute qualité',
      mediumEn: 'High quality digital print',
      dimensions: '50x70 cm',
      sendNewsletter: true,
    },
    {
      nameFr: 'Nature Abstraite',
      nameEn: 'Abstract Nature',
      descriptionFr: 'Une interprétation abstraite et colorée de paysages naturels. Cette œuvre fusionne réalité et imagination pour créer une expérience visuelle unique et apaisante.',
      descriptionEn: 'An abstract and colorful interpretation of natural landscapes. This work merges reality and imagination to create a unique and soothing visual experience.',
      price: 95.99,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      categoryFr: 'Art Numérique',
      categoryEn: 'Digital Art',
      stock: 10,
      active: true,
      mediumFr: 'Impression numérique sur papier premium',
      mediumEn: 'Digital print on premium paper',
      dimensions: '70x50 cm',
      sendNewsletter: false,
    },
    {
      nameFr: 'Portrait Minimaliste',
      nameEn: 'Minimalist Portrait',
      descriptionFr: 'Un portrait stylisé avec un traitement numérique minimaliste. Cette œuvre explore les formes essentielles et les contrastes forts pour révéler l\'émotion pure.',
      descriptionEn: 'A stylized portrait with minimalist digital treatment. This work explores essential forms and strong contrasts to reveal pure emotion.',
      price: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      categoryFr: 'Portrait',
      categoryEn: 'Portrait',
      stock: 8,
      active: true,
      mediumFr: 'Impression numérique sur toile',
      mediumEn: 'Digital print on canvas',
      dimensions: '40x40 cm',
      sendNewsletter: true,
    },
    {
      nameFr: 'Paysage Montagneux',
      nameEn: 'Mountain Landscape',
      descriptionFr: 'Une vue spectaculaire de montagnes enneigées au coucher du soleil. Cette impression numérique capture la majesté et la sérénité des paysages alpins avec des détails impressionnants.',
      descriptionEn: 'A spectacular view of snow-capped mountains at sunset. This digital print captures the majesty and serenity of alpine landscapes with impressive details.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      categoryFr: 'Paysage',
      categoryEn: 'Landscape',
      stock: 20,
      active: true,
      mediumFr: 'Impression numérique sur toile',
      mediumEn: 'Digital print on canvas',
      dimensions: '80x60 cm',
      sendNewsletter: false,
    },
    {
      nameFr: 'Abstraction Géométrique',
      nameEn: 'Geometric Abstraction',
      descriptionFr: 'Une composition géométrique moderne avec des formes et des couleurs audacieuses. Cette œuvre numérique crée un équilibre parfait entre structure et fluidité, idéale pour les espaces contemporains.',
      descriptionEn: 'A modern geometric composition with bold shapes and colors. This digital work creates a perfect balance between structure and fluidity, ideal for contemporary spaces.',
      price: 85.99,
      imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
      categoryFr: 'Art Abstrait',
      categoryEn: 'Abstract Art',
      stock: 14,
      active: true,
      mediumFr: 'Impression numérique premium',
      mediumEn: 'Premium digital print',
      dimensions: '60x60 cm',
      sendNewsletter: true,
    },
  ];

  console.log('📦 Création des impressions numériques...\n');

  let created = 0;
  let skipped = 0;

  for (const impression of impressions) {
    // Vérifier si le produit existe déjà (par nom français via traduction)
    const existing = await prisma.product.findFirst({
      where: {
        translations: {
          some: {
            language: 'fr',
            name: impression.nameFr,
          },
        },
      },
    });

    if (existing) {
      console.log(`⏭️  "${impression.nameFr}" existe déjà (ID: ${existing.id}) - ignoré`);
      skipped++;
    } else {
      const product = await prisma.product.create({
        data: {
          price: impression.price,
          imageUrl: impression.imageUrl,
          stock: impression.stock,
          active: impression.active,
          dimensions: impression.dimensions,
          sendNewsletter: impression.sendNewsletter,
          translations: {
            create: [
              {
                language: 'fr',
                name: impression.nameFr,
                description: impression.descriptionFr || null,
                category: impression.categoryFr,
                medium: impression.mediumFr || null,
              },
              {
                language: 'en',
                name: impression.nameEn,
                description: impression.descriptionEn || null,
                category: impression.categoryEn,
                medium: impression.mediumEn || null,
              },
            ],
          },
        },
        include: {
          translations: true,
        },
      });
      const frName = product.translations.find(t => t.language === 'fr')?.name || impression.nameFr;
      console.log(`✅ "${frName}" créé (ID: ${product.id})`);
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


