# 🚀 Prochaines étapes après création de la base de données

## ✅ Étape 1 : Vérifier votre `.env`

Assurez-vous que votre fichier `backend/.env` contient :

```env
DATABASE_URL="mysql://root:@localhost:3306/jeffstore?schema=public"
```

⚠️ **Important** : Le nom de la base doit être `jeffstore` (sans underscore)

## 📋 Étape 2 : Créer les tables dans MySQL

Vous avez 2 options :

### Option A : Via le fichier SQL (Recommandé si pas encore fait)

1. Ouvrez phpMyAdmin
2. Sélectionnez la base `jeffstore`
3. Allez dans l'onglet **"SQL"**
4. Ouvrez `backend/prisma/database.sql`
5. Copiez-collez le contenu et cliquez **"Exécuter"**

### Option B : Via Prisma Migrate

```bash
npm run prisma:migrate
```

## 🔧 Étape 3 : Générer le client Prisma

Cette commande génère le code TypeScript que vous utiliserez dans votre application :

```bash
npm run prisma:generate
```

## 📦 Étape 4 : Créer le fichier Prisma Client

Créez `src/lib/prisma.ts` pour initialiser Prisma (voir ci-dessous)

## ✅ Étape 5 : Tester la connexion

Testez que tout fonctionne correctement.

---

## 🎯 Commands à exécuter dans l'ordre

```bash
# 1. Vérifier que vous êtes dans le dossier backend
cd backend

# 2. Générer le client Prisma
npm run prisma:generate

# 3. (Si les tables n'existent pas encore) Créer les tables
npm run prisma:migrate

# 4. (Optionnel) Ouvrir Prisma Studio pour visualiser la DB
npm run prisma:studio
```


