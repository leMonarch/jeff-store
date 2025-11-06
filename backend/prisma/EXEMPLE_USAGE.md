# 💻 Exemple d'utilisation de Prisma dans votre code Express

## 📦 1. Initialiser Prisma Client

Créez un fichier `src/lib/prisma.ts` :

```typescript
import { PrismaClient } from '@prisma/client';

// Créer une seule instance de Prisma Client
const prisma = new PrismaClient();

// Fermer la connexion proprement à l'arrêt
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
```

## 🎯 2. Utiliser Prisma dans vos routes Express

### Exemple : Route pour lister tous les produits

```typescript
// src/routes/products.ts
import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET /api/products - Liste tous les produits actifs
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true  // Seulement les produits actifs
      },
      orderBy: {
        createdAt: 'desc'  // Plus récents en premier
      }
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

export default router;
```

### Exemple : Route pour créer un produit

```typescript
// POST /api/products - Créer un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock, medium, dimensions } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),  // Convertir en nombre
        imageUrl,
        category,
        stock: parseInt(stock) || 0,
        medium,
        dimensions,
        active: true
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du produit' });
  }
});
```

### Exemple : Route pour obtenir un produit par ID

```typescript
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});
```

### Exemple : Route pour mettre à jour un produit

```typescript
// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = req.body;
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });
    
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Produit non trouvé' });
  }
});
```

### Exemple : Route pour supprimer un produit

```typescript
// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    await prisma.product.delete({
      where: { id: productId }
    });
    
    res.status(204).send();  // 204 = No Content
  } catch (error) {
    res.status(404).json({ error: 'Produit non trouvé' });
  }
});
```

## ❤️ 3. Exemple : Gestion des favoris avec relations

```typescript
// src/routes/favorites.ts
import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET /api/users/:userId/favorites - Liste les favoris d'un utilisateur
router.get('/users/:userId/favorites', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Récupérer les favoris avec les détails du produit
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true  // Inclure les détails du produit
      }
    });
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
  }
});

// POST /api/users/:userId/favorites - Ajouter un produit aux favoris
router.post('/users/:userId/favorites', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { productId } = req.body;
    
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId: parseInt(productId)
      },
      include: {
        product: true  // Retourner le produit complet
      }
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    // Si déjà en favoris, Prisma lèvera une erreur (contrainte unique)
    res.status(400).json({ error: 'Produit déjà en favoris ou erreur' });
  }
});

// DELETE /api/users/:userId/favorites/:productId - Retirer un favori
router.delete('/users/:userId/favorites/:productId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    
    await prisma.favorite.deleteMany({
      where: {
        userId,
        productId
      }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
```

## 🔐 4. Exemple : Authentification utilisateur

```typescript
// src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

const router = express.Router();

// POST /api/auth/register - Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
        // Ne PAS retourner le password
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Ici, vous pouvez générer un JWT token
    // (exemple simplifié)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      // token: generateToken(user)  // À implémenter
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});
```

## 🔍 5. Requêtes avancées

```typescript
// Rechercher des produits par catégorie
const products = await prisma.product.findMany({
  where: {
    category: 'Art',
    active: true,
    price: {
      lte: 100  // Prix <= 100
    }
  }
});

// Pagination
const products = await prisma.product.findMany({
  skip: 0,      // Début
  take: 10,     // Nombre d'éléments
  orderBy: {
    createdAt: 'desc'
  }
});

// Compter
const count = await prisma.product.count({
  where: {
    active: true
  }
});

// Requête avec plusieurs conditions
const products = await prisma.product.findMany({
  where: {
    AND: [
      { active: true },
      { stock: { gt: 0 } },  // Stock > 0
      {
        OR: [
          { category: 'Art' },
          { category: 'Design' }
        ]
      }
    ]
  }
});
```

## 📝 Notes importantes

1. **Toujours utiliser `await`** avec Prisma (requêtes asynchrones)
2. **Gérer les erreurs** avec try/catch
3. **Ne jamais exposer les mots de passe** (utilisez `select`)
4. **Fermer Prisma** proprement à l'arrêt de l'application
5. **Utiliser les relations** pour éviter les requêtes multiples


