'use strict';

const constants = require('../../common/constants');
const iosDeviceLibModule = require("ios-device-lib").IOSDeviceLib;
const utils = require('../utils');

const currentDevices = [];
let skipDeviceEvents = true;
function deviceFoundCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    currentDevices.push(deviceInfo);
    if (!skipDeviceEvents) {
        socket.emit('deviceFound', deviceInfo);
    }
}

function deviceUpdatedCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    const device = currentDevices.find(d => d.deviceId === deviceInfo.deviceId);
    const index = device && currentDevices.indexOf(device);
    if (index !== null && index > -1) {
        currentDevices[index] = deviceInfo;
    }

    if (!skipDeviceEvents) {
        socket.emit('deviceUpdated', deviceInfo);
    }
}

function deviceLostCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    const device = currentDevices.find(d => d.deviceId === deviceInfo.deviceId);
    const index = device && currentDevices.indexOf(device);
    if (index !== null && index > -1) {
        currentDevices.splice(index, 1);
    }

    if (!skipDeviceEvents) {
        socket.emit('deviceLost', deviceInfo);
    }
}

const deviceLib = new iosDeviceLibModule(deviceFoundCallback, deviceUpdatedCallback, deviceLostCallback);
const lookingForDevicesPromise = new Promise((resolve) => setTimeout(() => {
    skipDeviceEvents = false;
    resolve();
}, 6000));

deviceLib.on('deviceLogData', (logData) => {
    const socket = utils.getServerSocket();
    socket.emit('deviceLogData', logData);
});

const callLibMethod = async (methodName, args) => {
    let promises = null;
    const result = [];
    const errors = [];
    try {
        promises = deviceLib[methodName].apply(deviceLib, args || []);
    } catch (err) {
        return res.status(constants.responseCode.ok).json({ result: [], errors: [`Error while executing ios device operation: ${err.message} with code: ${err.code}`] });
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

    return { result, errors };
}

module.exports = {
    currentDevices: async (req, res) => {
        await lookingForDevicesPromise;
        return res.status(constants.responseCode.ok).json(currentDevices);
    },
    callDeviceLib: async (req, res) => {
        const methodName = req.body.methodName;
        const args = req.body.args;
        const { result, errors } = await callLibMethod(methodName, args);

        if (result.length || errors.length) {
            return res.status(constants.responseCode.ok).json({ result, errors });
        } else {
            return res.status(constants.responseCode.ok).json({ result: promises });
        }
    },
    callLibMethod: callLibMethod
};
