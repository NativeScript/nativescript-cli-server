const EventEmitter = require("events").EventEmitter;
const http = require("http");
const constants = require('./common/constants');
const socketClient = require('socket.io-client');

let serverManagerInstance = null;

class IosDeviceLibManager extends EventEmitter {
    constructor(onDeviceFound, onDeviceUpdated, onDeviceLost) {
        serverManagerInstance.getServerAddress().then(serverInfo => {
            this.client = socketClient(`http://${serverInfo.host}:${serverInfo.port}`);
            this.client.on(constants.eventNames.deviceFound, onDeviceFound);
            this.client.on(constants.eventNames.deviceLost, onDeviceLost);
            this.client.on(constants.eventNames.deviceUpdated, onDeviceUpdated);
        });
    }

    dispose(signal) {
        this._sendRequest('dispose', [signal]);
        if (this.client) {
            this.client.close();
        }
    }

    install(ipaPath, deviceIdentifiers) {
        return this._sendRequest('install', [ipaPath, deviceIdentifiers]);
    }

    uninstall(ipaPath, deviceIdentifiers) {
        return this._sendRequest('uninstall', [ipaPath, deviceIdentifiers]);
    }
    list(listArray) {
        return this._sendRequest('list', [listArray]);
    }
    upload(uploadArray) {
        return this._sendRequest('upload', [uploadArray]);
    }
    download(downloadArray) {
        return this._sendRequest('download', [downloadArray]);
    }
    read(readArray) {
        return this._sendRequest('read', [readArray]);
    }
    delete(deleteArray) {
        return this._sendRequest('delete', [deleteArray]);
    }
    postNotification(postNotificationArray) {
        return this._sendRequest('postNotification', [postNotificationArray]);
    }
    awaitNotificationResponse(awaitNotificationResponseArray) {
        return this._sendRequest('awaitNotificationResponse', [awaitNotificationResponseArray]);
    }
    apps(deviceIdentifiers) {
        return this._sendRequest('apps', [deviceIdentifiers]);
    }
    start(startArray) {
        return this._sendRequest('start', [startArray]);
    }
    stop(stopArray) {
        return this._sendRequest('stop', [stopArray]);
    }
    startDeviceLog(deviceIdentifiers) {
        return this._sendRequest('startDeviceLog', [deviceIdentifiers]);
    }
    connectToPort(connectToPortArray) {
        return this._sendRequest('connectToPort', [connectToPortArray]);
    }

    on(event, listener) {
        this.client.on(event, listener);
    };

    _sendRequest(methodName, arguments) {
        return new Promise((resolve, reject) => {
            serverManagerInstance.getServerAddress().then(serverInfo => {
                const body = JSON.stringify({
                    methodName, arguments
                });
                const options = {
                    hostname: serverInfo.host,
                    port: serverInfo.port,
                    path: this._getUrl(deviceInfo, urlPath),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    }
                };

                const req = http.request(options, res => {
                    let rawData = '';
                    res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                    res.on(constants.eventNames.end, () => {
                        res.statusCode === constants.responseCode.ok ? resolve(JSON.parse(rawData)) : reject(JSON.parse(rawData));
                    });
                });

                req.on(constants.eventNames.error, err => {
                    reject(err);
                });

                req.write(body);
                req.end();
            });
        });
    }
}

function getIosDeviceLibManagerConstructor(serverManager) {
    serverManagerInstance = serverManager;
    return IosDeviceLibManager;
}

module.exports = getIosDeviceLibManagerConstructor;
