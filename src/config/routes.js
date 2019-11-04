'use strict';

const controllers = require('../controllers');
const constants = require('../common/constants');
const routeMiddware = require('./route-middlewares');
const utils = require('../utils');
const fs = require('fs');

module.exports = app => {
    app.get(constants.server.quitPath, (req, res) => {
        res.status(constants.responseCode.ok)
            .json({ status: constants.statusMassages.OK });

        utils.deleteFilesOlderThan(constants.logFilesLocation.logsDir, constants.common.logFilesDeleteDaysNumber);
        fs.unlinkSync(constants.logFilesLocation.statusFilePath);
    });
    app.get('/', controllers.layout.get);

    //API
    app.get(constants.server.healthUrlPath, routeMiddware.healthcheckMiddleware);
    app.get(constants.server.devicesUrlPath, controllers.simulator.getConnectedDevice);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/rotateleft', routeMiddware.populateSocket, controllers.simulator.rotateLeft);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/rotateright', routeMiddware.populateSocket, controllers.simulator.rotateRight);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/emitHomeButton', routeMiddware.populateSocket, controllers.simulator.emitHomeButton);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/setScale', routeMiddware.populateSocket, controllers.simulator.setScale);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/heartbeat', routeMiddware.populateSocket, controllers.simulator.heartbeat);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/mouseclick', routeMiddware.populateSocket, controllers.simulator.mouseclick);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/keypress', routeMiddware.populateSocket, controllers.simulator.keypress);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/openUrl', routeMiddware.populateSocket, controllers.simulator.openUrl);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/restartApp', routeMiddware.populateSocket, controllers.simulator.restartApp);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/endSession', routeMiddware.populateSocket, controllers.simulator.endSession);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/saveScreenshot', routeMiddware.populateSocket, controllers.simulator.saveScreenshot);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/getScreenshot', routeMiddware.populateSocket, controllers.simulator.getScreenshot);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/requestSession', routeMiddware.populateSocket, controllers.simulator.requestSession);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/pasteText', routeMiddware.populateSocket, controllers.simulator.pasteText);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/setLanguage', routeMiddware.populateSocket, controllers.simulator.setLanguage);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/setLocation', routeMiddware.populateSocket, controllers.simulator.setLocation);
    app.post('/api/simulators/:device/:publicKey/:deviceIdentifier/refresh', routeMiddware.populateSocket, controllers.simulator.refresh);
};
