const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const logger = require('./logger');
require('dotenv').config();

async function runAutoMigration() {
    let client;
    try {
        const sqlPath = path.join(__dirname, '../../migrations/init.sql');
        if (!fs.existsSync(sqlPath)) {
            logger.warn('Migration file not found: ' + sqlPath);
            return;
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');
        logger.info('Running auto-migration for PostgreSQL tables...');

        client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });

        await client.connect();

        // Split and execute statements logic is tricky with node-postgres if not using a library
        // But simply executing the whole file content in one query usually works if it contains multiple statements separated by semicolons, 
        // provided the driver supports it? 'pg' does support multiple statements in query if passed as a single string.

        await client.query(sql);

        logger.info('Auto-migration completed successfully.');

    } catch (error) {
        logger.error('Auto-migration failed: ' + error.message);
    } finally {
        if (client) await client.end();
    }
}

module.exports = runAutoMigration;
