import RecordStoreInterface from "./abstractRecordStoreInterface.mjs";
import * as db from './db.mjs'

export default class UserRecordStore extends RecordStoreInterface {

    async create(user){
        const query = `
            INSERT INTO users


            RETURNING *
            `;

        const values = [


        ]

        return await db.create(query, ...values);
    }


}