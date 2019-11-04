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
    constructor(serverManager) {
        super();
        if (!instance) {
            this.serverManager = serverManager;
            instance = this;
        }

        return instance;
    }

    startDeviceDiscovery() {
        this.serverManager.getServerAddress().then(({ host, port }) => {
            this.devices = {};

            http.get({
                host: host,
                port: port,
                path: constants.server.devicesUrlPath
            }, res => {
                let rawData = '';
                res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                res.on(constants.eventNames.end, () => {
                    const parsedData = JSON.parse(rawData);
                    parsedData.forEach(device => {
                        this.addDevice(device);
                    });
                });
            });

            const id = uuid.v4();
            this.client = socketClient(`http://${host}:${port}`);
            this.client.on(constants.eventNames.deviceFound, device => {
                this.addDevice(device);
            });
            this.client.on(constants.eventNames.deviceLost, deviceIdentifier => {
                this.removeDevice(deviceIdentifier);
            });
            this.client.emit(constants.eventNames.deviceEmitter, id);
        })
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

    dispose() {
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
