const https = require('https');

const hostname = 'nqebjcirrqbagcpoglhx.supabase.co';
const path = '/rest/v1/';

const options = {
    hostname: hostname,
    port: 443,
    path: path,
    method: 'GET',
    headers: {
        'apikey': 'sb_publishable_eTA9TYut-eCP9xTtNr7DvA_6vn-Kl5B',
        'Authorization': 'Bearer sb_publishable_eTA9TYut-eCP9xTtNr7DvA_6vn-Kl5B'
    }
};

console.log(`Checking status of https://${hostname}${path}...`);

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error('Error checking status:', error);
});

req.end();
