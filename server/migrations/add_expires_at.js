import db from '../db.js';

async function migrate() {
    console.log('Starting migration: add_expires_at to vouchers table...');
    try {
        await db.execute({
            sql: 'ALTER TABLE vouchers ADD COLUMN expires_at DATETIME;',
            args: [],
        });
        console.log('Migration successful: expires_at column added.');
    } catch (error) {
        if (error.message.includes('duplicate column name')) {
            console.log('Column expires_at already exists.');
        } else {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }
}

migrate();
