# ✅ Checklist Newsletter - Vérification

## Étapes complétées ✅

- [x] Modèle Newsletter ajouté dans `schema.prisma`
- [x] Table Newsletter créée dans MySQL
- [x] Client Prisma généré avec le modèle Newsletter
- [x] Service SendGrid créé (`emailService.ts`)
- [x] Routes API newsletter créées
- [x] Logique d'envoi automatique implémentée
- [x] Routes intégrées dans `index.ts`

## À vérifier maintenant

### 1. Test de la connexion à la base de données
```bash
npm run test:db
```
Doit afficher les tables incluant Newsletter.

### 2. Configuration SendGrid (optionnel pour tester)
Dans votre `.env`, ajoutez :
```env
SENDGRID_API_KEY="SG.votre_cle_api_ici"
SENDGRID_FROM_EMAIL="noreply@votre-domaine.com"  # Optionnel
```

**Note** : Vous pouvez tester les routes même sans SendGrid, mais aucun email ne sera envoyé.

### 3. Tester les routes API

#### Test 1 : S'abonner
```bash
POST http://localhost:3000/api/newsletter/subscribe
Body: { "email": "test@example.com" }
```

#### Test 2 : Compter les abonnés
```bash
GET http://localhost:3000/api/newsletter/count
```

#### Test 3 : Créer un produit avec newsletter
```bash
POST http://localhost:3000/api/products
Headers: { "Authorization": "Bearer <token_admin>" }
Body: {
  "name": "Test Newsletter",
  "price": 99.99,
  "category": "Art",
  "sendNewsletter": true
}
```

## Prochaines étapes (optionnelles)

### Si vous voulez utiliser SendGrid :

1. Créer un compte SendGrid : https://sendgrid.com
2. Obtenir une clé API
3. Ajouter `SENDGRID_API_KEY` dans `.env`
4. Configurer un domaine vérifié (pour production)

### Si vous gardez Firebase pour l'instant :

Vous pouvez garder le système actuel Firebase pour la newsletter frontend et utiliser les routes API backend en parallèle pour migrer progressivement.

---

**Tout est prêt ! Vous pouvez maintenant tester les routes API newsletter.**


