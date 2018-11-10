"use strict";

import axios from "axios";

import Accumulator from "../accumulator";
import ConnectorLoop from "../connectorLoop";
import ConnectorSettings from "../connectorSettings";

import { copyArray } from "../utils";

class SlmfHttpConnector {

    public readonly accumulator: Accumulator;
    public settings: ConnectorSettings;

    private loop: ConnectorLoop;
    private running: boolean;

    constructor(settings: ConnectorSettings) {
        this.settings = settings;
        this.running = false;
        this.accumulator = new Accumulator(this.settings.maxAccumulatedMessages);

        this.loop = new ConnectorLoop( async () => {

            const shifts = this.settings.maxSlmfMessages <= this.accumulator.data.length ?
                                this.settings.maxSlmfMessages : this.accumulator.data.length;

            if (shifts > 0) {
                const messages = [];
                for (let i = 0; i < shifts; i++) {
                    messages.push(this.accumulator.data.shift());
                }
                this.accumulator.clear();
                await axios.post(this.settings.url, {data: messages});
            }
        }, this.settings.accumulationPeriod);
    }

    public isRunning() { return this.running; }

    public start() {
        this.running = true;
        this.loop.start();
    }

    public stop() {
        this.running = false;
        this.loop.stop();
    }

    public addMessages(...messages: object[]) {
        this.accumulator.add(...messages);
    }
}

export default SlmfHttpConnector;
