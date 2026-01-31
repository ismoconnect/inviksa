import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SMTP Configuration diagnostics with TRIMMING
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    const portStr = process.env.SMTP_PORT?.trim();

    if (!host || !user || !pass || !portStr) {
        console.error('CRITICAL: Missing SMTP Environment Variables', {
            hasHost: !!host,
            hasUser: !!user,
            hasPass: !!pass,
            hasPort: !!portStr
        });
        return res.status(500).json({
            error: 'Configuration Error',
            details: 'One or more SMTP environment variables are missing on Vercel or empty.'
        });
    }

    const smtpPort = parseInt(portStr);
    const transporter = nodemailer.createTransport({
        host: host,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: user,
            pass: pass,
        },
        timeout: 20000,
    });

    try {
        console.log(`[SMTP-VERIFY] Checking connection to ${host}:${smtpPort} as ${user}...`);
        await transporter.verify();
        console.log(`[SMTP-VERIFY] Success for ${user}`);

        const fromName = process.env.FROM_NAME || 'INVIK BANK';
        const fromEmail = process.env.FROM_EMAIL || user;

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log('[SMTP-SUCCESS] Email sent:', info.messageId);
        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('[SMTP-ERROR]', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message,
            code: error.code
        });
    }
}
