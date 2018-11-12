"use strict";

jest.mock("axios");

jest.useFakeTimers();

import axios from "axios";

import ConnectorSettings from "../ConnectorSettings";
import SlmfHttpConnector from "./SlmfHttpConnector";

const RETRY_TIMES = 3;

const settings: ConnectorSettings = new ConnectorSettings({
    accumulationPeriod : 500,
    maxAccumulatedMessages : 3,
    maxRetries : RETRY_TIMES,
    maxSlmfMessages : 2,
    port : 8080,
    url : "http://127.0.0.1",
});

const slmfHttpConnector = new SlmfHttpConnector(settings);

describe("Slmf Http Connector tests", () => {
    beforeEach(() => {
        slmfHttpConnector.stop();
        slmfHttpConnector.accumulator.clear();
    });

    it("should start stopped", () => {
        expect(slmfHttpConnector.isRunning()).toBe(false);
    });

    it("starts when told to do so", () => {
        slmfHttpConnector.start();
        expect(slmfHttpConnector.isRunning()).toBe(true);
    });

    it("stops when told to do so", () => {
        slmfHttpConnector.start();
        slmfHttpConnector.stop();
        expect(slmfHttpConnector.isRunning()).toBe(false);
    });

    it("should throw error on invalid configuration set", () => {
        const wrongSettings = {...settings, accumulationPeriod: -1000};
        try {
            const slmfHttpConnectorFailed = new SlmfHttpConnector(new ConnectorSettings(wrongSettings));
        } catch (error) {
            expect(error.message).toBe("Invalid settings");
        }

    });

    it("should call send post request every time accumulationPeriod expires", () => {

        const CALLS = 3;

        slmfHttpConnector.start();

        for (let i = 0; i < CALLS; i++) {
            slmfHttpConnector.addMessages({data: "data"});
            jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);
        }

        slmfHttpConnector.stop();

        expect(axios.post).toHaveBeenCalledTimes(CALLS);

    });

    it("shouldn't do a post request when there are no messages", () => {
        axios.post = jest.fn();
        slmfHttpConnector.start();
        jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod * 100);

        expect(axios.post).toHaveBeenCalledTimes(0);
    });

    it("should call send post with the proper values", () => {
        slmfHttpConnector.start();

        for (let i = 0; i < 3; i++) {
            slmfHttpConnector.addMessages({number: "one"}, {number: "two"});
            jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);
            expect(axios.post).toHaveBeenCalledWith(
                slmfHttpConnector.settings.url,
                {data: [{number: "one"}, {number: "two"}]},
            );
        }

    });

    it("should not send more data than maxSlmfMessages", () => {
        slmfHttpConnector.start();

        const messages = [{number: "xxx"}, {number: "xxx"}, {number: "xxx"}];
        slmfHttpConnector.addMessages(...messages);
        expect(slmfHttpConnector.accumulator.data.length).toBe(messages.length);
        jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);

        expect(slmfHttpConnector.accumulator.data.length)
        .toBe(messages.length - slmfHttpConnector.settings.maxSlmfMessages);

        slmfHttpConnector.stop();
    });

    it("should delete data every time it sends the messages", () => {

        slmfHttpConnector.start();

        slmfHttpConnector.addMessages({data: "data"});
        expect(slmfHttpConnector.accumulator.data.length).toBe(1);
        jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);

        expect(slmfHttpConnector.accumulator.data.length).toBe(0);

        slmfHttpConnector.stop();
    });

    it("should discard data if necesary", () => {
        slmfHttpConnector.addMessages({num: 1}, {num: 2}, {num: 3});
        slmfHttpConnector.addMessages({num: -1}, {num: -2}, {num: -3});

        expect(slmfHttpConnector.accumulator.data).toMatchObject([{num: -1}, {num: -2}, {num: -3}]);

    });

    it("should insert the last messages if there is no room", () => {
        slmfHttpConnector.addMessages({num: 1}, {num: 2}, {num: 3}, {num: 4});
        expect(slmfHttpConnector.accumulator.data).toMatchObject([{num: 2}, {num: 3}, {num: 4}]);
    });

});
