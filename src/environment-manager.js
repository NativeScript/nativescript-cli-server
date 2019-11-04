const http = require("http");
const constants = require('./common/constants');
const DeviceEmitter = require('./device-emitter');

class EnvironmentManager {
    constructor(deviceEmitterInstance) {
        this.deviceEmitterInstance = deviceEmitterInstance;
    }

    getEnvironmentStatus(options) {
        return this.deviceEmitterInstance.getServerAddress()
            .then(serverInfo => {
                this.serverInfo = serverInfo;
                return this._sendRequest('/getEnvironmentStatus/', options);
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


}

module.exports = EnvironmentManager;
