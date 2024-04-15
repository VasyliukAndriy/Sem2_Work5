const { Client } = require('pg');

const dbConfig = {
    host: 'surus.db.elephantsql.com',
    port: 5432,
    database: 'iiypgvhw',
    user: 'iiypgvhw',
    password: 'Ehi-avgvbH-GU06aFXtOZPMEvMwZbH_S',
};

async function main() {
    const client = new Client(dbConfig);

    try {
        await client.connect();

        const res = await client.query('SELECT NOW() as current_time');
        console.log(res.rows[0]); // Assuming you want to log the result

        await createTables(client); // Create tables if they don't exist

        await insertSampleData(client); // Insert sample data into the tables

    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        await client.end();
    }
}

async function createTables(client) {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS djurnal (
                id SERIAL PRIMARY KEY,
                student_id INTEGER,
                subject VARCHAR(255),
                grade VARCHAR(10)
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS lesson_hours (
                id SERIAL PRIMARY KEY,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL
            )
        `);
        console.log('Tables "djurnal" and "lesson_hours" created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

async function insertSampleData(client) {
    try {
        const data = [
            { student_id: 1, subject: 'Math', grade: 'A' },
            { student_id: 2, subject: 'History', grade: 'B' },
            { student_id: 3, subject: 'Science', grade: 'C' }
        ];

        for (const item of data) {
            await client.query(`
                INSERT INTO djurnal (student_id, subject, grade)
                VALUES ($1, $2, $3)
            `, [item.student_id, item.subject, item.grade]);
        }

        console.log('Sample data inserted into "djurnal" table successfully.');

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

main().catch(console.error);
