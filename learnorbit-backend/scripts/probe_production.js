const https = require('https');

const data = JSON.stringify({
    fullName: 'Production Probe User',
    email: 'probe_' + Date.now() + '@example.com',
    role: 'student',
    currentPlatform: 'None',
    frustrations: [],
    desiredFeatures: [],
    pricingExpectation: 'Free',
    earlyAccessInterest: false,
    betaTester: false,
    source: 'prod_probe'
});

const options = {
    hostname: 'learnorbit-backend.onrender.com',
    port: 443,
    path: '/api/marketing/waitlist',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Sending request to https://${options.hostname}${options.path}...`);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('Response Body:', body);
    });
});

req.on('error', (e) => {
    console.error(`Request Error: ${e.message}`);
});

req.write(data);
req.end();
