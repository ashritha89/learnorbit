require('dotenv').config();
const { Client } = require('pg');

const regions = ['ap-southeast-1', 'eu-central-1', 'us-east-1'];
const projectRef = 'nqebjcirrqbagcpoglhx';
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

async function testRegion(region) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const user = `${dbUser}.${projectRef}`;

    console.log(`\nTesting region: ${region} (${host})`);
    console.log(`User: ${user}`);

    const client = new Client({
        host: host,
        port: 6543, // Transaction mode
        user: user,
        password: dbPass,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        await client.connect();
        console.log(`🎉 SUCCESS! Connected to ${region}`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ Failed ${region}: ${err.message}`);
        // console.error(err);
        return false;
    }
}

async function run() {
    for (const region of regions) {
        if (await testRegion(region)) break;
    }
}

run();
