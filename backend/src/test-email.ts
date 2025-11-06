// IMPORTANT : Charger dotenv AVANT d'importer les autres modules
import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "./services/emailService.js";

async function testEmail() {
  console.log("📧 Test d'envoi d'email avec SendGrid...\n");

  // Vérifier que la clé API est configurée
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY non trouvée dans le .env");
    console.log("\n💡 Ajoutez dans votre .env :");
    console.log("SENDGRID_API_KEY=\"SG.votre_cle_api_ici\"\n");
    process.exit(1);
  }

  console.log("✅ SENDGRID_API_KEY trouvée dans le .env");
  console.log(`🔑 Clé API: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...\n`);

  // Email de test
  const testEmail = process.env.SENDGRID_TEST_EMAIL || "test@example.com";
  
  console.log(`📬 Envoi d'un email de test à: ${testEmail}`);
  console.log("⏳ Envoi en cours...\n");

  try {
    await sendEmail({
      to: testEmail,
      subject: "Test Newsletter - Jeff Store",
      html: `
        <h1>Test d'envoi d'email</h1>
        <p>Cet email confirme que SendGrid est correctement configuré !</p>
        <p>Si vous recevez cet email, la newsletter fonctionne parfaitement.</p>
      `,
      text: "Test d'envoi d'email - SendGrid est correctement configuré !",
    });

    console.log("✅ Email envoyé avec succès !");
    console.log(`📧 Vérifiez votre boîte de réception: ${testEmail}`);
    console.log("\n💡 Note: Si vous êtes en mode sandbox SendGrid, vérifiez que l'email est dans votre liste d'emails vérifiés.");
    
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Erreur lors de l'envoi de l'email:");
    console.error(error.message);
    
    if (error.message.includes("authorized")) {
      console.error("\n💡 Solution: Vérifiez que votre clé API SendGrid a les permissions 'Mail Send'");
    } else if (error.message.includes("verified")) {
      console.error("\n💡 Solution: En mode sandbox SendGrid, vous ne pouvez envoyer qu'aux emails vérifiés");
      console.error("   Allez dans SendGrid → Settings → Sender Authentication pour vérifier un email");
    }
    
    process.exit(1);
  }
}

testEmail();


