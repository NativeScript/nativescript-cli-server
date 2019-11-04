const constants = require("./common/constants");
const utils = require("./utils");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const http = require("http");

let instance = null;

class ServerManager {
    constructor() {
        if (!instance) {
            this._isDisposed = false;
            const fileName = new Date().getTime();
            utils.ensureDirExistsRecursive(constants.logFilesLocation.logsDir);
            const outFileName = path.join(constants.logFilesLocation.logsDir, `${fileName}.log`);
            const out = fs.openSync(outFileName, 'a');
            const err = fs.openSync(path.join(constants.logFilesLocation.logsDir, `${fileName}.err`), 'a');
            this.startServerPromise = new Promise((resolve, reject) => {
                child_process.spawn("node", [path.join(__dirname, "server-launcher.js")], { detached: true, stdio: ['ignore', out, err] }).unref();
                const intervalHandle = setInterval(() => {
                    if (this._isDisposed) {
                        clearInterval(intervalHandle);
                        reject(new Error('Server disposed!'));
                        return;
                    }

                    const contents = fs.readFileSync(outFileName).toString();
                    if (contents) {
                        clearInterval(intervalHandle);
                        this.port = +fs.readFileSync(constants.logFilesLocation.statusFilePath).toString();
                        http.get({
                            host: constants.server.host,
                            port: this.port,
                            path: constants.server.healthUrlPath
                        }, res => {
                            let rawData = '';
                            res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                            res.on(constants.eventNames.end, () => {
                                const parsedData = JSON.parse(rawData);
                                if (parsedData.status === 'OK') {
                                    resolve({
                                        host: constants.server.host,
                                        port: this.port
                                    });
                                } else {
                                    reject(new Error('Server not running!'));
                                }
                            });
                        });
                    }
                }, 400);
            });

            instance = this;
        }

        return instance;
    }

    getServerAddress() {
        return !this.port ? this.startServerPromise : Promise.resolve({
            host: constants.server.host,
            port: this.port
        });
    }

    killServer() {
        return this.getServerAddress()
            .then(serverInfo => new Promise((resolve, reject) => {
                http.get({
                    host: serverInfo.host,
                    port: serverInfo.port,
                    path: constants.server.quitPath
                }, res => {
                    let rawData = '';
                    res.on(constants.eventNames.data, chunk => { rawData += chunk; });
                    res.on(constants.eventNames.end, () => {
                        resolve(JSON.parse(rawData));
                    });
                });
            }));
    }

    dispose() {
        this._isDisposed = true;
    }
}

module.exports = ServerManager;
