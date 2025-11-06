# 📝 Instructions : Importer le fichier SQL dans WAMP

## 🎯 Étapes pour créer la base de données dans WAMP

### Méthode 1 : Via phpMyAdmin (Recommandé)

1. **Démarrez WAMP**
   - Assurez-vous que WAMP est démarré (icône verte dans la barre des tâches)
   - MySQL doit être actif

2. **Ouvrez phpMyAdmin**
   - Cliquez sur l'icône WAMP dans la barre des tâches
   - Sélectionnez "phpMyAdmin"
   - Ou allez sur `http://localhost/phpmyadmin`

3. **Exécutez le script SQL**
   - Dans phpMyAdmin, allez dans l'onglet **"SQL"** (en haut)
   - Ouvrez le fichier `backend/prisma/database.sql`
   - **Copiez tout le contenu** du fichier
   - **Collez-le** dans la zone de texte SQL
   - Cliquez sur **"Exécuter"**

4. **Vérification**
   - Dans le menu de gauche, vous devriez voir la base `jeff_store`
   - Cliquez dessus pour voir les tables : `User`, `Product`, `Favorite`

### Méthode 2 : Via l'import de fichier

1. **Ouvrez phpMyAdmin**
2. **Cliquez sur "Importer"** (en haut)
3. **Sélectionnez le fichier** `backend/prisma/database.sql`
4. **Cliquez sur "Exécuter"**

### Méthode 3 : Via la ligne de commande MySQL

Si vous avez accès à la ligne de commande MySQL :

```bash
# Depuis le dossier backend/prisma
mysql -u root -p < database.sql
```

Ou connectez-vous à MySQL puis :
```sql
SOURCE C:/Users/Utilisateur/Desktop/admin/job/jeff-store/from-scratch/backend/prisma/database.sql;
```

## ✅ Vérification que ça a fonctionné

Après avoir exécuté le script, vous devriez avoir :

### Base de données
- ✅ Base de données `jeff_store` créée

### Tables créées
- ✅ Table `User` (colonnes : id, email, password, name, role, createdAt, updatedAt)
- ✅ Table `Product` (colonnes : id, name, description, price, imageUrl, category, stock, active, medium, dimensions, sendNewsletter, createdAt, updatedAt)
- ✅ Table `Favorite` (colonnes : id, userId, productId, createdAt)

### Contraintes
- ✅ Email unique dans `User`
- ✅ Clé primaire auto-incrémentée sur chaque table
- ✅ Relations (clés étrangères) entre `Favorite` ↔ `User` et `Favorite` ↔ `Product`
- ✅ Suppression en cascade (si un utilisateur est supprimé, ses favoris sont aussi supprimés)

## 🔍 Vérifier dans phpMyAdmin

1. Cliquez sur `jeff_store` dans le menu de gauche
2. Vous devriez voir les 3 tables
3. Cliquez sur une table pour voir sa structure

## ⚠️ Problèmes courants

### Erreur : "Base de données déjà existante"
- ✅ C'est normal, le script utilise `CREATE DATABASE IF NOT EXISTS`
- Le script continuera sans erreur

### Erreur : "Table déjà existante"
- ✅ C'est normal, le script utilise `CREATE TABLE IF NOT EXISTS`
- Si vous voulez réinitialiser, supprimez d'abord les tables manuellement

### Erreur de connexion
- Vérifiez que WAMP est démarré
- Vérifiez que MySQL est actif (icône verte)

## 🚀 Après avoir créé la base de données

Une fois la base créée, vous pouvez :

1. **Générer le client Prisma** :
   ```bash
   npm run prisma:generate
   ```

2. **Synchroniser Prisma avec votre base** :
   ```bash
   npm run prisma:db pull
   ```
   (Cette commande met à jour votre schema.prisma avec la structure réelle de la base)

3. **Utiliser Prisma dans votre code** :
   ```typescript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   ```

---

**Note :** Si vous préférez utiliser les migrations Prisma au lieu du SQL, utilisez :
```bash
npm run prisma:migrate
```
Cela créera automatiquement les tables en se basant sur votre `schema.prisma`.


