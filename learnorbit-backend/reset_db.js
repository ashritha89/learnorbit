const pool = require('./src/config/database');

async function resetWaitlist() {
    try {
        console.log('--- Clearing Marketing Users ---');
        await pool.query('DELETE FROM marketing_waitlist_users');
        console.log('✅ Deleted all records from marketing_waitlist_users');

        await pool.query('DELETE FROM marketing_contact_messages');
        console.log('✅ Deleted all records from marketing_contact_messages');

        await pool.query('DELETE FROM marketing_feedback_submissions');
        console.log('✅ Deleted all records from marketing_feedback_submissions');

        console.log('Database reset complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to clear database:', err);
        process.exit(1);
    }
}

resetWaitlist();
