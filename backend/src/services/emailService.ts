import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Initialiser SendGrid si la clé API est configurée
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SENDGRID_API_KEY non configurée. Les emails ne seront pas envoyés.');
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envoyer un email via SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY non configurée. Impossible d\'envoyer l\'email.');
  }

  // Utiliser l'email vérifié depuis .env, sinon utiliser une valeur par défaut
  // ⚠️ IMPORTANT : L'email "from" DOIT être vérifié dans SendGrid
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@jeffstore.com';
  
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn('⚠️  SENDGRID_FROM_EMAIL non configuré dans .env');
    console.warn('   Utilisation de la valeur par défaut. Assurez-vous que cet email est vérifié dans SendGrid.');
  }

  const msg = {
    to: options.to,
    from: fromEmail,
    subject: options.subject,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Version texte (sans HTML)
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email envoyé à: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    if (error.response) {
      console.error('Détails SendGrid:', error.response.body);
    }
    throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
  }
}

/**
 * Envoyer une newsletter à tous les abonnés
 */
export async function sendNewsletterToSubscribers(
  subscribers: string[],
  subject: string,
  htmlContent: string
): Promise<{ success: number; failed: number }> {
  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY non configurée.');
  }

  if (subscribers.length === 0) {
    console.log('Aucun abonné à qui envoyer la newsletter');
    return { success: 0, failed: 0 };
  }

  let success = 0;
  let failed = 0;

  // SendGrid permet d'envoyer à plusieurs destinataires en une fois (jusqu'à 1000)
  // Mais pour éviter les problèmes, on envoie par groupes de 100
  const batchSize = 100;
  
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@jeffstore.com';
      
      const msg = {
        to: batch,
        from: fromEmail,
        subject: subject,
        html: htmlContent,
        text: htmlContent.replace(/<[^>]*>/g, ''),
        // Utiliser SendGrid Dynamic Templates si vous en avez (optionnel)
        // templateId: 'your-template-id',
        // dynamicTemplateData: { ... }
      };

      await sgMail.send(msg);
      success += batch.length;
      console.log(`✅ Newsletter envoyée à ${batch.length} abonnés (${success}/${subscribers.length})`);
    } catch (error: any) {
      console.error(`❌ Erreur lors de l'envoi au batch ${i / batchSize + 1}:`, error.message);
      failed += batch.length;
      
      // Si l'erreur est générale (pas de destinataires invalides), on continue
      // Sinon on peut essayer d'envoyer individuellement pour identifier les emails invalides
    }
  }

  return { success, failed };
}

/**
 * Envoyer une newsletter pour un nouveau produit
 */
export function generateProductNewsletterHTML(product: {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle impression disponible</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Nouvelle impression disponible !</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">${product.name}</h2>
        
        ${product.imageUrl ? `
          <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; max-width: 500px; height: auto; border-radius: 8px; margin: 20px 0;">
        ` : ''}
        
        ${product.description ? `
          <p style="font-size: 16px; color: #666;">${product.description}</p>
        ` : ''}
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Catégorie:</strong> ${product.category}</p>
          <p style="margin: 10px 0;"><strong>Prix:</strong> <span style="color: #667eea; font-size: 24px; font-weight: bold;">${product.price}€</span></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" 
             style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Voir sur le site
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
        <p>Vous recevez cet email car vous êtes abonné à la newsletter de Jeff Store.</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe" style="color: #667eea;">Se désabonner</a></p>
      </div>
    </body>
    </html>
  `;
}

