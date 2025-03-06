import pg from 'pg'
const { Client } = pg

const config = {
    connectionString: process.env.DB_EXTERNAL_CRED,
    ssl: any, 
}


const client = new Client(config);

await client.connect();
