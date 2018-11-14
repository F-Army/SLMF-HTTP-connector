"use strict";

import Joi from "joi";

import { ConnectorSettings } from "./ConnectorSettings";

describe("Configuration schema test", () => {
    it("should validate correct schema", (done) => {
        try {
            const validSettings: ConnectorSettings = new ConnectorSettings({
                accumulationPeriod : 500,
                maxAccumulatedMessages : 1024,
                maxRetries : 15,
                maxSlmfMessages : 512,
                port : 80,
                url : "https://127.0.0.1",
            });
            done();
        } catch (error) {
            done("Should have validated");
        }
    });

    it("should give error with invalid schema", (done) => {

        try {
            const invalidSettings: ConnectorSettings = new ConnectorSettings({
                accumulationPeriod : -500,
                maxAccumulatedMessages : -1024,
                maxRetries : -15,
                maxSlmfMessages : -512,
                port : 80,
                url : "httpas://127.0.0.1",
            });
            done("Shouldn't have validated");
        } catch (error) {
            done();
        }
    });
});
