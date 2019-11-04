'use strict';

const constants = require('../../common/constants');
const uuid = require('uuid');
const iosDeviceLibModule = require("ios-device-lib").IOSDeviceLib;
const utils = require('../utils');

const currentDevices = [];
function deviceFoundCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    currentDevices.push(deviceInfo);
    socket.emit('deviceFound', deviceInfo);
}

function deviceUpdatedCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    const device = currentDevices.find(d => d.deviceId === deviceInfo.deviceId);
    const index = device && currentDevices.indexOf(device);
    if (index !== null && index > -1) {
        currentDevices.splice(index, 1, deviceInfo);
    }

    socket.emit('deviceUpdated', deviceInfo);
}

function deviceLostCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    const index = currentDevices.indexOf(deviceInfo);
    if (index > -1) {
        currentDevices.splice(index, 1);
    }
    socket.emit('deviceLost', deviceInfo);
}

const deviceLib = new iosDeviceLibModule(deviceFoundCallback, deviceUpdatedCallback, deviceLostCallback);

deviceLib.on('deviceLogData', (logData) => {
    const socket = utils.getServerSocket();
    socket.emit('deviceLogData', logData);
});

module.exports = {
    currentDevices: (req, res) => {
        res.status(constants.responseCode.ok).json(currentDevices);
    },
    callDeviceLib: async (req, res) => {
        // req.checkParams(constants.params.methodName, constants.errorMessages.requiredParameter).notEmpty();

        // const errors = req.validationErrors();
        // if (errors) {
        //     return res.status(constants.responseCode.badRequest).json(errors);
        // }

        const methodName = req.body.methodName;
        let promises = null;
        const result = [];
        const errors = [];
        try {
            promises = deviceLib[methodName].apply(deviceLib, req.body.args || []);
        } catch (err) {
            res.status(constants.responseCode.ok).json({ result: [], errors: [`Error while executing ios device operation: ${err.message} with code: ${err.code}`] });
        }

        if (promises && Array.isArray(promises)) {
            for (const promise of promises) {
                try {
                    result.push(await promise);
                } catch (err) {
                    errors.push(`Error while executing ios device operation: ${err.message} with code: ${err.code}`);
                }
            }
        }

        if (result.length || errors.length) {
            res.status(constants.responseCode.ok).json({ result, errors });
        } else {
            res.status(constants.responseCode.ok).json({ result: promises });
        }
    }
};
