'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

function ensureDirExistsRecursive(dirPath) {
    const dirname = path.dirname(dirPath);
    if (!fs.existsSync(dirname)) {
        ensureDirExistsRecursive(dirname);
    }

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

function deleteFilesOlderThan(directoryPath, days) {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            const now = new Date().getTime();
            const endTime = stat.mtime.getTime() + days * 1000 * 60 * 60 * 24;
            if (now > endTime) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    logger.error(`Failed to delete file ${filePath}`, err);
                }
            }
        }
    });
}

module.exports = {
    ensureDirExistsRecursive,
    deleteFilesOlderThan
};