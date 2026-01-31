import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SMTP Configuration from Vercel environment variables
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: smtpPort,
        secure: smtpPort === 465, // Force true for 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        timeout: 10000, // 10 seconds timeout
    });

    try {
        console.log(`Attempting to send email to ${to} via ${process.env.SMTP_HOST}:${smtpPort}`);
        const fromName = process.env.FROM_NAME || 'INVIK BANK';
        const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent successfully:', info.messageId);
        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Nodemailer error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message,
            code: error.code
        });
    }
}
