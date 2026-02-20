require('dotenv').config();
const { Client } = require('pg');

const ipv6 = '2406:da1a:6b0:f612:13c9:dfb4:daba:aea8';

console.log('Testing IPv6 connection to:', ipv6);

const client = new Client({
    host: ipv6,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
});

client.connect()
    .then(() => {
        console.log('Connected successfully via IPv6!');
        return client.end();
    })
    .catch(err => {
        console.error('IPv6 Connection failed:', err);
    });
