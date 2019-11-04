(function (io) {
    var url = window.location.protocol + "//" + window.location.host;
    var socket = io.connect(url);
    var handshake = document.getElementById('handshake').getAttribute('data');
    var iframe = document.getElementById('simulator');

    window.onbeforeunload = function (e) {
        socket.emit("device-disconnected", handshake)
        return;
    };

    socket.on('connect', function (data) {
        socket.emit('handshake', handshake);
    });

    socket.on('refresh', function () {
        iframe.src = iframe.src;
    });

    socket.on('rotateLeft', function () {
        rotateLeft();
    });

    socket.on('rotateRight', function () {
        rotateRight();
    });

    socket.on('emitHomeButton', function () {
        emitHomeButton();
    });

    socket.on('setScale', function (data) {
        setScale(data.scale);
    });

    socket.on('heartbeat', function () {
        heartbeat();
    });

    socket.on('mouseclick', function (data) {
        mouseclick(data.x, data.y);
    });

    socket.on('keypress', function (data) {
        keypress(data.key, data.shiftKey);
    });

    socket.on('openUrl', function (data) {
        openUrl(data.url);
    });

    socket.on('restartApp', function () {
        restartApp();
    });

    socket.on('endSession', function () {
        endSession();
    });

    socket.on('saveScreenshot', function () {
        saveScreenshot();
    });

    socket.on('getScreenshot', function () {
        getScreenshot();
    });

    socket.on('pasteText', function (data) {
        pasteText(data.text);
    });

    socket.on('setLanguage', function (data) {
        setLanguage(data.lang);
    });

    socket.on('setLocation', function (data) {
        setLocation(data.location);
    });

    socket.on('requestSession', function () {
        requestSession();
    });

    function emitHomeButton() {
        iframe.contentWindow.postMessage('emitHomeButton', '*');
    }

    function rotateLeft() {
        iframe.contentWindow.postMessage('rotateLeft', '*');
    }

    function rotateRight() {
        iframe.contentWindow.postMessage('rotateRight', '*');
    }

    function setScale(number) {
        iframe.contentWindow.postMessage({ type: 'setScale', value: number }, '*');
    }

    function saveScreenshot() {
        iframe.contentWindow.postMessage('saveScreenshot', '*');
    }

    function getScreenshot() {
        iframe.contentWindow.postMessage('getScreenshot', '*');
    }

    function heartbeat() {
        iframe.contentWindow.postMessage('heartbeat', '*');
    }

    function mouseclick(x, y) {
        iframe.contentWindow.postMessage({ type: 'mouseclick', x: x, y: y }, '*');
    }

    function keypress(key, shiftKey) {
        iframe.contentWindow.postMessage({ type: 'keypress', key: key, shiftKey: shiftKey }, '*');
    }

    function pasteText(textToPaste) {
        iframe.contentWindow.postMessage({ type: 'pasteText', value: textToPaste }, '*');
    }

    function openUrl(url) {
        iframe.contentWindow.postMessage({ type: 'url', value: url }, '*');
    }

    function restartApp() {
        iframe.contentWindow.postMessage('restartApp', '*');
    }

    function endSession() {
        iframe.contentWindow.postMessage('endSession', '*');
    }

    function requestSession() {
        iframe.contentWindow.postMessage('requestSession', '*');
    }

    function setLanguage(language_code) {
        iframe.contentWindow.postMessage({ type: 'language', value: language_code }, '*');
    }

    function setLocation(location) {
        iframe.contentWindow.postMessage({ type: 'location', value: location }, '*');
    }
})(io)
