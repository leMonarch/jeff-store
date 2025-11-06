# 📚 Explication de Prisma dans votre projet

## 🎯 Qu'est-ce que Prisma ?

**Prisma** est un **ORM (Object-Relational Mapping)** moderne pour Node.js. Il fait le lien entre votre code TypeScript/JavaScript et votre base de données MySQL.

### 🏗️ Architecture avec Prisma :

```
┌─────────────────┐
│   Votre Code    │
│   (Express)     │
└────────┬────────┘
         │
         │ Utilise Prisma Client
         ▼
┌─────────────────┐
│  Prisma Client  │ ← Généré automatiquement
│  (Type-Safe)    │
└────────┬────────┘
         │
         │ Traduit en SQL
         ▼
┌─────────────────┐
│   MySQL (WAMP)  │
│   Base données  │
└─────────────────┘
```

## 📁 Structure Prisma dans votre projet

```
backend/
├── prisma/
│   ├── schema.prisma    ← 🎨 Définit la structure de votre DB
│   ├── seed.ts          ← 🌱 Remplit la DB avec des données test
│   └── migrations/      ← 📝 Historique des modifications (auto-généré)
└── .env                 ← 🔗 DATABASE_URL pointe vers MySQL
```

## 🔑 Les 3 composants principaux :

### 1. **schema.prisma** - Le "design" de votre base de données

Ce fichier décrit **TOUTES** vos tables en langage Prisma :

```prisma
// Exemple pour votre store
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Float
  image     String?
  createdAt DateTime @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

### 2. **Prisma Client** - Le code TypeScript généré automatiquement

Après `npm run prisma:generate`, Prisma crée un client TypeScript avec :
- ✅ **Type-safety** : Autocomplétion dans votre IDE
- ✅ **Requêtes simples** : Pas besoin d'écrire du SQL
- ✅ **Validation** : Erreurs détectées avant l'exécution

**Exemple d'utilisation dans votre code Express :**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un produit
const product = await prisma.product.create({
  data: {
    name: "iPhone 15",
    price: 999.99,
    image: "https://..."
  }
});

// Lire tous les produits
const products = await prisma.product.findMany();

// Chercher par ID
const product = await prisma.product.findUnique({
  where: { id: 1 }
});

// Mettre à jour
await prisma.product.update({
  where: { id: 1 },
  data: { price: 899.99 }
});

// Supprimer
await prisma.product.delete({
  where: { id: 1 }
});
```

### 3. **Migrations** - Historique des changements

Quand vous modifiez `schema.prisma` et lancez `npm run prisma:migrate` :
1. Prisma génère des fichiers SQL de migration
2. Prisma applique ces migrations à votre MySQL
3. Votre base de données est synchronisée avec le schéma

## 🚀 Workflow Prisma dans votre projet

### Étape 1 : Définir le schéma
Écrivez vos modèles dans `prisma/schema.prisma`

### Étape 2 : Générer le client
```bash
npm run prisma:generate
```
→ Crée le code TypeScript que vous utiliserez

### Étape 3 : Appliquer les migrations
```bash
npm run prisma:migrate
```
→ Crée les tables dans MySQL selon votre schéma

### Étape 4 : Utiliser dans votre code
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

## 🛠️ Scripts Prisma disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `prisma:generate` | `npm run prisma:generate` | Génère le client TypeScript |
| `prisma:migrate` | `npm run prisma:migrate` | Crée/applique les migrations |
| `prisma:studio` | `npm run prisma:studio` | Interface graphique pour voir/éditer la DB |
| `prisma:seed` | `npm run prisma:seed` | Remplit la DB avec des données test |

## 🎯 Avantages de Prisma

✅ **Type-Safety** : Erreurs détectées à la compilation
✅ **Autocomplétion** : Votre IDE connaît toutes vos tables
✅ **Migrations automatiques** : Pas besoin d'écrire du SQL manuellement
✅ **Relation simple** : Définir les relations entre tables est facile
✅ **Productivité** : Moins de code à écrire que SQL brut

## 📝 Exemple concret pour Jeff Store

Voici ce que pourrait être votre `schema.prisma` :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  favorites Favorite[]
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  image       String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  favorites   Favorite[]
}

model Favorite {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

## 🔄 Cycle de développement

1. **Modifier** `schema.prisma`
2. **Générer** le client : `npm run prisma:generate`
3. **Migrer** la base : `npm run prisma:migrate`
4. **Utiliser** dans votre code Express

---

**En résumé : Prisma = Interface type-safe entre votre code Express et MySQL**


