import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res) => {

    const username = req.username;

    const user = { username: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken })    
}


export default authenticateToken