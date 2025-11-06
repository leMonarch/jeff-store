# 📧 SendGrid : Où définir "from" et "to" ?

## 🎯 Résumé rapide

| Élément | Où le définir ? | Comment ? |
|---------|----------------|-----------|
| **"from"** | Dans SendGrid Dashboard | Settings → Sender Authentication → Vérifier un email |
| **"to"** | Dans votre code | Directement dans le message à envoyer |

---

## 1️⃣ Email "FROM" (Expéditeur)

### Où : Dans SendGrid Dashboard

**Chemin :**
```
SendGrid Dashboard
  → Settings (en bas de la sidebar)
  → Sender Authentication
  → Single Sender Verification
  → Create New Sender
```

### Étapes :

1. **Cliquez sur "Settings"** (en bas de la sidebar à gauche)
2. **Cliquez sur "Sender Authentication"**
3. **Cliquez sur "Single Sender Verification"**
4. **Cliquez sur "Create New Sender"** (bouton bleu)
5. **Remplissez le formulaire :**
   - **From Email** : Votre email (ex: `votre-email@gmail.com`)
   - **From Name** : Nom affiché (ex: `Jeff Store`)
   - **Reply To** : Email pour les réponses
   - **Address, City, State, Country** : Votre adresse
   - **Company Name** : Nom de votre entreprise
6. **Cliquez sur "Create"**
7. **Vérifiez votre email** : SendGrid vous enverra un email de confirmation
8. **Cliquez sur le lien** dans l'email pour vérifier

### Une fois vérifié :

Ajoutez dans votre `.env` :
```env
SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com"
```

---

## 2️⃣ Email "TO" (Destinataire)

### Où : Dans votre code (pas dans SendGrid)

Le "to" est défini dans votre code JavaScript/TypeScript au moment de l'envoi.

### Exemple dans notre code :

```typescript
// Fichier: src/services/emailService.ts

const msg = {
  to: 'client@example.com',  // ← LE "TO" EST ICI
  from: process.env.SENDGRID_FROM_EMAIL,  // ← LE "FROM" VIENT DU .ENV
  subject: 'Bienvenue !',
  html: '<p>Contenu de l\'email</p>'
};

await sgMail.send(msg);
```

### Dans le test simple :

```typescript
// Fichier: src/test-sendgrid-simple.ts

const msg = {
  to: 'test@example.com',  // ← Changez ici par votre email de test
  from: process.env.SENDGRID_FROM_EMAIL || 'test@example.com',
  subject: 'Test SendGrid',
  text: 'Hello!',
  html: '<strong>Hello!</strong>',
};
```

### Dans la newsletter :

```typescript
// Fichier: src/services/emailService.ts

// Le "to" est une liste d'abonnés récupérée depuis MySQL
const subscribers = await prisma.newsletter.findMany({
  where: { active: true }
});

const emails = subscribers.map(s => s.email);  // Liste des "to"

await sendNewsletterToSubscribers(
  emails,  // ← Liste des destinataires
  subject,
  htmlContent
);
```

---

## 📝 Résumé pratique

### Pour tester maintenant :

1. **Vérifiez un email "from" dans SendGrid** (Settings → Sender Authentication)
2. **Ajoutez dans `.env`** :
   ```env
   SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com"
   ```
3. **Modifiez le "to" dans le test** :
   ```bash
   # Ouvrez src/test-sendgrid-simple.ts
   # Changez la ligne :
   to: 'votre-email@exemple.com',  // Votre email pour recevoir le test
   ```
4. **Lancez le test** :
   ```bash
   npm run test:sendgrid
   ```

---

## ⚠️ Note importante

**En mode Sandbox SendGrid :**
- Vous ne pouvez envoyer qu'aux emails que vous avez **vérifiés** dans SendGrid
- Pour tester, vérifiez aussi l'email "to" dans SendGrid
- Pour sortir du sandbox, vérifiez votre identité complète

**En production :**
- Le "from" doit être un domaine vérifié (Domain Authentication)
- Le "to" peut être n'importe quel email valide

---

**En résumé : "from" = dans SendGrid Dashboard, "to" = dans votre code !**


