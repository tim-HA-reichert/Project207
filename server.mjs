import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import recipeRouter from './router/recipeRoutes.mjs';
import loginRouter from './router/loginRoutes.mjs';


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

server.use('/recipes', recipeRouter);
server.use('/authentication', loginRouter);


server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});




server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});