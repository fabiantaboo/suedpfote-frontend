const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'nexletter.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Südpfote <noreply@nexletter.com>';
const LOGO_URL = 'https://suedpfote.de/logo.png';

type EmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailParams): Promise<boolean> {
  try {
    const form = new URLSearchParams();
    form.append('from', FROM_EMAIL);
    form.append('to', to);
    form.append('subject', subject);
    form.append('html', html);
    if (text) form.append('text', text);

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mailgun error:', error);
      return false;
    }

    console.log(`📧 Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, password: string, firstName?: string): Promise<boolean> {
  const name = firstName || 'Linkshänder';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #f4f4f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="${LOGO_URL}" alt="Südpfote" style="height: 60px; width: auto;" />
      </div>
      
      <h1 style="color: #18181b; margin: 0 0 24px 0; font-size: 24px; font-weight: 700; text-align: center;">
        Willkommen bei Südpfote!
      </h1>
      
      <!-- Content -->
      <p style="color: #3f3f46; font-size: 16px; margin-bottom: 16px;">Hallo ${name}! 👋</p>
      
      <p style="color: #3f3f46; font-size: 16px; margin-bottom: 24px;">
        Vielen Dank für deine Bestellung! Wir haben automatisch ein Kundenkonto für dich erstellt, 
        damit du deine Bestellungen verfolgen und Treuepunkte sammeln kannst.
      </p>
      
      <!-- Credentials Box -->
      <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p style="margin: 0 0 16px 0; font-weight: 600; color: #18181b; font-size: 15px;">Deine Zugangsdaten:</p>
        
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 14px; width: 80px;">E-Mail:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #18181b;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Passwort:</td>
            <td style="padding: 8px 0;">
              <code style="font-family: 'SF Mono', Monaco, monospace; font-size: 15px; background: #ffffff; padding: 8px 12px; border-radius: 6px; border: 1px solid #e4e4e7; display: inline-block;">${password}</code>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Security Notice -->
      <div style="background: #fef3c7; border-radius: 10px; padding: 14px 16px; margin: 24px 0; border-left: 3px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⚠️ Sicherheitshinweis:</strong> Bitte ändere dein Passwort nach dem ersten Login in deinem Kundenkonto.
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://suedpfote.de/login" style="display: inline-block; background: #18181b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 15px;">
          Jetzt einloggen →
        </a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 24px; text-align: center;">
      <p style="color: #a1a1aa; font-size: 13px; margin: 0;">
        Südpfote – Der Shop für die anderen 10%
      </p>
      <p style="color: #a1a1aa; font-size: 12px; margin: 8px 0 0 0;">
        Bei Fragen: support@suedpfote.de
      </p>
    </div>
    
  </div>
</body>
</html>
  `;

  const text = `
Willkommen bei Südpfote, ${name}!

Vielen Dank für deine Bestellung! Wir haben automatisch ein Kundenkonto für dich erstellt.

Deine Zugangsdaten:
E-Mail: ${email}
Passwort: ${password}

⚠️ SICHERHEITSHINWEIS: Bitte ändere dein Passwort nach dem ersten Login!

Jetzt einloggen: https://suedpfote.de/login

Südpfote – Der Shop für die anderen 10%
Bei Fragen: support@suedpfote.de
  `;

  return sendEmail({
    to: email,
    subject: '🐾 Willkommen bei Südpfote – Deine Zugangsdaten',
    html,
    text,
  });
}

export async function sendOrderConfirmation(
  email: string, 
  orderId: string, 
  firstName?: string
): Promise<boolean> {
  const name = firstName || 'Linkshänder';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #f4f4f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="${LOGO_URL}" alt="Südpfote" style="height: 60px; width: auto;" />
      </div>
      
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #dcfce7; border-radius: 50%; padding: 16px;">
          <span style="font-size: 32px;">✓</span>
        </div>
      </div>
      
      <h1 style="color: #18181b; margin: 0 0 24px 0; font-size: 24px; font-weight: 700; text-align: center;">
        Bestellung bestätigt!
      </h1>
      
      <p style="color: #3f3f46; font-size: 16px; margin-bottom: 16px;">Hallo ${name}! 👋</p>
      
      <p style="color: #3f3f46; font-size: 16px; margin-bottom: 24px;">
        Vielen Dank für deine Bestellung! Wir haben sie erhalten und bearbeiten sie so schnell wie möglich.
      </p>
      
      <!-- Order ID Box -->
      <div style="background: #f4f4f5; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">Bestellnummer:</p>
        <p style="margin: 0; font-family: 'SF Mono', Monaco, monospace; font-size: 18px; font-weight: 600; color: #18181b;">${orderId}</p>
      </div>
      
      <p style="color: #3f3f46; font-size: 15px; margin-bottom: 24px;">
        Du erhältst eine weitere E-Mail mit Tracking-Informationen, sobald dein Paket auf dem Weg ist.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://suedpfote.de/konto" style="display: inline-block; background: #18181b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 15px;">
          Bestellung verfolgen →
        </a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 24px; text-align: center;">
      <p style="color: #a1a1aa; font-size: 13px; margin: 0;">
        Südpfote – Der Shop für die anderen 10%
      </p>
      <p style="color: #a1a1aa; font-size: 12px; margin: 8px 0 0 0;">
        Bei Fragen: support@suedpfote.de
      </p>
    </div>
    
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: `🐾 Bestellbestätigung #${orderId}`,
    html,
    text: `Hallo ${name}! Deine Bestellung ${orderId} ist bestätigt. Bestellung verfolgen: https://suedpfote.de/konto`,
  });
}
