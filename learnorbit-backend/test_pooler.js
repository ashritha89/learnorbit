require('dotenv').config();
const { Client } = require('pg');

const poolerHost = 'aws-0-ap-south-1.pooler.supabase.com';
const projectRef = 'nqebjcirrqbagcpoglhx';
// For pooler, username is typically user.project_ref
const poolerUser = `${process.env.DB_USER}.${projectRef}`;

console.log('Testing connection to Supabase Pooler:', poolerHost);
console.log('User:', poolerUser);

const client = new Client({
    host: poolerHost,
    port: 5432, // Session mode pooler
    user: poolerUser,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
});

client.connect()
    .then(() => {
        console.log('Connected successfully via IPv4 Pooler!');
        return client.end();
    })
    .catch(err => {
        console.error('Pooler Connection failed:', err);
        // Try port 6543 just in case
        console.log('Retrying with port 6543 (Transaction mode)...');
        const client2 = new Client({
            host: poolerHost,
            port: 6543,
            user: poolerUser,
            password: process.env.DB_PASSWORD,
            database: 'postgres',
            ssl: { rejectUnauthorized: false },
        });
        return client2.connect()
            .then(() => {
                console.log('Connected successfully via IPv4 Pooler (Port 6543)!');
                return client2.end();
            })
            .catch(err2 => {
                console.error('Pooler Port 6543 failed too:', err2);
            });
    });
