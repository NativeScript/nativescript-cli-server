'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const constants = require('./common/constants');
const utils = require('./common/utils');
const _ = require('lodash');
const logger = require('./logger');

module.exports = {
    start: port => {
        return new Promise((resolve, reject) => {
            const express = require('express');
            const app = express();
            const server = require('http').createServer(app);
            const socket = require('socket.io')(server);

            let socketConnections = {};
            let deviceEmitterInstanceClients = {};

            require('./config/express')(app, socketConnections);
            require('./config/routes')(app);


            socket.on('connection', client => {
                client.on(constants.eventNames.deviceEmitter, emitterId => {
                    deviceEmitterInstanceClients[emitterId] = client;
                });

                client.on('handshake', fullDeviceIdentifier => {
                    socketConnections[fullDeviceIdentifier] = client;
                    _(deviceEmitterInstanceClients)
                        .values()
                        .each(deviceEmitterClient => {
                            deviceEmitterClient.emit(constants.eventNames.deviceFound, utils.getDeviceInfo(fullDeviceIdentifier));
                        });
                });

                client.on('device-disconnected', fullDeviceIdentifier => {
                    delete socketConnections[fullDeviceIdentifier];
                    _(deviceEmitterInstanceClients)
                        .values()
                        .each(deviceEmitterInstance => {
                            deviceEmitterInstance.emit(constants.eventNames.deviceLost, utils.getDeviceInfo(fullDeviceIdentifier).identifier);
                        });
                });
            });

            server.listen(port, () => {
                logger.log("Server stared listening");
                resolve(server.address().port);
            });

            server.on(constants.eventNames.error, err => reject(err));
        })
    }
}
