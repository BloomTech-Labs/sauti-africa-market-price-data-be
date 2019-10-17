const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

const devRouter = require('../developer/developer-router.js');
const clientRouter = require('../client/client-router.js');

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/sauti/developer', devRouter);
server.use('/sauti/client', clientRouter);

server.get('/', (req, res) => {
    res.send('working in my test server');
});

module.exports = server;