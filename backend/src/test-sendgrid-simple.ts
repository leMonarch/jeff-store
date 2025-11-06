// Exemple simple conforme à la documentation SendGrid
// https://app.sendgrid.com/guide/integrate/langs/nodejs

import dotenv from 'dotenv';
dotenv.config();

import sgMail from '@sendgrid/mail';

// Étape 1 : Configurer la clé API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Étape 2 : Créer le message (comme dans la doc)
const msg = {
  // ⚠️ "TO" : Changez par votre email pour recevoir le test
  // En mode sandbox SendGrid, vous ne pouvez envoyer qu'aux emails vérifiés
  to: 'test@example.com', // ← MODIFIEZ ICI : Votre email pour recevoir le test
  
  // ⚠️ "FROM" : Doit être un email vérifié dans SendGrid Dashboard
  // Settings → Sender Authentication → Single Sender Verification
  from: process.env.SENDGRID_FROM_EMAIL || 'test@example.com',
  
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

// Étape 3 : Envoyer l'email
console.log('📧 Envoi de l\'email de test...\n');
console.log('To:', msg.to);
console.log('From:', msg.from);
console.log('Subject:', msg.subject);
console.log('\n⏳ Envoi en cours...\n');

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('📬 Vérifiez votre boîte de réception.');
  })
  .catch((error: any) => {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('\nDétails SendGrid:');
      console.error(JSON.stringify(error.response.body, null, 2));
    }
    
    // Messages d'aide spécifiques
    if (error.code === 403) {
      console.error('\n💡 Erreur 403 - Forbidden:');
      console.error('   1. Vérifiez que l\'email "from" est vérifié dans SendGrid');
      console.error('   2. Allez sur: https://app.sendgrid.com/settings/sender_auth/senders/new');
      console.error('   3. Créez un "Single Sender" et vérifiez l\'email');
      console.error('   4. Ajoutez SENDGRID_FROM_EMAIL="votre-email-verifie@exemple.com" dans .env');
    }
  });

