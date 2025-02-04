import express from 'express'
import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';


//Add a state for users that are logged in?
//Add a check for already existing usernames?
//Create better user handling (currently it is an array in server.mjs)

export const becomeUser = async (aName, aPassword) => {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(aPassword, salt);

    const user = {username: aName, password: hashedPassword};

    return user;
};

export const loginUser = async (regularPassword, hashedPassword) => {

    const comparePassword = await bcrypt.compare(regularPassword, hashedPassword)

    return comparePassword
}


export const generateToken = (user, res) => {

    const accessToken = jwt.sign({username: user}, process.env.ACCESS_TOKEN_SECRET);

    return accessToken
}