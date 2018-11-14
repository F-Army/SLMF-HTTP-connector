"use strict";

import axios from "axios";
import axiosRetry from "axios-retry";

import Accumulator from "../Accumulator";
import ConnectorLoop from "../ConnectorLoop";
import ConnectorSettings from "../ConnectorSettings";
import LocationMessage from "../LocationMessage";

import { highestPossible, transferData } from "../utils";

export default class SlmfHttpConnector {

    public readonly accumulator: Accumulator<LocationMessage>;
    public readonly settings: ConnectorSettings;

    private loop: ConnectorLoop;
    private running: boolean;

    constructor(settings: ConnectorSettings) {
        this.settings = settings;
        this.running = false;
        this.accumulator = new Accumulator(this.settings.maxAccumulatedMessages);

        this.loop = new ConnectorLoop( async () => {
            try {
                await this.pushEventsRoutine();
            } catch (error) {
                // Let the request fail
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

    public addMessages(...messages: LocationMessage[]) {
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

    private createXMLPushEvents(messages: LocationMessage[]) {
        let XMLData: string = "<Push_Events>";
        XMLData += messages
                   .map((message) => `\n${message.toXML()}`)
                   .reduce((accumulator, xmlMessage) => accumulator + xmlMessage, "");

        XMLData += "\n</Push_Events>";

        return XMLData;
    }

    private async pushEventsRoutine() {
        const messagesNumber = highestPossible(this.accumulator.data.length, this.settings.maxSlmfMessages);
        if (messagesNumber > 0) {
            const messages: LocationMessage[] = [];
            transferData(this.accumulator.data, messages, messagesNumber);

            const XMLData = this.createXMLPushEvents(messages);

            axiosRetry(axios, { retries: this.settings.maxRetries});
            await axios.post(this.settings.url, XMLData);
        }
    }
}
