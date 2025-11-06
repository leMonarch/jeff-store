# 📧 Guide de test SendGrid selon la documentation officielle

## ✅ Vérification : Notre code est conforme

Notre implémentation suit déjà la documentation SendGrid :
- ✅ `sgMail.setApiKey(process.env.SENDGRID_API_KEY)` 
- ✅ Utilisation de `sgMail.send(msg)`
- ✅ Structure du message identique

---

## 🧪 Test rapide selon la doc SendGrid

### Option 1 : Utiliser notre test simple

```bash
# Modifiez d'abord le fichier test-sendgrid-simple.ts :
# - Changez "to" par votre email
# - Changez "from" par un email vérifié dans SendGrid

node src/test-sendgrid-simple.ts
```

### Option 2 : Utiliser notre test complet

```bash
npm run test:email
```

---

## 🔧 Points importants selon la documentation

### 1. Variable d'environnement ✅
Votre `.env` doit contenir :
```env
SENDGRID_API_KEY="SG.votre_cle_api"
```
**✅ C'est fait !**

### 2. Installation du package ✅
```bash
npm install --save @sendgrid/mail
```
**✅ C'est fait !**

### 3. Email "from" vérifié ⚠️
**C'est le point clé !**

Selon la doc SendGrid :
```javascript
from: 'test@example.com', // Change to your verified sender
```

**Vous devez :**
1. Aller sur SendGrid : https://app.sendgrid.com/settings/sender_auth/senders/new
2. Créer un "Single Sender"
3. Vérifier l'email (cliquez sur le lien dans l'email reçu)
4. Ajouter dans `.env` :
   ```env
   SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com"
   ```

---

## 📝 Code de la documentation SendGrid

Voici le code exact de la documentation que vous voyez :

```javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
```

**Notre code fait exactement la même chose, mais en TypeScript avec gestion d'erreurs améliorée !**

---

## ⚠️ Erreur "Forbidden" - Solution

Si vous obtenez une erreur 403, c'est parce que :
- L'email "from" n'est pas vérifié dans SendGrid

**Solution rapide :**
1. Allez sur : https://app.sendgrid.com/settings/sender_auth/senders/new
2. Créez un nouveau sender avec votre email
3. Vérifiez l'email reçu
4. Ajoutez dans `.env` :
   ```env
   SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com"
   ```

---

## ✅ Checklist

- [x] Package `@sendgrid/mail` installé
- [x] `SENDGRID_API_KEY` dans `.env`
- [ ] **Email "from" vérifié dans SendGrid** ← À faire
- [ ] `SENDGRID_FROM_EMAIL` dans `.env` ← À faire après vérification

Une fois l'email vérifié, tout fonctionnera !


