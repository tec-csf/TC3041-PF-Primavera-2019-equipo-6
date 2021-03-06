//app.js
'use strict'
// Variables / Imports ==================================================
//Imports
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
var cors = require('cors');
const debug = require('debug')('dev');
require('dotenv').config({path: __dirname + '/.env'})
//Archivos
const router = require('./routes/router');

// Configuración ===================================================
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression()); //Hace el api más ligera y más rápida
app.use(helmet()); // Añade seguridad a las cabezaras http
app.use("/user_data", express.static(path.join(__dirname, 'user_data')));

// Cors ===============================================================
app.use(cors());
app.options('*', cors());

// Rutas =========================================================
app.use('/', router);

// Listen ========================================================
const port = process.env.PORT || 8000
app.listen(port, () => {
    debug('User-post: http://127.0.0.1:' + port);
});
