"use strict";

import axios from "axios";
import Joi from "joi";

import Accumulator from "../accumulator";
import ConnectorLoop from "../connectorLoop";
import settingsSchema from "../settings";

import { copyArray } from "../utils";

class SlmfHttpConnector {

    public readonly accumulator: Accumulator;

    private loop: ConnectorLoop;
    private running: boolean;

    private settings$!: {
        accumulationPeriod: number,
        maxAccumulatedMessages?: number,
        maxRetries?: number,
        maxSlmfMessages: number,
        port: number,
        url: string,
    };

    constructor(
        settings: {
            accumulationPeriod: number,
            maxAccumulatedMessages?: number,
            maxRetries?: number,
            maxSlmfMessages: number,
            port: number,
            url: string,
    }) {
        this.settings = settings; // N.B. this.settings not this.settings$ because it will use the set function
        this.running = false;
        this.accumulator = new Accumulator(this.settings.maxAccumulatedMessages!);

        this.loop = new ConnectorLoop( async () => {
            if (this.accumulator.data.length > 0) {
                const messages = copyArray(this.accumulator.data);
                this.accumulator.clear();
                await axios.post(this.settings.url, {data: messages});
            }
        }, this.settings.accumulationPeriod);
    }

    set settings(settings) {
        const { error, value } = Joi.validate(settings, settingsSchema);
        if (!error) {
            this.settings$ = value;
        } else {
            throw new Error("Invalid settings");
        }
    }

    get settings() { return this.settings$; }

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
