import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; 
import HTTP_CODES from '../utils/httpCodes.mjs';

dotenv.config();

export const tokenAuthentication = (req, res, next) => {

    const token = req.cookies.accessToken;

    if(token == null){
        return res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).send("No token provided");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
        return res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Invalid token");
    }
        req.user = user;
        console.log("User authenticated:", user);
        next();
    });
}


export const adminAccess = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("You are not an admin, apparently.");
    }
    next();
}

