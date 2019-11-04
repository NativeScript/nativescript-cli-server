'use strict';

const exphbs = require('express-handlebars');
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');

module.exports = (app, socketConnections) => {
    app.engine('handlebars', exphbs({ defaultLayout: path.join(__dirname, '..', 'views', 'layouts', 'main'), extname: '.handlebars' }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '..', 'views'));

    app.use(expressValidator());

    app.use(express.static(path.join(__dirname, '..', 'public')));

    app.use((req, res, next) => {
        req.socketConnections = socketConnections;
        next();
    });
}
