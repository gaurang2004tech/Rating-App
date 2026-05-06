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

    console.log('Clearing old data...');
    await client.query('TRUNCATE ratings, stores, users RESTART IDENTITY CASCADE');

    // Create a universal hashed password 'Test@12345'
    const hash = await bcrypt.hash('Test@12345', 10);

    console.log('Inserting unified users...');
    await client.query(`INSERT INTO users (name, email, password, address, role) VALUES ('System Administrator', 'admin@app.com', $1, 'Admin Tower', 'admin')`, [hash]);
    await client.query(`INSERT INTO users (name, email, password, address, role) VALUES ('Store Owner', 'owner@app.com', $1, 'Owner Estate', 'store_owner')`, [hash]);
    await client.query(`INSERT INTO users (name, email, password, address, role) VALUES ('Normal User', 'user@app.com', $1, 'User Apartment', 'user')`, [hash]);

    console.log('Inserting dummy store securely tied to Owner ID 2...');
    await client.query(`INSERT INTO stores (name, email, address, "ownerId") VALUES ('SuperTech Gadgets', 'contact@supertech.com', '123 Silicon Road', 2)`);

    console.log('Inserting dummy rating correctly tied to Store and Normal User...');
    await client.query(`INSERT INTO ratings (value, "userId", "storeId") VALUES (5, 3, 1)`);

    console.log('Database completely seeded!');
    await client.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
