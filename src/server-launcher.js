const fs = require('fs');
const http = require('http');
const path = require('path');

const constants = require('./common/constants');
const logger = require('./logger');
const server = require('./server');
const utils = require('./utils');

function startServer() {
    return getState()
        .then(port => checkServerHealth(port)
            .then(serverHealth => {
                if (!serverHealth) {
                    return server.start(port)
                        .catch(initServerWithFreePort)
                        .then(port => {
                            watchStatusFile(port);
                        });
                }

                logger.log("Stopping this instance, server already running.");
            }),
        err => initServerWithFreePort(err)
            .then(port => {
                watchStatusFile(port);
            }));
}

function initServerWithFreePort(err) {
    return server.start(0)
        .then(saveState);
}

function saveState(port) {
    return new Promise((resolve, reject) => {
        utils.ensureDirExistsRecursive(constants.logFilesLocation.statusFileDir);
        fs.writeFile(constants.logFilesLocation.statusFilePath, port, err => err ? reject(err) : resolve(port));
    });
}

function getState() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(constants.logFilesLocation.logsDir)) {
            return reject();
        }

        if (fs.existsSync(constants.logFilesLocation.statusFilePath)) {
            return fs.readFile(constants.logFilesLocation.statusFilePath, 'utf8', (err, data) => {
                err ? reject(err) : resolve(data)
            });
        }

        reject();
    });
}

function watchStatusFile(port) {
    utils.ensureDirExistsRecursive(constants.logFilesLocation.statusFileDir);
    return fs.watch(constants.logFilesLocation.statusFileDir, (event, fileName) => {
        if (event === 'rename') {
            process.exit(1);
        }
    });
}

function checkServerHealth(port) {
    return new Promise((resolve, reject) => {
        const getRequest = http.get({
            host: constants.server.host,
            port: port,
            path: constants.server.healthUrlPath
        }, res => resolve(res.statusCode === 200));

        getRequest.on(constants.eventNames.error, err => resolve(false));
    });
}

startServer();
