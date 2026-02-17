require('dotenv').config();
const emailService = require('./src/utils/email.service');
const logger = require('./src/utils/logger');

const recipientName = process.argv[2] || 'Test User';
const recipientEmail = process.argv[3] || '22ve1a05n9@sreyas.ac.in';

async function testEmail() {
    console.log(`--- Starting Email Test ---`);
    console.log(`Sending to: ${recipientEmail}`);

    const result = await emailService.sendWaitlistEmail({
        fullName: recipientName,
        email: recipientEmail,
        role: 'Beta Tester',
        currentPlatform: 'None',
        pricingExpectation: 'Free'
    });

    if (result) {
        console.log('✅ Email Service returned TRUE (Success)');
    } else {
        console.log('❌ Email Service returned FALSE (Failed)');
    }
}

testEmail();
