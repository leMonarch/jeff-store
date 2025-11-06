# 📧 Configuration SendGrid - Résolution de l'erreur

## ⚠️ Erreur actuelle

```
The from address does not match a verified Sender Identity
```

Cela signifie que l'adresse email "from" n'est pas vérifiée dans SendGrid.

---

## ✅ Solution : Vérifier un Sender Identity

### Option 1 : Single Sender Verification (Recommandé pour les tests)

1. **Allez sur SendGrid** : https://app.sendgrid.com
2. **Settings** → **Sender Authentication** → **Single Sender Verification**
3. **Create New Sender**
4. Remplissez le formulaire :
   - **From Email** : `noreply@votre-domaine.com` ou votre email personnel
   - **From Name** : `Jeff Store` (ou le nom que vous voulez)
   - **Reply To** : Votre email
   - **Address, City, State, Country** : Votre adresse
   - **Company Name** : Nom de votre entreprise
5. **Vérifiez votre email** : SendGrid vous enverra un email de confirmation
6. Cliquez sur le lien dans l'email pour vérifier

### Option 2 : Domain Authentication (Pour production)

Si vous avez un domaine, vérifiez-le complètement pour envoyer depuis n'importe quelle adresse @votredomaine.com.

---

## 🔧 Mettre à jour le .env

Une fois l'email vérifié, mettez à jour votre `.env` :

```env
SENDGRID_API_KEY="SG.votre_cle_api"
SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com"  # L'email que vous avez vérifié
```

---

## 🧪 Tester à nouveau

```bash
npm run test:email
```

Ou modifiez le script pour utiliser votre email vérifié :

```bash
# Ajoutez dans .env :
SENDGRID_TEST_EMAIL="votre-email-verifie@exemple.com"
```

---

## 📝 Note importante

**Mode Sandbox SendGrid** :
- Si votre compte est en mode sandbox, vous ne pouvez envoyer qu'aux emails que vous avez vérifiés
- Pour sortir du sandbox, vérifiez votre identité et remplissez le formulaire dans SendGrid

**Pour la production** :
- Vérifiez votre domaine complet (Domain Authentication)
- Configurez SPF et DKIM pour éviter le spam
- Utilisez un domaine professionnel

---

## 🚀 Une fois configuré

Votre newsletter fonctionnera automatiquement :
- ✅ Abonnés enregistrés dans MySQL
- ✅ Emails envoyés via SendGrid
- ✅ Newsletter automatique lors de la création de produits avec `sendNewsletter: true`

---

**Après avoir vérifié votre sender, relancez le test : `npm run test:email`**


