const expressValidator = require('express-validator');
const express = require('express');

module.exports = (app, socketConnections) => {

    // TODO: is this needed?
    app.use(expressValidator());

    app.use(express.json());
    app.use((req, res, next) => {
        req.socketConnections = socketConnections;
        next();
    });
}
