'use strict';

const path = require('path');
const packageName = "nativescript-cli-server";
const osenv = require('osenv');

const winLogFilesLocation = path.join(process.env.APPDATA || "", packageName);
const unixLogFilesLocation = path.join(osenv.home(), ".local", "share", packageName);
const logsDir = process.platform === "win32" ? winLogFilesLocation : unixLogFilesLocation;
const statusFileDir = path.join(logsDir, "health");

module.exports = {
    common: {
        name: packageName,
        logFilesDeleteDaysNumber: 30
    },
    errorMessages: {
        requiredParameter: 'The parameter is required.',
        scaleErrorMessage: 'The parameter must be a number between 10 and 100.',
        deviceNotConnetcted: 'There is no connected device.'
    },
    successMesseges: {
        success: 'success'
    },
    statusMassages: {
        OK: 'OK'
    },
    logFilesLocation: {
        win: winLogFilesLocation,
        unix: unixLogFilesLocation,
        logsDir,
        statusFileDir,
        statusFilePath: path.join(statusFileDir, 'status.txt')
    },
    methods: {
        rotateLeft: 'rotateLeft',
        rotateRight: 'rotateRight',
        emitHomeButton: 'emitHomeButton',
        heartbeat: 'heartbeat',
        restartApp: 'restartApp',
        endSession: 'endSession',
        getScreenshot: 'getScreenshot',
        requestSession: 'requestSession',
        saveScreenshot: 'saveScreenshot',
        setScale: 'setScale',
        mouseclick: 'mouseclick',
        keypress: 'keypress',
        openUrl: 'openUrl',
        pasteText: 'pasteText',
        setLanguage: 'setLanguage',
        setLocation: 'setLocation',
        publicKey: 'publicKey',
        device: 'device',
        refresh: 'refresh'
    },
    params: {
        scale: 'scale',
        x: 'x',
        y: 'y',
        key: 'key',
        shiftKey: 'shiftKey',
        url: 'url',
        text: 'text',
        lang: 'lang',
        lat: 'lat',
        long: 'long',
        publicKey: 'publicKey',
        device: 'device',
        deviceIdentifier: 'deviceIdentifier',
        methodName: 'methodName'
    },
    views: {
        simulator: 'simulator',
        error: 'error'
    },
    os: {
        android: 'android',
        ios: 'ios'
    },
    device: {
        android: 'nexus'
    },
    responseCode: {
        ok: 200,
        badRequest: 400
    },
    server: {
        host: 'localhost',
        healthUrlPath: '/api/health',
        devicesUrlPath: '/api/simulators/devices',
        iosConnectedDevices: '/api/ios-connected-devices',
        iosDeviceCall: '/api/ios-device-call',
        quitPath: '/api/quit'
    },
    eventNames: {
        deviceFound: "deviceFound",
        deviceLost: "deviceLost",
        deviceEmitter: "deviceEmitter",
        deviceUpdated: "deviceUpdated",
        deviceLogData: "deviceLogData",
        data: "data",
        error: "error",
        end: "end"
    },
    deviceSizes: {
        iphone4s: {
            width: 370,
            height: 733
        },
        iphone5s: {
            width: 365,
            height: 782
        },
        iphone6: {
            width: 416,
            height: 870
        },
        iphone6plus: {
            width: 680,
            height: 1420,
            scale: 75
        },
        ipadair: {
            width: 864,
            height: 1287,
            scale: 75
        },
        iphone6s: {
            width: 416,
            height: 870
        },
        iphone6splus: {
            width: 690,
            height: 1420,
            scale: 75
        },
        ipadair2: {
            width: 864,
            height: 1287,
            scale: 75
        },
        nexus5: {
            width: 400,
            height: 795
        },
        nexus7: {
            width: 728,
            height: 1268,
            scale: 75
        },
        nexus9: {
            width: 866,
            height: 1288,
            scale: 75
        }
    }
};
