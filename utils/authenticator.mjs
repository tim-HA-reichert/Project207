import express from 'express'
import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const becomeUser = async (aName, aPassword, aRole) => {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(aPassword, salt);

    const user = {username: aName, password: hashedPassword, role: aRole};

    return user;
};

export const loginUser = async (regularPassword, hashedPassword) => {

    const comparePassword = await bcrypt.compare(regularPassword, hashedPassword)

    return comparePassword
}


export const generateToken = (user, res) => {

    const accessToken = jwt.sign({
        username: user.username,
        role: user.role
    }, 
        process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5min"});

    return accessToken
}