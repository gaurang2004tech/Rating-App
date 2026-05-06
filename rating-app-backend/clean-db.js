const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5433,
    database: 'rating_app'
});

async function main() {
    await client.connect();

    console.log('Wiping all data to prepare for real entries...');
    await client.query('TRUNCATE ratings, stores, users RESTART IDENTITY CASCADE');

    // Re-seed the core administrator so the app is accessible
    const hash = await bcrypt.hash('Admin@12345', 10);
    await client.query(`INSERT INTO users (name, email, password, address, role) VALUES ('System Administrator', 'admin@app.com', $1, 'Admin Headquarters', 'admin')`, [hash]);

    console.log('Database wiped! Only the core admin remains.');
    await client.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
