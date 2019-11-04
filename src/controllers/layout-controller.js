'use strict';

const constants = require('../common/constants');
const uuid = require('uuid');

module.exports = {
    get: (req, res) => {
        req.checkQuery(constants.params.publicKey, constants.errorMessages.requiredParameter).notEmpty();
        req.checkQuery(constants.params.device, constants.errorMessages.requiredParameter).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return res.render(constants.views.error);
        }

        const publicKey = req.query.publicKey;
        const device = req.query.device;
        const params = req.query.params;
        const deviceIdentifier = uuid.v4();
        const dimensions = constants.deviceSizes[device];
        const scale = dimensions.scale || 100;

        res.render(constants.views.simulator, {
            key: publicKey,
            device: device,
            deviceIdentifier: deviceIdentifier,
            width: dimensions.width / 100 * scale,
            height: dimensions.height / 100 * scale,
            scale: scale,
            params: params ? encodeURIComponent(params) : ''
        });
    }
};
