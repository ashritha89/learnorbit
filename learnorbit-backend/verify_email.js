require('dotenv').config();
const emailService = require('./src/utils/email.service');
const logger = require('./src/utils/logger');

async function testEmail() {
    console.log('--- Starting Email Test ---');
    console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
    console.log(`SMTP User: ${process.env.SMTP_USER}`);
    console.log(`Admin Email: ${process.env.ADMIN_EMAIL}`);

    const testRecipient = process.env.ADMIN_EMAIL;

    console.log(`Attempting to send test email to: ${testRecipient}`);

    try {
        const result = await emailService.transporter.sendMail({
            from: `"LearnOrbit Test" <${process.env.SMTP_USER}>`,
            to: testRecipient,
            subject: 'Direct Nodemailer Test',
            html: '<h1>If you see this, email is working!</h1><p>This is a direct test from the verification script.</p>'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', result.messageId);
        console.log('Response:', result.response);
    } catch (error) {
        console.error('❌ Email sending failed:');
        console.error(error);
    }
}

testEmail();
