class Log {
    constructor(_log) {
        for (const key in _log) {
            if (_log.hasOwnProperty(key)) {
                this[key] = _log[key];
            }
        }
    }
}

module.exports = Log