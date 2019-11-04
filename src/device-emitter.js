'use strict';

const EventEmitter = require("events").EventEmitter;
const constants = require("./common/constants");
const utils = require("./utils");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const http = require("http");
const socketClient = require('socket.io-client');
const uuid = require('uuid');

let instance = null;

class DeviceEmitter extends EventEmitter {
    constructor() {
        super();
        if (!instance) {
            this._isDisposed = false;
            this.devices = {};
            const fileName = new Date().getTime();
            utils.ensureDirExistsRecursive(constants.logFilesLocation.logsDir);
            const outFileName = path.join(constants.logFilesLocation.logsDir, `${fileName}.log`);
            const out = fs.openSync(outFileName, 'a');
            const err = fs.openSync(path.join(constants.logFilesLocation.logsDir, `${fileName}.err`), 'a');
            this.startServerPromise = new Promise((resolve, reject) => {
                child_process.spawn("node", [path.join(__dirname, "server-launcher.js")], { detached: true, stdio: ['ignore', out, err] }).unref();
                const intervalHandle = setInterval(() => {
                    if (this._isDisposed) {
                        clearInterval(intervalHandle);
                        return;
                    }

                    const contents = fs.readFileSync(outFileName).toString();
                    if (contents) {
                        clearInterval(intervalHandle);
                        this.port = +fs.readFileSync(constants.logFilesLocation.statusFilePath).toString();
                        http.get({
                            host: constants.server.host,
                            port: this.port,
                            path: constants.server.devicesUrlPath
                        }, res => {
                            let rawData = '';
                            res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                            res.on(constants.eventNames.end, () => {
                                const parsedData = JSON.parse(rawData);
                                parsedData.forEach(device => {
                                    this.addDevice(device);
                                });

                                resolve({
                                    host: constants.server.host,
                                    port: this.port
                                });
                            });
                        });

                        const id = uuid.v4();
                        this.client = socketClient(`http://${constants.server.host}:${this.port}`);
                        this.client.on(constants.eventNames.deviceFound, device => {
                            this.addDevice(device);
                        });
                        this.client.on(constants.eventNames.deviceLost, deviceIdentifier => {
                            this.removeDevice(deviceIdentifier);
                        });
                        this.client.emit(constants.eventNames.deviceEmitter, id);
                    }
                }, 400);
            });

            instance = this;
        }

        return instance;
    }

    getServerAddress() {
        return !this.port ? this.startServerPromise : Promise.resolve({
            host: constants.server.host,
            port: this.port
        });
    }

    addDevice(device) {
        this.devices[device.identifier] = device;
        this._raiseOnDeviceFound(device);
    }

    removeDevice(deviceIdentifier) {
        let device = this.devices[deviceIdentifier];
        if (!device) {
            return;
        }

        delete this.devices[deviceIdentifier];
        this._raiseOnDeviceLost(device);
    }

    getCurrentlyAttachedDevices() {
        return this.devices;
    }

    killServer() {
        return this.getServerAddress()
            .then(serverInfo => new Promise((resolve, reject) => {
                http.get({
                    host: serverInfo.host,
                    port: serverInfo.port,
                    path: constants.server.quitPath
                }, res => {
                    let rawData = '';
                    res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                    res.on(constants.eventNames.end, () => {
                        resolve(JSON.parse(rawData));
                    });
                });
            }));
    }

    dispose() {
        this._isDisposed = true;
        if (this.client) {
            this.client.close();
        }
    }

    _raiseOnDeviceFound(device) {
        this.emit(constants.eventNames.deviceFound, device);
    }

    _raiseOnDeviceLost(device) {
        this.emit(constants.eventNames.deviceLost, device);
    }
}

module.exports = DeviceEmitter;
