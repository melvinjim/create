// api/contact.js — Vercel Serverless Function
// Recibe el formulario de contacto y envía un email HTML bonito via Resend

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured.' });
  }

  // ── HTML del email ──────────────────────────────────────────────
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Inquiry — Create & Fabricate</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ebe3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1a1a18;padding:36px 40px 28px;">
              <p style="margin:0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#c4a882;font-weight:400;">
                Create &amp; Fabricate LLC
              </p>
              <h1 style="margin:12px 0 0;font-size:28px;font-weight:300;color:#e8e2d9;line-height:1.15;font-family:Georgia,'Times New Roman',serif;">
                New Client<br/><em style="font-style:italic;color:#c4a882;">Inquiry</em>
              </h1>
              <p style="margin:14px 0 0;font-size:12px;color:rgba(232,226,217,0.45);letter-spacing:0.04em;">
                Received via createfabricate.com
              </p>
            </td>
          </tr>

          <!-- ACCENT LINE -->
          <tr>
            <td style="background-color:#c4a882;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#f5f2ed;padding:36px 40px;">

              <!-- Greeting -->
              <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#2d2d2a;font-weight:300;">
                You have received a new project inquiry from your website. Here are the details:
              </p>

              <!-- Info cards -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Name -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e2d9;border-left:3px solid #c4a882;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#7a7570;font-weight:400;">Full Name</p>
                          <p style="margin:0;font-size:16px;font-weight:400;color:#1a1a18;font-family:Georgia,'Times New Roman',serif;">${escHtml(name)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email + Phone row -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48%" style="padding-right:8px;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e2d9;border-left:3px solid #c4a882;">
                            <tr>
                              <td style="padding:16px 20px;">
                                <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#7a7570;">Email</p>
                                <p style="margin:0;font-size:13px;color:#1a1a18;">
                                  <a href="mailto:${escHtml(email)}" style="color:#1a1a18;text-decoration:none;">${escHtml(email)}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="4%"></td>
                        <td width="48%">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e2d9;border-left:3px solid #c4a882;">
                            <tr>
                              <td style="padding:16px 20px;">
                                <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#7a7570;">Phone</p>
                                <p style="margin:0;font-size:13px;color:#1a1a18;">
                                  ${phone ? `<a href="tel:${escHtml(phone)}" style="color:#1a1a18;text-decoration:none;">${escHtml(phone)}</a>` : '<span style="color:#7a7570;font-style:italic;">Not provided</span>'}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Service -->
                ${service ? `
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e2d9;border-left:3px solid #c4a882;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#7a7570;">Service Requested</p>
                          <p style="margin:0;font-size:14px;color:#1a1a18;font-weight:400;">${escHtml(service)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ''}

                <!-- Message -->
                <tr>
                  <td style="padding-bottom:0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a18;border-left:3px solid #c4a882;">
                      <tr>
                        <td style="padding:20px 20px 20px;">
                          <p style="margin:0 0 10px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c4a882;">Their Vision</p>
                          <p style="margin:0;font-size:13px;line-height:1.75;color:#e8e2d9;font-weight:300;font-style:italic;">"${escHtml(message)}"</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td>
                    <a href="mailto:${escHtml(email)}" style="display:inline-block;background-color:#1a1a18;color:#e8e2d9;text-decoration:none;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;padding:14px 28px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Reply to ${escHtml(name.split(' ')[0])} →
                    </a>
                    ${phone ? `<a href="tel:${escHtml(phone)}" style="display:inline-block;margin-left:12px;border:1px solid #d4c9b8;color:#1a1a18;text-decoration:none;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;padding:14px 28px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Call ${escHtml(phone)} →
                    </a>` : ''}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1a1a18;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#c4a882;">Create &amp; Fabricate LLC</p>
              <p style="margin:0;font-size:10px;color:rgba(232,226,217,0.35);">
                786 427-4966 &nbsp;·&nbsp; 786 655-1264 &nbsp;·&nbsp; @createfabricate
              </p>
            </td>
          </tr>

          <!-- Bottom padding -->
          <tr><td style="height:32px;"></td></tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

  // ── Enviar via Resend ─────────────────────────────────────────
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Create & Fabricate <noreply@createfabricate.us.com>',
        to: ['info@createfabricate.com'],
        reply_to: email,
        subject: `New Inquiry from ${name} — ${service || 'General'}`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// Sanitize HTML to prevent injection
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
