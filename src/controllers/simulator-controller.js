'use strict';

const constants = require('../common/constants');
const utils = require('../common/utils');

module.exports = {
    rotateLeft: (req, res) => {
        req.simulatorSocket.emit(constants.methods.rotateLeft);
        return utils.successResponse(res);
    },

    rotateRight: (req, res) => {
        req.simulatorSocket.emit(constants.methods.rotateRight);
        return utils.successResponse(res);
    },

    emitHomeButton: (req, res) => {
        req.simulatorSocket.emit(constants.methods.emitHomeButton);
        return utils.successResponse(res);
    },

    heartbeat: (req, res) => {
        req.simulatorSocket.emit(constants.methods.heartbeat);
        return utils.successResponse(res);
    },

    restartApp: (req, res) => {
        req.simulatorSocket.emit(constants.methods.restartApp);
        return utils.successResponse(res);
    },

    endSession: (req, res) => {
        req.simulatorSocket.emit(constants.methods.endSession);
        return utils.successResponse(res);
    },

    saveScreenshot: (req, res) => {
        req.simulatorSocket.emit(constants.methods.saveScreenshot);
        return utils.successResponse(res);
    },

    getScreenshot: (req, res) => {
        req.simulatorSocket.emit(constants.methods.getScreenshot);
        return utils.successResponse(res);
    },


    requestSession: (req, res) => {
        req.simulatorSocket.emit(constants.methods.requestSession)
        return utils.successResponse(res);
    },

    setScale: (req, res) => {
        req.checkQuery(constants.params.scale, constants.errorMessages.scaleErrorMessage).isInt();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const scale = req.query.scale;
        req.simulatorSocket.emit(constants.methods.setScale, { scale });
        return utils.successResponse(res);
    },

    mouseclick: (req, res, next) => {
        req.checkQuery(constants.params.x, constants.errorMessages.requiredParameter).isInt();
        req.checkQuery(constants.params.y, constants.errorMessages.requiredParameter).isInt();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const x = req.query.x;
        const y = req.query.y;
        req.simulatorSocket.emit(constants.methods.mouseclick, { x, y });
        return utils.successResponse(res);
    },

    keypress: (req, res) => {
        req.checkQuery(constants.params.key, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const key = req.query.key;
        const shiftKey = req.query.shiftKey;
        req.simulatorSocket.emit(constants.methods.keypress, { key, shiftKey });
        return utils.successResponse(res);
    },

    openUrl: (req, res) => {
        req.checkQuery(constants.params.url, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const url = req.query.url;
        req.simulatorSocket.emit(constants.methods.openUrl, { url });
        return utils.successResponse(res);
    },

    pasteText: (req, res) => {
        req.checkQuery(constants.params.text, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const text = req.query.text
        req.simulatorSocket.emit(constants.methods.pasteText, { text });
        return utils.successResponse(res);
    },

    setLanguage: (req, res) => {
        req.checkQuery(constants.params.lang, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const lang = req.query.lang;
        req.simulatorSocket.emit(constants.methods.setLanguage, { lang })
        return utils.successResponse(res);
    },

    setLocation: (req, res) => {
        req.checkQuery(constants.params.lat, constants.errorMessages.requiredParameter).notEmpty();
        req.checkQuery(constants.params.long, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const lat = req.query.lat;
        const long = req.query.long;
        req.simulatorSocket.emit(constants.methods.setLocation, { location: [lat, long] })
        return utils.successResponse(res);
    },

    getConnectedDevice: (req, res) => {
        let devices = [];
        for (let key in req.socketConnections) {
            if (req.socketConnections.hasOwnProperty(key)) {
                devices.push(utils.getDeviceInfo(key));
            }
        }

        res.status(constants.responseCode.ok)
            .json(devices);
    },

    refresh: (req, res) => {
        req.simulatorSocket.emit(constants.methods.refresh);
        return utils.successResponse(res);
    }
}
