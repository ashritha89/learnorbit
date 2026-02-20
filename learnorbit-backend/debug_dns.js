const dns = require('dns');

const hostname = 'db.nqebjcirrqbagcpoglhx.supabase.co';

console.log(`Resolving ${hostname}...`);

dns.lookup(hostname, (err, address, family) => {
    if (err) {
        console.error('dns.lookup failed:', err);
    } else {
        console.log('dns.lookup result:', { address, family });
    }
});

dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error('dns.resolve4 failed:', err);
    } else {
        console.log('dns.resolve4 result:', addresses);
    }
});

dns.resolve6(hostname, (err, addresses) => {
    if (err) {
        console.error('dns.resolve6 failed:', err);
    } else {
        console.log('dns.resolve6 result:', addresses);
    }
});
