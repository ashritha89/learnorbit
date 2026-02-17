const pool = require('../src/config/db');

async function listWaitlist() {
    try {
        const [rows] = await pool.query('SELECT email, created_at, status FROM marketing_waitlist_users ORDER BY created_at DESC LIMIT 5');
        console.log('--- Recent Waitlist Entries ---');
        rows.forEach(row => {
            console.log(`Email: ${row.email} | Status: ${row.status} | Time: ${row.created_at}`);
        });
        console.log('-------------------------------');
    } catch (error) {
        console.error('Error fetching waitlist:', error);
    } finally {
        await pool.end();
    }
}

listWaitlist();
