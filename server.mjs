import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import recipeRouter from './router/recipeRoutes.mjs';
import loginRouter from './router/loginRoutes.mjs';
import dotenv from 'dotenv';

dotenv.config();


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

server.use('/recipes', recipeRouter);



//IKKE BRUKT
server.use('/authentication', loginRouter);
//IKKE BRUKT



server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});


server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});