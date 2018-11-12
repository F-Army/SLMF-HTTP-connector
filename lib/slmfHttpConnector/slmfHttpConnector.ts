"use strict";

import axios from "axios";

import Accumulator from "../accumulator";
import ConnectorLoop from "../connectorLoop";
import ConnectorSettings from "../connectorSettings";
import { highestPossible, transferData } from "../utils";

class SlmfHttpConnector {

    public readonly accumulator: Accumulator<object>;
    public readonly settings: ConnectorSettings;

    private loop: ConnectorLoop;
    private running: boolean;

    constructor(settings: ConnectorSettings) {
        this.settings = settings;
        this.running = false;
        this.accumulator = new Accumulator(this.settings.maxAccumulatedMessages);

        this.loop = new ConnectorLoop( async () => {

            const messagesNumber = highestPossible(this.accumulator.data.length, this.settings.maxSlmfMessages);

            if (messagesNumber > 0) {
                const messages: any[] = [];

                transferData(this.accumulator.data, messages, messagesNumber);

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
            // Make sure to add at least the most recent messages if you can't accumulate all the messages
            while (messages.length > this.settings.maxAccumulatedMessages) {
                messages.shift();
            }

            // Make room for new messages
            for (const message of messages) {
                this.accumulator.data.shift();
            }

            this.accumulator.add(...messages);
        }
    }
}

export default SlmfHttpConnector;
