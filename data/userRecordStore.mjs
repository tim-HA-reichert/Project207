import RecordStoreInterface from "./abstractRecordStoreInterface.mjs";
import * as db from './db.mjs'

export default class UserRecordStore extends RecordStoreInterface {

    async create(user){
        const query = `
            INSERT INTO users(
                username,
                password,
                role,
                created_at
            )
            VALUES ($1, $2, NOW()), $4)
            RETURNING *
            `;

        const values = [
            user.username,
            user.password,
            user.role || 'user'
        ]

        return await db.create(query, ...values);
    }


}