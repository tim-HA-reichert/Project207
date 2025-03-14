import RecordStoreInterface from "./abstractRecordStoreInterface.mjs";
import * as db from './db.mjs';

export default class StoreUserRecord extends RecordStoreInterface {
    async create(user) {
        const query = `
            INSERT INTO users (
                username,
                password,
                role,
                created_at
            )
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING user_id, username, role, created_at
        `;

        const values = [
            user.username,
            user.password, // Expect pre-hashed password
            user.role || 'user'
        ];

        return await db.create(query, ...values);
    }

    async findByUsername(username) {
        const query = `
            SELECT user_id, username, password, role
            FROM users
            WHERE username = $1
        `;

        return await db.read(query, username);
    }
}