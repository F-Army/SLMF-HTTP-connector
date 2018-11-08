'use strict'

class connectorLoop {
    constructor(operation, interval) {
        this._operation = operation
        this._interval = interval
    }

    start () {
        this._loopHandler = setInterval(this._operation, this._interval)
    }

    stop () {
        clearInterval(this._loopHandler)
    }
}

export default connectorLoop