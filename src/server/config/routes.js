'use strict';

const controllers = require('../controllers');
const constants = require('../../common/constants');
const routeMiddware = require('./route-middlewares');
const utils = require('../../utils');
const fs = require('fs');

module.exports = app => {
    app.get(constants.server.quitPath, async (req, res) => {
        await controllers.iosDevices.callLibMethod('dispose',[]);
        res.status(constants.responseCode.ok)
            .json({ status: constants.statusMassages.OK });

        utils.deleteFilesOlderThan(constants.logFilesLocation.logsDir, constants.common.logFilesDeleteDaysNumber);
        fs.unlinkSync(constants.logFilesLocation.statusFilePath);
    });
    app.get('/', controllers.layout.get);

    //API
    app.get(constants.server.healthUrlPath, routeMiddware.healthcheckMiddleware);
    app.get(constants.server.devicesUrlPath, controllers.simulator.getConnectedDevice);
    app.post(constants.server.iosDeviceCall, controllers.iosDevices.callDeviceLib);
    app.get(constants.server.iosConnectedDevices, controllers.iosDevices.currentDevices);
    // app.get(constants.server.healthUrlPath, controllers.environment.getStatus);
};
