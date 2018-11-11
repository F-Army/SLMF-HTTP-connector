"use strict";

import axios from "axios";

import Accumulator from "../accumulator";
import ConnectorLoop from "../connectorLoop";
import ConnectorSettings from "../connectorSettings";

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

                let tries = 0;

                do {
                    try {
                        await axios.post(this.settings.url, {data: messages});
                        break;
                    } catch (error) {
                        tries++;
                    }
                } while (tries < this.settings.maxRetries);

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
        try {
            this.accumulator.add(...messages);
        } catch (error) {
            if (error.message === "Item limit excedeed") {
                for (const message of messages) {
                    // Make room for new messages
                    if (this.accumulator.data.length > 0) {
                        this.accumulator.data.shift();
                    }
                }

                if (messages.length <= this.settings.maxAccumulatedMessages) {
                    // Insert every message
                    try {
                        this.accumulator.add(...messages);
                    } catch (error) {
                        throw new Error("Unexpected failure");
                    }
                } else {
                    // Insert just the last messages
                    while (messages.length > this.settings.maxAccumulatedMessages) {
                        messages.shift();
                    }

                    try {
                        this.accumulator.add(...messages);
                    } catch (error) {
                        throw new Error("Unexpected failure");
                    }
                }
            } else {
                throw new Error("Unexpected failure");
            }
        }
    }
}

export default SlmfHttpConnector;
