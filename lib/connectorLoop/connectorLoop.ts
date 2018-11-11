"use strict";

class ConnectorLoop {

    private routine: (...args: any) => any;
    private interval: number;
    private fnArguments: any;
    private loopHandler!: NodeJS.Timeout;

    constructor(routine: (...args: any) => any, interval: number, ...fnArguments: any) {
        this.routine = routine;
        this.interval = interval;
        this.fnArguments = fnArguments;
    }

    public start() {
        this.loopHandler = setInterval(this.routine, this.interval, ...this.fnArguments);
    }

    public stop() {
        clearInterval(this.loopHandler);
    }

    public changeRoutine(routine: (...args: any) => any, ...fnArguments: any) {
        this.routine = routine;
        this.fnArguments = fnArguments;
    }
}

export default ConnectorLoop;
