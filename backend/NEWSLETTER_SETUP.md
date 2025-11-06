# 📧 Guide de mise en place de la Newsletter

## ✅ Ce qui a été implémenté

### 1. **Base de données**
- ✅ Modèle `Newsletter` ajouté dans `schema.prisma`
- ✅ Fichier SQL créé : `prisma/add_newsletter_table.sql`
- ✅ Client Prisma régénéré avec le nouveau modèle

### 2. **Service SendGrid**
- ✅ Service `emailService.ts` créé avec :
  - Envoi d'emails individuels
  - Envoi de newsletters en masse
  - Template HTML pour les produits

### 3. **Routes API Newsletter**
- ✅ `POST /api/newsletter/subscribe` - S'abonner
- ✅ `DELETE /api/newsletter/unsubscribe/:email` - Se désabonner
- ✅ `GET /api/newsletter/subscribers` - Liste des abonnés (Admin)
- ✅ `GET /api/newsletter/count` - Nombre d'abonnés actifs
- ✅ `POST /api/newsletter/send` - Envoyer une newsletter manuelle (Admin)

### 4. **Envoi automatique**
- ✅ Quand un produit est créé avec `sendNewsletter: true`, une newsletter est envoyée automatiquement

---

## 🚀 Étapes de mise en place

### Étape 1 : Créer la table Newsletter dans MySQL

Exécutez le fichier SQL dans phpMyAdmin :

1. Ouvrez phpMyAdmin
2. Sélectionnez la base `jeffstore`
3. Onglet "SQL"
4. Copiez-collez le contenu de `prisma/add_newsletter_table.sql`
5. Cliquez sur "Exécuter"

### Étape 2 : Configurer SendGrid

1. **Créer un compte SendGrid** :
   - Allez sur https://sendgrid.com
   - Créez un compte gratuit (100 emails/jour gratuits)

2. **Obtenir une clé API** :
   - Dans SendGrid Dashboard → Settings → API Keys
   - Créez une nouvelle clé API avec les permissions "Mail Send"
   - Copiez la clé

3. **Configurer le `.env`** :
   ```env
   SENDGRID_API_KEY="SG.votre_cle_api_ici"
   SENDGRID_FROM_EMAIL="noreply@votre-domaine.com"  # Optionnel
   FRONTEND_URL="http://localhost:5173"  # Pour les liens dans les emails
   ```

4. **Vérifier votre domaine (pour production)** :
   - Dans SendGrid → Settings → Sender Authentication
   - Vérifiez votre domaine ou utilisez Single Sender Verification pour les tests

### Étape 3 : Tester la connexion

```bash
# Générer le client Prisma (déjà fait)
npm run prisma:generate

# Démarrer le serveur
npm run dev
```

### Étape 4 : Tester l'API

#### S'abonner à la newsletter :
```bash
POST http://localhost:3000/api/newsletter/subscribe
Body: { "email": "test@example.com" }
```

#### Créer un produit avec newsletter :
```bash
POST http://localhost:3000/api/products
Headers: { "Authorization": "Bearer <token_admin>" }
Body: {
  "name": "Nouveau produit",
  "price": 99.99,
  "category": "Art",
  "sendNewsletter": true  // ← Newsletter sera envoyée automatiquement
}
```

---

## 📝 Routes API détaillées

### `POST /api/newsletter/subscribe`
S'abonner à la newsletter

**Body:**
```json
{ "email": "user@example.com" }
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

### `DELETE /api/newsletter/unsubscribe/:email`
Se désabonner

**Réponse (200):**
```json
{
  "message": "Désabonnement réussi"
}
```

---

### `GET /api/newsletter/count`
Nombre d'abonnés actifs

**Réponse (200):**
```json
{
  "count": 42
}
```

---

### `GET /api/newsletter/subscribers`
Liste des abonnés (Admin uniquement)

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
      "createdAt": "2025-01-11T10:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/newsletter/send`
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

---

## 🔄 Fonctionnement automatique

Quand un produit est créé avec `sendNewsletter: true` :

1. ✅ Le produit est créé dans la base de données
2. ✅ Les abonnés actifs sont récupérés
3. ✅ Un email HTML est généré automatiquement avec :
   - Image du produit
   - Nom, description, prix, catégorie
   - Lien vers le site
4. ✅ L'email est envoyé via SendGrid à tous les abonnés
5. ✅ Le produit est retourné (sans attendre l'envoi de l'email)

**Note** : L'envoi se fait en arrière-plan pour ne pas bloquer la création du produit.

---

## ⚠️ Points importants

1. **SendGrid en développement** :
   - Vous pouvez utiliser le mode "sandbox" de SendGrid pour les tests
   - Limite : 100 emails/jour gratuits
   - En sandbox, vous ne pouvez envoyer qu'aux emails vérifiés

2. **Production** :
   - Vérifiez votre domaine dans SendGrid
   - Configurez SPF et DKIM pour éviter le spam
   - Utilisez une clé API avec les bonnes permissions

3. **Gestion des erreurs** :
   - Si l'envoi échoue, le produit est quand même créé
   - Les erreurs sont loggées dans la console
   - Le nombre de succès/échecs est retourné

4. **Performance** :
   - Les emails sont envoyés par batch de 100
   - L'envoi est asynchrone (ne bloque pas la réponse API)

---

## 🧪 Tests

Pour tester sans configurer SendGrid (mode développement) :

Le service détecte automatiquement si `SENDGRID_API_KEY` est absente et affiche un avertissement. Les routes fonctionneront mais aucun email ne sera envoyé.

---

## 📚 Documentation SendGrid

- API Reference: https://docs.sendgrid.com/api-reference
- Template Guide: https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates

---

**✅ La newsletter est maintenant complètement fonctionnelle !**


