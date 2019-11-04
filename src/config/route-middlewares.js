'use strict'

const constants = require('../common/constants');
const utils = require('../common/utils');

module.exports = {
    populateSocket: (req, res, next) => {
        req.checkParams(constants.params.publicKey, constants.errorMessages.requiredParameter).notEmpty();
        req.checkParams(constants.params.device, constants.errorMessages.requiredParameter).notEmpty();
        req.checkParams(constants.params.deviceIdentifier, constants.errorMessages.requiredParameter).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return utils.errorResponse(res, errors);
        }

        const publicKey = req.params.publicKey;
        const device = req.params.device;
        const deviceIdentifier = req.params.deviceIdentifier;

        req.simulatorSocket = req.socketConnections[`${publicKey}/${device}/${deviceIdentifier}`];

        if (!req.simulatorSocket) {
            return utils.errorResponse(res, [{ msg: constants.errorMessages.deviceNotConnetcted }]);
        }

        next();
    },

    healthcheckMiddleware: (req, res, next) => {
        res.status(constants.responseCode.ok)
            .json({ status: constants.statusMassages.OK });
    }
}
