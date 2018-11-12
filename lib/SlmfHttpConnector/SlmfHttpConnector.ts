"use strict";

import axios from "axios";
import axiosRetry from "axios-retry";

import Accumulator from "../Accumulator";
import ConnectorLoop from "../ConnectorLoop";
import ConnectorSettings from "../ConnectorSettings";
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

                axiosRetry(axios, { retries: this.settings.maxRetries});
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
        try {
            this.accumulator.add(...messages);
        } catch (error) {
            // Make sure to add at least the most recent messages if you can't accumulate all the messages
            const discarded = messages.length - this.settings.maxAccumulatedMessages;
            if (discarded > 0) {
                messages.splice(0, discarded);
            }

            // Make room for new messages
            this.accumulator.data.splice(0, messages.length);

            this.accumulator.add(...messages);
        }
    }
}

export default SlmfHttpConnector;
