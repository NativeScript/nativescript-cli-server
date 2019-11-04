'use strict';

const expressValidator = require('express-validator');

module.exports = (app, socketConnections) => {

    // TODO: is this needed?
    app.use(expressValidator());

    app.use((req, res, next) => {
        req.socketConnections = socketConnections;
        next();
    });
}
