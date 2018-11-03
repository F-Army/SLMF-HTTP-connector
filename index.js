module.exports = class SlmfHttpConnector {
    constructor(config) {
        this._config = config
        this._running = false
    }

    set config(config) {
        this._config = config
    }

    get config () { return this._config }

    isRunning () { return this._running }

    start () { this._running = true }

    stop () { this._running = false }
}
