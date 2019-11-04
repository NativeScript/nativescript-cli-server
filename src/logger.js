function log(...args) {
    args.unshift(new Date());
    return console.log.apply(console, args);
}

function error(...args) {
    args.unshift(new Date());
    return console.error.apply(console, args);
}

module.exports = {
    log,
    error
};
