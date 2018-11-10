"use strict";

jest.mock("axios");
jest.useFakeTimers();

import axios from "axios";
import SlmfHttpConnector from "./slmfHttpConnector";

const initialSettings = {
    accumulationPeriod : 500,
    maxSlmfMessages : 512,
    port : 80,
    url : "http://127.0.0.1",
};

const nextSettings = {
    accumulationPeriod : 500,
    maxAccumulatedMessages : 1024,
    maxRetries : 15,
    maxSlmfMessages : 512,
    port : 8080,
    url : "http://127.0.0.1",
};

const slmfHttpConnector = new SlmfHttpConnector(initialSettings);

describe("Slmf Http Connector tests", () => {
    beforeEach(() => {
        slmfHttpConnector.stop();
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

    it("should set the proper configuration when valid", () => {

        slmfHttpConnector.config = nextSettings;
        expect(slmfHttpConnector.config).toEqual(nextSettings);
    });

    it("should throw error on invalid configuration set", () => {
        const wrongSettings = {
            maxSlmfMessages : 512,
            port : -1,
            url : "random",
        };
        try {
            slmfHttpConnector.config = wrongSettings;
        } catch (error) {
            expect(error.message).toBe("Invalid configuration");
        }

    });

    it("should call send post request every time accumulationPeriod expires", () => {

        const CALLS = 3;

        slmfHttpConnector.settings = nextSettings;
        slmfHttpConnector.start();

        for (let i = 0; i < CALLS; i++) {
            slmfHttpConnector.addMessages({data: "data"});
            jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);
        }

        slmfHttpConnector.stop();

        expect(axios.post).toHaveBeenCalledTimes(CALLS);

    });

    it("should delete data every time it sends the messages", () => {

        slmfHttpConnector.settings = nextSettings;
        slmfHttpConnector.start();

        slmfHttpConnector.addMessages({data: "data"});
        expect(slmfHttpConnector.accumulator.data.length).toBe(1);
        jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod);

        expect(slmfHttpConnector.accumulator.data.length).toBe(0);

        slmfHttpConnector.stop();
    });

});
