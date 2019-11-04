let serverSocket = null;

function setServerSocket(socket) {
    serverSocket = socket;
}

function getServerSocket() {
    return serverSocket;
}

module.exports = {
    setServerSocket,
    getServerSocket
};