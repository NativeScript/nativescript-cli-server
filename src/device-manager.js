const http = require("http");
const constants = require('./common/constants');
const DeviceEmitter = require('./device-emitter');

class DeviceManager {
    constructor(deviceEmitterInstance) {
        this.deviceEmitterInstance = deviceEmitterInstance;
    }

    refresh(deviceIdentifier) {
        return this.deviceEmitterInstance.getServerAddress()
            .then(serverInfo => {
                this.serverInfo = serverInfo;
                return this._sendRequest(this._getDeviceInfo(deviceIdentifier), constants.methods.refresh);
            });
    }

    _sendRequest(deviceInfo, urlPath) {
        return new Promise((resolve, reject) => {
            if (!deviceInfo) {
                return reject('No such device found.');
            }

            const options = {
                hostname: this.serverInfo.host,
                port: this.serverInfo.port,
                path: this._getUrl(deviceInfo, urlPath),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const req = http.request(options, res => {
                let rawData = '';
                res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                res.on(constants.eventNames.end, () => {
                    res.statusCode === constants.responseCode.ok ? resolve() : reject(JSON.parse(rawData));
                });
            });

            req.on(constants.eventNames.error, err => {
                reject(err);
            });

            req.end();
        });
    }

    _getUrl(deviceInfo, urlPath) {
        return `/api/simulators/${deviceInfo.model}/${deviceInfo.publicKey}/${deviceInfo.identifier}/${urlPath}`;
    }

    _getDeviceInfo(deviceIdentifier) {
        const devices = this.deviceEmitterInstance.getCurrentlyAttachedDevices();
        return devices[deviceIdentifier];
    }
}

module.exports = DeviceManager;
