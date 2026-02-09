// scripts/generate-hash.js
/**
 * Generate bcrypt password hash
 * Usage: node scripts/generate-hash.js [password]
 */

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function generateHash() {
    try {
        // Get password from command line argument or use default
        const password = process.argv[2] || 'Admin@123';

        console.log('\n🔐 Generating Password Hash...\n');
        console.log(`Password: ${password}`);
        console.log(`Salt Rounds: ${SALT_ROUNDS}\n`);

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        console.log('✅ Hash Generated Successfully!\n');
        console.log('Copy this hash to your SQL INSERT statement:\n');
        console.log(`'${hash}'\n`);

        console.log('Example SQL:');
        console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@learnorbit.com';\n`);

        // Verify the hash works
        const isValid = await bcrypt.compare(password, hash);
        console.log(`Verification: ${isValid ? '✅ Valid' : '❌ Invalid'}\n`);

    } catch (error) {
        console.error('❌ Error generating hash:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    generateHash();
}

module.exports = generateHash;
