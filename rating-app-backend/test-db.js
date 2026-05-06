const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to abstract postgres properly');

        // Check if rating_app exists
        const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'rating_app'");
        if (res.rowCount === 0) {
            console.log('rating_app does not exist, creating it...');
            await client.query("CREATE DATABASE rating_app");
            console.log('Database rating_app created');
        } else {
            console.log('rating_app already exists');
        }
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await client.end();
    }
}

main();
