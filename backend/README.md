# Jeff Store Backend API

Backend Express + MySQL + Prisma pour l'application Jeff Store.

## 📋 Prérequis

- Node.js >= 18
- MySQL (via WAMP)
- npm ou yarn

## 🚀 Installation

1. Installer les dépendances :

```bash
cd from-scratch/backend
npm install
```

2. Configurer les variables d'environnement :
   Créez un fichier `.env` à la racine du dossier `backend/` avec :

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/jeffstore?schema=public"

# JWT Secret (changez cette clé en production !)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS (URLs autorisées pour le frontend)
FRONTEND_URL="http://localhost:5173"

# SendGrid (optionnel, pour la newsletter)
SENDGRID_API_KEY=""
```

3. Créer la base de données MySQL :

- Ouvrez phpMyAdmin (via WAMP)
- Créez une nouvelle base de données nommée `jeffstore`
- Ou exécutez le fichier `prisma/database.sql` dans phpMyAdmin

## 🏃 Développement

```bash
# Lancer le serveur en mode développement
npm run dev

# Le serveur sera accessible sur http://localhost:3000
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/          # Configuration (DB, JWT)
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Auth, validation
│   ├── models/          # Types TypeScript
│   ├── routes/          # Routes API
│   ├── services/        # Services (email, etc.)
│   ├── utils/           # Helpers
│   └── index.ts         # Point d'entrée
├── prisma/
│   ├── schema.prisma    # Schéma de base de données
│   └── seed.ts          # Script de seed
└── package.json
```

## 🔧 Scripts disponibles

- `npm run dev` - Lancer en développement (avec hot-reload)
- `npm run build` - Compiler TypeScript
- `npm run start` - Lancer la version compilée
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Créer/appliquer les migrations
- `npm run prisma:studio` - Ouvrir Prisma Studio (GUI pour la DB)
- `npm run prisma:seed` - Remplir la DB avec des données de test

## 📝 Notes

- Le backend écoute sur le port 3000 par défaut
- CORS est configuré pour accepter les requêtes depuis `http://localhost:5173`
- Les routes API commencent par `/api/`
