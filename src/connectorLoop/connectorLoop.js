'use strict'

class ConnectorLoop {
    constructor(operation,interval, ...fnArguments) {
        this._operation = operation
        this._interval = interval
        this._fnArguments = fnArguments
    }

    start () {
        this._loopHandler = setInterval(this._operation, this._interval, ...this._fnArguments)
    }

    stop () {
        clearInterval(this._loopHandler)
    }
}

export default ConnectorLoop