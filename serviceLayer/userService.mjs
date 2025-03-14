import bcrypt from 'bcrypt';
import User from '../models/userModel.mjs';

export default class UserService {
    constructor(userRecord) {
        this.userRecord = userRecord;
        
        this.roles = {
            user: "user",
            admin: "admin"
        };
    }

    async createUser(userData) {
        this.validateUserData(userData);

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            ...userData,
            password: hashedPassword,
            role: userData.role || this.roles.user
        });

        return await this.userRecord.create(newUser.userData());
    }

    async loginUser(username, password) {
        const users = await this.userRecord.findByUsername(username);
        
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        };
    }

    validateUserData(userData) {

        if (!userData.username) {
            throw new Error('Username is required');
        }

        if (!userData.password) {
            throw new Error('Password is required');
        }
    }
}