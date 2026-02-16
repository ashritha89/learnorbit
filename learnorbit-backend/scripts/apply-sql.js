const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create a dedicated pool for migrations with multipleStatements enabled
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true // Enable multiple statements
});

async function runMigration() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.error('Please provide the path to the SQL file to execute.');
            process.exit(1);
        }

        const sqlFilePath = path.resolve(process.cwd(), args[0]);
        if (!fs.existsSync(sqlFilePath)) {
            console.error(`File not found: ${sqlFilePath}`);
            process.exit(1);
        }

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log(`Executing SQL from ${sqlFilePath}...`);

        const connection = await pool.getConnection();
        try {
            // Execute the entire file content as a single query (with multiple statements)
            await connection.query(sqlContent);
            console.log('Migration executed successfully.');
        } catch (err) {
            console.error('Error executing migration:', err.message);
            // Log specific error details if available
            if (err.sql) console.error('Failed SQL:', err.sql.substring(0, 100) + '...');
            process.exit(1);
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Migration script failed:', error);
        process.exit(1);
    } finally {
        if (pool) await pool.end();
    }
}

runMigration();
