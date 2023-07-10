require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');

/*
*IMPORTAR RUTAS
*/
const useRoutes = require('./routes/useRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productsRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');

const port = process.env.PORT || 4004;
const host = process.env.DB_HOST || 'localhost';
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');
app.set('port', port);

const upload = multer({
    storage: multer.memoryStorage()
})

server.listen(port, host, function(){
    console.log('/////////////////////////////////////////////////////////////////////');
    console.log('//SERVIDOR ORDER NOW EN LINEA en '+ host + ':' + port + ' Iniciada...//');
    console.log('/////////////////////////////////////////////////////////////////////');
});

/*
* LLAMADO DE LA RUTA
*/
useRoutes(app, upload);
categoryRoutes(app, upload);
productsRoutes(app, upload);
addressRoutes(app);
orderRoutes(app);

app.get('/', (request, response) => {
    response.send('Ruta raiz del backend');
});

// ERROR HANDLER
app.use((error, reqquest, response, next) => {
    console.log(error);
    response.status(error.status || 500).set(error.stack);
});