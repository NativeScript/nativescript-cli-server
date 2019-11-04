'use strict';

const DeviceEmitter = require('./src/device-emitter');
const ServerManager = require('./src/server-manager');
const DeviceManager = require('./src/device-manager');
const serverManagerInstance = new ServerManager();
const deviceEmitterInstance = new DeviceEmitter(serverManagerInstance);
const deviceManager = new DeviceManager(serverManagerInstance);
const EnvironmentManager = require('./src/environment-manager');
const environmentManager = new EnvironmentManager(serverManagerInstance);
const getIosDeviceLibManagerConstructor = require('./src/ios-device-lib-manager');
const iosDeviceLibManager = getIosDeviceLibManagerConstructor(serverManagerInstance);

module.exports = {
    getServerAddress: serverManagerInstance.getServerAddress.bind(serverManagerInstance),
    killServer: serverManagerInstance.killServer.bind(serverManagerInstance),
    deviceEmitter: deviceEmitterInstance,
    getEnvironmentStatus: environmentManager.getEnvironmentStatus.bind(environmentManager),
    IosDeviceLib: iosDeviceLibManager,
    refresh: deviceManager.refresh.bind(deviceManager)
}
