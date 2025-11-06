# 📚 Explication des Commandes Prisma

## 🔧 Scripts Prisma disponibles dans votre projet

Votre `package.json` contient plusieurs scripts Prisma. Voici ce que chacun fait :

---

## 1. `npm run prisma:generate`

### À quoi ça sert ?
Génère le **Prisma Client** - le code TypeScript que vous utilisez dans votre application pour interagir avec la base de données.

### Quand l'utiliser ?
- ✅ **Après avoir modifié `schema.prisma`** (ajout/modification de modèles)
- ✅ **Après avoir installé Prisma** pour la première fois
- ✅ **Après avoir fait `npm install`** dans un nouveau projet

### Ce qui se passe :
- Prisma lit votre `schema.prisma`
- Génère automatiquement le code TypeScript dans `node_modules/@prisma/client`
- Ce code contient toutes les fonctions comme `prisma.user.findMany()`, `prisma.product.create()`, etc.

### Exemple :
```bash
npm run prisma:generate
# → Génère le client TypeScript utilisable dans votre code
```

---

## 2. `npm run prisma:migrate`

### À quoi ça sert ?
Crée et applique des **migrations** - des modifications à votre base de données MySQL.

### Quand l'utiliser ?
- ✅ **Quand vous modifiez `schema.prisma`** et voulez mettre à jour la base de données
- ✅ **Au début du projet** pour créer les tables initiales
- ✅ **Après chaque modification** du schéma de base de données

### Ce qui se passe :
1. Prisma compare votre `schema.prisma` avec l'état actuel de la base de données
2. Génère un fichier SQL de migration dans `prisma/migrations/`
3. Applique cette migration à votre base MySQL
4. Met à jour les tables pour qu'elles correspondent au schéma

### Exemple :
```bash
npm run prisma:migrate
# → Prisma vous demande un nom pour la migration
# → Crée et applique les changements à MySQL
```

---

## 3. `npm run prisma:studio`

### À quoi ça sert ?
Ouvre **Prisma Studio** - une interface graphique (dans votre navigateur) pour visualiser et modifier votre base de données.

### Quand l'utiliser ?
- ✅ **Pour voir vos données** visuellement
- ✅ **Pour tester rapidement** sans écrire de code
- ✅ **Pour déboguer** et vérifier ce qui est dans la base

### Ce qui se passe :
- Ouvre un serveur local (généralement sur `http://localhost:5555`)
- Affiche toutes vos tables dans une interface graphique
- Permet de voir, créer, modifier, supprimer des données

### Exemple :
```bash
npm run prisma:studio
# → Ouvre http://localhost:5555 dans votre navigateur
# → Interface graphique pour voir/modifier vos données
```

---

## 4. `npm run prisma:seed`

### À quoi ça sert ?
Exécute le script **seed** (`prisma/seed.ts`) pour remplir votre base de données avec des données de test/exemple.

### Quand l'utiliser ?
- ✅ **Au début du projet** pour avoir des données de test
- ✅ **Après avoir vidé la base** pour la repeupler
- ✅ **Pour tester** votre application avec des données réelles

### Ce qui se passe :
- Exécute le fichier `prisma/seed.ts`
- Ce script crée des données d'exemple (produits, utilisateurs, etc.)
- Utilise Prisma Client pour insérer les données

### Exemple :
```bash
npm run prisma:seed
# → Exécute prisma/seed.ts
# → Crée 6 impressions numériques dans votre base
```

---

## 📋 Workflow Prisma typique

### Au début d'un projet :
```bash
# 1. Modifier schema.prisma
# 2. Générer le client
npm run prisma:generate

# 3. Créer/appliquer les migrations
npm run prisma:migrate

# 4. Peupler avec des données de test
npm run prisma:seed
```

### Après modification du schéma :
```bash
# 1. Modifier schema.prisma (ex: ajouter un champ)
# 2. Générer le nouveau client
npm run prisma:generate

# 3. Créer une migration
npm run prisma:migrate
# → Prisma détecte les changements
# → Crée et applique la migration
```

### Pour visualiser les données :
```bash
# Ouvrir Prisma Studio
npm run prisma:studio
# → Interface graphique dans le navigateur
```

---

## 🔍 Différence importante

### `prisma:generate` vs `prisma:migrate`

| Commande | Modifie quoi ? | Quand ? |
|----------|---------------|---------|
| `prisma:generate` | **Le code TypeScript** (node_modules/@prisma/client) | Après chaque modification du schéma |
| `prisma:migrate` | **La base de données MySQL** (les tables) | Quand vous voulez appliquer les changements à la DB |

### Exemple concret :

Si vous ajoutez un champ `tags` à votre modèle `Product` dans `schema.prisma` :

1. **`npm run prisma:generate`** 
   - → Met à jour le code TypeScript
   - → Vous pouvez maintenant utiliser `prisma.product.create({ data: { tags: [...] } })`

2. **`npm run prisma:migrate`**
   - → Modifie la table MySQL `Product` 
   - → Ajoute la colonne `tags` dans la base de données

**Les deux sont souvent nécessaires !**

---

## ⚠️ Note importante

Dans votre projet, vous avez créé les tables **manuellement avec le fichier SQL** (`database.sql`). 

Donc vous n'avez **pas forcément besoin** de `prisma:migrate` si vous continuez à gérer les tables manuellement.

Mais si vous voulez utiliser Prisma pour gérer les migrations à l'avenir :
1. Supprimez les tables existantes
2. Utilisez `prisma:migrate` pour les recréer

---

## 🎯 Résumé rapide

| Commande | Action | Résultat |
|----------|--------|----------|
| `prisma:generate` | Génère le code TypeScript | `prisma.user.findMany()` disponible |
| `prisma:migrate` | Modifie la base MySQL | Tables créées/modifiées |
| `prisma:studio` | Interface graphique | Visualisation des données dans le navigateur |
| `prisma:seed` | Remplit la DB | Données de test créées |


