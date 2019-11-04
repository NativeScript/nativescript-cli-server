'use strict';

const constants = require('./constants');

module.exports = {
    successResponse: res => {
        res.status(constants.responseCode.ok)
            .json({ msg: constants.successMesseges.success });
    },

    errorResponse: (res, errors) => {
        res.status(constants.responseCode.badRequest)
            .json({ errors });
    },

    getDeviceInfo: deviceIdentifier => {
        const deviceInfo = deviceIdentifier.split('/');

        return {
            identifier: deviceInfo[2],
            publicKey: deviceInfo[0],
            model: deviceInfo[1],
            os: deviceInfo[1].toLowerCase().startsWith(constants.device.android) ? constants.os.android : constants.os.ios
        }
    }
}
