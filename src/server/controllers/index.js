'use strict';

const layoutController = require('./layout-controller');
const simulatorController = require('./simulator-controller');
const iosDevicesController = require('./ios-devices-controller');

module.exports = {
    layout: layoutController,
    simulator: simulatorController,
    iosDevices: iosDevicesController
};
