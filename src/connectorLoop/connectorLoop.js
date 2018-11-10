// @flow
'use strict'

class ConnectorLoop {
    _operation: Function
    _interval: number
    _fnArguments: Array<any>
    _loopHandler: IntervalID

    constructor(operation: Function, interval: number, ...fnArguments: Array<any>): void {
        this._operation = operation
        this._interval = interval
        this._fnArguments = fnArguments
    }

    start (): void {
        this._loopHandler = setInterval(this._operation, this._interval, ...this._fnArguments)
    }

    stop (): void {
        clearInterval(this._loopHandler)
    }

    changeOperation (operation: Function, ...fnArguments: Array<any>): void {
        this._operation = operation
        this._fnArguments = fnArguments
    }
}

export default ConnectorLoop