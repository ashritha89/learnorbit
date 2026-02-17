const http = require('http');

const randomId = Math.floor(Math.random() * 10000);
const data = JSON.stringify({
    fullName: `Test User ${randomId}`,
    email: `test_local_${randomId}@example.com`,
    role: "student",
    earlyAccessInterest: true
});

console.log(`Testing with email: test_local_${randomId}@example.com`);

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/marketing/waitlist',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
