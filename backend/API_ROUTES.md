# 📚 Documentation des Routes API

## 🔐 Authentification

### POST `/api/auth/register`
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // Optionnel
}
```

**Réponse (201):**
```json
{
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/api/auth/login`
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### GET `/api/auth/me`
Récupérer les informations de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2025-01-11T10:00:00.000Z"
}
```

---

## 🛍️ Produits

### GET `/api/products`
Liste tous les produits actifs

**Query params:**
- `?all=true` - Afficher tous les produits (y compris inactifs)
- `?category=<nom>` - Filtrer par catégorie

**Exemple:**
```
GET /api/products
GET /api/products?category=Art
GET /api/products?all=true
```

**Réponse (200):**
```json
[
  {
    "id": 1,
    "name": "Tableau d'art",
    "description": "Belle œuvre d'art",
    "price": "99.99",
    "imageUrl": "https://...",
    "category": "Art",
    "stock": 10,
    "active": true,
    "medium": "Huile",
    "dimensions": "50x50",
    "sendNewsletter": false,
    "createdAt": "2025-01-11T10:00:00.000Z",
    "updatedAt": "2025-01-11T10:00:00.000Z"
  }
]
```

---

### GET `/api/products/:id`
Récupérer un produit par son ID

**Réponse (200):**
```json
{
  "id": 1,
  "name": "Tableau d'art",
  "description": "Belle œuvre d'art",
  "price": "99.99",
  "imageUrl": "https://...",
  "category": "Art",
  "stock": 10,
  "active": true,
  "medium": "Huile",
  "dimensions": "50x50",
  "sendNewsletter": false,
  "createdAt": "2025-01-11T10:00:00.000Z",
  "updatedAt": "2025-01-11T10:00:00.000Z"
}
```

---

### POST `/api/products`
Créer un nouveau produit (Admin uniquement)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Tableau d'art",
  "description": "Belle œuvre d'art",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Art",
  "stock": 10,
  "active": true,
  "medium": "Huile",
  "dimensions": "50x50",
  "sendNewsletter": false
}
```

**Réponse (201):**
```json
{
  "id": 1,
  "name": "Tableau d'art",
  ...
}
```

---

### PUT `/api/products/:id`
Mettre à jour un produit (Admin uniquement)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (Tous les champs sont optionnels)
```json
{
  "name": "Nouveau nom",
  "price": 89.99,
  "stock": 5
}
```

---

### DELETE `/api/products/:id`
Supprimer un produit (Admin uniquement)

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (204):** Pas de contenu

---

## ❤️ Favoris

### GET `/api/favorites`
Liste tous les favoris de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "createdAt": "2025-01-11T10:00:00.000Z",
    "product": {
      "id": 1,
      "name": "Tableau d'art",
      "price": "99.99",
      ...
    }
  }
]
```

---

### GET `/api/favorites/check/:productId`
Vérifier si un produit est en favori

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "isFavorite": true
}
```

---

### POST `/api/favorites`
Ajouter un produit aux favoris

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "productId": 1
}
```

**Réponse (201):**
```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "createdAt": "2025-01-11T10:00:00.000Z",
  "product": {
    "id": 1,
    "name": "Tableau d'art",
    ...
  }
}
```

---

### DELETE `/api/favorites/:productId`
Retirer un produit des favoris

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (204):** Pas de contenu

---

## 📧 Newsletter

### POST `/api/newsletter/subscribe`
S'abonner à la newsletter

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Réponse (201):**
```json
{
  "message": "Inscription à la newsletter réussie",
  "subscriber": {
    "email": "user@example.com",
    "subscribedAt": "2025-01-11T10:00:00.000Z"
  }
}
```

---

### DELETE `/api/newsletter/unsubscribe/:email`
Se désabonner de la newsletter

**Réponse (200):**
```json
{
  "message": "Désabonnement réussi"
}
```

---

### GET `/api/newsletter/count`
Obtenir le nombre d'abonnés actifs

**Réponse (200):**
```json
{
  "count": 42
}
```

---

### GET `/api/newsletter/subscribers`
Liste tous les abonnés (Admin uniquement)

**Headers:**
```
Authorization: Bearer <token>
```

**Query params:**
- `?active=true` - Seulement les actifs
- `?active=false` - Seulement les désactivés

**Réponse (200):**
```json
{
  "count": 42,
  "subscribers": [
    {
      "id": 1,
      "email": "user@example.com",
      "active": true,
      "createdAt": "2025-01-11T10:00:00.000Z",
      "updatedAt": "2025-01-11T10:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/newsletter/send`
Envoyer une newsletter manuelle (Admin uniquement)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "subject": "Nouvelle collection disponible !",
  "content": "<h1>Bonjour</h1><p>Découvrez nos nouvelles impressions...</p>"
}
```

**Réponse (200):**
```json
{
  "message": "Newsletter envoyée",
  "total": 42,
  "success": 40,
  "failed": 2
}
```

**Note :** Quand un produit est créé avec `sendNewsletter: true`, une newsletter est automatiquement envoyée à tous les abonnés actifs.

---

## 🧪 Routes de test

### GET `/api/health`
Vérifier que le serveur fonctionne

**Réponse (200):**
```json
{
  "status": "OK",
  "message": "Backend API is running",
  "timestamp": "2025-01-11T10:00:00.000Z"
}
```

---

### GET `/api/test-db`
Tester la connexion à la base de données

**Réponse (200):**
```json
{
  "status": "OK",
  "message": "Connexion à la base de données réussie !",
  "database": "jeffstore",
  "tables": {
    "users": 0,
    "products": 0
  },
  "timestamp": "2025-01-11T10:00:00.000Z"
}
```

---

## 🔑 Authentification JWT

Pour accéder aux routes protégées, incluez le token JWT dans les headers :

```
Authorization: Bearer <votre-token-jwt>
```

Le token est obtenu lors de l'inscription (`/api/auth/register`) ou de la connexion (`/api/auth/login`).

---

## ⚠️ Gestion des erreurs

Toutes les routes retournent des erreurs au format :

```json
{
  "error": "Message d'erreur",
  "message": "Détails supplémentaires" // Optionnel
}
```

**Codes HTTP:**
- `200` - Succès
- `201` - Créé
- `204` - Pas de contenu (succès sans réponse)
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Accès refusé (pas les droits)
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email déjà utilisé)
- `500` - Erreur serveur

