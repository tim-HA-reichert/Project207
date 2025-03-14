export default class User {
    constructor(userData) {
        this.user_id = userData.user_id || null;
        this.username = userData.username;
        this.password = userData.password;
        this.role = userData.role || 'user';
        this.created_at = userData.created_at || new Date();
    }

    userData() {
        return {
            user_id: this.user_id,
            username: this.username,
            password: this.password,
            role: this.role,
            created_at: this.created_at
        };
    }
}