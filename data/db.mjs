import pg from 'pg'
const { Client, Pool } = pg

const config = {
    connectionString: process.env.DB_EXTERNAL_CRED,
    ssl: false 
}

const pool = new Pool(config);

async function create(statement, ...values){
    return await runQuery(statement, ...values);
}
async function read(statement, ...values){
    return await runQuery(statement, ...values);
}
async function update(statement, ...values){
   return await runQuery(statement, ...values);
}
async function remove(statement, ...values){
    return await runQuery(statement, ...values);
}

async function runQuery(query, ...values){
    const client = await pool.connect();
    
    try{
        await client.connect();
        const result = await client.query(query, values);

        if(result.rowCount <= 0){
            throw new Error(console.log("Row count is 0. No records created."));
        }

        return result.rows[0];

    } catch(error){
        console.error(error);
        throw error

    }finally{
       await client.release();
    }
}
