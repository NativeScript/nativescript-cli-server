'use strict';

const constants = require('../../common/constants');
const uuid = require('uuid');
const iosDeviceLibModule = require("ios-device-lib").IOSDeviceLib;
const utils = require('../utils');

function deviceFoundCallback(deviceInfo) {
    const socket = utils.getServerSocket();
    socket.emit('deviceFound', deviceInfo);
}

function deviceUpdatedCallback() {
    const socket = utils.getServerSocket();
    socket.emit('deviceUpdated', deviceInfo);
}

function deviceLostCallback() {
    const socket = utils.getServerSocket();
    socket.emit('deviceLost', deviceInfo);
}

const deviceLib = new iosDeviceLibModule(deviceFoundCallback, deviceUpdatedCallback, deviceLostCallback);

deviceLib.on('deviceLogData', (logData) => {
    const socket = utils.getServerSocket();
    socket.emit('deviceLogData', logData);
});

module.exports = {
    callDeviceLib: (req, res) => {
        req.checkParams(constants.params.methodName, constants.errorMessages.requiredParameter).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return res.render(constants.views.error);
        }

        const methodName = req.params.methodName;
        let result = null;
        try {
            result = deviceLib[methodName].apply(this, req.params.arguments || []);
        } catch (err) {
            res.status(constants.responseCode.badRequest).json(err);
        }

        if (result && typeof result.then === 'function') {
            result
                .then(libResult => res.status(constants.responseCode.ok).json(libResult))
                .catch(libError => res.status(constants.responseCode.badRequest).json(libError));
        } else {
            res.status(constants.responseCode.ok).json(result);
        }
    }
};
