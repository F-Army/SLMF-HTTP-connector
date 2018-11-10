"use strict";

class ConnectorLoop {

    public operation;
    public interval;
    public fnArguments;
    public loopHandler;

    constructor(operation, interval, ...fnArguments) {
        this.operation = operation;
        this.interval = interval;
        this.fnArguments = fnArguments;
    }

    public start() {
        this.loopHandler = setInterval(this.operation, this.interval, ...this.fnArguments);
    }

    public stop() {
        clearInterval(this.loopHandler);
    }

    public changeOperation(operation, ...fnArguments) {
        this.operation = operation;
        this.fnArguments = fnArguments;
    }
}

export default ConnectorLoop;
